import { Settings, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category, Contestant, VotingType } from "./types";

interface InspectorPanelProps {
    category: Category;
    onUpdate: (updates: Partial<Category>) => void;
    onContestantUpdate: (contestantId: string, updates: Partial<Contestant>) => void;
    onContestantDelete: (contestantId: string) => void;
    onContestantAdd: () => void;
}

export function InspectorPanel({
    category,
    onUpdate,
    onContestantUpdate,
    onContestantDelete,
    onContestantAdd,
}: InspectorPanelProps) {
    return (
        <aside className="w-80 bg-white border-l border-slate-200 shadow-xl z-20 flex flex-col animate-slide-in">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Settings className="h-4 w-4 text-slate-400" />
                    Properties
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Question Type */}
                <div className="space-y-3">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Question Type
                    </Label>
                    <select
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        value={category.votingType}
                        onChange={(e) =>
                            onUpdate({
                                votingType: e.target.value as VotingType,
                            })
                        }
                    >
                        <option value="rank">Ranked Choice</option>
                        <option value="pick-one">Pick One</option>
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="rating">Rating Scale</option>
                        <option value="head-to-head">Head to Head</option>
                    </select>
                </div>

                {/* Description */}
                <div className="space-y-3">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Description
                    </Label>
                    <Input
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        value={category.description || ""}
                        onChange={(e) => onUpdate({ description: e.target.value })}
                        placeholder="Helper text (optional)"
                    />
                </div>

                {/* Required Toggle */}
                <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-slate-700">Required</span>
                    <button
                        onClick={() => onUpdate({ allowWriteIns: !category.allowWriteIns })}
                        className={`w-11 h-6 rounded-full transition-colors relative ${category.allowWriteIns ? "bg-primary" : "bg-slate-200"
                            }`}
                    >
                        <div
                            className={`w-4 h-4 bg-white rounded-full shadow-sm absolute top-1 transition-transform ${category.allowWriteIns ? "left-6" : "left-1"
                                }`}
                        />
                    </button>
                </div>

                <hr className="border-slate-100" />

                {/* Type Specific Properties */}
                {category.votingType === "rank" && (
                    <div className="space-y-3">
                        <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Max Rankings
                        </Label>
                        <Input
                            type="number"
                            min="1"
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm"
                            value={category.maxRankings || ""}
                            onChange={(e) =>
                                onUpdate({
                                    maxRankings: e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined,
                                })
                            }
                            placeholder="Leave empty for all"
                        />
                    </div>
                )}

                {category.votingType === "multiple-choice" && (
                    <div className="space-y-3">
                        <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Max Selections
                        </Label>
                        <Input
                            type="number"
                            min="1"
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm"
                            value={category.maxSelections || ""}
                            onChange={(e) =>
                                onUpdate({
                                    maxSelections: e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined,
                                })
                            }
                            placeholder="Leave empty for all"
                        />
                    </div>
                )}

                {category.votingType === "rating" && (
                    <div className="space-y-3">
                        <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Rating Scale
                        </Label>
                        <div className="flex gap-2">
                            {[3, 5, 10].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => onUpdate({ ratingScale: val })}
                                    className={`px-3 py-1.5 rounded text-sm font-medium border transition-all ${category.ratingScale === val
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

                {/* Contestants/Options */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Options
                        </Label>
                    </div>
                    <div className="space-y-2">
                        {category.contestants.map((contestant) => (
                            <div key={contestant.id} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                <Input
                                    className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:bg-white focus:ring-2 focus:ring-primary outline-none"
                                    value={contestant.name}
                                    onChange={(e) =>
                                        onContestantUpdate(contestant.id, {
                                            name: e.target.value,
                                        })
                                    }
                                />
                                <button
                                    onClick={() => onContestantDelete(contestant.id)}
                                    className="text-slate-300 hover:text-slate-500 p-1"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={onContestantAdd}
                        className="text-sm text-primary font-medium flex items-center gap-1 hover:underline mt-2"
                    >
                        <Plus className="h-3.5 w-3.5" /> Add Option
                    </button>
                </div>
            </div>
        </aside>
    );
}

