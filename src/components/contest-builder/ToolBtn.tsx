import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ToolBtnProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

export function ToolBtn({ icon, label, onClick }: ToolBtnProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    onClick={onClick}
                    className="w-full aspect-square flex items-center justify-center text-slate-600 rounded-lg hover:bg-slate-50 hover:text-primary transition-all group border border-slate-200 hover:border-primary/30 hover:shadow-sm"
                    aria-label={label}
                >
                    <span className="text-slate-400 group-hover:text-primary transition-colors">
                        {icon}
                    </span>
                </button>
            </TooltipTrigger>
            <TooltipContent
                side="right"
                className="text-xs animate-in fade-in-0 duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-150"
                sideOffset={8}
            >
                {label}
            </TooltipContent>
        </Tooltip>
    );
}

