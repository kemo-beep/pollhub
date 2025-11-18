/**
 * Instant Runoff Voting (IRV) Algorithm
 * 
 * This implementation handles:
 * - Single winner elections
 * - Vote redistribution
 * - Tie breaking
 * - Exhausted ballots
 */

export interface IRVResult {
    winner: string | null;
    rounds: IRVRound[];
    totalVotes: number;
    exhaustedBallots: number;
}

export interface IRVRound {
    round: number;
    candidates: CandidateVotes[];
    eliminated: string | null;
    winner: string | null;
}

export interface CandidateVotes {
    candidateId: string;
    votes: number;
    percentage: number;
}

export interface VoteData {
    rankings: string[]; // Array of contestant IDs in preference order
}

/**
 * Calculate IRV results from votes
 */
export function calculateIRV(
    votes: VoteData[],
    candidateIds: string[]
): IRVResult {
    const rounds: IRVRound[] = [];
    let activeCandidates = [...candidateIds];
    let currentVotes = votes.map((v) => ({ rankings: [...v.rankings] }));
    let roundNumber = 1;
    let exhaustedBallots = 0;

    while (activeCandidates.length > 1) {
        // Count first-choice votes for each active candidate
        const voteCounts: Record<string, number> = {};
        activeCandidates.forEach((id) => {
            voteCounts[id] = 0;
        });

        const validVotes: typeof currentVotes = [];
        const newExhausted: typeof currentVotes = [];

        currentVotes.forEach((vote) => {
            // Find first preference that's still active
            const firstChoice = vote.rankings.find((id) =>
                activeCandidates.includes(id)
            );

            if (firstChoice) {
                voteCounts[firstChoice]++;
                validVotes.push(vote);
            } else {
                // Ballot is exhausted (no remaining preferences)
                newExhausted.push(vote);
            }
        });

        exhaustedBallots += newExhausted.length;
        const totalValidVotes = validVotes.length;
        const majorityThreshold = totalValidVotes / 2;

        // Calculate percentages
        const candidateResults: CandidateVotes[] = activeCandidates.map((id) => ({
            candidateId: id,
            votes: voteCounts[id],
            percentage: totalValidVotes > 0 ? (voteCounts[id] / totalValidVotes) * 100 : 0,
        }));

        // Sort by votes (descending)
        candidateResults.sort((a, b) => b.votes - a.votes);

        // Check for winner (majority)
        const topCandidate = candidateResults[0];
        let winner: string | null = null;
        let eliminated: string | null = null;

        if (topCandidate.votes > majorityThreshold) {
            winner = topCandidate.candidateId;
        } else {
            // Eliminate the candidate with the fewest votes
            const lowestCandidate = candidateResults[candidateResults.length - 1];
            eliminated = lowestCandidate.candidateId;
            activeCandidates = activeCandidates.filter((id) => id !== eliminated);
        }

        rounds.push({
            round: roundNumber,
            candidates: candidateResults,
            eliminated,
            winner,
        });

        // If we have a winner, stop
        if (winner) {
            break;
        }

        // Redistribute votes from eliminated candidate
        currentVotes = validVotes.map((vote) => {
            // Remove eliminated candidate from rankings
            const newRankings = vote.rankings.filter(
                (id) => id !== eliminated
            );
            return { rankings: newRankings };
        });

        roundNumber++;
    }

    // If only one candidate remains, they win
    if (activeCandidates.length === 1 && rounds[rounds.length - 1].winner === null) {
        const finalRound = rounds[rounds.length - 1];
        finalRound.winner = activeCandidates[0];
        finalRound.eliminated = null;
    }

    return {
        winner: rounds[rounds.length - 1]?.winner || null,
        rounds,
        totalVotes: votes.length,
        exhaustedBallots,
    };
}

/**
 * Handle ties by using a tie-breaking method
 * Default: eliminate the candidate that appeared first in the original list
 */
export function breakTie(
    tiedCandidates: string[],
    originalOrder: string[]
): string {
    // Find the first candidate in the original order
    for (const candidateId of originalOrder) {
        if (tiedCandidates.includes(candidateId)) {
            return candidateId;
        }
    }
    // Fallback: return first tied candidate
    return tiedCandidates[0];
}

