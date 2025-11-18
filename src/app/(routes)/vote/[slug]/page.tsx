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
import { GripVertical, Check, Twitter, Youtube, Facebook, Instagram, Globe } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PickOneVote } from "@/components/voting/PickOneVote";
import { MultipleChoiceVote } from "@/components/voting/MultipleChoiceVote";
import { RatingVote } from "@/components/voting/RatingVote";
import { HeadToHeadVote } from "@/components/voting/HeadToHeadVote";

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
        opacity: isDragging ? 0.5 : 1,
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
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-3 p-4 bg-card border rounded-lg cursor-grab active:cursor-grabbing"
        >
            <div
                {...attributes}
                {...listeners}
                className="text-muted-foreground hover:text-foreground"
            >
                <GripVertical className="h-5 w-5" />
            </div>
            <Avatar className="h-10 w-10">
                <AvatarImage src={contestant.avatar} alt={contestant.name} />
                <AvatarFallback>{getInitials(contestant.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="font-medium">{contestant.name}</div>
                {contestant.description && (
                    <div className="text-sm text-muted-foreground">
                        {contestant.description}
                    </div>
                )}
                {contestant.socialLinks && (
                    <div className="flex items-center gap-2 mt-1">
                        {contestant.socialLinks.twitter && (
                            <a
                                href={contestant.socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
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
                                onClick={(e) => e.stopPropagation()}
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
                                onClick={(e) => e.stopPropagation()}
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
                                onClick={(e) => e.stopPropagation()}
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
                                onClick={(e) => e.stopPropagation()}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <Globe className="h-3 w-3" />
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
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
    const customStyles: React.CSSProperties = {
        fontFamily: custom.fontFamily || undefined,
        backgroundColor: custom.backgroundColor || undefined,
        color: custom.textColor || undefined,
    };

    // Background image styling (Notion-style)
    const backgroundImageStyles: React.CSSProperties = {};
    if (custom.backgroundImage) {
        backgroundImageStyles.backgroundImage = `url(${custom.backgroundImage})`;
        backgroundImageStyles.backgroundSize = "cover";
        backgroundImageStyles.backgroundPosition = "center";
        backgroundImageStyles.backgroundAttachment = "fixed"; // Fixed background like Notion
        backgroundImageStyles.backgroundRepeat = "no-repeat";
        backgroundImageStyles.minHeight = "100vh";
        backgroundImageStyles.position = "relative";
    }

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
        <>
            {custom.customCSS && (
                <style dangerouslySetInnerHTML={{ __html: custom.customCSS }} />
            )}
            <div
                className="min-h-screen relative"
                style={backgroundImageStyles}
            >
                {/* Background overlay for readability */}
                {custom.backgroundImage && custom.backgroundOverlay && (
                    <div
                        className="fixed inset-0 -z-10"
                        style={{
                            backgroundColor: custom.backgroundOverlay,
                        }}
                    />
                )}

                {/* Content wrapper with overlay background if needed */}
                <div
                    className="relative z-0"
                    style={customStyles}
                >
                    <div className="container mx-auto max-w-4xl py-8 px-4">
                        {/* Header Image */}
                        {custom.headerImage && (
                            <div className="mb-6">
                                <img
                                    src={custom.headerImage}
                                    alt="Header"
                                    className="w-full h-48 object-cover rounded-lg"
                                    style={{ borderRadius }}
                                />
                            </div>
                        )}

                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                {custom.logo && (
                                    <img
                                        src={custom.logo}
                                        alt="Logo"
                                        className="h-12 w-12 rounded"
                                        style={{ borderRadius }}
                                    />
                                )}
                                <h1
                                    className="text-3xl font-bold"
                                    style={{ color: custom.textColor || undefined }}
                                >
                                    {contest.name}
                                </h1>
                            </div>
                            {contest.description && (
                                <p style={{ color: custom.textColor ? `${custom.textColor}CC` : undefined }}>
                                    {contest.description}
                                </p>
                            )}
                        </div>

                        {contest.oneVotePerEmail && (
                            <Card
                                className="mb-6"
                                style={{
                                    backgroundColor: custom.backgroundImage
                                        ? (custom.backgroundColor || "rgba(255, 255, 255, 0.95)")
                                        : undefined,
                                }}
                            >
                                <CardContent className="pt-6">
                                    <Label htmlFor="email">Email (required for voting)</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="mt-2"
                                    />
                                </CardContent>
                            </Card>
                        )}

                        <div className="space-y-6">
                            {contest.categories.map((category) => {
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

                                return (
                                    <Card
                                        key={category.id}
                                        style={{
                                            backgroundColor: custom.backgroundImage
                                                ? (custom.backgroundColor || "rgba(255, 255, 255, 0.95)")
                                                : undefined,
                                        }}
                                    >
                                        <CardHeader>
                                            <CardTitle>{category.name}</CardTitle>
                                            {category.description && (
                                                <CardDescription>{category.description}</CardDescription>
                                            )}
                                            {votingType === "rank" && category.maxRankings && (
                                                <CardDescription>
                                                    Rank your top {category.maxRankings} contestants
                                                </CardDescription>
                                            )}
                                            {votingType === "multiple-choice" && category.maxSelections && (
                                                <CardDescription>
                                                    Select up to {category.maxSelections} contestant{category.maxSelections > 1 ? "s" : ""}
                                                </CardDescription>
                                            )}
                                            {votingType === "rating" && (
                                                <CardDescription>
                                                    Rate each contestant from 1 to {category.ratingScale || 5}
                                                </CardDescription>
                                            )}
                                            {votingType === "head-to-head" && (
                                                <CardDescription>
                                                    Compare contestants in pairs and choose your preferred option
                                                </CardDescription>
                                            )}
                                        </CardHeader>
                                        <CardContent className="space-y-4">
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

                                            <div className="pt-4 border-t">
                                                <button
                                                    onClick={() => handleSubmit(category.id)}
                                                    disabled={submitting || !canSubmit}
                                                    className={`w-full ${getButtonClass()}`}
                                                    style={{
                                                        backgroundColor: custom.primaryColor || undefined,
                                                        color: "#ffffff",
                                                        borderRadius: borderRadius,
                                                        opacity: (submitting || !canSubmit) ? 0.5 : 1,
                                                        cursor: (submitting || !canSubmit) ? "not-allowed" : "pointer",
                                                    }}
                                                >
                                                    {submitting ? (
                                                        "Submitting..."
                                                    ) : (
                                                        <>
                                                            <Check className="h-4 w-4 mr-2" />
                                                            Submit Vote for {category.name}
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </CardContent>
                                    </Card>
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
                                <Card
                                    className="mt-6"
                                    style={{
                                        backgroundColor: custom.backgroundImage
                                            ? (custom.backgroundColor || "rgba(255, 255, 255, 0.95)")
                                            : undefined,
                                    }}
                                >
                                    <CardContent className="pt-6 text-center">
                                        <h2 className="text-2xl font-bold mb-2">All Done!</h2>
                                        <p className="text-muted-foreground mb-4">
                                            You've submitted votes for all categories.
                                        </p>
                                        <button
                                            onClick={() => router.push(`/contests/${contest.id}/results`)}
                                            className={getButtonClass()}
                                            style={{
                                                backgroundColor: custom.primaryColor || undefined,
                                                color: "#ffffff",
                                                borderRadius: borderRadius,
                                            }}
                                        >
                                            View Results
                                        </button>
                                    </CardContent>
                                </Card>
                            )}
                    </div>
                </div>
            </div>
        </>
    );
}

