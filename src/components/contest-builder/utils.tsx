import {
    ArrowUpDown,
    CircleDot,
    ListChecks,
    Star,
    GitCompare,
} from "lucide-react";
import { VotingType } from "./types";

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const getVotingTypeLabel = (type: VotingType): string => {
    switch (type) {
        case "rank":
            return "Ranked Choice";
        case "pick-one":
            return "Pick One";
        case "multiple-choice":
            return "Multiple Choice";
        case "rating":
            return "Rating Scale";
        case "head-to-head":
            return "Head to Head";
    }
};

export const getVotingTypeIcon = (type: VotingType) => {
    switch (type) {
        case "rank":
            return <ArrowUpDown className="h-4 w-4" />;
        case "pick-one":
            return <CircleDot className="h-4 w-4" />;
        case "multiple-choice":
            return <ListChecks className="h-4 w-4" />;
        case "rating":
            return <Star className="h-4 w-4" />;
        case "head-to-head":
            return <GitCompare className="h-4 w-4" />;
    }
};

