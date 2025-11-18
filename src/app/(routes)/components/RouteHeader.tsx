"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ContestHeader } from "../contests/new/components/ContestHeader";
import { useContestFormContext } from "../contests/new/context/ContestFormContext";
import { useSession } from "@/lib/auth/client";
import { Plus, Sparkles } from "lucide-react";

export function RouteHeader() {
    const pathname = usePathname();
    const isContestNewPage = pathname === "/contests/new";
    const isHomePage = pathname === "/";
    const { data: session } = useSession();

    // Try to get contest form context if on contests/new page
    let contestFormContext = null;
    if (isContestNewPage) {
        try {
            contestFormContext = useContestFormContext();
        } catch {
            // Context not available yet (provider might not be mounted)
            contestFormContext = null;
        }
    }

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2 flex-1">
                {isHomePage && session?.user ? (
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl" />
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                                <Sparkles className="h-5 w-5" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold">
                                Welcome back,{" "}
                                <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                                    {session.user.name?.split(" ")[0] || "there"}
                                </span>
                            </h1>
                        </div>
                    </div>
                ) : (
                    <h1 className="text-lg font-semibold">PollHub</h1>
                )}
            </div>
            {isContestNewPage && contestFormContext && (
                <div className="flex items-center gap-3">
                    <ContestHeader
                        onSettingsClick={() =>
                            contestFormContext!.setShowSettings(
                                !contestFormContext!.showSettings
                            )
                        }
                        onPreviewClick={() => contestFormContext!.setShowPreview(true)}
                        onCreateClick={contestFormContext!.handleSubmit}
                        loading={contestFormContext!.loading}
                    />
                </div>
            )}
            {isHomePage && session?.user && (
                <Link href="/contests/new">
                    <Button size="lg" className="group shadow-lg hover:shadow-xl transition-all duration-300">
                        <Plus className="h-4 w-4 mr-2 transition-transform group-hover:rotate-90" />
                        Create Contest
                    </Button>
                </Link>
            )}
        </header>
    );
}

