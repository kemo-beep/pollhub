/**
 * Result calculation functions for different voting types
 */

import { calculateIRV } from "./irv";

export interface VoteData {
    rankings?: string[];
    selection?: string;
    selections?: string[];
    ratings?: Record<string, number>;
    comparisons?: Array<{ winner: string; loser: string }>;
}

export interface ContestantResult {
    id: string;
    name: string;
    votes: number;
    percentage: number;
    isWinner: boolean;
    averageRating?: number; // For rating type
    winCount?: number; // For head-to-head
    lossCount?: number; // For head-to-head
}

export interface CategoryResult {
    categoryId: string;
    categoryName: string;
    votingType: string;
    totalVotes: number;
    winner: { id: string; name: string } | null;
    contestants: ContestantResult[];
    result?: any; // Type-specific result data
}

/**
 * Calculate results for rank (IRV) voting
 */
export function calculateRankResults(
    votes: Array<{ voteData?: VoteData | null; rankings?: string[] | null }>,
    contestantIds: string[]
): CategoryResult["result"] {
    if (votes.length === 0) {
        return null;
    }

    // Support both new voteData format and legacy rankings format
    const irvVotes = votes
        .filter((v) => {
            const rankings = v.voteData?.rankings || v.rankings;
            return rankings && rankings.length > 0;
        })
        .map((v) => ({
            rankings: (v.voteData?.rankings || v.rankings)!,
        }));

    if (irvVotes.length === 0) {
        return null;
    }

    return calculateIRV(irvVotes, contestantIds);
}

/**
 * Calculate results for pick-one voting
 */
export function calculatePickOneResults(
    votes: Array<{ voteData?: VoteData | null }>,
    contestantIds: string[]
): ContestantResult[] {
    const voteCounts: Record<string, number> = {};
    contestantIds.forEach((id) => {
        voteCounts[id] = 0;
    });

    votes.forEach((vote) => {
        if (vote.voteData?.selection) {
            voteCounts[vote.voteData.selection] = (voteCounts[vote.voteData.selection] || 0) + 1;
        }
    });

    const totalVotes = votes.length;
    const results: ContestantResult[] = contestantIds.map((id) => {
        const votes = voteCounts[id] || 0;
        return {
            id,
            name: "", // Will be filled in by caller
            votes,
            percentage: totalVotes > 0 ? (votes / totalVotes) * 100 : 0,
            isWinner: false, // Will be determined by caller
        };
    });

    // Sort by votes descending
    results.sort((a, b) => b.votes - a.votes);

    // Mark winner(s) - handle ties
    if (results.length > 0 && results[0].votes > 0) {
        const maxVotes = results[0].votes;
        results.forEach((r) => {
            r.isWinner = r.votes === maxVotes;
        });
    }

    return results;
}

/**
 * Calculate results for multiple-choice voting
 */
export function calculateMultipleChoiceResults(
    votes: Array<{ voteData?: VoteData | null }>,
    contestantIds: string[]
): ContestantResult[] {
    const voteCounts: Record<string, number> = {};
    contestantIds.forEach((id) => {
        voteCounts[id] = 0;
    });

    votes.forEach((vote) => {
        if (vote.voteData?.selections) {
            vote.voteData.selections.forEach((id) => {
                voteCounts[id] = (voteCounts[id] || 0) + 1;
            });
        }
    });

    const totalVotes = votes.length;
    const results: ContestantResult[] = contestantIds.map((id) => {
        const votes = voteCounts[id] || 0;
        return {
            id,
            name: "",
            votes,
            percentage: totalVotes > 0 ? (votes / totalVotes) * 100 : 0,
            isWinner: false,
        };
    });

    results.sort((a, b) => b.votes - a.votes);

    if (results.length > 0 && results[0].votes > 0) {
        const maxVotes = results[0].votes;
        results.forEach((r) => {
            r.isWinner = r.votes === maxVotes;
        });
    }

    return results;
}

/**
 * Calculate results for rating voting
 */
export function calculateRatingResults(
    votes: Array<{ voteData?: VoteData | null }>,
    contestantIds: string[]
): ContestantResult[] {
    const ratings: Record<string, number[]> = {};
    contestantIds.forEach((id) => {
        ratings[id] = [];
    });

    votes.forEach((vote) => {
        if (vote.voteData?.ratings) {
            Object.entries(vote.voteData.ratings).forEach(([id, rating]) => {
                if (ratings[id]) {
                    ratings[id].push(rating);
                }
            });
        }
    });

    const results: ContestantResult[] = contestantIds.map((id) => {
        const ratingList = ratings[id] || [];
        const averageRating =
            ratingList.length > 0
                ? ratingList.reduce((sum, r) => sum + r, 0) / ratingList.length
                : 0;
        const voteCount = ratingList.length;

        return {
            id,
            name: "",
            votes: voteCount,
            percentage: 0, // Not applicable for ratings
            averageRating,
            isWinner: false,
        };
    });

    // Sort by average rating descending
    results.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));

    if (results.length > 0 && (results[0].averageRating || 0) > 0) {
        const maxRating = results[0].averageRating || 0;
        results.forEach((r) => {
            r.isWinner = (r.averageRating || 0) === maxRating;
        });
    }

    return results;
}

/**
 * Calculate results for head-to-head voting
 */
export function calculateHeadToHeadResults(
    votes: Array<{ voteData?: VoteData | null }>,
    contestantIds: string[]
): ContestantResult[] {
    const winCounts: Record<string, number> = {};
    const lossCounts: Record<string, number> = {};
    contestantIds.forEach((id) => {
        winCounts[id] = 0;
        lossCounts[id] = 0;
    });

    votes.forEach((vote) => {
        if (vote.voteData?.comparisons) {
            vote.voteData.comparisons.forEach((comp) => {
                winCounts[comp.winner] = (winCounts[comp.winner] || 0) + 1;
                lossCounts[comp.loser] = (lossCounts[comp.loser] || 0) + 1;
            });
        }
    });

    const results: ContestantResult[] = contestantIds.map((id) => {
        const wins = winCounts[id] || 0;
        const losses = lossCounts[id] || 0;
        const totalComparisons = wins + losses;
        const winPercentage = totalComparisons > 0 ? (wins / totalComparisons) * 100 : 0;

        return {
            id,
            name: "",
            votes: wins,
            percentage: winPercentage,
            winCount: wins,
            lossCount: losses,
            isWinner: false,
        };
    });

    // Sort by win count, then by win percentage
    results.sort((a, b) => {
        if (b.votes !== a.votes) return b.votes - a.votes;
        return (b.percentage || 0) - (a.percentage || 0);
    });

    if (results.length > 0 && results[0].votes > 0) {
        const maxWins = results[0].votes;
        results.forEach((r) => {
            r.isWinner = r.votes === maxWins;
        });
    }

    return results;
}

