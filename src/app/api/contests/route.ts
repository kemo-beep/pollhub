import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contest, category, contestant } from "@/db/schema";
import { getServerSession } from "@/lib/auth/get-session";
import { generateId, generateSlug } from "@/lib/utils/ids";
import { eq, desc, and } from "drizzle-orm";
import { z } from "zod";
import { nanoid } from "nanoid";

const createContestSchema = z.object({
    name: z.string().min(1).max(200),
    description: z.string().optional().nullable(),
    isPublic: z.boolean().default(true),
    passcode: z.string().optional().nullable(),
    emailDomainRestriction: z.string().optional().nullable(),
    oneVotePerDevice: z.boolean().default(true),
    oneVotePerEmail: z.boolean().default(false),
    oneVotePerAccount: z.boolean().default(false),
    startDate: z.string().datetime().optional().nullable(),
    endDate: z.string().datetime(),
    showLiveResults: z.boolean().default(false),
    showResultsAfterEnd: z.boolean().default(true),
    categories: z.array(
        z.object({
            name: z.string().min(1).max(100),
            description: z.string().optional().nullable(),
            votingType: z.enum(["rank", "pick-one", "multiple-choice", "rating", "head-to-head"]).default("rank"),
            maxRankings: z.number().int().positive().optional().nullable(),
            maxSelections: z.number().int().positive().optional().nullable(),
            ratingScale: z.number().int().positive().min(3).max(10).optional().default(5),
            allowWriteIns: z.boolean().default(false),
            randomizeOrder: z.boolean().default(true),
            contestants: z.array(
                z.object({
                    name: z.string().min(1).max(100),
                    description: z.string().optional().nullable(),
                    bio: z.string().optional().nullable(),
                    avatar: z.string().url().optional().nullable(),
                    socialLinks: z
                        .object({
                            twitter: z.string().optional(),
                            youtube: z.string().optional(),
                            facebook: z.string().optional(),
                            instagram: z.string().optional(),
                            website: z.string().optional(),
                        })
                        .optional()
                        .nullable(),
                })
            ).min(2), // At least 2 contestants per category
        })
    ).min(1), // At least 1 category
});

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // Preprocess: convert empty strings to undefined/null for optional fields
        const processedBody = {
            ...body,
            description: body.description?.trim() || undefined,
            passcode: body.passcode?.trim() || undefined,
            emailDomainRestriction: body.emailDomainRestriction?.trim() || undefined,
            startDate: body.startDate && body.startDate.trim() ? body.startDate.trim() : undefined,
            categories: body.categories?.map((cat: any) => ({
                ...cat,
                description: cat.description?.trim() || undefined,
                contestants: cat.contestants?.map((cont: any) => ({
                    ...cont,
                    description: cont.description?.trim() || undefined,
                    avatar: cont.avatar?.trim() || undefined,
                })),
            })),
        };

        const data = createContestSchema.parse(processedBody);

        // Generate unique slug
        let slug = generateSlug(data.name);

        // Ensure slug is not empty (fallback if name generates empty slug)
        if (!slug || slug.length === 0) {
            slug = `contest-${nanoid(8).toLowerCase()}`;
        }

        let slugExists = true;
        let attempts = 0;
        while (slugExists && attempts < 10) {
            const existing = await db
                .select()
                .from(contest)
                .where(eq(contest.slug, slug))
                .limit(1);
            if (existing.length === 0) {
                slugExists = false;
            } else {
                slug = `${generateSlug(data.name) || 'contest'}-${nanoid(6).toLowerCase()}`;
                attempts++;
            }
        }

        console.log(`Generated slug for contest "${data.name}": ${slug}`);

        const contestId = generateId("contest");
        const endDate = new Date(data.endDate);
        const startDate = data.startDate ? new Date(data.startDate) : null;

        // Create contest
        await db.insert(contest).values({
            id: contestId,
            userId: session.user.id,
            name: data.name,
            description: data.description,
            slug,
            isPublic: data.isPublic,
            passcode: data.passcode,
            emailDomainRestriction: data.emailDomainRestriction,
            oneVotePerDevice: data.oneVotePerDevice,
            oneVotePerEmail: data.oneVotePerEmail,
            oneVotePerAccount: data.oneVotePerAccount,
            startDate,
            endDate,
            showLiveResults: data.showLiveResults,
            showResultsAfterEnd: data.showResultsAfterEnd,
        });

        // Create categories and contestants
        for (let catIndex = 0; catIndex < data.categories.length; catIndex++) {
            const cat = data.categories[catIndex];
            const categoryId = generateId("cat");

            await db.insert(category).values({
                id: categoryId,
                contestId,
                name: cat.name,
                description: cat.description,
                votingType: cat.votingType || "rank",
                maxRankings: cat.maxRankings,
                maxSelections: cat.maxSelections,
                ratingScale: cat.ratingScale || 5,
                allowWriteIns: cat.allowWriteIns,
                randomizeOrder: cat.randomizeOrder,
                order: catIndex,
            });

            // Create contestants
            for (let contIndex = 0; contIndex < cat.contestants.length; contIndex++) {
                const cont = cat.contestants[contIndex];
                const contestantId = generateId("cont");

                // Prepare social links object (only include non-empty values)
                const socialLinks = cont.socialLinks ? {
                    ...(cont.socialLinks.twitter && { twitter: cont.socialLinks.twitter }),
                    ...(cont.socialLinks.youtube && { youtube: cont.socialLinks.youtube }),
                    ...(cont.socialLinks.facebook && { facebook: cont.socialLinks.facebook }),
                    ...(cont.socialLinks.instagram && { instagram: cont.socialLinks.instagram }),
                    ...(cont.socialLinks.website && { website: cont.socialLinks.website }),
                } : null;

                await db.insert(contestant).values({
                    id: contestantId,
                    categoryId,
                    name: cont.name,
                    description: cont.description,
                    bio: cont.bio,
                    avatar: cont.avatar,
                    socialLinks: socialLinks,
                    order: contIndex,
                });
            }
        }

        // Fetch created contest with relations
        const createdContest = await db.query.contest.findFirst({
            where: (contests, { eq }) => eq(contests.id, contestId),
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

        return NextResponse.json(createdContest, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Error creating contest:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const contests = await db.query.contest.findMany({
            where: (contests, { eq }) => eq(contests.userId, session.user.id),
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
            orderBy: (contests, { desc }) => [desc(contests.createdAt)],
        });

        return NextResponse.json(contests);
    } catch (error) {
        console.error("Error fetching contests:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}


