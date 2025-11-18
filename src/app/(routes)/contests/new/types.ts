export type VotingType = "rank" | "pick-one" | "multiple-choice" | "rating" | "head-to-head";

export interface Contestant {
    id: string;
    name: string;
    description?: string;
    bio?: string;
    avatar?: string;
    socialLinks?: {
        twitter?: string;
        youtube?: string;
        facebook?: string;
        instagram?: string;
        website?: string;
    };
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    votingType: VotingType;
    maxRankings?: number;
    maxSelections?: number;
    ratingScale?: number;
    allowWriteIns: boolean;
    randomizeOrder: boolean;
    contestants: Contestant[];
}

export interface ContestFormData {
    name: string;
    description: string;
    isPublic: boolean;
    passcode: string;
    emailDomainRestriction: string;
    oneVotePerDevice: boolean;
    oneVotePerEmail: boolean;
    oneVotePerAccount: boolean;
    startDate: string;
    endDate: string;
    showLiveResults: boolean;
    showResultsAfterEnd: boolean;
}

