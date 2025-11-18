"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Check, Twitter, Youtube, Facebook, Instagram, Globe, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PickOneVote } from "@/components/voting/PickOneVote";
import { MultipleChoiceVote } from "@/components/voting/MultipleChoiceVote";
import { RatingVote } from "@/components/voting/RatingVote";
import { HeadToHeadVote } from "@/components/voting/HeadToHeadVote";
import { PremiumVotePage } from "@/components/voting/PremiumVotePage";
import { PremiumVotingCard } from "@/components/voting/PremiumVotingCard";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Contestant {
    id: string;
    name: string;
    description?: string;
    bio?: string;
    avatar?: string;
    socialLinks?: {
        twitter?: string;
        youtube?: string;
        facebook?: string;
        instagram?: string;
        website?: string;
    };
}

type VotingType = "rank" | "pick-one" | "multiple-choice" | "rating" | "head-to-head";

interface Category {
    id: string;
    name: string;
    description?: string;
    votingType?: VotingType;
    maxRankings?: number;
    maxSelections?: number;
    ratingScale?: number;
    contestants: Contestant[];
}

interface Customization {
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
}

interface Contest {
    id: string;
    name: string;
    description?: string;
    slug: string;
    hasStarted?: boolean;
    hasEnded: boolean;
    canVote: boolean;
    categories: Category[];
    customization?: Customization;
}

