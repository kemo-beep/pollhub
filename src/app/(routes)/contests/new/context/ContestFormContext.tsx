"use client";

import { createContext, useContext, ReactNode } from "react";
import { ContestFormData, Category } from "../types";

interface ContestFormContextType {
    formData: ContestFormData;
    setFormData: (data: ContestFormData) => void;
    categories: Category[];
    setCategories: (categories: Category[]) => void;
    loading: boolean;
    handleSubmit: () => void;
    showSettings: boolean;
    setShowSettings: (show: boolean) => void;
    showPreview: boolean;
    setShowPreview: (show: boolean) => void;
}

const ContestFormContext = createContext<ContestFormContextType | undefined>(undefined);

export function ContestFormProvider({
    children,
    value,
}: {
    children: ReactNode;
    value: ContestFormContextType;
}) {
    return (
        <ContestFormContext.Provider value={value}>{children}</ContestFormContext.Provider>
    );
}

export function useContestFormContext() {
    const context = useContext(ContestFormContext);
    if (!context) {
        throw new Error("useContestFormContext must be used within ContestFormProvider");
    }
    return context;
}

