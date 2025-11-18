"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { contestTemplates, ContestTemplate, searchTemplates } from "@/lib/templates/contest-templates";
import { templateCategories, TemplateCategory } from "@/lib/templates/template-categories";
import { Category, Contestant } from "@/app/(routes)/contests/new/types";
import { nanoid } from "nanoid";
import { Sparkles, X, ArrowRight, Zap, Search, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TemplateSelectorProps {
    onSelectTemplate: (template: {
        name: string;
        description: string;
        categories: Category[];
    }) => void;
    onStartBlank: () => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TemplateSelector({
    onSelectTemplate,
    onStartBlank,
    open,
    onOpenChange,
}: TemplateSelectorProps) {
    const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter templates based on category and search
    const filteredTemplates = useMemo(() => {
        let templates: ContestTemplate[] = contestTemplates;

        // Filter by category
        if (selectedCategory !== "all") {
            templates = templates.filter((t) => t.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            templates = searchTemplates(searchQuery).filter((t) =>
                selectedCategory === "all" ? true : t.category === selectedCategory
            );
        }

        return templates;
    }, [selectedCategory, searchQuery]);

    // Get template count for each category
    const getCategoryTemplateCount = (categoryId: TemplateCategory | "all"): number => {
        if (categoryId === "all") {
            return contestTemplates.length;
        }
        return contestTemplates.filter((t) => t.category === categoryId).length;
    };

    const handleTemplateSelect = (template: ContestTemplate) => {
        // Convert template to contest form format
        const categories: Category[] = template.template.categories.map((cat) => ({
            id: nanoid(),
            name: cat.name,
            description: cat.description,
            votingType: cat.votingType,
            maxRankings: cat.votingType === "rank" ? undefined : undefined,
            maxSelections: cat.votingType === "multiple-choice" ? undefined : undefined,
            ratingScale: cat.votingType === "rating" ? 5 : undefined,
            allowWriteIns: false,
            randomizeOrder: true,
            contestants: cat.contestants.map((c) => ({
                id: nanoid(),
                name: c.name,
                description: c.description,
                bio: undefined,
                avatar: undefined,
                socialLinks: undefined,
            } as Contestant)),
        }));

        // Store template theme and design in localStorage
        if (template.theme) {
            localStorage.setItem('selectedTemplateTheme', JSON.stringify(template.theme));
            localStorage.setItem('selectedTemplateId', template.id);
        }

        // Also store the template design config if available
        import("@/lib/templates/template-designs").then(({ getTemplateDesign }) => {
            const design = getTemplateDesign(template.id);
            localStorage.setItem('selectedTemplateDesign', JSON.stringify(design));
        });

        onSelectTemplate({
            name: template.template.name,
            description: template.template.description,
            categories,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 flex flex-col overflow-hidden">
                {/* Premium Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary px-8 py-6 text-primary-foreground border-b">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Pick a template</h2>
                                <p className="text-sm text-primary-foreground/80 mt-1">
                                    Choose from {contestTemplates.length} professional templates
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onOpenChange(false)}
                            className="text-primary-foreground hover:bg-white/20"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Sidebar - Categories */}
                    <div className="w-64 border-r bg-slate-50/50 overflow-y-auto flex-shrink-0">
                        {/* Search Bar */}
                        <div className="p-4 border-b bg-white">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search templates"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-9 text-sm"
                                />
                            </div>
                        </div>

                        {/* Category List */}
                        <div className="p-2">
                            {/* All Templates */}
                            <motion.button
                                onClick={() => {
                                    setSelectedCategory("all");
                                    setSearchQuery("");
                                }}
                                className={cn(
                                    "w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-1",
                                    "hover:bg-slate-100",
                                    selectedCategory === "all"
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "text-slate-700"
                                )}
                                whileHover={{ x: 2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <span>⭐</span>
                                        <span>All Templates</span>
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {contestTemplates.length}
                                    </span>
                                </div>
                            </motion.button>

                            {/* Category Items */}
                            {templateCategories.map((category, idx) => {
                                const count = getCategoryTemplateCount(category.id);
                                if (count === 0) return null;

                                return (
                                    <motion.button
                                        key={category.id}
                                        onClick={() => {
                                            setSelectedCategory(category.id);
                                            setSearchQuery("");
                                        }}
                                        className={cn(
                                            "w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-1",
                                            "hover:bg-slate-100",
                                            selectedCategory === category.id
                                                ? "bg-primary/10 text-primary font-semibold"
                                                : "text-slate-700"
                                        )}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.02 }}
                                        whileHover={{ x: 2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <span>{category.icon}</span>
                                                <span>{category.name}</span>
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {count}
                                            </span>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content - Template Grid */}
                    <div className="flex-1 overflow-y-auto bg-white">
                        <div className="p-6">
                            {filteredTemplates.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                                    <p className="text-muted-foreground">
                                        Try adjusting your search or category filter
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Results Header */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold">
                                            {searchQuery
                                                ? `Search results for "${searchQuery}"`
                                                : selectedCategory === "all"
                                                    ? "All Templates"
                                                    : templateCategories.find((c) => c.id === selectedCategory)?.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {filteredTemplates.length} template
                                            {filteredTemplates.length !== 1 ? "s" : ""} found
                                        </p>
                                    </div>

                                    {/* Template Grid */}
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {filteredTemplates.map((template, idx) => (
                                            <motion.div
                                                key={template.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.05 }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Card
                                                    className={cn(
                                                        "cursor-pointer group relative overflow-hidden h-full",
                                                        "border-2 transition-all duration-300",
                                                        "hover:border-primary hover:shadow-2xl",
                                                        "bg-gradient-to-br from-white to-slate-50/50",
                                                        "flex flex-col"
                                                    )}
                                                    onClick={() => handleTemplateSelect(template)}
                                                >
                                                    {/* Template Preview/Thumbnail Area */}
                                                    <div className="relative h-32 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 overflow-hidden">
                                                        {template.thumbnail ? (
                                                            <img
                                                                src={template.thumbnail}
                                                                alt={template.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <span className="text-6xl opacity-30">
                                                                    {template.icon}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                                                    </div>

                                                    {/* Gradient overlay on hover */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                                    {/* Shine effect */}
                                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                                                    <CardHeader className="relative z-10 flex-1">
                                                        <div className="flex items-start gap-3 mb-2">
                                                            <div className="text-2xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                                                {template.icon}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <CardTitle className="text-base font-bold group-hover:text-primary transition-colors line-clamp-2">
                                                                    {template.name}
                                                                </CardTitle>
                                                            </div>
                                                        </div>
                                                        <CardDescription className="text-sm leading-relaxed line-clamp-2">
                                                            {template.description}
                                                        </CardDescription>
                                                    </CardHeader>

                                                    <CardContent className="relative z-10 pt-0">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <div className="flex items-center gap-4 text-muted-foreground">
                                                                <div className="flex items-center gap-1">
                                                                    <Zap className="h-3 w-3" />
                                                                    <span>
                                                                        {template.template.categories.length}{" "}
                                                                        categor
                                                                        {template.template.categories.length === 1
                                                                            ? "y"
                                                                            : "ies"}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Sparkles className="h-3 w-3" />
                                                                    <span>
                                                                        {template.template.categories.reduce(
                                                                            (sum, cat) =>
                                                                                sum + cat.contestants.length,
                                                                            0
                                                                        )}{" "}
                                                                        items
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t bg-slate-50/50 px-6 py-4 flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => {
                            onStartBlank();
                            onOpenChange(false);
                        }}
                        className="gap-2"
                    >
                        <X className="h-4 w-4" />
                        Start from Scratch
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        {filteredTemplates.length} of {contestTemplates.length} templates
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
