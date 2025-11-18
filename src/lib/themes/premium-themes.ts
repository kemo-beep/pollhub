export interface PremiumTheme {
    id: string;
    name: string;
    description: string;
    category: "modern" | "elegant" | "vibrant" | "minimal" | "dark" | "corporate";
    preview: {
        primaryColor: string;
        secondaryColor: string;
        backgroundColor: string;
        gradient?: string;
    };
    customization: {
        primaryColor: string;
        secondaryColor: string;
        backgroundColor: string;
        backgroundImage?: string;
        backgroundOverlay?: string;
        textColor: string;
        accentColor: string;
        fontFamily: string;
        borderRadius: string;
        buttonStyle: "rounded" | "square" | "pill";
    };
}

export const premiumThemes: PremiumTheme[] = [
    {
        id: "ocean-breeze",
        name: "Ocean Breeze",
        description: "Calm and refreshing blue gradient theme",
        category: "modern",
        preview: {
            primaryColor: "#0ea5e9",
            secondaryColor: "#06b6d4",
            backgroundColor: "#f0f9ff",
            gradient: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
        },
        customization: {
            primaryColor: "#0ea5e9",
            secondaryColor: "#06b6d4",
            backgroundColor: "#f0f9ff",
            textColor: "#0c4a6e",
            accentColor: "#22d3ee",
            fontFamily: "Inter, sans-serif",
            borderRadius: "0.75rem",
            buttonStyle: "rounded",
        },
    },
    {
        id: "sunset-glow",
        name: "Sunset Glow",
        description: "Warm and inviting orange-pink gradient",
        category: "vibrant",
        preview: {
            primaryColor: "#f97316",
            secondaryColor: "#ec4899",
            backgroundColor: "#fff7ed",
            gradient: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
        },
        customization: {
            primaryColor: "#f97316",
            secondaryColor: "#ec4899",
            backgroundColor: "#fff7ed",
            textColor: "#7c2d12",
            accentColor: "#fb923c",
            fontFamily: "Poppins, sans-serif",
            borderRadius: "1rem",
            buttonStyle: "pill",
        },
    },
    {
        id: "forest-serenity",
        name: "Forest Serenity",
        description: "Natural green tones for a peaceful feel",
        category: "elegant",
        preview: {
            primaryColor: "#10b981",
            secondaryColor: "#059669",
            backgroundColor: "#f0fdf4",
            gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        },
        customization: {
            primaryColor: "#10b981",
            secondaryColor: "#059669",
            backgroundColor: "#f0fdf4",
            textColor: "#065f46",
            accentColor: "#34d399",
            fontFamily: "Inter, sans-serif",
            borderRadius: "0.75rem",
            buttonStyle: "rounded",
        },
    },
    {
        id: "royal-purple",
        name: "Royal Purple",
        description: "Luxurious purple gradient for premium feel",
        category: "elegant",
        preview: {
            primaryColor: "#8b5cf6",
            secondaryColor: "#a855f7",
            backgroundColor: "#faf5ff",
            gradient: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
        },
        customization: {
            primaryColor: "#8b5cf6",
            secondaryColor: "#a855f7",
            backgroundColor: "#faf5ff",
            textColor: "#581c87",
            accentColor: "#c084fc",
            fontFamily: "Poppins, sans-serif",
            borderRadius: "1rem",
            buttonStyle: "pill",
        },
    },
    {
        id: "midnight-elegance",
        name: "Midnight Elegance",
        description: "Sophisticated dark theme with subtle accents",
        category: "dark",
        preview: {
            primaryColor: "#6366f1",
            secondaryColor: "#818cf8",
            backgroundColor: "#1e293b",
            gradient: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
        },
        customization: {
            primaryColor: "#6366f1",
            secondaryColor: "#818cf8",
            backgroundColor: "#1e293b",
            backgroundOverlay: "rgba(30, 41, 59, 0.95)",
            textColor: "#f1f5f9",
            accentColor: "#818cf8",
            fontFamily: "Inter, sans-serif",
            borderRadius: "0.75rem",
            buttonStyle: "rounded",
        },
    },
    {
        id: "minimal-white",
        name: "Minimal White",
        description: "Clean and simple white theme",
        category: "minimal",
        preview: {
            primaryColor: "#3b82f6",
            secondaryColor: "#60a5fa",
            backgroundColor: "#ffffff",
            gradient: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        },
        customization: {
            primaryColor: "#3b82f6",
            secondaryColor: "#60a5fa",
            backgroundColor: "#ffffff",
            textColor: "#1e293b",
            accentColor: "#3b82f6",
            fontFamily: "Inter, sans-serif",
            borderRadius: "0.5rem",
            buttonStyle: "rounded",
        },
    },
    {
        id: "corporate-blue",
        name: "Corporate Blue",
        description: "Professional blue theme for business",
        category: "corporate",
        preview: {
            primaryColor: "#2563eb",
            secondaryColor: "#1d4ed8",
            backgroundColor: "#eff6ff",
            gradient: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
        },
        customization: {
            primaryColor: "#2563eb",
            secondaryColor: "#1d4ed8",
            backgroundColor: "#eff6ff",
            textColor: "#1e3a8a",
            accentColor: "#3b82f6",
            fontFamily: "Inter, sans-serif",
            borderRadius: "0.5rem",
            buttonStyle: "square",
        },
    },
    {
        id: "rose-gold",
        name: "Rose Gold",
        description: "Elegant rose and gold gradient",
        category: "elegant",
        preview: {
            primaryColor: "#e11d48",
            secondaryColor: "#f59e0b",
            backgroundColor: "#fff1f2",
            gradient: "linear-gradient(135deg, #e11d48 0%, #f59e0b 100%)",
        },
        customization: {
            primaryColor: "#e11d48",
            secondaryColor: "#f59e0b",
            backgroundColor: "#fff1f2",
            textColor: "#881337",
            accentColor: "#fb7185",
            fontFamily: "Poppins, sans-serif",
            borderRadius: "1rem",
            buttonStyle: "pill",
        },
    },
    {
        id: "cyber-punk",
        name: "Cyber Punk",
        description: "Bold neon colors for modern appeal",
        category: "vibrant",
        preview: {
            primaryColor: "#a855f7",
            secondaryColor: "#ec4899",
            backgroundColor: "#0f172a",
            gradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
        },
        customization: {
            primaryColor: "#a855f7",
            secondaryColor: "#ec4899",
            backgroundColor: "#0f172a",
            backgroundOverlay: "rgba(15, 23, 42, 0.95)",
            textColor: "#e2e8f0",
            accentColor: "#ec4899",
            fontFamily: "Inter, sans-serif",
            borderRadius: "0.5rem",
            buttonStyle: "rounded",
        },
    },
    {
        id: "nature-fresh",
        name: "Nature Fresh",
        description: "Fresh green and teal for natural feel",
        category: "modern",
        preview: {
            primaryColor: "#14b8a6",
            secondaryColor: "#06b6d4",
            backgroundColor: "#f0fdfa",
            gradient: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
        },
        customization: {
            primaryColor: "#14b8a6",
            secondaryColor: "#06b6d4",
            backgroundColor: "#f0fdfa",
            textColor: "#134e4a",
            accentColor: "#5eead4",
            fontFamily: "Inter, sans-serif",
            borderRadius: "0.75rem",
            buttonStyle: "rounded",
        },
    },
];

export function getThemeById(id: string): PremiumTheme | undefined {
    return premiumThemes.find((t) => t.id === id);
}

export function getThemesByCategory(category: PremiumTheme["category"]): PremiumTheme[] {
    return premiumThemes.filter((t) => t.category === category);
}

