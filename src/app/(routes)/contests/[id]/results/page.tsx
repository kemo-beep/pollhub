"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, Users, UserCheck, Mail, Clock, Twitter, Youtube, Facebook, Instagram, Globe } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ContestantResult {
    id: string;
    name: string;
    avatar?: string;
    description?: string;
    bio?: string;
    socialLinks?: {
        twitter?: string;
        youtube?: string;
        facebook?: string;
        instagram?: string;
        website?: string;
    };
    votes: number;
    percentage: number;
    isWinner: boolean;
}

interface CategoryResult {
    categoryId: string;
    categoryName: string;
    totalVotes: number;
    exhaustedBallots: number;
    winner: {
        id: string;
        name: string;
    } | null;
    result: {
        winner: string | null;
        rounds: Array<{
            round: number;
            candidates: Array<{
                candidateId: string;
                votes: number;
                percentage: number;
            }>;
            eliminated: string | null;
            winner: string | null;
        }>;
    } | null;
    contestants: ContestantResult[];
}

interface Voter {
    id: string;
    categoryId: string;
    categoryName: string;
    voterName: string;
    email: string | null;
    votedAt: Date | string;
    isLoggedIn: boolean;
}

interface ResultsData {
    contest: {
        id: string;
        name: string;
        description?: string;
        hasEnded: boolean;
    };
    categories: CategoryResult[];
    totalVotes: number;
    voters?: Voter[];
}

