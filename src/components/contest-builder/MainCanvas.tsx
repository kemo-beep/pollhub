import { useRef, useEffect, useState } from "react";
import { Category, Contestant, VotingType } from "./types";
import { PollHeader } from "./PollHeader";
import { CategoryCard } from "./CategoryCard";
import { Sparkles, Plus, ArrowDown, ArrowUpDown, CircleDot, ListChecks, Star, GitCompare } from "lucide-react";
import { getVotingTypeLabel } from "./utils";
import { motion } from "framer-motion";

interface MainCanvasProps {
    contestName: string;
    contestDescription: string;
    categories: Category[];
    activeCategoryId: string | null;
    onContestNameChange: (name: string) => void;
    onContestDescriptionChange: (description: string) => void;
    onCategorySelect: (id: string) => void;
    onCategoryDelete: (id: string, e: React.MouseEvent) => void;
    onCategoryNameChange: (id: string, name: string) => void;
    onCategoryUpdate?: (id: string, updates: Partial<Category>) => void;
    onContestantUpdate?: (categoryId: string, contestantId: string, updates: Partial<Contestant>) => void;
    onContestantDelete?: (categoryId: string, contestantId: string) => void;
    onContestantAdd?: (categoryId: string) => void;
    onAddCategory?: (type: VotingType) => void;
}

