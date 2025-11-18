import {
    ArrowUpDown,
    CircleDot,
    ListChecks,
    Star,
    GitCompare,
    Sparkles,
    Eye,
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToolBtn } from "./ToolBtn";
import { VotingType } from "./types";

interface ToolboxProps {
    onAddCategory: (type: VotingType) => void;
    onPreview?: () => void;
}

export function Toolbox({ onAddCategory, onPreview }: ToolboxProps) {
    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-10">
            <div className="p-4 flex-1 overflow-y-auto">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
                    Blocks
                </div>
                <TooltipProvider delayDuration={300}>
                    <div className="grid grid-cols-2 gap-2">
                        <ToolBtn
                            icon={<ArrowUpDown className="h-5 w-5" />}
                            label="Ranked Choice"
                            onClick={() => onAddCategory("rank")}
                        />
                        <ToolBtn
                            icon={<CircleDot className="h-5 w-5" />}
                            label="Pick One"
                            onClick={() => onAddCategory("pick-one")}
                        />
                        <ToolBtn
                            icon={<ListChecks className="h-5 w-5" />}
                            label="Multiple Choice"
                            onClick={() => onAddCategory("multiple-choice")}
                        />
                        <ToolBtn
                            icon={<Star className="h-5 w-5" />}
                            label="Rating Scale"
                            onClick={() => onAddCategory("rating")}
                        />
                        <ToolBtn
                            icon={<GitCompare className="h-5 w-5" />}
                            label="Head to Head"
                            onClick={() => onAddCategory("head-to-head")}
                        />
                    </div>
                </TooltipProvider>

                <div className="mt-8 p-4 bg-gradient-to-br from-primary/10 to-indigo-50 rounded-xl border border-primary/20">
                    <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                        <Sparkles className="h-4 w-4" />
                        <span>Magic Generation</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                        Stuck? Let AI generate a complete poll for you in seconds.
                    </p>
                    <button
                        onClick={() => {
                            // TODO: Implement AI generation
                            alert("AI generation coming soon!");
                        }}
                        className="w-full py-2 px-3 bg-white text-primary text-sm font-medium rounded-lg shadow-sm border border-primary/20 hover:shadow-md hover:border-primary/30 transition-all flex items-center justify-center gap-2"
                    >
                        Open AI Wizard
                    </button>
                </div>
            </div>

            {onPreview && (
                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={onPreview}
                        className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                    >
                        <Eye className="h-4 w-4" />
                        <span>Preview Poll</span>
                    </button>
                </div>
            )}
        </aside>
    );
}

