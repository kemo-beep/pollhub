"use client";

import { useState, useEffect } from "react";
import { PollBuilder } from "@/components/contest-builder/PollBuilder";
import { ProfessionalFormBuilder } from "@/components/contest-builder/ProfessionalFormBuilder";
import { SettingsPanel } from "./components/SettingsPanel";
import { ContestPreview } from "./components/ContestPreview";
import { TemplateSelector } from "@/components/templates/TemplateSelector";
import { useContestFormContext } from "./context/ContestFormContext";
import { Category } from "./types";

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

    const [showTemplateSelector, setShowTemplateSelector] = useState(true);
    const [hasSelectedTemplate, setHasSelectedTemplate] = useState(false);

    useEffect(() => {
        // Only hide template selector if categories exist AND form has a name (meaning template was selected)
        if (categories.length > 0 && formData.name) {
            setShowTemplateSelector(false);
            setHasSelectedTemplate(true);
        } else if (categories.length === 0 && !formData.name) {
            // Show template selector if no categories and no form name
            setShowTemplateSelector(true);
            setHasSelectedTemplate(false);
        }
    }, [categories, formData.name]);

    const handleTemplateSelect = (template: {
        name: string;
        description: string;
        categories: Category[];
    }) => {
        setFormData({
            ...formData,
            name: template.name,
            description: template.description,
        });
        setCategories(template.categories);
        setHasSelectedTemplate(true);
        // Auto-select first category so user can immediately edit it
        if (template.categories.length > 0) {
            // This will be handled by PollBuilder's useState
        }
    };

    const handleStartBlank = () => {
        setHasSelectedTemplate(true);
    };

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
            <TemplateSelector
                open={showTemplateSelector && !hasSelectedTemplate}
                onOpenChange={setShowTemplateSelector}
                onSelectTemplate={handleTemplateSelect}
                onStartBlank={handleStartBlank}
            />

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