function SortableItem({
    contestant,
    index,
}: {
    contestant: Contestant;
    index: number;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: contestant.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        scale: isDragging ? 0.98 : 1,
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
        <motion.div
            ref={setNodeRef}
            style={style}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className={cn(
                "group relative flex items-center gap-4 p-5",
                "bg-gradient-to-br from-white to-slate-50/50",
                "border-2 rounded-xl cursor-grab active:cursor-grabbing",
                "shadow-sm hover:shadow-lg transition-all duration-300",
                "backdrop-blur-sm",
                isDragging && "z-50 shadow-2xl"
            )}
        >
            {/* Rank badge */}
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center font-bold text-primary border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
                {index + 1}
            </div>

            {/* Drag handle */}
            <div
                {...attributes}
                {...listeners}
                className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors cursor-grab active:cursor-grabbing p-1"
            >
                <GripVertical className="h-5 w-5" />
            </div>

            {/* Avatar */}
            <Avatar className="h-14 w-14 border-2 border-slate-200 group-hover:border-primary/40 transition-colors shadow-sm">
                <AvatarImage src={contestant.avatar} alt={contestant.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold">
                    {getInitials(contestant.name)}
                </AvatarFallback>
            </Avatar>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="font-semibold text-base group-hover:text-primary transition-colors">
                    {contestant.name}
                </div>
                {contestant.description && (
                    <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {contestant.description}
                    </div>
                )}
                {contestant.socialLinks && (
                    <div className="flex items-center gap-2 mt-2">
                        {contestant.socialLinks.twitter && (
                            <a
                                href={contestant.socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-muted-foreground hover:text-primary transition-colors p-1 rounded hover:bg-primary/10"
                            >
                                <Twitter className="h-4 w-4" />
                            </a>
                        )}
                        {contestant.socialLinks.youtube && (
                            <a
                                href={contestant.socialLinks.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-muted-foreground hover:text-primary transition-colors p-1 rounded hover:bg-primary/10"
                            >
                                <Youtube className="h-4 w-4" />
                            </a>
                        )}
                        {contestant.socialLinks.facebook && (
                            <a
                                href={contestant.socialLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-muted-foreground hover:text-primary transition-colors p-1 rounded hover:bg-primary/10"
                            >
                                <Facebook className="h-4 w-4" />
                            </a>
                        )}
                        {contestant.socialLinks.instagram && (
                            <a
                                href={contestant.socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-muted-foreground hover:text-primary transition-colors p-1 rounded hover:bg-primary/10"
                            >
                                <Instagram className="h-4 w-4" />
                            </a>
                        )}
                        {contestant.socialLinks.website && (
                            <a
                                href={contestant.socialLinks.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-muted-foreground hover:text-primary transition-colors p-1 rounded hover:bg-primary/10"
                            >
                                <Globe className="h-4 w-4" />
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
        </motion.div>
    );
}

export default function VotePage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const [contest, setContest] = useState<Contest | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [email, setEmail] = useState("");
    const [passcode, setPasscode] = useState("");
    const [rankings, setRankings] = useState<Record<string, string[]>>({});
    const [votes, setVotes] = useState<Record<string, any>>({}); // Store votes for all types
    const [errorState, setErrorState] = useState<{ type: "not-found" | "passcode-required" | "not-started" | null; message?: string }>({ type: null });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchContest();
    }, [slug, passcode]);

    const fetchContest = async () => {
        setLoading(true);
        setErrorState({ type: null });
        try {
            const url = new URL(`/api/contests/${slug}`, window.location.origin);
            if (passcode) {
                url.searchParams.set("passcode", passcode);
            }

            console.log(`Fetching contest: ${url.toString()}`);

            // Use fetch with proper error handling and timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            let response;
            try {
                response = await fetch(url.toString(), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    signal: controller.signal,
                    cache: 'no-store',
                });
                clearTimeout(timeoutId);
            } catch (fetchError: any) {
                clearTimeout(timeoutId);
                if (fetchError.name === 'AbortError') {
                    console.error("Fetch timeout:", fetchError);
                    setErrorState({
                        type: null,
                        message: "Request timed out. Please check your connection and try again."
                    });
                    setLoading(false);
                    return;
                } else if (fetchError.name === 'TypeError' && fetchError.message.includes('fetch')) {
                    console.error("Network error:", fetchError);
                    setErrorState({
                        type: null,
                        message: "Network error. Please check your connection and try again."
                    });
                    setLoading(false);
                    return;
                }
                throw fetchError;
            }

            if (!response.ok) {
                let error;
                try {
                    error = await response.json();
                } catch (e) {
                    error = { error: `HTTP ${response.status}: ${response.statusText}` };
                }
                console.error("Failed to fetch contest:", { status: response.status, error, slug, url: url.toString() });

                // Provide more helpful error message
                if (response.status === 404) {
                    setErrorState({ type: "not-found", message: `Contest with slug "${slug}" not found. Please check the URL.` });
                    setLoading(false);
                    return;
                } else if (response.status === 403) {
                    const errorMsg = error.error || "Access denied";
                    if (error.requiresPasscode || errorMsg.includes("Passcode") || errorMsg.includes("passcode")) {
                        // Show passcode input UI
                        setErrorState({ type: "passcode-required", message: "This contest requires a passcode" });
                        setLoading(false);
                        return;
                    } else if (errorMsg.includes("not started")) {
                        setErrorState({ type: "not-started", message: errorMsg });
                        setLoading(false);
                        return;
                    }
                    setErrorState({ type: null, message: errorMsg });
                    setLoading(false);
                    return;
                } else if (response.status === 500) {
                    setErrorState({ type: null, message: error.error || "Server error. Please try again later." });
                    setLoading(false);
                    return;
                }
                setErrorState({ type: null, message: error.error || `Failed to load contest (${response.status})` });
                setLoading(false);
                return;
            }

            let data;
            try {
                const responseText = await response.text();
                console.log("Response text length:", responseText.length);
                data = JSON.parse(responseText);
                console.log("Contest loaded successfully:", { id: data.id, slug: data.slug, isPublic: data.isPublic });
            } catch (parseError) {
                console.error("Failed to parse JSON response:", parseError);
                setErrorState({
                    type: null,
                    message: "Failed to parse server response. The contest data may be corrupted."
                });
                setLoading(false);
                return;
            }

            setContest(data);
            setErrorState({ type: null }); // Clear any previous errors

            // Initialize rankings/votes based on voting type
            const initialRankings: Record<string, string[]> = {};
            const initialVotes: Record<string, any> = {};

            data.categories.forEach((category: Category) => {
                const votingType = category.votingType || "rank";
                const contestantIds = category.contestants.map((c) => c.id);

                if (votingType === "rank") {
                    // For rank type, initialize with randomized order if enabled
                    if (category.randomizeOrder) {
                        const shuffled = [...contestantIds].sort(() => Math.random() - 0.5);
                        initialRankings[category.id] = shuffled;
                    } else {
                        initialRankings[category.id] = contestantIds;
                    }
                } else {
                    // For other types, initialize empty vote data
                    initialVotes[category.id] = null;
                }
            });
            setRankings(initialRankings);
            setVotes(initialVotes);
        } catch (error: any) {
            console.error("Unexpected error fetching contest:", error);
            setErrorState({
                type: null,
                message: error.message || "An unexpected error occurred. Please try again."
            });
            toast.error(error.message || "Failed to load contest");
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = (event: DragEndEvent, categoryId: string) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setRankings((prev) => {
                const oldIndex = prev[categoryId].indexOf(active.id as string);
                const newIndex = prev[categoryId].indexOf(over.id as string);
                return {
                    ...prev,
                    [categoryId]: arrayMove(prev[categoryId], oldIndex, newIndex),
                };
            });
        }
    };

    // Handlers for different voting types
    const handleRankVote = (categoryId: string, rankings: string[]) => {
        setRankings((prev) => ({ ...prev, [categoryId]: rankings }));
    };

    const handlePickOneVote = (categoryId: string, selection: string) => {
        setVotes((prev) => ({
            ...prev,
            [categoryId]: { selection },
        }));
    };

    const handleMultipleChoiceVote = (categoryId: string, selections: string[]) => {
        setVotes((prev) => ({
            ...prev,
            [categoryId]: { selections },
        }));
    };

    const handleRatingVote = (categoryId: string, ratings: Record<string, number>) => {
        setVotes((prev) => ({
            ...prev,
            [categoryId]: { ratings },
        }));
    };

    const handleHeadToHeadVote = (categoryId: string, comparisons: Array<{ winner: string; loser: string }>) => {
        setVotes((prev) => ({
            ...prev,
            [categoryId]: { comparisons },
        }));
    };

    const handleSubmit = async (categoryId: string) => {
        if (!contest) return;

        const category = contest.categories.find((c) => c.id === categoryId);
        if (!category) return;

        const votingType = category.votingType || "rank";
        let voteData: any = null;

        // Prepare vote data based on voting type
        if (votingType === "rank") {
            const categoryRankings = rankings[categoryId];
            if (!categoryRankings || categoryRankings.length === 0) {
                toast.error("Please rank at least one contestant");
                return;
            }
            const limitedRankings = category.maxRankings
                ? categoryRankings.slice(0, category.maxRankings)
                : categoryRankings;
            voteData = { rankings: limitedRankings };
        } else {
            const vote = votes[categoryId];
            if (!vote) {
                toast.error("Please complete your vote");
                return;
            }
            voteData = vote;
        }

        setSubmitting(true);
        try {
            const response = await fetch("/api/votes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contestId: contest.id,
                    categoryId,
                    voteData,
                    votingType,
                    email: email || undefined,
                    passcode: passcode || undefined,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to submit vote");
            }

            toast.success("Vote submitted successfully!");
            // Remove category from votes/rankings to show it's been voted
            if (votingType === "rank") {
                const updatedRankings = { ...rankings };
                delete updatedRankings[categoryId];
                setRankings(updatedRankings);
            } else {
                const updatedVotes = { ...votes };
                delete updatedVotes[categoryId];
                setVotes(updatedVotes);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to submit vote");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto max-w-4xl py-8 px-4">
                <div className="text-center">Loading contest...</div>
            </div>
        );
    }

    if (!contest && !loading) {
        // Show appropriate error based on error state
        if (errorState.type === "not-found") {
            return (
                <div className="container mx-auto max-w-4xl py-8 px-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-2">Contest Not Found</h2>
                                <p className="text-muted-foreground mb-4">
                                    {errorState.message || "The contest you're looking for doesn't exist."}
                                </p>
                                <Button onClick={() => router.push("/")}>Go to Dashboard</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        if (errorState.type === "passcode-required") {
            return (
                <div className="container mx-auto max-w-4xl py-8 px-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-2">Passcode Required</h2>
                                <p className="text-muted-foreground mb-4">
                                    This contest is private. Please enter the passcode provided by the contest host to access it.
                                </p>
                                <div className="space-y-3 max-w-sm mx-auto">
                                    <div>
                                        <Label htmlFor="passcode-input" className="sr-only">Passcode</Label>
                                        <Input
                                            id="passcode-input"
                                            type="text"
                                            placeholder="Enter passcode"
                                            value={passcode}
                                            onChange={(e) => setPasscode(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    fetchContest();
                                                }
                                            }}
                                            autoFocus
                                            className="text-center text-lg tracking-wider"
                                        />
                                    </div>
                                    <Button onClick={fetchContest} className="w-full">Submit Passcode</Button>
                                    <p className="text-xs text-muted-foreground">
                                        Don't have a passcode? Contact the contest host.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        if (errorState.type === "not-started") {
            return (
                <div className="container mx-auto max-w-4xl py-8 px-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-2">Contest Not Started</h2>
                                <p className="text-muted-foreground mb-4">
                                    {errorState.message || "This contest hasn't started yet."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        // Generic error
        return (
            <div className="container mx-auto max-w-4xl py-8 px-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">Error Loading Contest</h2>
                            <p className="text-muted-foreground mb-4">
                                {errorState.message || "Failed to load the contest. Please try again."}
                            </p>
                            <Button onClick={() => {
                                setErrorState({ type: null });
                                fetchContest();
                            }}>Try Again</Button>
                            {process.env.NODE_ENV === 'development' && (
                                <div className="mt-4 text-xs text-left bg-muted p-4 rounded overflow-auto max-h-40">
                                    <p className="font-semibold mb-2">Debug Info:</p>
                                    <pre className="whitespace-pre-wrap break-words">
                                        {JSON.stringify({ slug, error: errorState.message, type: errorState.type }, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Check if contest hasn't started
    if (contest.hasStarted === false) {
        return (
            <div className="container mx-auto max-w-4xl py-8 px-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">Contest Has Not Started</h2>
                            <p className="text-muted-foreground mb-4">
                                This contest hasn't started yet. Please check back later.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (contest.hasEnded) {
        return (
            <div className="container mx-auto max-w-4xl py-8 px-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">Voting Has Ended</h2>
                            <p className="text-muted-foreground mb-4">
                                This contest has ended. Results may be available.
                            </p>
                            <Button onClick={() => router.push(`/contests/${contest.id}/results`)}>
                                View Results
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Determine which categories still need votes
    const remainingCategories = contest.categories.filter((cat) => {
        const votingType = cat.votingType || "rank";
        if (votingType === "rank") {
            return rankings[cat.id] && rankings[cat.id].length > 0;
        } else {
            return votes[cat.id] !== null && votes[cat.id] !== undefined;
        }
    });

    // Apply customizations
    const custom = contest.customization || {};

    const getButtonClass = () => {
        const base = "px-4 py-2 font-medium transition-colors";
        switch (custom.buttonStyle) {
            case "square":
                return `${base} rounded-none`;
            case "pill":
                return `${base} rounded-full`;
            default:
                return `${base} rounded-lg`;
        }
    };

    const borderRadius = custom.borderRadius || "0.5rem";

    return (
        <PremiumVotePage customization={custom}>
            <div className="container mx-auto max-w-4xl py-8 sm:py-12 px-4 sm:px-6">
                {/* Premium Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center space-y-6"
                >
                    {/* Header Image */}
                    {custom.headerImage && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mb-8"
                        >
                            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                                <img
                                    src={custom.headerImage}
                                    alt="Header"
                                    className="w-full h-64 sm:h-80 object-cover"
                                    style={{ borderRadius: custom.borderRadius || "1rem" }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                        </motion.div>
                    )}

                    {/* Logo and Title */}
                    <div className="flex flex-col items-center gap-4">
                        {custom.logo && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl rounded-full" />
                                <img
                                    src={custom.logo}
                                    alt="Logo"
                                    className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl shadow-xl border-4 border-white/50"
                                    style={{ borderRadius: custom.borderRadius || "1rem" }}
                                />
                            </motion.div>
                        )}
                        <div className="space-y-3">
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent"
                                style={{
                                    color: custom.textColor || undefined,
                                    fontFamily: custom.fontFamily,
                                }}
                            >
                                {contest.name}
                            </motion.h1>
                            {contest.description && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                                    style={{
                                        color: custom.textColor ? `${custom.textColor}DD` : undefined,
                                    }}
                                >
                                    {contest.description}
                                </motion.p>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Email Input */}
                {contest.oneVotePerEmail && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mb-8"
                    >
                        <Card
                            className="border-2 shadow-lg backdrop-blur-sm"
                            style={{
                                backgroundColor: custom.backgroundImage
                                    ? (custom.backgroundColor || "rgba(255, 255, 255, 0.95)")
                                    : (custom.backgroundColor || "white"),
                                borderRadius: custom.borderRadius || "1rem",
                            }}
                        >
                            <CardContent className="pt-6">
                                <Label htmlFor="email" className="text-base font-semibold">
                                    Email (required for voting)
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="mt-3 h-12 text-base"
                                    style={{
                                        borderRadius: custom.borderRadius || "0.5rem",
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Premium Voting Categories */}
                <div className="space-y-8">
                    {contest.categories.map((category, categoryIdx) => {
                        const votingType = category.votingType || "rank";
                        const categoryRankings = rankings[category.id] || [];
                        const categoryVote = votes[category.id];

                        // Determine if category still needs a vote
                        const needsVote = votingType === "rank"
                            ? (rankings[category.id] && rankings[category.id].length > 0)
                            : (categoryVote !== null && categoryVote !== undefined);

                        // Skip if already voted (no longer needs vote)
                        if (!needsVote) return null;

                        const canSubmit = votingType === "rank"
                            ? categoryRankings.length > 0
                            : categoryVote !== null && categoryVote !== undefined;

                        // Build description with voting instructions
                        let votingDescription = category.description || "";
                        if (votingType === "rank" && category.maxRankings) {
                            votingDescription += ` Rank your top ${category.maxRankings} contestants.`;
                        } else if (votingType === "multiple-choice" && category.maxSelections) {
                            votingDescription += ` Select up to ${category.maxSelections} contestant${category.maxSelections > 1 ? "s" : ""}.`;
                        } else if (votingType === "rating") {
                            votingDescription += ` Rate each contestant from 1 to ${category.ratingScale || 5}.`;
                        } else if (votingType === "head-to-head") {
                            votingDescription += ` Compare contestants in pairs and choose your preferred option.`;
                        }

                        return (
                            <PremiumVotingCard
                                key={category.id}
                                title={category.name}
                                description={votingDescription.trim()}
                                index={categoryIdx}
                                style={{
                                    backgroundColor: custom.backgroundImage
                                        ? (custom.backgroundColor || "rgba(255, 255, 255, 0.95)")
                                        : (custom.backgroundColor || "white"),
                                    borderRadius: custom.borderRadius || "1rem",
                                    borderColor: custom.primaryColor ? `${custom.primaryColor}20` : undefined,
                                }}
                            >
                                {/* Render appropriate voting component based on type */}
                                {votingType === "rank" && (
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={(e) => handleDragEnd(e, category.id)}
                                    >
                                        <SortableContext
                                            items={categoryRankings}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="space-y-2">
                                                {categoryRankings.map((contestantId, index) => {
                                                    const contestant = category.contestants.find(
                                                        (c) => c.id === contestantId
                                                    );
                                                    if (!contestant) return null;
                                                    return (
                                                        <SortableItem
                                                            key={contestantId}
                                                            contestant={contestant}
                                                            index={index}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </SortableContext>
                                    </DndContext>
                                )}

                                {votingType === "pick-one" && (
                                    <PickOneVote
                                        contestants={category.contestants}
                                        onVote={(selection) => handlePickOneVote(category.id, selection)}
                                        disabled={submitting}
                                    />
                                )}

                                {votingType === "multiple-choice" && (
                                    <MultipleChoiceVote
                                        contestants={category.contestants}
                                        maxSelections={category.maxSelections}
                                        onVote={(selections) => handleMultipleChoiceVote(category.id, selections)}
                                        disabled={submitting}
                                    />
                                )}

                                {votingType === "rating" && (
                                    <RatingVote
                                        contestants={category.contestants}
                                        maxRating={category.ratingScale || 5}
                                        onVote={(ratings) => handleRatingVote(category.id, ratings)}
                                        disabled={submitting}
                                    />
                                )}

                                {votingType === "head-to-head" && (
                                    <HeadToHeadVote
                                        contestants={category.contestants}
                                        onVote={(comparisons) => handleHeadToHeadVote(category.id, comparisons)}
                                        disabled={submitting}
                                    />
                                )}

                                <motion.div
                                    className="pt-6 border-t"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <motion.button
                                        onClick={() => handleSubmit(category.id)}
                                        disabled={submitting || !canSubmit}
                                        whileHover={!submitting && canSubmit ? { scale: 1.02 } : {}}
                                        whileTap={!submitting && canSubmit ? { scale: 0.98 } : {}}
                                        className={cn(
                                            "w-full flex items-center justify-center gap-2 font-semibold text-base py-4 transition-all duration-200 shadow-lg hover:shadow-xl",
                                            getButtonClass()
                                        )}
                                        style={{
                                            backgroundColor: custom.primaryColor || "#3b82f6",
                                            color: "#ffffff",
                                            borderRadius: custom.borderRadius || "0.75rem",
                                            opacity: (submitting || !canSubmit) ? 0.6 : 1,
                                            cursor: (submitting || !canSubmit) ? "not-allowed" : "pointer",
                                        }}
                                    >
                                        {submitting ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                >
                                                    <Sparkles className="h-5 w-5" />
                                                </motion.div>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="h-5 w-5" />
                                                Submit Vote for {category.name}
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            </PremiumVotingCard>
                        );
                    })}
                </div>

                {contest.categories.every((cat) => {
                    const votingType = cat.votingType || "rank";
                    if (votingType === "rank") {
                        return !(rankings[cat.id] && rankings[cat.id].length > 0);
                    } else {
                        return !(votes[cat.id] !== null && votes[cat.id] !== undefined);
                    }
                }) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="mt-12"
                        >
                            <Card
                                className="border-2 shadow-2xl text-center overflow-hidden relative"
                                style={{
                                    backgroundColor: custom.backgroundImage
                                        ? (custom.backgroundColor || "rgba(255, 255, 255, 0.95)")
                                        : (custom.backgroundColor || "white"),
                                    borderRadius: custom.borderRadius || "1.5rem",
                                }}
                            >
                                {/* Success gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/10" />
                                <CardContent className="pt-12 pb-12 relative z-10">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", delay: 0.2 }}
                                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-6 shadow-lg"
                                    >
                                        <CheckCircle2 className="h-10 w-10 text-white" />
                                    </motion.div>
                                    <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                        All Done! 🎉
                                    </h2>
                                    <p className="text-muted-foreground mb-6 text-lg">
                                        You've submitted votes for all categories. Thank you for participating!
                                    </p>
                                    <motion.button
                                        onClick={() => router.push(`/contests/${contest.id}/results`)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={cn(
                                            "px-8 py-4 font-semibold text-base shadow-xl hover:shadow-2xl transition-all duration-200",
                                            getButtonClass()
                                        )}
                                        style={{
                                            backgroundColor: custom.primaryColor || "#3b82f6",
                                            color: "#ffffff",
                                            borderRadius: custom.borderRadius || "0.75rem",
                                        }}
                                    >
                                        View Results
                                    </motion.button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
            </div>
        </PremiumVotePage>
    );
}

