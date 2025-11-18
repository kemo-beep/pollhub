import { useState, useEffect } from "react";
import { Trash2, ChevronDown, ChevronUp, Plus, X, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Category, Contestant, VotingType } from "./types";
import { getVotingTypeIcon, getVotingTypeLabel } from "./utils";
import { CategoryPreview } from "./CategoryPreview";

interface CategoryCardProps {
    category: Category;
    index: number;
    isActive: boolean;
    onSelect: () => void;
    onDelete: (e: React.MouseEvent) => void;
    onNameChange: (name: string) => void;
    onUpdate?: (updates: Partial<Category>) => void;
    onContestantUpdate?: (contestantId: string, updates: Partial<Contestant>) => void;
    onContestantDelete?: (contestantId: string) => void;
    onContestantAdd?: () => void;
}

export function CategoryCard({
    category,
    index,
    isActive,
    onSelect,
    onDelete,
    onNameChange,
    onUpdate,
    onContestantUpdate,
    onContestantDelete,
    onContestantAdd,
}: CategoryCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasInlineEditing = !!onUpdate;

    // Auto-expand when category becomes active
    useEffect(() => {
        if (isActive && hasInlineEditing) {
            setIsExpanded(true);
        }
    }, [isActive, hasInlineEditing]);
    return (
        <div
            onClick={onSelect}
            className={`relative bg-white rounded-xl border transition-all duration-300 cursor-pointer group overflow-hidden ${isActive
                ? "border-primary/60 ring-2 ring-primary/20 shadow-xl shadow-primary/5 scale-[1.01] z-10"
                : "border-slate-200/60 hover:border-slate-300 hover:shadow-lg hover:scale-[1.005]"
                }`}
        >
            {/* Active indicator bar */}
            <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl transition-all duration-300 ${isActive
                    ? "bg-gradient-to-b from-primary to-primary/80 shadow-sm"
                    : "bg-transparent group-hover:bg-slate-200/50"
                    }`}
            />

            {/* Subtle gradient overlay on hover */}
            <div
                className={`absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 transition-all duration-300 pointer-events-none ${isActive
                    ? "from-primary/5 via-primary/2 to-transparent"
                    : "group-hover:from-primary/2 group-hover:via-transparent group-hover:to-transparent"
                    }`}
            />

            <div className="relative p-6 sm:p-7">
                {/* Header with index and type */}
                <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Index badge */}
                        <div
                            className={`flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs transition-all duration-300 flex-shrink-0 ${isActive
                                ? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-md shadow-primary/20 scale-110"
                                : "bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:scale-105"
                                }`}
                        >
                            {index + 1}
                        </div>

                        {/* Voting type badge */}
                        <span
                            className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all duration-300 ${isActive
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "bg-slate-50 text-slate-500 border border-slate-200/60 group-hover:bg-slate-100 group-hover:text-slate-600"
                                }`}
                        >
                            {getVotingTypeIcon(category.votingType)}
                            <span className="text-[10px]">{getVotingTypeLabel(category.votingType)}</span>
                        </span>
                    </div>

                    {/* Delete button */}
                    <button
                        onClick={onDelete}
                        className={`ml-2 text-slate-300 hover:text-red-500 transition-all duration-200 p-2 rounded-lg hover:bg-red-50 flex-shrink-0 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            }`}
                        aria-label="Delete category"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>

                {/* Category name input */}
                <div className="mb-5">
                    <Input
                        className={`w-full text-lg sm:text-xl font-semibold text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent border-0 focus-visible:ring-0 p-0 h-auto transition-colors ${isActive ? "text-slate-900" : "text-slate-700"
                            }`}
                        value={category.name}
                        onChange={(e) => onNameChange(e.target.value)}
                        placeholder="Type your question here..."
                        autoFocus={isActive}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>

                {/* Description input (inline) */}
                {hasInlineEditing && isActive && (
                    <div className="mb-4" onClick={(e) => e.stopPropagation()}>
                        <Textarea
                            className="w-full text-sm text-slate-600 placeholder-slate-400 resize-none focus:outline-none bg-slate-50/50 border border-slate-200/60 rounded-lg p-3 focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"
                            value={category.description || ""}
                            onChange={(e) => onUpdate?.({ description: e.target.value })}
                            placeholder="Add a description (optional)..."
                            rows={2}
                        />
                    </div>
                )}

                {/* Category Type Specific Content Preview */}
                <div
                    className={`transition-opacity duration-300 pointer-events-none ${isActive ? "opacity-90" : "opacity-70 group-hover:opacity-85"
                        }`}
                >
                    <CategoryPreview category={category} />
                </div>

                {/* Expandable Properties Section */}
                {hasInlineEditing && isActive && (
                    <div className="mt-5 pt-5 border-t border-slate-200">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                            className="flex items-center justify-between w-full text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors mb-3"
                        >
                            <div className="flex items-center gap-2">
                                <Settings2 className="h-4 w-4" />
                                <span>Edit Properties</span>
                            </div>
                            {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </button>

                        {isExpanded && (
                            <div className="space-y-4 animate-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                                {/* Voting Type */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                                        Voting Type
                                    </label>
                                    <select
                                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        value={category.votingType}
                                        onChange={(e) => onUpdate?.({ votingType: e.target.value as VotingType })}
                                    >
                                        <option value="rank">Ranked Choice</option>
                                        <option value="pick-one">Pick One</option>
                                        <option value="multiple-choice">Multiple Choice</option>
                                        <option value="rating">Rating Scale</option>
                                        <option value="head-to-head">Head to Head</option>
                                    </select>
                                </div>

                                {/* Type-specific settings */}
                                {category.votingType === "rank" && (
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                                            Max Rankings
                                        </label>
                                        <Input
                                            type="number"
                                            min="1"
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                                            value={category.maxRankings || ""}
                                            onChange={(e) =>
                                                onUpdate?.({
                                                    maxRankings: e.target.value ? parseInt(e.target.value) : undefined,
                                                })
                                            }
                                            placeholder="Leave empty for all"
                                        />
                                    </div>
                                )}

                                {category.votingType === "multiple-choice" && (
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                                            Max Selections
                                        </label>
                                        <Input
                                            type="number"
                                            min="1"
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                                            value={category.maxSelections || ""}
                                            onChange={(e) =>
                                                onUpdate?.({
                                                    maxSelections: e.target.value ? parseInt(e.target.value) : undefined,
                                                })
                                            }
                                            placeholder="Leave empty for all"
                                        />
                                    </div>
                                )}

                                {category.votingType === "rating" && (
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                                            Rating Scale
                                        </label>
                                        <div className="flex gap-2">
                                            {[3, 5, 10].map((val) => (
                                                <button
                                                    key={val}
                                                    onClick={() => onUpdate?.({ ratingScale: val })}
                                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${category.ratingScale === val
                                                        ? "bg-primary/10 border-primary text-primary"
                                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    {val} Stars
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Allow Write-ins */}
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm font-medium text-slate-700">Allow Write-ins</span>
                                    <button
                                        onClick={() => onUpdate?.({ allowWriteIns: !category.allowWriteIns })}
                                        className={`w-11 h-6 rounded-full transition-colors relative ${category.allowWriteIns ? "bg-primary" : "bg-slate-200"
                                            }`}
                                    >
                                        <div
                                            className={`w-4 h-4 bg-white rounded-full shadow-sm absolute top-1 transition-transform ${category.allowWriteIns ? "left-6" : "left-1"
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* Contestants/Options */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            Options
                                        </label>
                                        {onContestantAdd && (
                                            <button
                                                onClick={onContestantAdd}
                                                className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                                            >
                                                <Plus className="h-3 w-3" /> Add
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {category.contestants.map((contestant) => (
                                            <div key={contestant.id} className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                                                <Input
                                                    className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:bg-white focus:ring-2 focus:ring-primary outline-none"
                                                    value={contestant.name}
                                                    onChange={(e) =>
                                                        onContestantUpdate?.(contestant.id, {
                                                            name: e.target.value,
                                                        })
                                                    }
                                                />
                                                {onContestantDelete && (
                                                    <button
                                                        onClick={() => onContestantDelete(contestant.id)}
                                                        className="text-slate-300 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors flex-shrink-0"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Contestant count indicator */}
                {category.contestants.length > 0 && !(hasInlineEditing && isActive && isExpanded) && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <div className="flex -space-x-1.5">
                                {category.contestants.slice(0, 3).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-5 h-5 rounded-full border-2 border-white bg-slate-200 ${isActive ? "bg-primary/20 border-primary/30" : ""
                                            }`}
                                    />
                                ))}
                                {category.contestants.length > 3 && (
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-600 ${isActive ? "bg-primary/10 text-primary" : ""
                                            }`}
                                    >
                                        +{category.contestants.length - 3}
                                    </div>
                                )}
                            </div>
                            <span className="ml-1">
                                {category.contestants.length} contestant{category.contestants.length !== 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        </div>
    );
}

