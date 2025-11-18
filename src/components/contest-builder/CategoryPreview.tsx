import { ArrowUpDown, Star } from "lucide-react";
import { Category } from "./types";

interface CategoryPreviewProps {
    category: Category;
}

export function CategoryPreview({ category }: CategoryPreviewProps) {
    if (category.votingType === "rank") {
        return (
            <div className="space-y-2">
                {category.contestants.slice(0, 3).map((c) => (
                    <div key={c.id} className="flex items-center gap-3">
                        <ArrowUpDown className="h-4 w-4 text-slate-300 flex-shrink-0" />
                        <div className="text-sm text-slate-600 truncate flex-1">
                            {c.name || "Untitled option"}
                        </div>
                    </div>
                ))}
                {category.contestants.length > 3 && (
                    <div className="text-xs text-slate-400 pl-7">
                        +{category.contestants.length - 3} more
                    </div>
                )}
            </div>
        );
    }

    if (category.votingType === "pick-one") {
        return (
            <div className="space-y-2">
                {category.contestants.slice(0, 2).map((c) => (
                    <div key={c.id} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" />
                        <div className="text-sm text-slate-600 truncate flex-1">
                            {c.name || "Untitled option"}
                        </div>
                    </div>
                ))}
                {category.contestants.length > 2 && (
                    <div className="text-xs text-slate-400 pl-7">
                        +{category.contestants.length - 2} more
                    </div>
                )}
            </div>
        );
    }

    if (category.votingType === "multiple-choice") {
        return (
            <div className="space-y-2">
                {category.contestants.slice(0, 2).map((c) => (
                    <div key={c.id} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded border border-slate-300 flex-shrink-0" />
                        <div className="text-sm text-slate-600 truncate flex-1">
                            {c.name || "Untitled option"}
                        </div>
                    </div>
                ))}
                {category.contestants.length > 2 && (
                    <div className="text-xs text-slate-400 pl-7">
                        +{category.contestants.length - 2} more
                    </div>
                )}
            </div>
        );
    }

    if (category.votingType === "rating") {
        return (
            <div className="flex gap-2 text-slate-300">
                {[...Array(category.ratingScale || 5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6" />
                ))}
            </div>
        );
    }

    if (category.votingType === "head-to-head") {
        return (
            <div className="flex gap-4">
                <div className="px-4 py-2 rounded border border-slate-200 bg-slate-50 text-slate-400">
                    Contestant A
                </div>
                <div className="px-4 py-2 rounded border border-slate-200 bg-slate-50 text-slate-400">
                    Contestant B
                </div>
            </div>
        );
    }

    return null;
}

