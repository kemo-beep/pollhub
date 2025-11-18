import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contest, category, vote } from "@/db/schema";
import { getServerSession } from "@/lib/auth/get-session";
import { generateId } from "@/lib/utils/ids";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { headers } from "next/headers";

const submitVoteSchema = z.object({
    contestId: z.string(),
    categoryId: z.string(),
    voteData: z.object({
        rankings: z.array(z.string()).optional(),
        selection: z.string().optional(),
        selections: z.array(z.string()).optional(),
        ratings: z.record(z.string(), z.number()).optional(),
        comparisons: z.array(z.object({
            winner: z.string(),
            loser: z.string(),
        })).optional(),
    }),
    votingType: z.enum(["rank", "pick-one", "multiple-choice", "rating", "head-to-head"]).optional(),
    email: z.string().email().optional(),
    passcode: z.string().optional(),
}).refine((data) => {
    // Validate that voteData matches votingType
    const { voteData, votingType } = data;
    const type = votingType || "rank";

    if (type === "rank") return !!voteData.rankings && voteData.rankings.length > 0;
    if (type === "pick-one") return !!voteData.selection;
    if (type === "multiple-choice") return !!voteData.selections && voteData.selections.length > 0;
    if (type === "rating") return !!voteData.ratings && Object.keys(voteData.ratings).length > 0;
    if (type === "head-to-head") return !!voteData.comparisons && voteData.comparisons.length > 0;
    return false;
}, { message: "Vote data does not match voting type" });

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();
        const headersList = await headers();
        const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";

        const body = await request.json();
        const data = submitVoteSchema.parse(body);

        // Fetch contest
        const foundContest = await db.query.contest.findFirst({
            where: (contests, { eq }) => eq(contests.id, data.contestId),
            with: {
                categories: true,
            },
        });

        if (!foundContest) {
            return NextResponse.json(
                { error: "Contest not found" },
                { status: 404 }
            );
        }

        // Check if contest has ended
        const now = new Date();
        if (now > foundContest.endDate) {
            return NextResponse.json(
                { error: "Voting has ended" },
                { status: 400 }
            );
        }

        // Check if contest has started
        if (foundContest.startDate && now < foundContest.startDate) {
            return NextResponse.json(
                { error: "Voting has not started yet" },
                { status: 400 }
            );
        }

        // Check passcode if private
        if (!foundContest.isPublic) {
            if (!foundContest.passcode || foundContest.passcode !== data.passcode) {
                return NextResponse.json(
                    { error: "Invalid passcode" },
                    { status: 403 }
                );
            }
        }

        // Check email domain restriction
        if (foundContest.emailDomainRestriction && data.email) {
            if (!data.email.endsWith(foundContest.emailDomainRestriction)) {
                return NextResponse.json(
                    { error: "Email domain not allowed" },
                    { status: 403 }
                );
            }
        }

        // Verify category exists in contest
        const categoryExists = foundContest.categories.some(
            (cat) => cat.id === data.categoryId
        );
        if (!categoryExists) {
            return NextResponse.json(
                { error: "Category not found in contest" },
                { status: 400 }
            );
        }

        // Fetch category to check maxRankings
        const foundCategory = await db.query.category.findFirst({
            where: (categories, { eq }) => eq(categories.id, data.categoryId),
            with: {
                contestants: true,
            },
        });

        if (!foundCategory) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        // Validate vote data based on voting type
        const votingType = data.votingType || foundCategory.votingType || "rank";
        const contestantIds = foundCategory.contestants.map((c) => c.id);

        if (votingType === "rank") {
            if (!data.voteData.rankings || data.voteData.rankings.length === 0) {
                return NextResponse.json(
                    { error: "Rankings are required" },
                    { status: 400 }
                );
            }
            if (foundCategory.maxRankings && data.voteData.rankings.length > foundCategory.maxRankings) {
                return NextResponse.json(
                    { error: `Maximum ${foundCategory.maxRankings} rankings allowed` },
                    { status: 400 }
                );
            }
            const invalidRankings = data.voteData.rankings.filter(
                (id: string) => !contestantIds.includes(id)
            );
            if (invalidRankings.length > 0) {
                return NextResponse.json(
                    { error: "Invalid contestant IDs in rankings" },
                    { status: 400 }
                );
            }
        } else if (votingType === "pick-one") {
            if (!data.voteData.selection) {
                return NextResponse.json(
                    { error: "Selection is required" },
                    { status: 400 }
                );
            }
            if (!contestantIds.includes(data.voteData.selection)) {
                return NextResponse.json(
                    { error: "Invalid contestant ID" },
                    { status: 400 }
                );
            }
        } else if (votingType === "multiple-choice") {
            if (!data.voteData.selections || data.voteData.selections.length === 0) {
                return NextResponse.json(
                    { error: "At least one selection is required" },
                    { status: 400 }
                );
            }
            if (foundCategory.maxSelections && data.voteData.selections.length > foundCategory.maxSelections) {
                return NextResponse.json(
                    { error: `Maximum ${foundCategory.maxSelections} selections allowed` },
                    { status: 400 }
                );
            }
            const invalidSelections = data.voteData.selections.filter(
                (id: string) => !contestantIds.includes(id)
            );
            if (invalidSelections.length > 0) {
                return NextResponse.json(
                    { error: "Invalid contestant IDs in selections" },
                    { status: 400 }
                );
            }
        } else if (votingType === "rating") {
            if (!data.voteData.ratings || Object.keys(data.voteData.ratings).length === 0) {
                return NextResponse.json(
                    { error: "At least one rating is required" },
                    { status: 400 }
                );
            }
            const maxRating = foundCategory.ratingScale || 5;
            for (const [contestantId, rating] of Object.entries(data.voteData.ratings)) {
                if (!contestantIds.includes(contestantId)) {
                    return NextResponse.json(
                        { error: "Invalid contestant ID in ratings" },
                        { status: 400 }
                    );
                }
                if (typeof rating !== "number" || rating < 1 || rating > maxRating) {
                    return NextResponse.json(
                        { error: `Rating must be between 1 and ${maxRating}` },
                        { status: 400 }
                    );
                }
            }
        } else if (votingType === "head-to-head") {
            if (!data.voteData.comparisons || data.voteData.comparisons.length === 0) {
                return NextResponse.json(
                    { error: "Comparisons are required" },
                    { status: 400 }
                );
            }
            for (const comparison of data.voteData.comparisons) {
                if (!contestantIds.includes(comparison.winner) || !contestantIds.includes(comparison.loser)) {
                    return NextResponse.json(
                        { error: "Invalid contestant IDs in comparisons" },
                        { status: 400 }
                    );
                }
            }
        }

        // Check voting restrictions
        if (foundContest.oneVotePerAccount && session?.user) {
            const existingVote = await db.query.vote.findFirst({
                where: (votes, { eq, and }) =>
                    and(
                        eq(votes.contestId, data.contestId),
                        eq(votes.categoryId, data.categoryId),
                        eq(votes.userId, session.user.id)
                    ),
            });

            if (existingVote) {
                return NextResponse.json(
                    { error: "You have already voted in this category" },
                    { status: 400 }
                );
            }
        }

        if (foundContest.oneVotePerEmail && data.email) {
            const existingVote = await db.query.vote.findFirst({
                where: (votes, { eq, and }) =>
                    and(
                        eq(votes.contestId, data.contestId),
                        eq(votes.categoryId, data.categoryId),
                        eq(votes.email, data.email)
                    ),
            });

            if (existingVote) {
                return NextResponse.json(
                    { error: "This email has already voted in this category" },
                    { status: 400 }
                );
            }
        }

        // Generate device ID from IP + user agent (simple approach)
        const userAgent = headersList.get("user-agent") || "";
        const deviceId = foundContest.oneVotePerDevice
            ? `${ipAddress}-${userAgent.slice(0, 50)}`
            : null;

        if (foundContest.oneVotePerDevice && deviceId) {
            const existingVote = await db.query.vote.findFirst({
                where: (votes, { eq, and }) =>
                    and(
                        eq(votes.contestId, data.contestId),
                        eq(votes.categoryId, data.categoryId),
                        eq(votes.deviceId, deviceId)
                    ),
            });

            if (existingVote) {
                return NextResponse.json(
                    { error: "You have already voted from this device" },
                    { status: 400 }
                );
            }
        }

        // Create vote
        const voteId = generateId("vote");
        await db.insert(vote).values({
            id: voteId,
            contestId: data.contestId,
            categoryId: data.categoryId,
            userId: session?.user?.id || null,
            email: data.email || null,
            deviceId: deviceId || null,
            ipAddress: ipAddress,
            voteData: data.voteData,
            // Legacy support: also store rankings for backward compatibility
            rankings: data.voteData.rankings || null,
        });

        console.log(`Vote submitted successfully:`, {
            voteId,
            contestId: data.contestId,
            categoryId: data.categoryId,
            votingType,
        });

        return NextResponse.json(
            { success: true, voteId },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Error submitting vote:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

