"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface Contestant {
    id: string;
    name: string;
    description?: string;
    avatar?: string;
}

interface RatingVoteProps {
    contestants: Contestant[];
    maxRating: number; // 3, 5, or 10
    onVote: (ratings: Record<string, number>) => void;
    disabled?: boolean;
}

export function RatingVote({ contestants, maxRating, onVote, disabled }: RatingVoteProps) {
    const [ratings, setRatings] = useState<Record<string, number>>({});

    const handleRating = (contestantId: string, rating: number) => {
        if (disabled) return;
        const newRatings = { ...ratings, [contestantId]: rating };
        setRatings(newRatings);
        onVote(newRatings);
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const renderRatingInput = (contestantId: string, currentRating: number) => {
        if (maxRating <= 5) {
            // Star rating
            return (
                <div className="flex items-center gap-1">
                    {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => handleRating(contestantId, star)}
                            disabled={disabled}
                            className={`transition-colors ${star <= currentRating
                                    ? "text-yellow-500"
                                    : "text-muted-foreground hover:text-yellow-300"
                                }`}
                        >
                            <Star
                                className={`h-6 w-6 ${star <= currentRating ? "fill-current" : ""
                                    }`}
                            />
                        </button>
                    ))}
                    {currentRating > 0 && (
                        <span className="ml-2 text-sm font-medium">{currentRating}/{maxRating}</span>
                    )}
                </div>
            );
        } else {
            // Number rating (1-10)
            return (
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        {Array.from({ length: maxRating }, (_, i) => i + 1).map((num) => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => handleRating(contestantId, num)}
                                disabled={disabled}
                                className={`h-8 w-8 rounded-md text-sm font-medium transition-colors ${num === currentRating
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted hover:bg-muted/80"
                                    }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                    {currentRating > 0 && (
                        <span className="text-sm font-medium">{currentRating}/{maxRating}</span>
                    )}
                </div>
            );
        }
    };

    return (
        <div className="space-y-4">
            {contestants.map((contestant) => {
                const currentRating = ratings[contestant.id] || 0;
                return (
                    <Card key={contestant.id} className="hover:bg-muted/30 transition-colors">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-12 w-12 shrink-0">
                                    <AvatarImage src={contestant.avatar} alt={contestant.name} />
                                    <AvatarFallback>{getInitials(contestant.name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <Label className="text-base font-medium">{contestant.name}</Label>
                                    {contestant.description && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {contestant.description}
                                        </p>
                                    )}
                                    <div className="mt-3">
                                        {renderRatingInput(contestant.id, currentRating)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

