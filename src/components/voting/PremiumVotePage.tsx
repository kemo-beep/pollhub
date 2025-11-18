"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface PremiumVotePageProps {
    children: React.ReactNode;
    customization?: {
        primaryColor?: string;
        secondaryColor?: string;
        backgroundColor?: string;
        backgroundImage?: string;
        backgroundOverlay?: string;
        textColor?: string;
        accentColor?: string;
        fontFamily?: string;
        borderRadius?: string;
        buttonStyle?: "rounded" | "square" | "pill";
        headerImage?: string;
        logo?: string;
        customCSS?: string;
    };
}

export function PremiumVotePage({ children, customization = {} }: PremiumVotePageProps) {
    const custom = customization;
    
    // Create gradient background if colors are provided
    const backgroundStyle: React.CSSProperties = {};
    if (custom.backgroundImage) {
        backgroundStyle.backgroundImage = `url(${custom.backgroundImage})`;
        backgroundStyle.backgroundSize = "cover";
        backgroundStyle.backgroundPosition = "center";
        backgroundStyle.backgroundAttachment = "fixed";
        backgroundStyle.backgroundRepeat = "no-repeat";
    } else if (custom.primaryColor && custom.secondaryColor) {
        backgroundStyle.background = `linear-gradient(135deg, ${custom.primaryColor}15 0%, ${custom.secondaryColor}15 50%, ${custom.backgroundColor || "#ffffff"} 100%)`;
    } else {
        backgroundStyle.backgroundColor = custom.backgroundColor || "#ffffff";
    }

    return (
        <>
            {custom.customCSS && (
                <style dangerouslySetInnerHTML={{ __html: custom.customCSS }} />
            )}
            <div
                className="min-h-screen relative"
                style={{
                    ...backgroundStyle,
                    fontFamily: custom.fontFamily,
                    color: custom.textColor,
                }}
            >
                {/* Animated gradient overlay */}
                {custom.backgroundImage && custom.backgroundOverlay && (
                    <div
                        className="fixed inset-0 -z-10"
                        style={{
                            backgroundColor: custom.backgroundOverlay,
                        }}
                    />
                )}

                {/* Animated background particles */}
                {!custom.backgroundImage && (
                    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                        <div className="absolute inset-0">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute rounded-full opacity-10"
                                    style={{
                                        width: Math.random() * 300 + 100,
                                        height: Math.random() * 300 + 100,
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        background: custom.primaryColor
                                            ? `radial-gradient(circle, ${custom.primaryColor}40, transparent)`
                                            : "radial-gradient(circle, rgba(59, 130, 246, 0.1), transparent)",
                                    }}
                                    animate={{
                                        x: [0, Math.random() * 100 - 50],
                                        y: [0, Math.random() * 100 - 50],
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        duration: Math.random() * 10 + 10,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        delay: Math.random() * 5,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </>
    );
}

