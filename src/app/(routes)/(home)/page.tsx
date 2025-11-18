import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import SignOutButton from "../(auth)/components/button-signout";
import { getServerSession } from "@/lib/auth/get-session";
import {
  ArrowRight,
  Plus,
  BarChart3,
  Calendar,
  Users,
  Share2,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle2,
  Zap,
  Shield,
  Globe,
  Activity,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { contest, vote } from "@/db/schema";
import { eq, desc, sql, and, gte, lte, or, isNull } from "drizzle-orm";

async function getUserContests(userId: string) {
  const contests = await db.query.contest.findMany({
    where: (contests, { eq }) => eq(contests.userId, userId),
    with: {
      categories: {
        with: {
          contestants: true,
        },
      },
    },
    orderBy: (contests, { desc }) => [desc(contests.createdAt)],
    limit: 12,
  });

  return contests;
}

async function getContestStats(userId: string) {
  const totalContests = await db
    .select({ count: sql<number>`count(*)` })
    .from(contest)
    .where(eq(contest.userId, userId));

  const now = new Date();
  const activeContests = await db
    .select({ count: sql<number>`count(*)` })
    .from(contest)
    .where(
      and(
        eq(contest.userId, userId),
        gte(contest.endDate, now),
        or(isNull(contest.startDate), lte(contest.startDate, now))
      )
    );

  const totalVotes = await db
    .select({ count: sql<number>`count(*)` })
    .from(vote)
    .innerJoin(contest, eq(vote.contestId, contest.id))
    .where(eq(contest.userId, userId));

  return {
    totalContests: Number(totalContests[0]?.count || 0),
    activeContests: Number(activeContests[0]?.count || 0),
    totalVotes: Number(totalVotes[0]?.count || 0),
  };
}

export default async function Home() {
  const me = await getServerSession();

  if (me) {
    const userContests = await getUserContests(me.user.id);
    const stats = await getContestStats(me.user.id);

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        {/* Subtle animated background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Statistics Cards */}
            {userContests.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity hover:opacity-100" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Contests
                    </CardTitle>
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold tracking-tight">{stats.totalContests}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      All time contests
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity hover:opacity-100" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Contests
                    </CardTitle>
                    <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold tracking-tight">{stats.activeContests}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Currently running
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity hover:opacity-100" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Votes
                    </CardTitle>
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold tracking-tight">{stats.totalVotes}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Across all contests
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Contests Section */}
            {userContests.length === 0 ? (
              <Card className="relative overflow-hidden border-2 border-dashed">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />
                <CardContent className="pt-12 pb-12">
                  <div className="text-center space-y-6 max-w-md mx-auto">
                    <div className="relative mx-auto w-20 h-20">
                      <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                        <Users className="h-10 w-10 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold tracking-tight">Create your first contest</h3>
                      <p className="text-muted-foreground">
                        Start building fair, transparent ranked-choice voting experiences for your community.
                      </p>
                    </div>
                    <Link href="/contests/new">
                      <Button size="lg" className="group shadow-lg hover:shadow-xl transition-all duration-300">
                        <Plus className="h-4 w-4 mr-2 transition-transform group-hover:rotate-90" />
                        Create Your First Contest
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Your Contests</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage and monitor your voting contests
                    </p>
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {userContests.map((contest, index) => {
                    const hasEnded = new Date(contest.endDate) < new Date();
                    const hasStarted = !contest.startDate || new Date(contest.startDate) <= new Date();
                    const isActive = hasStarted && !hasEnded;
                    const totalContestants = contest.categories.reduce(
                      (sum, cat) => sum + cat.contestants.length,
                      0
                    );

                    return (
                      <Card
                        key={contest.id}
                        className="group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-primary/50"
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

                        {/* Status indicator */}
                        <div className="absolute top-4 right-4">
                          <div className={cn(
                            "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm",
                            isActive
                              ? "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20"
                              : hasEnded
                                ? "bg-muted text-muted-foreground border border-border"
                                : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-500/20"
                          )}>
                            <div className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              isActive ? "bg-green-500 animate-pulse" : hasEnded ? "bg-muted-foreground" : "bg-yellow-500"
                            )} />
                            {isActive ? "Active" : hasEnded ? "Ended" : "Upcoming"}
                          </div>
                        </div>

                        <CardHeader className="pb-3 relative z-10">
                          <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                            {contest.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 text-sm">
                            {contest.description || "No description provided"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 relative z-10">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{contest.categories.length} categor{contest.categories.length === 1 ? "y" : "ies"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Award className="h-4 w-4" />
                              <span>{totalContestants} contestant{totalContestants !== 1 ? "s" : ""}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t">
                            <Link
                              href={`/contests/${contest.id}`}
                              className={cn(
                                buttonVariants({ variant: "default", size: "sm" }),
                                "flex-1 group/btn"
                              )}
                            >
                              <Share2 className="h-3.5 w-3.5 mr-1.5 transition-transform group-hover/btn:scale-110" />
                              View
                            </Link>
                            <Link
                              href={`/contests/${contest.id}/results`}
                              className={cn(
                                buttonVariants({ variant: "outline", size: "sm" }),
                                "flex-1 group/btn"
                              )}
                            >
                              <BarChart3 className="h-3.5 w-3.5 mr-1.5 transition-transform group-hover/btn:scale-110" />
                              Results
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sign Out */}
            <div className="flex justify-center pt-4">
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDelay: '0.75s' }} />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md group-hover:bg-primary/30 transition-colors" />
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg group-hover:scale-105 transition-transform">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              PollHub
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground px-3 py-1.5 rounded-md hover:bg-muted/50"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className={cn(buttonVariants({ variant: "default", size: "sm" }), "group shadow-lg hover:shadow-xl transition-all")}
            >
              Get Started
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-28 md:py-32">
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 backdrop-blur-sm px-4 py-2 text-sm font-medium shadow-sm animate-fade-in">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span>Ranked Choice Voting Platform</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                Fair voting for{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                    everyone
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/10 blur-xl" />
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl leading-relaxed">
                Create ranked-choice voting contests with multiple categories and contestants.
                Get fair, transparent results with Instant Runoff Voting (IRV).
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in" style={{ animationDelay: '200ms' }}>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "group shadow-xl hover:shadow-2xl transition-all duration-300 text-base px-8"
                )}
              >
                Start Building Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/signin"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "group text-base px-8 border-2 hover:bg-muted/50"
                )}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative border-y bg-muted/30 py-24 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Everything you need to run{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                fair votes
              </span>
            </h2>
            <p className="text-lg text-muted-foreground sm:text-xl">
              Built with modern technologies and best practices, ready for production.
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Users,
                title: "Ranked Choice Voting",
                description: "Fair voting with Instant Runoff Voting (IRV) algorithm for accurate results.",
                color: "from-blue-500/10 to-blue-500/5",
                iconColor: "text-blue-600 dark:text-blue-400",
              },
              {
                icon: Share2,
                title: "Easy Sharing",
                description: "Shareable links and QR codes for easy participation.",
                color: "from-green-500/10 to-green-500/5",
                iconColor: "text-green-600 dark:text-green-400",
              },
              {
                icon: BarChart3,
                title: "Live Results",
                description: "Real-time results with round-by-round breakdowns and visualizations.",
                color: "from-purple-500/10 to-purple-500/5",
                iconColor: "text-purple-600 dark:text-purple-400",
              },
              {
                icon: Calendar,
                title: "Flexible Settings",
                description: "Control voting deadlines, privacy, and restrictions.",
                color: "from-orange-500/10 to-orange-500/5",
                iconColor: "text-orange-600 dark:text-orange-400",
              },
              {
                icon: Plus,
                title: "Multiple Categories",
                description: "Create contests with multiple categories and unlimited contestants.",
                color: "from-pink-500/10 to-pink-500/5",
                iconColor: "text-pink-600 dark:text-pink-400",
              },
              {
                icon: Zap,
                title: "Drag & Drop",
                description: "Intuitive drag-and-drop interface for ranking contestants.",
                color: "from-yellow-500/10 to-yellow-500/5",
                iconColor: "text-yellow-600 dark:text-yellow-400",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border-2 bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-primary/50"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                <div className="relative">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-muted transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                    <feature.icon className={`h-7 w-7 ${feature.iconColor} transition-transform group-hover:scale-110`} />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-12 sm:p-16 text-center shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.15),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(120,119,198,0.1),transparent_50%)]" />
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ready to get started?
              </h2>
              <p className="mx-auto max-w-xl text-lg text-muted-foreground sm:text-xl">
                Create your first ranked-choice voting contest in minutes. Free forever.
              </p>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "group shadow-xl hover:shadow-2xl transition-all duration-300 text-base px-8"
                )}
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md group-hover:bg-primary/30 transition-colors" />
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
              <span className="text-lg font-bold">PollHub</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PollHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
