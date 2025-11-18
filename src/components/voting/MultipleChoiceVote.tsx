"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Contestant {
    id: string;
    name: string;
    description?: string;
    avatar?: string;
}

interface MultipleChoiceVoteProps {
    contestants: Contestant[];
    maxSelections?: number;
    onVote: (selectedIds: string[]) => void;
    disabled?: boolean;
}

export function MultipleChoiceVote({
    contestants,
    maxSelections,
    onVote,
    disabled,
}: MultipleChoiceVoteProps) {
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const handleToggle = (contestantId: string) => {
        if (disabled) return;

        const newSelected = new Set(selected);
        if (newSelected.has(contestantId)) {
            newSelected.delete(contestantId);
        } else {
            if (maxSelections && newSelected.size >= maxSelections) {
                return; // Can't select more
            }
            newSelected.add(contestantId);
        }
        setSelected(newSelected);
        onVote(Array.from(newSelected));
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="space-y-3">
            {maxSelections && (
                <div className="text-sm text-muted-foreground mb-2">
                    Select up to {maxSelections} contestant{maxSelections > 1 ? "s" : ""} (
                    {selected.size}/{maxSelections})
                </div>
            )}
            {contestants.map((contestant) => {
                const isSelected = selected.has(contestant.id);
                const canSelect = !maxSelections || selected.size < maxSelections || isSelected;

                return (
                    <Card
                        key={contestant.id}
                        className={`cursor-pointer transition-all ${isSelected
                                ? "border-primary border-2 bg-primary/5"
                                : canSelect
                                    ? "hover:bg-muted/50"
                                    : "opacity-50 cursor-not-allowed"
                            }`}
                        onClick={() => canSelect && handleToggle(contestant.id)}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => handleToggle(contestant.id)}
                                    disabled={disabled || !canSelect}
                                />
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={contestant.avatar} alt={contestant.name} />
                                    <AvatarFallback>{getInitials(contestant.name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <Label className="text-base font-medium cursor-pointer">
                                        {contestant.name}
                                    </Label>
                                    {contestant.description && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {contestant.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

