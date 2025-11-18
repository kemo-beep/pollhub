"use client";

import { useState, useEffect } from "react";
import { Category, Contestant, PollBuilderProps, VotingType } from "./types";
import { generateId } from "./utils";
import { ArrowLeft, ArrowRight, Check, Settings, Eye, Plus, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TemplateTheme } from "@/lib/templates/contest-templates";
import { FormCustomizationPanel } from "./FormCustomizationPanel";
import { TemplateDesignConfig, getTemplateDesign } from "@/lib/templates/template-designs";

interface FormStep {
    id: string;
    title: string;
    category: Category;
}

export function ProfessionalFormBuilder({
    contestName,
    contestDescription,
    categories,
    onContestNameChange,
    onContestDescriptionChange,
    onCategoriesChange,
    onPreview,
}: PollBuilderProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [showCustomization, setShowCustomization] = useState(false);
    const [theme, setTheme] = useState<TemplateTheme | null>(null);
    const [designConfig, setDesignConfig] = useState<TemplateDesignConfig | null>(null);

    // Load template theme and design on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('selectedTemplateTheme');
        const savedDesign = localStorage.getItem('selectedTemplateDesign');
        const templateId = localStorage.getItem('selectedTemplateId');

        if (savedTheme) {
            try {
                setTheme(JSON.parse(savedTheme));
            } catch (e) {
                console.error('Failed to parse theme', e);
            }
        }

        if (savedDesign) {
            try {
                setDesignConfig(JSON.parse(savedDesign));
            } catch (e) {
                console.error('Failed to parse design', e);
            }
        } else if (templateId) {
            // Fallback to getting design from template ID
            const design = getTemplateDesign(templateId);
            setDesignConfig(design);
        }
    }, []);

    // Save theme changes to localStorage
    const handleThemeChange = (newTheme: TemplateTheme) => {
        setTheme(newTheme);
        localStorage.setItem('selectedTemplateTheme', JSON.stringify(newTheme));
    };

    // Default theme (corporate green like reference)
    const activeTheme: TemplateTheme = theme || {
        backgroundColor: "#1a4d3a",
        primaryColor: "#2d5f47",
        secondaryColor: "#3d7a5f",
        textColor: "#ffffff",
        accentColor: "#f59e0b",
        inputBackground: "#2d5f47",
        inputBorder: "#3d7a5f",
        buttonColor: "#ffffff",
        buttonTextColor: "#1a4d3a",
    };

    // Convert categories to steps
    const steps: FormStep[] = [
        {
            id: "basic-info",
            title: "Basic Information",
            category: {
                id: "basic-info",
                name: "Basic Information",
                description: "",
                votingType: "pick-one",
                contestants: [],
            },
        },
        ...categories.map((cat, idx) => ({
            id: cat.id,
            title: cat.name || `Step ${idx + 2}`,
            category: cat,
        })),
    ];

    const addCategory = (type: VotingType) => {
        const newCategory: Category = {
            id: generateId(),
            name: type === "rating" ? "How would you rate this?" : "Select an option",
            description: "",
            votingType: type,
            maxRankings: undefined,
            maxSelections: undefined,
            ratingScale: type === "rating" ? 5 : undefined,
            allowWriteIns: false,
            randomizeOrder: true,
            contestants: [
                { id: generateId(), name: "Option 1" },
                { id: generateId(), name: "Option 2" },
            ],
        };
        onCategoriesChange([...categories, newCategory]);
        // Go to the new step (basic info + all existing categories + new one)
        setCurrentStep(categories.length + 1);
    };

    const updateCategory = (id: string, updates: Partial<Category>) => {
        onCategoriesChange(
            categories.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
        );
    };

    const deleteCategory = (id: string) => {
        onCategoriesChange(categories.filter((cat) => cat.id !== id));
        if (currentStep > 0) {
            setCurrentStep(Math.max(0, currentStep - 1));
        }
    };

    const addContestant = (categoryId: string) => {
        const category = categories.find((cat) => cat.id === categoryId);
        if (!category) return;

        onCategoriesChange(
            categories.map((cat) => {
                if (cat.id !== categoryId) return cat;
                return {
                    ...cat,
                    contestants: [
                        ...cat.contestants,
                        { id: generateId(), name: `Option ${cat.contestants.length + 1}` },
                    ],
                };
            })
        );
    };

    const updateContestant = (categoryId: string, contestantId: string, updates: Partial<Contestant>) => {
        onCategoriesChange(
            categories.map((cat) => {
                if (cat.id !== categoryId) return cat;
                return {
                    ...cat,
                    contestants: cat.contestants.map((c) =>
                        c.id === contestantId ? { ...c, ...updates } : c
                    ),
                };
            })
        );
    };

    const deleteContestant = (categoryId: string, contestantId: string) => {
        onCategoriesChange(
            categories.map((cat) => {
                if (cat.id !== categoryId) return cat;
                return {
                    ...cat,
                    contestants: cat.contestants.filter((c) => c.id !== contestantId),
                };
            })
        );
    };

    const currentStepData = steps[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === steps.length - 1;

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div
            className="min-h-screen relative overflow-hidden"
            style={{ backgroundColor: activeTheme.backgroundColor }}
        >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                        backgroundSize: "32px 32px",
                    }}
                />
            </div>

            {/* Header */}
            <div
                className="relative z-10 border-b backdrop-blur-sm"
                style={{
                    borderColor: activeTheme.primaryColor,
                    backgroundColor: `${activeTheme.backgroundColor}cc`
                }}
            >
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={prevStep}
                            disabled={isFirstStep}
                            style={{
                                color: activeTheme.textColor,
                            }}
                            className="hover:opacity-90 disabled:opacity-30"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = activeTheme.primaryColor;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1
                                className="text-xl font-semibold"
                                style={{ color: activeTheme.textColor }}
                            >
                                {contestName || "New Form"}
                            </h1>
                            <p
                                className="text-sm"
                                style={{ color: `${activeTheme.textColor}b3` }}
                            >
                                Step {currentStep + 1} of {steps.length}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                addCategory("pick-one");
                            }}
                            className="text-white hover:text-white/90 hover:bg-[#2d5f47]"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Step
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowCustomization(!showCustomization)}
                            style={{ color: activeTheme.textColor }}
                            className="hover:opacity-90"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = activeTheme.primaryColor;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <Palette className="h-4 w-4 mr-2" />
                            Customize
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowSettings(!showSettings)}
                            style={{ color: activeTheme.textColor }}
                            className="hover:opacity-90"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = activeTheme.primaryColor;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onPreview}
                            className="text-white hover:text-white/90 hover:bg-[#2d5f47]"
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                        </Button>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div
                className="relative z-10 border-b"
                style={{
                    borderColor: activeTheme.primaryColor,
                    backgroundColor: `${activeTheme.backgroundColor}99`
                }}
            >
                <div className="max-w-4xl mx-auto px-6 py-2">
                    <div className="flex items-center gap-2">
                        {steps.map((step, idx) => (
                            <div key={step.id} className="flex items-center flex-1">
                                <div
                                    className="flex-1 h-1 rounded-full transition-all duration-300"
                                    style={{
                                        backgroundColor: idx <= currentStep
                                            ? activeTheme.accentColor
                                            : activeTheme.primaryColor
                                    }}
                                />
                                {idx < steps.length - 1 && (
                                    <div
                                        className="w-2 h-2 rounded-full mx-1 transition-all duration-300"
                                        style={{
                                            backgroundColor: idx < currentStep
                                                ? activeTheme.accentColor
                                                : activeTheme.primaryColor
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isFirstStep ? (
                            <BasicInfoStep
                                contestName={contestName}
                                contestDescription={contestDescription}
                                onContestNameChange={onContestNameChange}
                                onContestDescriptionChange={onContestDescriptionChange}
                                theme={activeTheme}
                                designConfig={designConfig}
                            />
                        ) : (
                            <CategoryStep
                                category={currentStepData.category}
                                onUpdate={(updates) => updateCategory(currentStepData.category.id, updates)}
                                onContestantUpdate={(contestantId, updates) =>
                                    updateContestant(currentStepData.category.id, contestantId, updates)
                                }
                                onContestantDelete={(contestantId) =>
                                    deleteContestant(currentStepData.category.id, contestantId)
                                }
                                onContestantAdd={() => addContestant(currentStepData.category.id)}
                                onDelete={() => deleteCategory(currentStepData.category.id)}
                                theme={activeTheme}
                                designConfig={designConfig}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div
                className="relative z-10 border-t backdrop-blur-sm sticky bottom-0"
                style={{
                    borderColor: activeTheme.primaryColor,
                    backgroundColor: `${activeTheme.backgroundColor}cc`
                }}
            >
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={isFirstStep}
                        style={{
                            borderColor: activeTheme.secondaryColor,
                            color: activeTheme.textColor,
                        }}
                        className="hover:opacity-90 disabled:opacity-30 rounded-lg"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = activeTheme.primaryColor;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>
                    <div className="flex items-center gap-2">
                        {!isLastStep && (
                            <Button
                                onClick={nextStep}
                                style={{
                                    backgroundColor: activeTheme.buttonColor,
                                    color: activeTheme.buttonTextColor,
                                }}
                                className="hover:opacity-90 font-semibold rounded-lg px-6"
                            >
                                Next
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        )}
                        {isLastStep && (
                            <Button
                                onClick={onPreview}
                                style={{
                                    backgroundColor: activeTheme.buttonColor,
                                    color: activeTheme.buttonTextColor,
                                }}
                                className="hover:opacity-90 font-semibold rounded-lg px-6"
                            >
                                <Check className="h-4 w-4 mr-2" />
                                Review & Create
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Customization Panel */}
            {showCustomization && (
                <FormCustomizationPanel
                    theme={activeTheme}
                    onThemeChange={handleThemeChange}
                    onClose={() => setShowCustomization(false)}
                    onPreview={onPreview}
                />
            )}
        </div>
    );
}

function BasicInfoStep({
    contestName,
    contestDescription,
    onContestNameChange,
    onContestDescriptionChange,
    theme,
    designConfig,
}: {
    contestName: string;
    contestDescription: string;
    onContestNameChange: (name: string) => void;
    onContestDescriptionChange: (description: string) => void;
    theme: TemplateTheme;
    designConfig: TemplateDesignConfig | null;
}) {
    const config = designConfig || {
        layout: "centered" as const,
        inputStyle: "modern" as const,
        fieldSpacing: "comfortable" as const,
        borderRadius: "medium" as const,
        labelPosition: "above" as const,
    };

    const getSpacingClass = () => {
        switch (config.fieldSpacing) {
            case "compact": return "space-y-4";
            case "spacious": return "space-y-8";
            default: return "space-y-6";
        }
    };

    const getBorderRadius = () => {
        switch (config.borderRadius) {
            case "none": return "rounded-none";
            case "small": return "rounded";
            case "large": return "rounded-xl";
            case "pill": return "rounded-full";
            default: return "rounded-lg";
        }
    };

    const getMaxWidth = () => {
        switch (config.layout) {
            case "full-width": return "max-w-full";
            case "left-aligned": return "max-w-2xl";
            default: return "max-w-2xl mx-auto";
        }
    };
    return (
        <div className={getMaxWidth()}>
            <Card className="bg-transparent border-0 shadow-none">
                <CardHeader className={config.fieldSpacing === "spacious" ? "pb-8" : config.fieldSpacing === "compact" ? "pb-4" : "pb-6"}>
                    <CardTitle
                        className={config.headerStyle === "hero" ? "text-4xl font-bold" : "text-3xl font-bold"}
                        style={{ color: theme.textColor }}
                    >
                        Basic Information
                    </CardTitle>
                </CardHeader>
                <CardContent className={getSpacingClass()}>
                    <div>
                        <Label
                            htmlFor="form-name"
                            className="font-semibold mb-3 block text-base"
                            style={{ color: theme.textColor }}
                        >
                            Form Name: *
                        </Label>
                        <Input
                            id="form-name"
                            value={contestName}
                            onChange={(e) => onContestNameChange(e.target.value)}
                            placeholder="Enter form name"
                            className={`h-14 text-base focus:ring-2 ${getBorderRadius()}`}
                            style={{
                                backgroundColor: `${theme.inputBackground}80`,
                                borderColor: theme.inputBorder,
                                color: theme.textColor,
                                paddingLeft: config.showIcons ? "3rem" : "1rem",
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = theme.accentColor;
                                e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.accentColor}33`;
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = theme.inputBorder;
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="form-description"
                            className="font-semibold mb-3 block text-base"
                            style={{ color: theme.textColor }}
                        >
                            Description:
                        </Label>
                        <Textarea
                            id="form-description"
                            value={contestDescription}
                            onChange={(e) => onContestDescriptionChange(e.target.value)}
                            placeholder="Enter form description"
                            rows={config.fieldSpacing === "spacious" ? 5 : 4}
                            className={`resize-none focus:ring-2 ${getBorderRadius()}`}
                            style={{
                                backgroundColor: `${theme.inputBackground}80`,
                                borderColor: theme.inputBorder,
                                color: theme.textColor,
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = theme.accentColor;
                                e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.accentColor}33`;
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = theme.inputBorder;
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function CategoryStep({
    category,
    onUpdate,
    onContestantUpdate,
    onContestantDelete,
    onContestantAdd,
    onDelete,
    theme,
    designConfig,
}: {
    category: Category;
    onUpdate: (updates: Partial<Category>) => void;
    onContestantUpdate: (contestantId: string, updates: Partial<Contestant>) => void;
    onContestantDelete: (contestantId: string) => void;
    onContestantAdd: () => void;
    onDelete: () => void;
    theme: TemplateTheme;
    designConfig: TemplateDesignConfig | null;
}) {
    const config = designConfig || {
        layout: "centered" as const,
        inputStyle: "modern" as const,
        fieldSpacing: "comfortable" as const,
        borderRadius: "medium" as const,
        labelPosition: "above" as const,
    };

    const getSpacingClass = () => {
        switch (config.fieldSpacing) {
            case "compact": return "space-y-4";
            case "spacious": return "space-y-8";
            default: return "space-y-6";
        }
    };

    const getBorderRadius = () => {
        switch (config.borderRadius) {
            case "none": return "rounded-none";
            case "small": return "rounded";
            case "large": return "rounded-xl";
            case "pill": return "rounded-full";
            default: return "rounded-lg";
        }
    };

    const getMaxWidth = () => {
        switch (config.layout) {
            case "full-width": return "max-w-full";
            case "left-aligned": return "max-w-2xl";
            default: return "max-w-2xl mx-auto";
        }
    };
    return (
        <div className={getMaxWidth()}>
            <Card className="bg-transparent border-0 shadow-none">
                <CardHeader className={config.fieldSpacing === "spacious" ? "pb-8" : config.fieldSpacing === "compact" ? "pb-4" : "pb-6"}>
                    <div className="flex items-center justify-between">
                        <CardTitle
                            className={config.headerStyle === "hero" ? "text-4xl font-bold" : "text-3xl font-bold"}
                            style={{ color: theme.textColor }}
                        >
                            {category.name}
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onDelete}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                            Delete
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className={getSpacingClass()}>
                    <div>
                        <Label
                            htmlFor="category-name"
                            className="font-semibold mb-3 block text-base"
                            style={{ color: theme.textColor }}
                        >
                            Question/Field Name: *
                        </Label>
                        <Input
                            id="category-name"
                            value={category.name}
                            onChange={(e) => onUpdate({ name: e.target.value })}
                            placeholder="Enter question or field name"
                            className={`h-14 text-base focus:ring-2 ${getBorderRadius()}`}
                            style={{
                                backgroundColor: `${theme.inputBackground}80`,
                                borderColor: theme.inputBorder,
                                color: theme.textColor,
                                paddingLeft: config.showIcons ? "3rem" : "1rem",
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = theme.accentColor;
                                e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.accentColor}33`;
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = theme.inputBorder;
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="category-description"
                            className="font-semibold mb-3 block text-base"
                            style={{ color: theme.textColor }}
                        >
                            Description/Instructions:
                        </Label>
                        <Textarea
                            id="category-description"
                            value={category.description || ""}
                            onChange={(e) => onUpdate({ description: e.target.value })}
                            placeholder="Enter description or instructions"
                            rows={config.fieldSpacing === "spacious" ? 4 : 3}
                            className={`resize-none focus:ring-2 ${getBorderRadius()}`}
                            style={{
                                backgroundColor: `${theme.inputBackground}80`,
                                borderColor: theme.inputBorder,
                                color: theme.textColor,
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = theme.accentColor;
                                e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.accentColor}33`;
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = theme.inputBorder;
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                    <div>
                        <Label
                            className="font-semibold mb-3 block text-base"
                            style={{ color: theme.textColor }}
                        >
                            Options/Choices:
                        </Label>
                        <div className="space-y-3">
                            {category.contestants.map((contestant, idx) => (
                                <div key={contestant.id} className="flex items-center gap-3">
                                    <Input
                                        value={contestant.name}
                                        onChange={(e) =>
                                            onContestantUpdate(contestant.id, { name: e.target.value })
                                        }
                                        placeholder={`Option ${idx + 1}`}
                                        className={`flex-1 focus:ring-2 ${getBorderRadius()}`}
                                        style={{
                                            backgroundColor: `${theme.inputBackground}80`,
                                            borderColor: theme.inputBorder,
                                            color: theme.textColor,
                                            paddingLeft: config.showIcons ? "3rem" : "1rem",
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = theme.accentColor;
                                            e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.accentColor}33`;
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = theme.inputBorder;
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onContestantDelete(contestant.id)}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg"
                                    >
                                        ×
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                onClick={onContestantAdd}
                                className={`w-full ${getBorderRadius()}`}
                                style={{
                                    borderColor: theme.secondaryColor,
                                    color: theme.textColor,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = theme.primaryColor;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                + Add Option
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

