"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Share2,
    BarChart3,
    Calendar,
    Users,
    Lock,
    Globe,
    Eye,
    Settings,
    Twitter,
    Youtube,
    Facebook,
    Instagram,
    Palette,
    Clock,
    CheckCircle2,
    AlertCircle,
    Copy,
    ExternalLink,
    TrendingUp,
    Award,
    Zap,
    Loader2,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QRCodeGenerator } from "@/components/sharing/QRCodeGenerator";
import { SocialShareButtons } from "@/components/sharing/SocialShareButtons";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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

interface Category {
    id: string;
    name: string;
    description?: string;
    contestants: Contestant[];
}

interface Contest {
    id: string;
    name: string;
    description?: string;
    slug: string;
    hasEnded: boolean;
    hasStarted: boolean;
    canVote: boolean;
    categories: Category[];
    isPublic?: boolean;
    passcode?: string;
    startDate?: string | Date | null;
    endDate?: string | Date | null;
    showLiveResults?: boolean;
    showResultsAfterEnd?: boolean;
    oneVotePerDevice?: boolean;
    oneVotePerEmail?: boolean;
    oneVotePerAccount?: boolean;
    emailDomainRestriction?: string;
    createdAt?: string | Date | null;
}

interface ContestantVotes {
    [contestantId: string]: {
        votes: number;
        percentage: number;
    };
}

interface CategoryVotes {
    [categoryId: string]: ContestantVotes;
}

