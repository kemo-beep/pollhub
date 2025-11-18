import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ContestFormData, Category } from "../types";

const initialFormData: ContestFormData = {
    name: "",
    description: "",
    isPublic: true,
    passcode: "",
    emailDomainRestriction: "",
    oneVotePerDevice: true,
    oneVotePerEmail: false,
    oneVotePerAccount: false,
    startDate: "",
    endDate: "",
    showLiveResults: false,
    showResultsAfterEnd: true,
};

export function useContestForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ContestFormData>(initialFormData);
    const [categories, setCategories] = useState<Category[]>([]);

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            toast.error("Please enter a contest name");
            return false;
        }

        if (categories.length === 0) {
            toast.error("Please add at least one category");
            return false;
        }

        // Validate categories
        for (const category of categories) {
            if (!category.name.trim()) {
                toast.error(`Category "${category.name || "Unnamed"}" must have a name`);
                return false;
            }
            if (category.contestants.length < 2) {
                toast.error(`Category "${category.name}" must have at least 2 contestants`);
                return false;
            }
        }

        if (!formData.endDate) {
            toast.error("Please set an end date");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Convert categories to API format (remove id, convert contestants)
            const payload = {
                ...formData,
                endDate: formData.endDate
                    ? new Date(formData.endDate).toISOString()
                    : formData.endDate,
                startDate: formData.startDate
                    ? new Date(formData.startDate).toISOString()
                    : undefined,
                passcode: formData.passcode || undefined,
                emailDomainRestriction: formData.emailDomainRestriction || undefined,
                description: formData.description || undefined,
                categories: categories.map((cat) => ({
                    name: cat.name,
                    description: cat.description || undefined,
                    votingType: cat.votingType,
                    maxRankings: cat.maxRankings || undefined,
                    maxSelections: cat.maxSelections || undefined,
                    ratingScale: cat.ratingScale || undefined,
                    allowWriteIns: cat.allowWriteIns,
                    randomizeOrder: cat.randomizeOrder,
                    contestants: cat.contestants
                        .filter((c) => c.name.trim())
                        .map((c) => ({
                            name: c.name,
                            description: c.description || undefined,
                            bio: c.bio || undefined,
                            avatar: c.avatar || undefined,
                            socialLinks: c.socialLinks || undefined,
                        })),
                })),
            };

            const response = await fetch("/api/contests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const error = await response.json();
                if (error.details && Array.isArray(error.details)) {
                    const errorMessages = error.details
                        .map((err: any) => `${err.path.join(".")}: ${err.message}`)
                        .join(", ");
                    throw new Error(`Validation error: ${errorMessages}`);
                }
                throw new Error(error.error || "Failed to create contest");
            }

            const contest = await response.json();
            toast.success("Contest created successfully!");
            router.push(`/contests/${contest.id}`);
        } catch (error: any) {
            toast.error(error.message || "Failed to create contest");
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        setFormData,
        categories,
        setCategories,
        loading,
        handleSubmit,
    };
}

