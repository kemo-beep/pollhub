import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contest } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { getServerSession } from "@/lib/auth/get-session";
import { z } from "zod";

const updateContestSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().optional().nullable(),
    isPublic: z.boolean().optional(),
    passcode: z.string().optional().nullable(),
    emailDomainRestriction: z.string().optional().nullable(),
    oneVotePerDevice: z.boolean().optional(),
    oneVotePerEmail: z.boolean().optional(),
    oneVotePerAccount: z.boolean().optional(),
    startDate: z.string().datetime().optional().nullable(),
    endDate: z.string().datetime().optional(),
    showLiveResults: z.boolean().optional(),
    showResultsAfterEnd: z.boolean().optional(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const searchParams = request.nextUrl.searchParams;
        const passcode = searchParams.get("passcode");

        // Try to find by slug first (since vote pages use slugs)
        console.log(`Searching for contest with slug/id: "${id}"`);
        let foundContest = await db.query.contest.findFirst({
            where: (contests, { eq }) => eq(contests.slug, id),
            with: {
                categories: {
                    with: {
                        contestants: {
                            orderBy: (contestants, { asc }) => [asc(contestants.order)],
                        },
                    },
                    orderBy: (categories, { asc }) => [asc(categories.order)],
                },
            },
        });

        if (foundContest) {
            console.log(`Found contest by slug: ${foundContest.id}, slug: "${foundContest.slug}"`);
        } else {
            console.log(`No contest found with slug: "${id}"`);
        }

        // If not found by slug, try by ID
        if (!foundContest) {
            foundContest = await db.query.contest.findFirst({
                where: (contests, { eq }) => eq(contests.id, id),
                with: {
                    categories: {
                        with: {
                            contestants: {
                                orderBy: (contestants, { asc }) => [asc(contestants.order)],
                            },
                        },
                        orderBy: (categories, { asc }) => [asc(categories.order)],
                    },
                },
            });
        }

        if (!foundContest) {
            console.log(`Contest not found for identifier: ${id}`);
            return NextResponse.json(
                { error: "Contest not found", searchedFor: id },
                { status: 404 }
            );
        }

        console.log(`Found contest: ${foundContest.id}, slug: ${foundContest.slug}, isPublic: ${foundContest.isPublic} (type: ${typeof foundContest.isPublic}), hasPasscode: ${!!foundContest.passcode}, startDate: ${foundContest.startDate}, endDate: ${foundContest.endDate}, searchedFor: ${id}`);

        // Check if contest is public or passcode matches
        // Handle both boolean true and string "true" cases
        const isPublic = foundContest.isPublic === true || foundContest.isPublic === "true" || foundContest.isPublic === 1;
        console.log(`isPublic check: ${isPublic} (raw: ${foundContest.isPublic})`);

        if (!isPublic) {
            // If contest is private, require passcode
            if (!foundContest.passcode) {
                // Contest is private but has no passcode - this shouldn't happen, but allow access
                console.warn(`Contest ${foundContest.id} is private but has no passcode`);
            } else if (foundContest.passcode !== passcode) {
                console.log(`Passcode mismatch for contest ${foundContest.id}. Expected: ${foundContest.passcode}, Got: ${passcode}`);
                return NextResponse.json(
                    { error: "Unauthorized - Passcode required", requiresPasscode: true },
                    { status: 403 }
                );
            }
        }

        // Check if contest has started (but allow viewing even if not started)
        const now = new Date();
        const hasStarted = foundContest.startDate ? now >= new Date(foundContest.startDate) : true;
        const hasEnded = now > new Date(foundContest.endDate);

        // Only block if contest hasn't started AND we're trying to vote
        // For now, allow viewing the contest even if it hasn't started
        // The frontend will handle showing appropriate messages

        // Serialize the response data properly, converting Date objects to ISO strings
        const responseData = {
            id: foundContest.id,
            name: foundContest.name,
            description: foundContest.description,
            slug: foundContest.slug,
            userId: foundContest.userId,
            isPublic: foundContest.isPublic,
            passcode: foundContest.passcode,
            emailDomainRestriction: foundContest.emailDomainRestriction,
            oneVotePerDevice: foundContest.oneVotePerDevice,
            oneVotePerEmail: foundContest.oneVotePerEmail,
            oneVotePerAccount: foundContest.oneVotePerAccount,
            startDate: foundContest.startDate ? new Date(foundContest.startDate).toISOString() : null,
            endDate: foundContest.endDate ? new Date(foundContest.endDate).toISOString() : null,
            showLiveResults: foundContest.showLiveResults,
            showResultsAfterEnd: foundContest.showResultsAfterEnd,
            randomizeOrder: foundContest.randomizeOrder,
            createdAt: foundContest.createdAt ? new Date(foundContest.createdAt).toISOString() : null,
            updatedAt: foundContest.updatedAt ? new Date(foundContest.updatedAt).toISOString() : null,
            categories: foundContest.categories?.map(category => ({
                id: category.id,
                name: category.name,
                description: category.description,
                order: category.order,
                randomizeOrder: category.randomizeOrder,
                contestants: category.contestants?.map(contestant => ({
                    id: contestant.id,
                    name: contestant.name,
                    description: contestant.description,
                    bio: contestant.bio,
                    avatar: contestant.avatar,
                    socialLinks: contestant.socialLinks,
                    order: contestant.order,
                })) || [],
            })) || [],
            hasStarted,
            hasEnded,
            canVote: hasStarted && !hasEnded,
        };

        console.log(`Returning contest data for ${id}:`, {
            id: responseData.id,
            slug: responseData.slug,
            isPublic: responseData.isPublic,
            hasStarted,
            hasEnded,
            canVote: responseData.canVote,
            categoriesCount: responseData.categories?.length || 0,
        });

        try {
            const jsonString = JSON.stringify(responseData);
            console.log(`Response JSON size: ${jsonString.length} bytes`);
            const response = NextResponse.json(responseData);
            console.log(`Response created successfully for ${id}`);
            return response;
        } catch (serializeError) {
            console.error("Error serializing response:", serializeError);
            return NextResponse.json(
                { error: "Failed to serialize response data" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error fetching contest:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { error: errorMessage, details: error instanceof Error ? error.stack : undefined },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        // Preprocess: convert empty strings to undefined/null for optional fields
        const processedBody = {
            ...body,
            description: body.description?.trim() || undefined,
            passcode: body.passcode?.trim() || undefined,
            emailDomainRestriction: body.emailDomainRestriction?.trim() || undefined,
            startDate: body.startDate && body.startDate.trim() ? body.startDate.trim() : undefined,
        };

        const data = updateContestSchema.parse(processedBody);

        // Verify contest exists and user owns it
        const foundContest = await db.query.contest.findFirst({
            where: (contests, { eq }) => eq(contests.id, id),
        });

        if (!foundContest) {
            return NextResponse.json(
                { error: "Contest not found" },
                { status: 404 }
            );
        }

        if (foundContest.userId !== session.user.id) {
            return NextResponse.json(
                { error: "Unauthorized - You don't own this contest" },
                { status: 403 }
            );
        }

        // Validate passcode for private contests
        if (data.isPublic === false && !data.passcode && !foundContest.passcode) {
            return NextResponse.json(
                { error: "Passcode is required for private contests" },
                { status: 400 }
            );
        }

        // Prepare update data
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;
        if (data.passcode !== undefined) updateData.passcode = data.passcode;
        if (data.emailDomainRestriction !== undefined) updateData.emailDomainRestriction = data.emailDomainRestriction;
        if (data.oneVotePerDevice !== undefined) updateData.oneVotePerDevice = data.oneVotePerDevice;
        if (data.oneVotePerEmail !== undefined) updateData.oneVotePerEmail = data.oneVotePerEmail;
        if (data.oneVotePerAccount !== undefined) updateData.oneVotePerAccount = data.oneVotePerAccount;
        if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null;
        if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
        if (data.showLiveResults !== undefined) updateData.showLiveResults = data.showLiveResults;
        if (data.showResultsAfterEnd !== undefined) updateData.showResultsAfterEnd = data.showResultsAfterEnd;

        // Update contest
        await db
            .update(contest)
            .set(updateData)
            .where(eq(contest.id, id));

        // Fetch updated contest
        const updatedContest = await db.query.contest.findFirst({
            where: (contests, { eq }) => eq(contests.id, id),
            with: {
                categories: {
                    with: {
                        contestants: {
                            orderBy: (contestants, { asc }) => [asc(contestants.order)],
                        },
                    },
                    orderBy: (categories, { asc }) => [asc(categories.order)],
                },
            },
        });

        return NextResponse.json(updatedContest);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Error updating contest:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
