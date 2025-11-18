import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

interface PollHeaderProps {
    contestName: string;
    contestDescription: string;
    onContestNameChange: (name: string) => void;
    onContestDescriptionChange: (description: string) => void;
}

export function PollHeader({
    contestName,
    contestDescription,
    onContestNameChange,
    onContestDescriptionChange,
}: PollHeaderProps) {
    return (
        <div className="group relative">
            {/* Subtle glow effect on focus */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-xl opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-300" />

            <div className="relative bg-white rounded-xl border border-slate-200/60 p-6 sm:p-8 shadow-sm group-hover:shadow-md transition-all duration-200">
                {/* Decorative accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Title input with icon */}
                <div className="flex items-start gap-3 mb-4">
                    <div className="mt-1.5 flex-shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <Sparkles className="h-4 w-4 text-primary/60" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <Input
                            className="w-full text-2xl sm:text-3xl font-bold text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent border-0 focus-visible:ring-0 p-0 h-auto focus:placeholder-slate-300 transition-colors"
                            value={contestName}
                            onChange={(e) => onContestNameChange(e.target.value)}
                            placeholder="Enter your poll title..."
                        />
                    </div>
                </div>

                {/* Description textarea */}
                <div className="pl-11">
                    <Textarea
                        className="w-full text-sm sm:text-base text-slate-600 placeholder-slate-400 resize-none focus:outline-none bg-transparent border-0 focus-visible:ring-0 p-0 min-h-[2.5rem] focus:placeholder-slate-300 transition-colors leading-relaxed"
                        rows={contestDescription ? Math.min(contestDescription.split('\n').length + 1, 4) : 2}
                        value={contestDescription}
                        onChange={(e) => onContestDescriptionChange(e.target.value)}
                        placeholder="Add a description to help voters understand your poll..."
                    />

                    {/* Character count hint (optional) */}
                    {contestDescription.length > 0 && (
                        <div className="mt-2 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            {contestDescription.length} characters
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