export default function ResultsPage() {
    const params = useParams();
    const contestId = params.id as string;
    const [results, setResults] = useState<ResultsData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchResults = useCallback(async () => {
        try {
            const response = await fetch(`/api/contests/${contestId}/results`, {
                cache: 'no-store',
            });
            if (!response.ok) {
                throw new Error("Failed to load results");
            }
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error("Error fetching results:", error);
        } finally {
            setLoading(false);
        }
    }, [contestId]);

    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

    useEffect(() => {
        // Auto-refresh results every 5 seconds if contest hasn't ended
        if (!results || results.contest.hasEnded) {
            return;
        }

        const interval = setInterval(() => {
            fetchResults();
        }, 5000);

        return () => clearInterval(interval);
    }, [results?.contest.hasEnded, fetchResults]);

    if (loading) {
        return (
            <div className="container mx-auto max-w-4xl py-8 px-4">
                <div className="text-center">Loading results...</div>
            </div>
        );
    }

    if (!results) {
        return (
            <div className="container mx-auto max-w-4xl py-8 px-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">Results Not Available</h2>
                            <p className="text-muted-foreground">
                                Results are not available yet or the contest doesn't exist.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl py-8 px-4">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{results.contest.name}</h1>
                        {results.contest.description && (
                            <p className="text-muted-foreground">{results.contest.description}</p>
                        )}
                    </div>
                    <button
                        onClick={fetchResults}
                        className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                        Refresh
                    </button>
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{results.totalVotes} total votes</span>
                    </div>
                    {!results.contest.hasEnded && (
                        <span className="text-xs text-muted-foreground">
                            (Auto-refreshing every 5 seconds)
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {results.categories.map((category) => (
                    <Card key={category.categoryId}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {category.winner && (
                                    <Trophy className="h-5 w-5 text-yellow-500" />
                                )}
                                {category.categoryName}
                            </CardTitle>
                            <CardDescription>
                                {category.totalVotes} votes
                                {category.exhaustedBallots > 0 &&
                                    ` • ${category.exhaustedBallots} exhausted ballots`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Winner */}
                            {category.winner && (
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Trophy className="h-6 w-6 text-yellow-500" />
                                        <div>
                                            <div className="font-semibold text-lg">Winner</div>
                                            <div className="text-muted-foreground">
                                                {category.winner.name}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Results Table */}
                            <div className="space-y-2">
                                <h3 className="font-semibold">Final Results</h3>
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-muted">
                                            <tr>
                                                <th className="text-left p-3 font-medium">Rank</th>
                                                <th className="text-left p-3 font-medium">Contestant</th>
                                                <th className="text-right p-3 font-medium">Votes</th>
                                                <th className="text-right p-3 font-medium">Percentage</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {category.contestants.map((contestant, index) => (
                                                <tr
                                                    key={contestant.id}
                                                    className={
                                                        contestant.isWinner
                                                            ? "bg-yellow-50 dark:bg-yellow-950/20"
                                                            : "border-t"
                                                    }
                                                >
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-2">
                                                            {index === 0 && contestant.isWinner && (
                                                                <Trophy className="h-4 w-4 text-yellow-500" />
                                                            )}
                                                            <span className="font-medium">#{index + 1}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage src={contestant.avatar} alt={contestant.name} />
                                                                <AvatarFallback>
                                                                    {contestant.name
                                                                        .split(" ")
                                                                        .map((n) => n[0])
                                                                        .join("")
                                                                        .toUpperCase()
                                                                        .slice(0, 2)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1">
                                                                <div className="font-medium">{contestant.name}</div>
                                                                {contestant.description && (
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {contestant.description}
                                                                    </div>
                                                                )}
                                                                {contestant.socialLinks && (
                                                                    <div className="flex items-center gap-1.5 mt-1">
                                                                        {contestant.socialLinks.twitter && (
                                                                            <a
                                                                                href={contestant.socialLinks.twitter}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-muted-foreground hover:text-foreground"
                                                                            >
                                                                                <Twitter className="h-3 w-3" />
                                                                            </a>
                                                                        )}
                                                                        {contestant.socialLinks.youtube && (
                                                                            <a
                                                                                href={contestant.socialLinks.youtube}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-muted-foreground hover:text-foreground"
                                                                            >
                                                                                <Youtube className="h-3 w-3" />
                                                                            </a>
                                                                        )}
                                                                        {contestant.socialLinks.facebook && (
                                                                            <a
                                                                                href={contestant.socialLinks.facebook}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-muted-foreground hover:text-foreground"
                                                                            >
                                                                                <Facebook className="h-3 w-3" />
                                                                            </a>
                                                                        )}
                                                                        {contestant.socialLinks.instagram && (
                                                                            <a
                                                                                href={contestant.socialLinks.instagram}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-muted-foreground hover:text-foreground"
                                                                            >
                                                                                <Instagram className="h-3 w-3" />
                                                                            </a>
                                                                        )}
                                                                        {contestant.socialLinks.website && (
                                                                            <a
                                                                                href={contestant.socialLinks.website}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-muted-foreground hover:text-foreground"
                                                                            >
                                                                                <Globe className="h-3 w-3" />
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-right font-medium">
                                                        {contestant.votes}
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <div className="w-24 bg-muted rounded-full h-2">
                                                                <div
                                                                    className="bg-primary h-2 rounded-full"
                                                                    style={{
                                                                        width: `${contestant.percentage}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="text-sm font-medium w-12 text-right">
                                                                {contestant.percentage.toFixed(1)}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Round-by-Round Breakdown */}
                            {category.result && category.result.rounds && category.result.rounds.length > 1 && (
                                <div className="space-y-4">
                                    <h3 className="font-semibold">Round-by-Round Breakdown</h3>
                                    <div className="space-y-3">
                                        {category.result.rounds.map((round, roundIndex) => (
                                            <div
                                                key={round.round}
                                                className="border rounded-lg p-4 bg-muted/30"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="font-semibold">Round {round.round}</div>
                                                    {round.eliminated && (
                                                        <div className="text-sm text-muted-foreground">
                                                            Eliminated:{" "}
                                                            {
                                                                category.contestants.find(
                                                                    (c) => c.id === round.eliminated
                                                                )?.name
                                                            }
                                                        </div>
                                                    )}
                                                    {round.winner && (
                                                        <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                            Winner:{" "}
                                                            {
                                                                category.contestants.find(
                                                                    (c) => c.id === round.winner
                                                                )?.name
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    {round.candidates
                                                        .sort((a, b) => b.votes - a.votes)
                                                        .map((candidate) => {
                                                            const contestant = category.contestants.find(
                                                                (c) => c.id === candidate.candidateId
                                                            );
                                                            if (!contestant) return null;
                                                            return (
                                                                <div
                                                                    key={candidate.candidateId}
                                                                    className="flex items-center justify-between text-sm"
                                                                >
                                                                    <span>{contestant.name}</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-20 bg-muted rounded-full h-1.5">
                                                                            <div
                                                                                className="bg-primary h-1.5 rounded-full"
                                                                                style={{
                                                                                    width: `${candidate.percentage}%`,
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <span className="w-16 text-right">
                                                                            {candidate.votes} ({candidate.percentage.toFixed(1)}%)
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {/* Voters List */}
                {results.voters && results.voters.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Voters ({results.voters.length})
                            </CardTitle>
                            <CardDescription>
                                List of all participants who have voted
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {results.voters.map((voter) => (
                                    <div
                                        key={voter.id}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            {voter.isLoggedIn ? (
                                                <UserCheck className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <div className="flex-1">
                                                <div className="font-medium">{voter.voterName}</div>
                                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <span>{voter.categoryName}</span>
                                                    {voter.email && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                <Mail className="h-3 w-3" />
                                                                {voter.email}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(voter.votedAt).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

