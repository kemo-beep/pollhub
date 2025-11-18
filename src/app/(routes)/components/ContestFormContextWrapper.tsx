"use client";

import { usePathname } from "next/navigation";
import { ContestFormProvider } from "../contests/new/context/ContestFormContext";
import { useContestForm } from "../contests/new/hooks/useContestForm";
import { useState } from "react";

export function ContestFormContextWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isContestNewPage = pathname === "/contests/new";

    // Only provide context on contests/new page
    if (!isContestNewPage) {
        return <>{children}</>;
    }

    // Provide context for contests/new page
    return <ContestFormContextProvider>{children}</ContestFormContextProvider>;
}

function ContestFormContextProvider({ children }: { children: React.ReactNode }) {
    const [showSettings, setShowSettings] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const { formData, setFormData, categories, setCategories, loading, handleSubmit } =
        useContestForm();

    const contextValue = {
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
    };

    return (
        <ContestFormProvider value={contextValue}>{children}</ContestFormProvider>
    );
}

