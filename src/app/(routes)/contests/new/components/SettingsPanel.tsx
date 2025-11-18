import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { ContestFormData } from "../types";

interface SettingsPanelProps {
    formData: ContestFormData;
    onFormDataChange: (data: ContestFormData) => void;
    onClose: () => void;
}

export function SettingsPanel({ formData, onFormDataChange, onClose }: SettingsPanelProps) {
    const updateFormData = (updates: Partial<ContestFormData>) => {
        onFormDataChange({ ...formData, ...updates });
    };

    return (
        <div className="absolute top-16 right-0 w-96 bg-white border-l border-slate-200 shadow-xl z-40 h-[calc(100vh-4rem)] overflow-y-auto animate-slide-in">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
                <h2 className="text-lg font-semibold">Contest Settings</h2>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
                    aria-label="Close settings"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
            <div className="p-6">
                <div className="space-y-6">
                    {/* Privacy */}
                    <div className="space-y-3">
                        <Label>Privacy</Label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isPublic"
                                checked={formData.isPublic}
                                onChange={(e) => updateFormData({ isPublic: e.target.checked })}
                                className="rounded"
                            />
                            <Label htmlFor="isPublic" className="font-normal">
                                Public (anyone with link can vote)
                            </Label>
                        </div>
                        {!formData.isPublic && (
                            <div>
                                <Label htmlFor="passcode">Passcode</Label>
                                <Input
                                    id="passcode"
                                    value={formData.passcode}
                                    onChange={(e) => updateFormData({ passcode: e.target.value })}
                                    placeholder="Enter passcode"
                                />
                            </div>
                        )}
                    </div>

                    {/* Voting Restrictions */}
                    <div className="space-y-3">
                        <Label>Voting Restrictions</Label>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="oneVotePerDevice"
                                    checked={formData.oneVotePerDevice}
                                    onChange={(e) =>
                                        updateFormData({ oneVotePerDevice: e.target.checked })
                                    }
                                    className="rounded"
                                />
                                <Label htmlFor="oneVotePerDevice" className="font-normal">
                                    One vote per device
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="oneVotePerEmail"
                                    checked={formData.oneVotePerEmail}
                                    onChange={(e) =>
                                        updateFormData({ oneVotePerEmail: e.target.checked })
                                    }
                                    className="rounded"
                                />
                                <Label htmlFor="oneVotePerEmail" className="font-normal">
                                    One vote per email
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="oneVotePerAccount"
                                    checked={formData.oneVotePerAccount}
                                    onChange={(e) =>
                                        updateFormData({ oneVotePerAccount: e.target.checked })
                                    }
                                    className="rounded"
                                />
                                <Label htmlFor="oneVotePerAccount" className="font-normal">
                                    One vote per account
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Timing */}
                    <div className="space-y-3">
                        <Label>Timing</Label>
                        <div>
                            <Label htmlFor="startDate">Start Date (optional)</Label>
                            <Input
                                id="startDate"
                                type="datetime-local"
                                value={formData.startDate}
                                onChange={(e) => updateFormData({ startDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="endDate">End Date *</Label>
                            <Input
                                id="endDate"
                                type="datetime-local"
                                value={formData.endDate}
                                onChange={(e) => updateFormData({ endDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Results */}
                    <div className="space-y-3">
                        <Label>Results</Label>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="showLiveResults"
                                    checked={formData.showLiveResults}
                                    onChange={(e) =>
                                        updateFormData({ showLiveResults: e.target.checked })
                                    }
                                    className="rounded"
                                />
                                <Label htmlFor="showLiveResults" className="font-normal">
                                    Show live results
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="showResultsAfterEnd"
                                    checked={formData.showResultsAfterEnd}
                                    onChange={(e) =>
                                        updateFormData({ showResultsAfterEnd: e.target.checked })
                                    }
                                    className="rounded"
                                />
                                <Label htmlFor="showResultsAfterEnd" className="font-normal">
                                    Show results after end
                                </Label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

