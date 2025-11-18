import { Button } from "@/components/ui/button";
import { Settings, Eye } from "lucide-react";

interface ContestHeaderProps {
    onSettingsClick: () => void;
    onPreviewClick: () => void;
    onCreateClick: () => void;
    loading: boolean;
}

export function ContestHeader({
    onSettingsClick,
    onPreviewClick,
    onCreateClick,
    loading,
}: ContestHeaderProps) {
    return (
        <>
            <Button
                variant="outline"
                onClick={onSettingsClick}
                className="flex items-center gap-2"
            >
                <Settings className="h-4 w-4" />
                Settings
            </Button>
            <Button
                variant="outline"
                onClick={onPreviewClick}
                className="flex items-center gap-2"
            >
                <Eye className="h-4 w-4" />
                Preview
            </Button>
            <Button onClick={onCreateClick} disabled={loading}>
                {loading ? "Creating..." : "Create Contest"}
            </Button>
        </>
    );
}

