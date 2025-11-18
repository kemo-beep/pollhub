import { ContestTemplate, TemplateTheme } from "./contest-templates";

// Premium design configurations for each template type
export interface TemplateDesignConfig {
    theme: TemplateTheme;
    layout: "centered" | "left-aligned" | "full-width";
    inputStyle: "modern" | "classic" | "minimal";
    fieldSpacing: "compact" | "comfortable" | "spacious";
    showIcons: boolean;
    showLabels: boolean;
    labelPosition: "above" | "inline" | "floating";
    buttonStyle: "filled" | "outlined" | "ghost";
    borderRadius: "none" | "small" | "medium" | "large" | "pill";
    headerStyle: "minimal" | "banner" | "hero";
    showProgress: boolean;
    showStepNumbers: boolean;
}

// Corporate Credit Application Design (matching reference)
export const corporateCreditDesign: TemplateDesignConfig = {
    theme: {
        backgroundColor: "#1a4d3a",
        primaryColor: "#2d5f47",
        secondaryColor: "#3d7a5f",
        textColor: "#ffffff",
        accentColor: "#f59e0b",
        inputBackground: "#2d5f47",
        inputBorder: "#3d7a5f",
        buttonColor: "#ffffff",
        buttonTextColor: "#1a4d3a",
    },
    layout: "centered",
    inputStyle: "modern",
    fieldSpacing: "comfortable",
    showIcons: true,
    showLabels: true,
    labelPosition: "above",
    buttonStyle: "filled",
    borderRadius: "medium",
    headerStyle: "banner",
    showProgress: true,
    showStepNumbers: false,
};

// Job Application Design
export const jobApplicationDesign: TemplateDesignConfig = {
    theme: {
        backgroundColor: "#1e3a5f",
        primaryColor: "#2d4a6b",
        secondaryColor: "#3d5a7b",
        textColor: "#ffffff",
        accentColor: "#3b82f6",
        inputBackground: "#2d4a6b",
        inputBorder: "#3d5a7b",
        buttonColor: "#ffffff",
        buttonTextColor: "#1e3a5f",
    },
    layout: "centered",
    inputStyle: "modern",
    fieldSpacing: "comfortable",
    showIcons: true,
    showLabels: true,
    labelPosition: "above",
    buttonStyle: "filled",
    borderRadius: "medium",
    headerStyle: "banner",
    showProgress: true,
    showStepNumbers: true,
};

// Customer Survey Design
export const customerSurveyDesign: TemplateDesignConfig = {
    theme: {
        backgroundColor: "#1a4d3a",
        primaryColor: "#2d5f47",
        secondaryColor: "#3d7a5f",
        textColor: "#ffffff",
        accentColor: "#f59e0b",
        inputBackground: "#2d5f47",
        inputBorder: "#3d7a5f",
        buttonColor: "#ffffff",
        buttonTextColor: "#1a4d3a",
    },
    layout: "centered",
    inputStyle: "modern",
    fieldSpacing: "spacious",
    showIcons: false,
    showLabels: true,
    labelPosition: "above",
    buttonStyle: "filled",
    borderRadius: "large",
    headerStyle: "hero",
    showProgress: true,
    showStepNumbers: false,
};

// Event Registration Design
export const eventRegistrationDesign: TemplateDesignConfig = {
    theme: {
        backgroundColor: "#4a1e5f",
        primaryColor: "#5d2d7b",
        secondaryColor: "#6d3d8b",
        textColor: "#ffffff",
        accentColor: "#a855f7",
        inputBackground: "#5d2d7b",
        inputBorder: "#6d3d8b",
        buttonColor: "#ffffff",
        buttonTextColor: "#4a1e5f",
    },
    layout: "centered",
    inputStyle: "modern",
    fieldSpacing: "comfortable",
    showIcons: true,
    showLabels: true,
    labelPosition: "above",
    buttonStyle: "filled",
    borderRadius: "medium",
    headerStyle: "hero",
    showProgress: true,
    showStepNumbers: true,
};

// Map template IDs to their design configs
export const templateDesignMap: Record<string, TemplateDesignConfig> = {
    "job-application-software-engineer": jobApplicationDesign,
    "customer-satisfaction-comprehensive": customerSurveyDesign,
    "tech-conference-registration": eventRegistrationDesign,
    "product-feature-prioritization": corporateCreditDesign,
    "employee-performance-review": jobApplicationDesign,
    "online-course-registration": eventRegistrationDesign,
    "restaurant-menu-selection": corporateCreditDesign,
    "vendor-selection-process": jobApplicationDesign,
    "patient-intake-form": corporateCreditDesign,
    "team-building-activity": eventRegistrationDesign,
    "product-launch-feedback": jobApplicationDesign,
    "employee-onboarding-survey": corporateCreditDesign,
    "software-feature-requests": eventRegistrationDesign,
    "support-ticket-priority": jobApplicationDesign,
    "course-evaluation-form": corporateCreditDesign,
    "vendor-evaluation": jobApplicationDesign,
    "event-venue-selection": eventRegistrationDesign,
};

export function getTemplateDesign(templateId: string): TemplateDesignConfig {
    return templateDesignMap[templateId] || corporateCreditDesign;
}

