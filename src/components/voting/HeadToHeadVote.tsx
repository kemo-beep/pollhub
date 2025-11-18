"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight } from "lucide-react";

interface Contestant {
    id: string;
    name: string;
    description?: string;
    avatar?: string;
}

interface HeadToHeadVoteProps {
    contestants: Contestant[];
    onVote: (comparisons: Array<{ winner: string; loser: string }>) => void;
    disabled?: boolean;
}

// Generate all possible pairs for head-to-head comparison
function generatePairs(contestants: Contestant[]): Array<[Contestant, Contestant]> {
    const pairs: Array<[Contestant, Contestant]> = [];
    for (let i = 0; i < contestants.length; i++) {
        for (let j = i + 1; j < contestants.length; j++) {
            pairs.push([contestants[i], contestants[j]]);
        }
    }
    return pairs;
}

export function HeadToHeadVote({
    contestants,
    onVote,
    disabled,
}: HeadToHeadVoteProps) {
    const [pairs] = useState(() => generatePairs(contestants));
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [comparisons, setComparisons] = useState<Array<{ winner: string; loser: string }>>([]);

    const currentPair = pairs[currentPairIndex];
    const progress = ((currentPairIndex + 1) / pairs.length) * 100;

    useEffect(() => {
        if (comparisons.length > 0) {
            onVote(comparisons);
        }
    }, [comparisons, onVote]);

    const handleChoice = (winnerId: string, loserId: string) => {
        if (disabled) return;

        const newComparisons = [
            ...comparisons,
            { winner: winnerId, loser: loserId },
        ];
        setComparisons(newComparisons);

        if (currentPairIndex < pairs.length - 1) {
            setCurrentPairIndex(currentPairIndex + 1);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    if (!currentPair) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-lg font-medium">All comparisons complete!</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        You've compared all pairs of contestants.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const [contestantA, contestantB] = currentPair;

    return (
        <div className="space-y-4">
            {/* Progress */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Comparison {currentPairIndex + 1} of {pairs.length}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                    <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Comparison */}
            <div className="grid grid-cols-2 gap-4">
                <Card
                    className={`cursor-pointer transition-all hover:border-primary ${disabled ? "opacity-50" : ""
                        }`}
                    onClick={() => handleChoice(contestantA.id, contestantB.id)}
                >
                    <CardContent className="p-6 text-center">
                        <Avatar className="h-20 w-20 mx-auto mb-3">
                            <AvatarImage src={contestantA.avatar} alt={contestantA.name} />
                            <AvatarFallback className="text-lg">
                                {getInitials(contestantA.name)}
                            </AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-lg mb-1">{contestantA.name}</h3>
                        {contestantA.description && (
                            <p className="text-sm text-muted-foreground">{contestantA.description}</p>
                        )}
                        <Button
                            className="mt-4 w-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleChoice(contestantA.id, contestantB.id);
                            }}
                            disabled={disabled}
                        >
                            Choose This
                        </Button>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-center">
                    <div className="text-muted-foreground font-semibold">VS</div>
                </div>

                <Card
                    className={`cursor-pointer transition-all hover:border-primary ${disabled ? "opacity-50" : ""
                        }`}
                    onClick={() => handleChoice(contestantB.id, contestantA.id)}
                >
                    <CardContent className="p-6 text-center">
                        <Avatar className="h-20 w-20 mx-auto mb-3">
                            <AvatarImage src={contestantB.avatar} alt={contestantB.name} />
                            <AvatarFallback className="text-lg">
                                {getInitials(contestantB.name)}
                            </AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-lg mb-1">{contestantB.name}</h3>
                        {contestantB.description && (
                            <p className="text-sm text-muted-foreground">{contestantB.description}</p>
                        )}
                        <Button
                            className="mt-4 w-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleChoice(contestantB.id, contestantA.id);
                            }}
                            disabled={disabled}
                        >
                            Choose This
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

