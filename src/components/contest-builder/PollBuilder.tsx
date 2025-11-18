"use client";

import { useState, useEffect } from "react";
import { Category, Contestant, PollBuilderProps, VotingType } from "./types";
import { generateId } from "./utils";
import { Toolbox } from "./Toolbox";
import { MainCanvas } from "./MainCanvas";
import { InspectorPanel } from "./InspectorPanel";

export function PollBuilder({
    contestName,
    contestDescription,
    categories,
    onContestNameChange,
    onContestDescriptionChange,
    onCategoriesChange,
    onPreview,
}: PollBuilderProps) {
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

    // Auto-select first category when categories are loaded (e.g., from template)
    useEffect(() => {
        if (categories.length > 0) {
            // If no category is selected, or the selected category no longer exists, select the first one
            setActiveCategoryId((currentId) => {
                const activeCategoryExists = currentId && categories.some(cat => cat.id === currentId);
                if (!activeCategoryExists) {
                    return categories[0].id;
                }
                return currentId;
            });
        } else {
            setActiveCategoryId(null);
        }
    }, [categories]);

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
        setActiveCategoryId(newCategory.id);
    };

    const updateCategory = (id: string, updates: Partial<Category>) => {
        onCategoriesChange(
            categories.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
        );
    };

    const deleteCategory = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onCategoriesChange(categories.filter((cat) => cat.id !== id));
        if (activeCategoryId === id) setActiveCategoryId(null);
    };

    const updateCategoryName = (id: string, name: string) => {
        updateCategory(id, { name });
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

    const activeCategory = categories.find((cat) => cat.id === activeCategoryId);

    return (
        <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden">
            <Toolbox onAddCategory={addCategory} onPreview={onPreview} />

            <MainCanvas
                contestName={contestName}
                contestDescription={contestDescription}
                categories={categories}
                activeCategoryId={activeCategoryId}
                onContestNameChange={onContestNameChange}
                onContestDescriptionChange={onContestDescriptionChange}
                onCategorySelect={setActiveCategoryId}
                onCategoryDelete={deleteCategory}
                onCategoryNameChange={updateCategoryName}
                onCategoryUpdate={updateCategory}
                onContestantUpdate={updateContestant}
                onContestantDelete={deleteContestant}
                onContestantAdd={addContestant}
                onAddCategory={addCategory}
            />

            {activeCategory && (
                <InspectorPanel
                    category={activeCategory}
                    onUpdate={(updates) => updateCategory(activeCategory.id, updates)}
                    onContestantUpdate={(contestantId, updates) =>
                        updateContestant(activeCategory.id, contestantId, updates)
                    }
                    onContestantDelete={(contestantId) =>
                        deleteContestant(activeCategory.id, contestantId)
                    }
                    onContestantAdd={() => addContestant(activeCategory.id)}
                />
            )}
        </div>
    );
}