export function MainCanvas({
    contestName,
    contestDescription,
    categories,
    activeCategoryId,
    onContestNameChange,
    onContestDescriptionChange,
    onCategorySelect,
    onCategoryDelete,
    onCategoryNameChange,
    onCategoryUpdate,
    onContestantUpdate,
    onContestantDelete,
    onContestantAdd,
    onAddCategory,
}: MainCanvasProps) {
    const questionsEndRef = useRef<HTMLDivElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);
    const mainRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when a new category is added
    useEffect(() => {
        if (categories.length > 0 && activeCategoryId) {
            const timeout = setTimeout(() => {
                questionsEndRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "end"
                });
            }, 150);
            return () => clearTimeout(timeout);
        }
    }, [categories.length, activeCategoryId]);

    // Track scroll position for header styling
    useEffect(() => {
        const handleScroll = () => {
            if (mainRef.current) {
                const scrolled = mainRef.current.scrollTop > 20;
                setIsScrolled(scrolled);

                // Show scroll indicator if not at bottom
                const { scrollTop, scrollHeight, clientHeight } = mainRef.current;
                const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
                setShowScrollIndicator(!isNearBottom && categories.length > 2);
            }
        };

        const mainElement = mainRef.current;
        if (mainElement) {
            mainElement.addEventListener("scroll", handleScroll);
            handleScroll(); // Initial check
            return () => mainElement.removeEventListener("scroll", handleScroll);
        }
    }, [categories.length]);

    return (
        <main
            ref={mainRef}
            className="flex-1 h-full overflow-y-auto relative bg-gradient-to-br from-slate-50 via-white via-blue-50/20 to-purple-50/20"
            style={{
                scrollBehavior: "smooth",
            }}
        >
            {/* Premium animated background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Animated gradient orbs */}
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />

                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
                            backgroundSize: "32px 32px",
                        }}
                    />
                </div>
            </div>

            {/* Premium gradient fade at top */}
            <div className="sticky top-0 z-20 h-24 bg-gradient-to-b from-slate-50/95 via-white/90 to-transparent backdrop-blur-sm pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12 pb-40">
                {/* Premium Header with sticky behavior */}
                <div className={`z-30 transition-all duration-500 ${isScrolled ? 'mb-8' : 'mb-12'}`}>
                    <div className={`transition-all duration-500 ${isScrolled
                        ? 'shadow-2xl rounded-3xl bg-white/98 backdrop-blur-md border-2 border-slate-200/60 shadow-primary/5'
                        : 'bg-transparent'
                        }`}>
                        <div className={isScrolled ? 'p-8' : 'p-0'}>
                            <PollHeader
                                contestName={contestName}
                                contestDescription={contestDescription}
                                onContestNameChange={onContestNameChange}
                                onContestDescriptionChange={onContestDescriptionChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Premium Categories List with enhanced animations */}
                <div className="space-y-6 sm:space-y-8">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                duration: 0.5,
                                delay: Math.min(idx * 0.1, 0.5),
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            whileHover={{ scale: 1.01 }}
                            className="relative"
                        >
                            {/* Glow effect for active category */}
                            {activeCategoryId === cat.id && (
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl blur-xl opacity-75 animate-pulse" />
                            )}
                            <div className="relative">
                                <CategoryCard
                                    category={cat}
                                    index={idx}
                                    isActive={activeCategoryId === cat.id}
                                    onSelect={() => onCategorySelect(cat.id)}
                                    onDelete={(e) => onCategoryDelete(cat.id, e)}
                                    onNameChange={(name) => onCategoryNameChange(cat.id, name)}
                                    onUpdate={onCategoryUpdate ? (updates) => onCategoryUpdate(cat.id, updates) : undefined}
                                    onContestantUpdate={onContestantUpdate ? (contestantId, updates) => onContestantUpdate(cat.id, contestantId, updates) : undefined}
                                    onContestantDelete={onContestantDelete ? (contestantId) => onContestantDelete(cat.id, contestantId) : undefined}
                                    onContestantAdd={onContestantAdd ? () => onContestantAdd(cat.id) : undefined}
                                />
                            </div>
                        </motion.div>
                    ))}
                    <div ref={questionsEndRef} className="h-4" />
                </div>

                {/* Enhanced Empty State with Action Options */}
                {categories.length === 0 && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="relative mt-16 sm:mt-24">
                            {/* Decorative background elements */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="absolute w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-pulse" />
                                <div className="absolute w-48 h-48 rounded-full bg-primary/10 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                            </div>

                            <div className="relative text-center py-16 sm:py-24 px-6">
                                {/* Icon */}
                                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 mb-6 shadow-lg">
                                    <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-primary/60" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl sm:text-2xl font-semibold text-slate-700 mb-3">
                                    Start Building Your Poll
                                </h3>
                                <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
                                    Choose a voting type to add your first category and begin creating your ranked-choice voting contest.
                                </p>

                                {/* Action Options Grid */}
                                {onAddCategory && (
                                    <div className="max-w-2xl mx-auto">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                                            <button
                                                onClick={() => onAddCategory("rank")}
                                                className="group relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-slate-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 hover:shadow-lg hover:scale-105"
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                    <ArrowUpDown className="h-6 w-6 text-primary" />
                                                </div>
                                                <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">
                                                    {getVotingTypeLabel("rank")}
                                                </span>
                                            </button>

                                            <button
                                                onClick={() => onAddCategory("pick-one")}
                                                className="group relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-slate-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 hover:shadow-lg hover:scale-105"
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                    <CircleDot className="h-6 w-6 text-primary" />
                                                </div>
                                                <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">
                                                    {getVotingTypeLabel("pick-one")}
                                                </span>
                                            </button>

                                            <button
                                                onClick={() => onAddCategory("multiple-choice")}
                                                className="group relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-slate-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 hover:shadow-lg hover:scale-105"
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                    <ListChecks className="h-6 w-6 text-primary" />
                                                </div>
                                                <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">
                                                    {getVotingTypeLabel("multiple-choice")}
                                                </span>
                                            </button>

                                            <button
                                                onClick={() => onAddCategory("rating")}
                                                className="group relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-slate-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 hover:shadow-lg hover:scale-105"
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                    <Star className="h-6 w-6 text-primary" />
                                                </div>
                                                <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">
                                                    {getVotingTypeLabel("rating")}
                                                </span>
                                            </button>

                                            <button
                                                onClick={() => onAddCategory("head-to-head")}
                                                className="group relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-slate-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 hover:shadow-lg hover:scale-105 sm:col-start-2"
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                    <GitCompare className="h-6 w-6 text-primary" />
                                                </div>
                                                <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">
                                                    {getVotingTypeLabel("head-to-head")}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Scroll to bottom indicator */}
            {showScrollIndicator && (
                <button
                    onClick={() => {
                        questionsEndRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "end"
                        });
                    }}
                    className="fixed bottom-8 right-8 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg border border-slate-200 hover:shadow-xl hover:scale-110 transition-all duration-200 text-slate-600 hover:text-primary group"
                    aria-label="Scroll to bottom"
                >
                    <ArrowDown className="h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
                </button>
            )}

            {/* Premium bottom gradient fade */}
            <div className="sticky bottom-0 z-20 h-32 bg-gradient-to-t from-slate-50/95 via-white/90 to-transparent backdrop-blur-sm pointer-events-none" />
        </main>
    );
}

