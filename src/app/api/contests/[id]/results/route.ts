import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contest, category, vote } from "@/db/schema";
import { getServerSession } from "@/lib/auth/get-session";
import { eq } from "drizzle-orm";
import {
    calculateRankResults,
    calculatePickOneResults,
    calculateMultipleChoiceResults,
    calculateRatingResults,
    calculateHeadToHeadResults,
} from "@/lib/algorithms/results";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession();

        // Fetch contest
        const foundContest = await db.query.contest.findFirst({
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

        if (!foundContest) {
            return NextResponse.json(
                { error: "Contest not found" },
                { status: 404 }
            );
        }

        // Check permissions - only owner or if results are public
        const isOwner = session?.user?.id === foundContest.userId;
        const now = new Date();
        const hasEnded = now > foundContest.endDate;

        const canViewResults =
            isOwner ||
            (hasEnded && foundContest.showResultsAfterEnd) ||
            foundContest.showLiveResults;

        if (!canViewResults) {
            return NextResponse.json(
                { error: "Results are not available yet" },
                { status: 403 }
            );
        }

        // Fetch all votes for this contest with user information
        const allVotes = await db.query.vote.findMany({
            where: (votes, { eq }) => eq(votes.contestId, id),
            with: {
                user: true, // Join user table if userId exists
            },
            orderBy: (votes, { desc }) => [desc(votes.createdAt)],
        });

        console.log(`Fetched ${allVotes.length} votes for contest ${id}`);

        // Calculate results for each category
        const categoryResults = await Promise.all(
            foundContest.categories.map(async (category) => {
                const categoryVotes = allVotes.filter(
                    (v) => v.categoryId === category.id
                );

                const contestantIds = category.contestants.map((c) => c.id);
                const votingType = category.votingType || "rank";

                if (categoryVotes.length === 0) {
                    return {
                        categoryId: category.id,
                        categoryName: category.name,
                        votingType,
                        totalVotes: 0,
                        exhaustedBallots: 0,
                        result: null,
                        winner: null,
                        contestants: category.contestants.map((c) => ({
                            id: c.id,
                            name: c.name,
                            avatar: c.avatar,
                            description: c.description,
                            bio: c.bio,
                            socialLinks: c.socialLinks,
                            votes: 0,
                            percentage: 0,
                            isWinner: false,
                        })),
                    };
                }

                let contestantResults: any[] = [];
                let result: any = null;
                let winner: { id: string; name: string } | null = null;
                let exhaustedBallots = 0;

                // Calculate results based on voting type
                if (votingType === "rank") {
                    // Use IRV for ranked voting
                    result = calculateRankResults(categoryVotes, contestantIds);
                    if (result) {
                        const lastRound = result.rounds[result.rounds.length - 1];
                        contestantResults = category.contestants.map((contestant) => {
                            const contestantVotes = lastRound?.candidates.find(
                                (c) => c.candidateId === contestant.id
                            );
                            return {
                                id: contestant.id,
                                name: contestant.name,
                                avatar: contestant.avatar,
                                description: contestant.description,
                                bio: contestant.bio,
                                socialLinks: contestant.socialLinks,
                                votes: contestantVotes?.votes || 0,
                                percentage: contestantVotes?.percentage || 0,
                                isWinner: result.winner === contestant.id,
                            };
                        });
                        exhaustedBallots = result.exhaustedBallots || 0;
                        if (result.winner) {
                            const winnerContestant = category.contestants.find(
                                (c) => c.id === result.winner
                            );
                            if (winnerContestant) {
                                winner = { id: winnerContestant.id, name: winnerContestant.name };
                            }
                        }
                        contestantResults.sort((a, b) => b.votes - a.votes);
                    }
                } else if (votingType === "pick-one") {
                    const results = calculatePickOneResults(categoryVotes, contestantIds);
                    contestantResults = results.map((r) => {
                        const contestant = category.contestants.find((c) => c.id === r.id);
                        return {
                            ...r,
                            name: contestant?.name || "",
                            avatar: contestant?.avatar,
                            description: contestant?.description,
                            bio: contestant?.bio,
                            socialLinks: contestant?.socialLinks,
                        };
                    });
                    const winnerResult = contestantResults.find((r) => r.isWinner);
                    if (winnerResult) {
                        winner = { id: winnerResult.id, name: winnerResult.name };
                    }
                } else if (votingType === "multiple-choice") {
                    const results = calculateMultipleChoiceResults(categoryVotes, contestantIds);
                    contestantResults = results.map((r) => {
                        const contestant = category.contestants.find((c) => c.id === r.id);
                        return {
                            ...r,
                            name: contestant?.name || "",
                            avatar: contestant?.avatar,
                            description: contestant?.description,
                            bio: contestant?.bio,
                            socialLinks: contestant?.socialLinks,
                        };
                    });
                    const winnerResult = contestantResults.find((r) => r.isWinner);
                    if (winnerResult) {
                        winner = { id: winnerResult.id, name: winnerResult.name };
                    }
                } else if (votingType === "rating") {
                    const results = calculateRatingResults(categoryVotes, contestantIds);
                    contestantResults = results.map((r) => {
                        const contestant = category.contestants.find((c) => c.id === r.id);
                        return {
                            ...r,
                            name: contestant?.name || "",
                            avatar: contestant?.avatar,
                            description: contestant?.description,
                            bio: contestant?.bio,
                            socialLinks: contestant?.socialLinks,
                        };
                    });
                    const winnerResult = contestantResults.find((r) => r.isWinner);
                    if (winnerResult) {
                        winner = { id: winnerResult.id, name: winnerResult.name };
                    }
                } else if (votingType === "head-to-head") {
                    const results = calculateHeadToHeadResults(categoryVotes, contestantIds);
                    contestantResults = results.map((r) => {
                        const contestant = category.contestants.find((c) => c.id === r.id);
                        return {
                            ...r,
                            name: contestant?.name || "",
                            avatar: contestant?.avatar,
                            description: contestant?.description,
                            bio: contestant?.bio,
                            socialLinks: contestant?.socialLinks,
                        };
                    });
                    const winnerResult = contestantResults.find((r) => r.isWinner);
                    if (winnerResult) {
                        winner = { id: winnerResult.id, name: winnerResult.name };
                    }
                }

                return {
                    categoryId: category.id,
                    categoryName: category.name,
                    votingType,
                    totalVotes: categoryVotes.length,
                    exhaustedBallots,
                    result,
                    winner,
                    contestants: contestantResults,
                };
            })
        );

        // Prepare voter information (only for contest owner)
        const voters = isOwner ? allVotes.map((vote) => ({
            id: vote.id,
            categoryId: vote.categoryId,
            categoryName: foundContest.categories.find(c => c.id === vote.categoryId)?.name || 'Unknown',
            voterName: vote.user?.name || vote.email || 'Anonymous',
            email: vote.email || vote.user?.email || null,
            votedAt: vote.createdAt,
            isLoggedIn: !!vote.userId,
        })) : [];

        return NextResponse.json({
            contest: {
                id: foundContest.id,
                name: foundContest.name,
                description: foundContest.description,
                hasEnded,
            },
            categories: categoryResults,
            totalVotes: allVotes.length,
            voters: voters,
        });
    } catch (error) {
        console.error("Error fetching results:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

