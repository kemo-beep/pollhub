"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PremiumTheme } from "@/lib/themes/premium-themes";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumThemeCardProps {
    theme: PremiumTheme;
    isSelected?: boolean;
    onClick: () => void;
}

export function PremiumThemeCard({ theme, isSelected, onClick }: PremiumThemeCardProps) {
    return (
        <Card
            className={cn(
                "cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 group relative overflow-hidden",
                isSelected && "ring-2 ring-primary ring-offset-2"
            )}
            onClick={onClick}
        >
            <div
                className="h-32 w-full relative"
                style={{
                    background: theme.preview.gradient || theme.preview.primaryColor,
                }}
            >
                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent" />
                
                {/* Selected indicator */}
                {isSelected && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                        <Check className="h-4 w-4" />
                    </div>
                )}
            </div>
            <CardContent className="p-4">
                <div className="space-y-1">
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {theme.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {theme.description}
                    </p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                    <div
                        className="w-4 h-4 rounded-full border-2 border-background shadow-sm"
                        style={{ backgroundColor: theme.preview.primaryColor }}
                    />
                    <div
                        className="w-4 h-4 rounded-full border-2 border-background shadow-sm"
                        style={{ backgroundColor: theme.preview.secondaryColor }}
                    />
                    <div
                        className="w-4 h-4 rounded-full border-2 border-background shadow-sm"
                        style={{ backgroundColor: theme.preview.backgroundColor }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

