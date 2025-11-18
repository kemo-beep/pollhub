"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PremiumVotingCardProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    index?: number;
}

export function PremiumVotingCard({
    title,
    description,
    children,
    className,
    style,
    index = 0,
}: PremiumVotingCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group"
        >
            <Card
                className={cn(
                    "relative overflow-hidden border-2 transition-all duration-500",
                    "hover:shadow-2xl hover:scale-[1.01] hover:-translate-y-1",
                    "bg-gradient-to-br from-white via-white to-slate-50/30",
                    "backdrop-blur-sm",
                    className
                )}
                style={style}
            >
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Shine effect on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                
                {/* Subtle border glow */}
                <div className="absolute inset-0 rounded-lg border-2 border-primary/0 group-hover:border-primary/20 transition-colors duration-500 pointer-events-none" />
                
                <CardHeader className="relative z-10 pb-6">
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:via-primary/90 group-hover:to-secondary transition-all duration-300">
                        {title}
                    </CardTitle>
                    {description && (
                        <CardDescription className="text-base sm:text-lg mt-3 leading-relaxed text-muted-foreground">
                            {description}
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent className="relative z-10">
                    {children}
                </CardContent>
            </Card>
        </motion.div>
    );
}