// Format date helper
const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return "Not set";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// Time remaining helper
const getTimeRemaining = (endDate: string | Date | null | undefined): string | null => {
    if (!endDate) return null;
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Ended";
    if (diff < 60000) return "Less than a minute";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours`;
    return `${Math.floor(diff / 86400000)} days`;
};

// Get contest status
const getContestStatus = (contest: Contest | null): { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode } => {
    if (!contest) return { label: "Unknown", variant: "outline", icon: <AlertCircle className="h-3 w-3" /> };

    const now = new Date();
    const startDate = contest.startDate ? new Date(contest.startDate) : null;
    const endDate = contest.endDate ? new Date(contest.endDate) : null;

    if (endDate && now > endDate) {
        return { label: "Ended", variant: "secondary", icon: <CheckCircle2 className="h-3 w-3" /> };
    }
    if (startDate && now < startDate) {
        return { label: "Upcoming", variant: "outline", icon: <Clock className="h-3 w-3" /> };
    }
    return { label: "Active", variant: "default", icon: <Zap className="h-3 w-3" /> };
};

export default function ContestDetailPage() {
    const params = useParams();
    const router = useRouter();
    const contestId = params.id as string;
    const [contest, setContest] = useState<Contest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [voteCounts, setVoteCounts] = useState<CategoryVotes>({});
    const [totalVotes, setTotalVotes] = useState(0);
    const [settings, setSettings] = useState({
        name: "",
        description: "",
        isPublic: true,
        passcode: "",
        startDate: "",
        endDate: "",
        showLiveResults: false,
        showResultsAfterEnd: true,
        oneVotePerDevice: true,
        oneVotePerEmail: false,
        oneVotePerAccount: false,
        emailDomainRestriction: "",
    });

    // Memoize share link
    const shareLink = useMemo(() => {
        if (!contest) return "";
        if (typeof window === "undefined") return "";
        return `${window.location.origin}/vote/${contest.slug}`;
    }, [contest]);

    // Fetch vote counts
    const fetchVoteCounts = useCallback(async () => {
        if (!contestId) return;
        try {
            const response = await fetch(`/api/contests/${contestId}/results`, {
                cache: "no-store",
            });
            if (!response.ok) {
                // Results might not be available yet
                return;
            }
            const data = await response.json();

            // Map vote counts by category and contestant
            const counts: CategoryVotes = {};
            let total = 0;
            data.categories?.forEach((category: any) => {
                counts[category.categoryId] = {};
                category.contestants?.forEach((contestant: any) => {
                    counts[category.categoryId][contestant.id] = {
                        votes: contestant.votes || 0,
                        percentage: contestant.percentage || 0,
                    };
                });
                total += category.totalVotes || 0;
            });
            setVoteCounts(counts);
            setTotalVotes(data.totalVotes || total);
        } catch (error) {
            // Silently fail - results might not be available
            console.error("Error fetching vote counts:", error);
        }
    }, [contestId]);

    // Fetch contest data
    const fetchContest = useCallback(async () => {
        if (!contestId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/contests/${contestId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    setError("Contest not found");
                } else if (response.status === 401) {
                    setError("You don't have permission to view this contest");
                } else {
                    setError("Failed to load contest");
                }
                return;
            }

            const data = await response.json();
            const contestData: Contest = {
                id: data.id,
                name: data.name,
                description: data.description,
                slug: data.slug,
                hasEnded: data.hasEnded || false,
                hasStarted: data.hasStarted || true,
                canVote: data.canVote || false,
                categories: data.categories || [],
                isPublic: data.isPublic,
                passcode: data.passcode,
                startDate: data.startDate,
                endDate: data.endDate,
                showLiveResults: data.showLiveResults,
                showResultsAfterEnd: data.showResultsAfterEnd,
                oneVotePerDevice: data.oneVotePerDevice,
                oneVotePerEmail: data.oneVotePerEmail,
                oneVotePerAccount: data.oneVotePerAccount,
                emailDomainRestriction: data.emailDomainRestriction,
                createdAt: data.createdAt,
            };
            setContest(contestData);

            // Initialize settings form
            setSettings({
                name: data.name,
                description: data.description || "",
                isPublic: data.isPublic ?? true,
                passcode: data.passcode || "",
                startDate: data.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : "",
                endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : "",
                showLiveResults: data.showLiveResults ?? false,
                showResultsAfterEnd: data.showResultsAfterEnd ?? true,
                oneVotePerDevice: data.oneVotePerDevice ?? true,
                oneVotePerEmail: data.oneVotePerEmail ?? false,
                oneVotePerAccount: data.oneVotePerAccount ?? false,
                emailDomainRestriction: data.emailDomainRestriction || "",
            });
        } catch (error) {
            console.error("Error fetching contest:", error);
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }, [contestId]);

    // Initial fetch and auto-refresh
    useEffect(() => {
        fetchContest();
        fetchVoteCounts();

        // Auto-refresh vote counts every 5 seconds if contest is active
        const interval = setInterval(() => {
            if (contest && !contest.hasEnded) {
                fetchVoteCounts();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [contestId, fetchContest, fetchVoteCounts, contest?.hasEnded]);

    const copyToClipboard = useCallback(() => {
        if (!shareLink) return;
        navigator.clipboard.writeText(shareLink);
        toast.success("Link copied to clipboard!", {
            icon: <Copy className="h-4 w-4" />,
        });
    }, [shareLink]);

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            const payload: any = {
                name: settings.name,
                description: settings.description || undefined,
                isPublic: settings.isPublic,
                passcode: settings.passcode || undefined,
                startDate: settings.startDate ? new Date(settings.startDate).toISOString() : undefined,
                endDate: settings.endDate ? new Date(settings.endDate).toISOString() : undefined,
                showLiveResults: settings.showLiveResults,
                showResultsAfterEnd: settings.showResultsAfterEnd,
                oneVotePerDevice: settings.oneVotePerDevice,
                oneVotePerEmail: settings.oneVotePerEmail,
                oneVotePerAccount: settings.oneVotePerAccount,
                emailDomainRestriction: settings.emailDomainRestriction || undefined,
            };

            const response = await fetch(`/api/contests/${contestId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to update contest");
            }

            toast.success("Contest settings updated successfully!");
            setSettingsOpen(false);
            fetchContest(); // Refresh contest data
        } catch (error: any) {
            toast.error(error.message || "Failed to update contest");
        } finally {
            setSaving(false);
        }
    };

    const contestStatus = getContestStatus(contest);
    const timeRemaining = contest ? getTimeRemaining(contest.endDate) : null;
    const totalContestants = contest?.categories.reduce((sum, cat) => sum + cat.contestants.length, 0) || 0;

    // Loading state
    if (loading) {
        return (
            <div className="container mx-auto max-w-6xl py-8 px-4">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                        <p className="text-muted-foreground">Loading contest...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !contest) {
        return (
            <div className="container mx-auto max-w-4xl py-8 px-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Contest Not Found</h2>
                                <p className="text-muted-foreground mb-4">
                                    {error || "The contest you're looking for doesn't exist or you don't have permission to view it."}
                                </p>
                                <Button onClick={() => router.push("/")} variant="outline">
                                    Go to Home
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-6xl py-8 px-4">
            {/* Header Section */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-3xl sm:text-4xl font-bold">{contest.name}</h1>
                            <Badge variant={contestStatus.variant} className="gap-1.5">
                                {contestStatus.icon}
                                {contestStatus.label}
                            </Badge>
                        </div>
                        {contest.description && (
                            <p className="text-muted-foreground text-lg">{contest.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    {contest.startDate
                                        ? `Starts: ${formatDate(contest.startDate)}`
                                        : "Starts immediately"}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                <span>
                                    Ends: {formatDate(contest.endDate)}
                                    {timeRemaining && !contest.hasEnded && (
                                        <span className="ml-1 text-primary font-medium">
                                            ({timeRemaining} left)
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Users className="h-4 w-4" />
                                <span>{totalContestants} contestants</span>
                            </div>
                            {totalVotes > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <TrendingUp className="h-4 w-4" />
                                    <span>{totalVotes} votes</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <Button
                            variant="outline"
                            onClick={() => window.open(`/vote/${contest.slug}`, "_blank")}
                            className="gap-2"
                        >
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">Preview</span>
                        </Button>
                        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <Settings className="h-4 w-4" />
                                    <span className="hidden sm:inline">Settings</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Edit Contest Settings</DialogTitle>
                                    <DialogDescription>
                                        Update your contest settings and preferences
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div>
                                        <Label htmlFor="name">Contest Name *</Label>
                                        <Input
                                            id="name"
                                            value={settings.name}
                                            onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                                            required
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={settings.description}
                                            onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                                            rows={3}
                                            className="mt-1"
                                            placeholder="Describe your contest..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="startDate">Start Date</Label>
                                            <Input
                                                id="startDate"
                                                type="datetime-local"
                                                value={settings.startDate}
                                                onChange={(e) => setSettings({ ...settings, startDate: e.target.value })}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="endDate">End Date *</Label>
                                            <Input
                                                id="endDate"
                                                type="datetime-local"
                                                value={settings.endDate}
                                                onChange={(e) => setSettings({ ...settings, endDate: e.target.value })}
                                                required
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                                        <input
                                            type="checkbox"
                                            id="isPublic"
                                            checked={settings.isPublic}
                                            onChange={(e) => setSettings({ ...settings, isPublic: e.target.checked })}
                                            className="rounded"
                                        />
                                        <Label htmlFor="isPublic" className="cursor-pointer">
                                            Public contest (anyone with the link can vote)
                                        </Label>
                                    </div>
                                    {!settings.isPublic && (
                                        <div>
                                            <Label htmlFor="passcode">Passcode *</Label>
                                            <Input
                                                id="passcode"
                                                type="text"
                                                value={settings.passcode}
                                                onChange={(e) => setSettings({ ...settings, passcode: e.target.value })}
                                                placeholder="Enter passcode for participants"
                                                required
                                                className="mt-1"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Share this passcode with participants. They'll need it to access the voting page.
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <Label htmlFor="emailDomainRestriction">Email Domain Restriction</Label>
                                        <Input
                                            id="emailDomainRestriction"
                                            value={settings.emailDomainRestriction}
                                            onChange={(e) => setSettings({ ...settings, emailDomainRestriction: e.target.value })}
                                            placeholder="e.g., @company.com"
                                            className="mt-1"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Only allow votes from emails with this domain
                                        </p>
                                    </div>
                                    <div className="space-y-3 p-3 border rounded-lg">
                                        <Label>Voting Restrictions</Label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="oneVotePerDevice"
                                                checked={settings.oneVotePerDevice}
                                                onChange={(e) => setSettings({ ...settings, oneVotePerDevice: e.target.checked })}
                                                className="rounded"
                                            />
                                            <Label htmlFor="oneVotePerDevice" className="cursor-pointer">
                                                One vote per device
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="oneVotePerEmail"
                                                checked={settings.oneVotePerEmail}
                                                onChange={(e) => setSettings({ ...settings, oneVotePerEmail: e.target.checked })}
                                                className="rounded"
                                            />
                                            <Label htmlFor="oneVotePerEmail" className="cursor-pointer">
                                                One vote per email
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="oneVotePerAccount"
                                                checked={settings.oneVotePerAccount}
                                                onChange={(e) => setSettings({ ...settings, oneVotePerAccount: e.target.checked })}
                                                className="rounded"
                                            />
                                            <Label htmlFor="oneVotePerAccount" className="cursor-pointer">
                                                One vote per account
                                            </Label>
                                        </div>
                                    </div>
                                    <div className="space-y-3 p-3 border rounded-lg">
                                        <Label>Results Visibility</Label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="showLiveResults"
                                                checked={settings.showLiveResults}
                                                onChange={(e) => setSettings({ ...settings, showLiveResults: e.target.checked })}
                                                className="rounded"
                                            />
                                            <Label htmlFor="showLiveResults" className="cursor-pointer">
                                                Show live results as votes come in
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="showResultsAfterEnd"
                                                checked={settings.showResultsAfterEnd}
                                                onChange={(e) => setSettings({ ...settings, showResultsAfterEnd: e.target.checked })}
                                                className="rounded"
                                            />
                                            <Label htmlFor="showResultsAfterEnd" className="cursor-pointer">
                                                Show results after contest ends
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSaveSettings} disabled={saving}>
                                        {saving ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {/* Quick Actions Cards */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Share2 className="h-5 w-5" />
                            Share Contest
                        </CardTitle>
                        <CardDescription>Share this link for people to vote</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                value={shareLink}
                                readOnly
                                className="flex-1 text-sm bg-muted"
                                onClick={(e) => (e.target as HTMLInputElement).select()}
                            />
                            <Button onClick={copyToClipboard} size="sm" variant="outline">
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <QRCodeGenerator url={shareLink} title={contest.name} />
                            <SocialShareButtons
                                url={shareLink}
                                title={contest.name}
                                description={contest.description || ""}
                                size={20}
                            />
                        </div>
                        {!contest.isPublic && contest.passcode && (
                            <div className="p-3 bg-muted rounded-md space-y-2">
                                <Label className="text-xs font-medium">Passcode for participants:</Label>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 px-2 py-1.5 bg-background border rounded text-sm font-mono">
                                        {contest.passcode}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            navigator.clipboard.writeText(contest.passcode || "");
                                            toast.success("Passcode copied!");
                                        }}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Share this passcode along with the voting link
                                </p>
                            </div>
                        )}
                        <Button
                            variant="outline"
                            className="w-full gap-2"
                            onClick={() => window.open(`/vote/${contest.slug}`, "_blank")}
                        >
                            <ExternalLink className="h-4 w-4" />
                            View Voting Page
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Results
                        </CardTitle>
                        <CardDescription>View voting results and analytics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {totalVotes > 0 ? (
                            <div className="space-y-2">
                                <div className="text-3xl font-bold">{totalVotes}</div>
                                <div className="text-sm text-muted-foreground">Total votes</div>
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground py-4">
                                No votes yet
                            </div>
                        )}
                        <Button
                            className="w-full gap-2"
                            onClick={() => router.push(`/contests/${contest.id}/results`)}
                        >
                            <BarChart3 className="h-4 w-4" />
                            View Results
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Customize
                        </CardTitle>
                        <CardDescription>Customize colors, styles, and branding</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            className="w-full gap-2"
                            variant="outline"
                            onClick={() => router.push(`/contests/${contest.id}/customize`)}
                        >
                            <Palette className="h-4 w-4" />
                            Customize Voting Page
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Categories & Contestants */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Categories & Contestants</CardTitle>
                            <CardDescription>
                                {contest.categories.length} categor{contest.categories.length === 1 ? "y" : "ies"} • {totalContestants} contestants
                            </CardDescription>
                        </div>
                        {contest.isPublic !== false && (
                            <Badge variant="outline" className="gap-1.5">
                                <Globe className="h-3 w-3" />
                                Public
                            </Badge>
                        )}
                        {contest.isPublic === false && (
                            <Badge variant="outline" className="gap-1.5">
                                <Lock className="h-3 w-3" />
                                Private
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {contest.categories.map((category) => {
                            const categoryVotes = voteCounts[category.id];
                            const categoryTotalVotes = categoryVotes
                                ? Object.values(categoryVotes).reduce((sum, v) => sum + v.votes, 0)
                                : 0;

                            return (
                                <div key={category.id} className="border rounded-lg p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-lg">{category.name}</h3>
                                            {category.description && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {category.description}
                                                </p>
                                            )}
                                        </div>
                                        {categoryTotalVotes > 0 && (
                                            <Badge variant="secondary" className="gap-1.5">
                                                <TrendingUp className="h-3 w-3" />
                                                {categoryTotalVotes} votes
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                        {category.contestants.map((contestant) => {
                                            const votes = voteCounts[category.id]?.[contestant.id];
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
                                                    key={contestant.id}
                                                    className={cn(
                                                        "p-3 rounded-md flex items-center justify-between gap-3 transition-colors",
                                                        votes && votes.votes > 0
                                                            ? "bg-muted/50 border border-border"
                                                            : "bg-muted/30"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <Avatar className="h-10 w-10 shrink-0">
                                                            <AvatarImage src={contestant.avatar} alt={contestant.name} />
                                                            <AvatarFallback className="text-xs">
                                                                {getInitials(contestant.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium truncate">{contestant.name}</div>
                                                            {contestant.description && (
                                                                <div className="text-sm text-muted-foreground truncate">
                                                                    {contestant.description}
                                                                </div>
                                                            )}
                                                            {contestant.socialLinks && (
                                                                <div className="flex items-center gap-1.5 mt-1">
                                                                    {contestant.socialLinks.twitter && (
                                                                        <a
                                                                            href={contestant.socialLinks.twitter}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-muted-foreground hover:text-foreground transition-colors"
                                                                            aria-label={`${contestant.name}'s Twitter`}
                                                                        >
                                                                            <Twitter className="h-3 w-3" />
                                                                        </a>
                                                                    )}
                                                                    {contestant.socialLinks.youtube && (
                                                                        <a
                                                                            href={contestant.socialLinks.youtube}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-muted-foreground hover:text-foreground transition-colors"
                                                                            aria-label={`${contestant.name}'s YouTube`}
                                                                        >
                                                                            <Youtube className="h-3 w-3" />
                                                                        </a>
                                                                    )}
                                                                    {contestant.socialLinks.facebook && (
                                                                        <a
                                                                            href={contestant.socialLinks.facebook}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-muted-foreground hover:text-foreground transition-colors"
                                                                            aria-label={`${contestant.name}'s Facebook`}
                                                                        >
                                                                            <Facebook className="h-3 w-3" />
                                                                        </a>
                                                                    )}
                                                                    {contestant.socialLinks.instagram && (
                                                                        <a
                                                                            href={contestant.socialLinks.instagram}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-muted-foreground hover:text-foreground transition-colors"
                                                                            aria-label={`${contestant.name}'s Instagram`}
                                                                        >
                                                                            <Instagram className="h-3 w-3" />
                                                                        </a>
                                                                    )}
                                                                    {contestant.socialLinks.website && (
                                                                        <a
                                                                            href={contestant.socialLinks.website}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-muted-foreground hover:text-foreground transition-colors"
                                                                            aria-label={`${contestant.name}'s Website`}
                                                                        >
                                                                            <Globe className="h-3 w-3" />
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {votes !== undefined && votes.votes > 0 && (
                                                        <div className="ml-4 text-right shrink-0">
                                                            <div className="font-semibold text-lg">{votes.votes}</div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {votes.percentage.toFixed(1)}%
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
