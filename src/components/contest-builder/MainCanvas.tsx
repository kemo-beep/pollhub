import { useRef, useEffect, useState } from "react";
import { Category, Contestant } from "./types";
import { PollHeader } from "./PollHeader";
import { CategoryCard } from "./CategoryCard";
import { Sparkles, Plus, ArrowDown } from "lucide-react";

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
            className="flex-1 h-full overflow-y-auto relative bg-gradient-to-br from-slate-50 via-white to-slate-50/30"
            style={{
                scrollBehavior: "smooth",
            }}
        >
            {/* Subtle background pattern */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
                        backgroundSize: "32px 32px",
                    }}
                />
            </div>

            {/* Gradient fade at top */}
            <div className="sticky top-0 z-20 h-24 bg-gradient-to-b from-slate-50 via-slate-50/95 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12 pb-40">
                {/* Header with sticky behavior */}
                <div className={`sticky top-6 z-30 transition-all duration-300 ${isScrolled ? 'mb-8' : 'mb-12'}`}>
                    <div className={`transition-all duration-300 ${isScrolled
                        ? 'shadow-lg rounded-2xl bg-white/95 backdrop-blur-sm border border-slate-200/50'
                        : 'bg-transparent'
                        }`}>
                        <div className={isScrolled ? 'p-6' : 'p-0'}>
                            <PollHeader
                                contestName={contestName}
                                contestDescription={contestDescription}
                                onContestNameChange={onContestNameChange}
                                onContestDescriptionChange={onContestDescriptionChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Categories List with staggered animations */}
                <div className="space-y-5 sm:space-y-6">
                    {categories.map((cat, idx) => (
                        <div
                            key={cat.id}
                            className="animate-in fade-in slide-in-from-bottom-4"
                            style={{
                                animationDelay: `${Math.min(idx * 50, 300)}ms`,
                                animationFillMode: "both",
                            }}
                        >
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
                    ))}
                    <div ref={questionsEndRef} className="h-4" />
                </div>

                {/* Enhanced Empty State */}
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
                                    Your poll canvas is ready. Add categories from the sidebar to begin creating your ranked-choice voting contest.
                                </p>

                                {/* Visual guide */}
                                <div className="flex items-center justify-center gap-2 text-slate-400 mb-6">
                                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200">
                                        <Plus className="h-4 w-4" />
                                        <span className="text-xs font-medium">Add Category</span>
                                    </div>
                                    <ArrowDown className="h-4 w-4 animate-bounce" />
                                </div>

                                {/* Decorative dots */}
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    {[...Array(3)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-2 h-2 rounded-full bg-slate-300 animate-pulse"
                                            style={{ animationDelay: `${i * 200}ms` }}
                                        />
                                    ))}
                                </div>
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

            {/* Bottom gradient fade */}
            <div className="sticky bottom-0 z-20 h-32 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent pointer-events-none" />
        </main>
    );
}

