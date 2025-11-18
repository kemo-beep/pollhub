"use client";

import { PollBuilder } from "@/components/contest-builder/PollBuilder";
import { SettingsPanel } from "./components/SettingsPanel";
import { ContestPreview } from "./components/ContestPreview";
import { useContestFormContext } from "./context/ContestFormContext";

export default function NewContestPage() {
    const {
        formData,
        setFormData,
        categories,
        setCategories,
        loading,
        handleSubmit,
        showSettings,
        setShowSettings,
        showPreview,
        setShowPreview,
    } = useContestFormContext();

    if (showPreview) {
        return (
            <ContestPreview
                formData={formData}
                categories={categories}
                onBack={() => setShowPreview(false)}
                onCreate={handleSubmit}
                loading={loading}
            />
        );
    }

    return (
        <div className="h-screen flex flex-col">
            {showSettings && (
                <SettingsPanel
                    formData={formData}
                    onFormDataChange={setFormData}
                    onClose={() => setShowSettings(false)}
                />
            )}

            <div className="flex-1 overflow-hidden">
                <PollBuilder
                    contestName={formData.name}
                    contestDescription={formData.description}
                    categories={categories}
                    onContestNameChange={(name) => setFormData({ ...formData, name })}
                    onContestDescriptionChange={(description) =>
                        setFormData({ ...formData, description })
                    }
                    onCategoriesChange={setCategories}
                    onPreview={() => setShowPreview(true)}
                />
            </div>
        </div>
    );
}
