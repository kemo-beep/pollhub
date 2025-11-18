"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, BarChart3, Calendar, Users, Lock, Globe, Eye, Settings, Twitter, Youtube, Facebook, Instagram, Palette } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
    canVote: boolean;
    categories: Category[];
    isPublic?: boolean;
    passcode?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    showLiveResults?: boolean;
    showResultsAfterEnd?: boolean;
    oneVotePerDevice?: boolean;
    oneVotePerEmail?: boolean;
    oneVotePerAccount?: boolean;
    emailDomainRestriction?: string;
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

export default function ContestDetailPage() {
    const params = useParams();
    const router = useRouter();
    const contestId = params.id as string;
    const [contest, setContest] = useState<Contest | null>(null);
    const [loading, setLoading] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [voteCounts, setVoteCounts] = useState<CategoryVotes>({});
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

    const fetchVoteCounts = useCallback(async () => {
        try {
            const response = await fetch(`/api/contests/${contestId}/results`, {
                cache: 'no-store',
            });
            if (!response.ok) {
                // Results might not be available yet (e.g., not started, no votes)
                return;
            }
            const data = await response.json();

            // Map vote counts by category and contestant
            const counts: CategoryVotes = {};
            data.categories.forEach((category: any) => {
                counts[category.categoryId] = {};
                category.contestants.forEach((contestant: any) => {
                    counts[category.categoryId][contestant.id] = {
                        votes: contestant.votes,
                        percentage: contestant.percentage,
                    };
                });
            });
            setVoteCounts(counts);
        } catch (error) {
            // Silently fail - results might not be available
            console.error("Error fetching vote counts:", error);
        }
    }, [contestId]);

    useEffect(() => {
        // Try to fetch from user's contests first
        fetchContest();
        fetchVoteCounts();

        // Auto-refresh vote counts every 5 seconds
        const interval = setInterval(() => {
            fetchVoteCounts();
        }, 5000);

        return () => clearInterval(interval);
    }, [contestId, fetchVoteCounts]);

    const fetchContest = async () => {
        try {
            const response = await fetch("/api/contests");
            if (!response.ok) throw new Error("Failed to fetch contests");

            const contests = await response.json();
            const found = contests.find((c: any) => c.id === contestId);

            if (found) {
                const contestData = {
                    id: found.id,
                    name: found.name,
                    description: found.description,
                    slug: found.slug,
                    hasEnded: new Date(found.endDate) < new Date(),
                    canVote: new Date(found.endDate) > new Date(),
                    categories: found.categories || [],
                    isPublic: found.isPublic,
                    passcode: found.passcode,
                    startDate: found.startDate,
                    endDate: found.endDate,
                    showLiveResults: found.showLiveResults,
                    showResultsAfterEnd: found.showResultsAfterEnd,
                    oneVotePerDevice: found.oneVotePerDevice,
                    oneVotePerEmail: found.oneVotePerEmail,
                    oneVotePerAccount: found.oneVotePerAccount,
                    emailDomainRestriction: found.emailDomainRestriction,
                };
                setContest(contestData);

                // Initialize settings form
                setSettings({
                    name: found.name,
                    description: found.description || "",
                    isPublic: found.isPublic ?? true,
                    passcode: found.passcode || "",
                    startDate: found.startDate ? new Date(found.startDate).toISOString().slice(0, 16) : "",
                    endDate: found.endDate ? new Date(found.endDate).toISOString().slice(0, 16) : "",
                    showLiveResults: found.showLiveResults ?? false,
                    showResultsAfterEnd: found.showResultsAfterEnd ?? true,
                    oneVotePerDevice: found.oneVotePerDevice ?? true,
                    oneVotePerEmail: found.oneVotePerEmail ?? false,
                    oneVotePerAccount: found.oneVotePerAccount ?? false,
                    emailDomainRestriction: found.emailDomainRestriction || "",
                });
            }
        } catch (error) {
            console.error("Error fetching contest:", error);
        } finally {
            setLoading(false);
        }
    };

    const shareLink = contest
        ? `${window.location.origin}/vote/${contest.slug}`
        : "";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
        toast.success("Link copied to clipboard!");
    };

    if (loading) {
        return (
            <div className="container mx-auto max-w-4xl py-8 px-4">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    if (!contest) {
        return (
            <div className="container mx-auto max-w-4xl py-8 px-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">Contest Not Found</h2>
                            <p className="text-muted-foreground">
                                The contest you're looking for doesn't exist.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

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

            const updated = await response.json();
            toast.success("Contest settings updated successfully!");
            setSettingsOpen(false);
            fetchContest(); // Refresh contest data
        } catch (error: any) {
            toast.error(error.message || "Failed to update contest");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mx-auto max-w-4xl py-8 px-4">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{contest.name}</h1>
                    {contest.description && (
                        <p className="text-muted-foreground mb-4">{contest.description}</p>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => window.open(`/vote/${contest.slug}`, '_blank')}
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                    </Button>
                    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Settings className="h-4 w-4 mr-2" />
                                Edit Settings
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
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={settings.description}
                                        onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="startDate">Start Date</Label>
                                        <Input
                                            id="startDate"
                                            type="datetime-local"
                                            value={settings.startDate}
                                            onChange={(e) => setSettings({ ...settings, startDate: e.target.value })}
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
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isPublic"
                                        checked={settings.isPublic}
                                        onChange={(e) => setSettings({ ...settings, isPublic: e.target.checked })}
                                        className="rounded"
                                    />
                                    <Label htmlFor="isPublic">Public contest (anyone can vote)</Label>
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
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Voting Restrictions</Label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="oneVotePerDevice"
                                            checked={settings.oneVotePerDevice}
                                            onChange={(e) => setSettings({ ...settings, oneVotePerDevice: e.target.checked })}
                                            className="rounded"
                                        />
                                        <Label htmlFor="oneVotePerDevice">One vote per device</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="oneVotePerEmail"
                                            checked={settings.oneVotePerEmail}
                                            onChange={(e) => setSettings({ ...settings, oneVotePerEmail: e.target.checked })}
                                            className="rounded"
                                        />
                                        <Label htmlFor="oneVotePerEmail">One vote per email</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="oneVotePerAccount"
                                            checked={settings.oneVotePerAccount}
                                            onChange={(e) => setSettings({ ...settings, oneVotePerAccount: e.target.checked })}
                                            className="rounded"
                                        />
                                        <Label htmlFor="oneVotePerAccount">One vote per account</Label>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Results Visibility</Label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="showLiveResults"
                                            checked={settings.showLiveResults}
                                            onChange={(e) => setSettings({ ...settings, showLiveResults: e.target.checked })}
                                            className="rounded"
                                        />
                                        <Label htmlFor="showLiveResults">Show live results</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="showResultsAfterEnd"
                                            checked={settings.showResultsAfterEnd}
                                            onChange={(e) => setSettings({ ...settings, showResultsAfterEnd: e.target.checked })}
                                            className="rounded"
                                        />
                                        <Label htmlFor="showResultsAfterEnd">Show results after contest ends</Label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveSettings} disabled={saving}>
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Share2 className="h-5 w-5" />
                            Share Contest
                        </CardTitle>
                        <CardDescription>
                            Share this link for people to vote
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={shareLink}
                                readOnly
                                className="flex-1 px-3 py-2 border rounded-md bg-muted text-sm"
                            />
                            <Button onClick={copyToClipboard} size="sm">
                                Copy
                            </Button>
                        </div>
                        {!contest.isPublic && contest.passcode && (
                            <div className="p-3 bg-muted rounded-md">
                                <Label className="text-xs font-medium">Passcode for participants:</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <code className="flex-1 px-2 py-1 bg-background border rounded text-sm font-mono">
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
                                        Copy
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Share this passcode along with the voting link
                                </p>
                            </div>
                        )}
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => window.open(`/vote/${contest.slug}`, '_blank')}
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            View Voting Page
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Results
                        </CardTitle>
                        <CardDescription>
                            View voting results and analytics
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            className="w-full"
                            onClick={() => router.push(`/contests/${contest.id}/results`)}
                        >
                            View Results
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Customize
                        </CardTitle>
                        <CardDescription>
                            Customize colors, styles, and branding
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => router.push(`/contests/${contest.id}/customize`)}
                        >
                            <Palette className="h-4 w-4 mr-2" />
                            Customize Voting Page
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Categories & Contestants</CardTitle>
                    <CardDescription>
                        {contest.categories.length} categor{contest.categories.length === 1 ? "y" : "ies"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {contest.categories.map((category) => (
                            <div key={category.id} className="border rounded-lg p-4">
                                <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                                {category.description && (
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {category.description}
                                    </p>
                                )}
                                <div className="grid gap-2 sm:grid-cols-2">
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
                                                className="p-3 bg-muted/30 rounded-md flex items-center justify-between gap-3"
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <Avatar className="h-10 w-10 shrink-0">
                                                        <AvatarImage src={contestant.avatar} alt={contestant.name} />
                                                        <AvatarFallback>{getInitials(contestant.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium">{contestant.name}</div>
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
                                                                        className="text-muted-foreground hover:text-foreground"
                                                                    >
                                                                        <Globe className="h-3 w-3" />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {votes !== undefined && (
                                                    <div className="ml-4 text-right shrink-0">
                                                        <div className="font-semibold text-lg">
                                                            {votes.votes}
                                                        </div>
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
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

