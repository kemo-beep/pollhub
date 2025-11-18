"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Contestant {
    id: string;
    name: string;
    description?: string;
    avatar?: string;
}

interface PickOneVoteProps {
    contestants: Contestant[];
    onVote: (contestantId: string) => void;
    disabled?: boolean;
}

export function PickOneVote({ contestants, onVote, disabled }: PickOneVoteProps) {
    const [selected, setSelected] = useState<string>("");

    const handleChange = (value: string) => {
        setSelected(value);
        onVote(value);
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
        <RadioGroup value={selected} onValueChange={handleChange} disabled={disabled}>
            <div className="space-y-3">
                {contestants.map((contestant) => (
                    <Card
                        key={contestant.id}
                        className={`cursor-pointer transition-all ${selected === contestant.id
                                ? "border-primary border-2 bg-primary/5"
                                : "hover:bg-muted/50"
                            }`}
                        onClick={() => !disabled && handleChange(contestant.id)}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <RadioGroupItem value={contestant.id} id={contestant.id} />
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={contestant.avatar} alt={contestant.name} />
                                    <AvatarFallback>{getInitials(contestant.name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <Label
                                        htmlFor={contestant.id}
                                        className="text-base font-medium cursor-pointer"
                                    >
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
                ))}
            </div>
        </RadioGroup>
    );
}

