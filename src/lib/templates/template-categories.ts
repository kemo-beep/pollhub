export type TemplateCategory =
    | "most-popular"
    | "application-forms"
    | "appointment-forms"
    | "booking-forms"
    | "business-forms"
    | "calculation-forms"
    | "checklist-forms"
    | "client-project-forms"
    | "consent-forms"
    | "consultation-forms"
    | "contact-forms"
    | "content-forms"
    | "customer-service-forms"
    | "donation-forms"
    | "ecommerce"
    | "education"
    | "employment-forms"
    | "enrollment-forms"
    | "estimate-forms"
    | "evaluation-survey"
    | "event-registration"
    | "feedback"
    | "file-upload-forms"
    | "finance"
    | "health-care-forms"
    | "hospitality-forms"
    | "human-resources"
    | "inspection-forms"
    | "intake-forms"
    | "it-forms"
    | "lead-generation"
    | "legal-forms"
    | "marketing"
    | "membership-forms"
    | "notion-forms"
    | "order-forms"
    | "party-forms"
    | "payment-forms"
    | "personal"
    | "productivity-forms"
    | "questionnaire"
    | "quiz"
    | "quote-forms"
    | "registration-forms"
    | "rental-forms"
    | "report-forms"
    | "request-forms"
    | "reservation-forms"
    | "retail-forms"
    | "rsvp-forms"
    | "signup-forms"
    | "small-business-forms"
    | "sponsorship-forms"
    | "subscription-forms"
    | "survey"
    | "tracking-forms"
    | "volunteer-forms"
    | "voting-forms"
    | "wedding-forms";

export interface TemplateCategoryInfo {
    id: TemplateCategory;
    name: string;
    icon: string;
    count: number;
}

export const templateCategories: TemplateCategoryInfo[] = [
    { id: "most-popular", name: "Most popular", icon: "⭐", count: 14 },
    { id: "application-forms", name: "Application forms", icon: "📝", count: 30 },
    { id: "appointment-forms", name: "Appointment forms", icon: "📅", count: 11 },
    { id: "booking-forms", name: "Booking forms", icon: "🎫", count: 22 },
    { id: "business-forms", name: "Business forms", icon: "💼", count: 113 },
    { id: "calculation-forms", name: "Calculation forms", icon: "🔢", count: 13 },
    { id: "checklist-forms", name: "Checklist forms", icon: "✅", count: 7 },
    { id: "client-project-forms", name: "Client project forms", icon: "📊", count: 32 },
    { id: "consent-forms", name: "Consent forms", icon: "✍️", count: 9 },
    { id: "consultation-forms", name: "Consultation forms", icon: "💬", count: 6 },
    { id: "contact-forms", name: "Contact forms", icon: "📧", count: 16 },
    { id: "content-forms", name: "Content forms", icon: "📄", count: 2 },
    { id: "customer-service-forms", name: "Customer service forms", icon: "🎧", count: 20 },
    { id: "donation-forms", name: "Donation forms", icon: "💝", count: 3 },
    { id: "ecommerce", name: "Ecommerce", icon: "🛒", count: 97 },
    { id: "education", name: "Education", icon: "🎓", count: 50 },
    { id: "employment-forms", name: "Employment forms", icon: "👔", count: 40 },
    { id: "enrollment-forms", name: "Enrollment forms", icon: "📚", count: 6 },
    { id: "estimate-forms", name: "Estimate forms", icon: "💰", count: 2 },
    { id: "evaluation-survey", name: "Evaluation survey", icon: "📊", count: 12 },
    { id: "event-registration", name: "Event registration", icon: "🎉", count: 49 },
    { id: "feedback", name: "Feedback", icon: "💭", count: 58 },
    { id: "file-upload-forms", name: "File upload forms", icon: "📎", count: 1 },
    { id: "finance", name: "Finance", icon: "💳", count: 19 },
    { id: "health-care-forms", name: "Health care forms", icon: "🏥", count: 30 },
    { id: "hospitality-forms", name: "Hospitality forms", icon: "🏨", count: 25 },
    { id: "human-resources", name: "Human resources", icon: "👥", count: 51 },
    { id: "inspection-forms", name: "Inspection forms", icon: "🔍", count: 5 },
    { id: "intake-forms", name: "Intake forms", icon: "📋", count: 8 },
    { id: "it-forms", name: "IT forms", icon: "💻", count: 9 },
    { id: "lead-generation", name: "Lead generation", icon: "🎯", count: 59 },
    { id: "legal-forms", name: "Legal forms", icon: "⚖️", count: 24 },
    { id: "marketing", name: "Marketing", icon: "📢", count: 74 },
    { id: "membership-forms", name: "Membership forms", icon: "🎫", count: 7 },
    { id: "notion-forms", name: "Notion forms", icon: "📝", count: 16 },
    { id: "order-forms", name: "Order forms", icon: "🛍️", count: 34 },
    { id: "party-forms", name: "Party forms", icon: "🎊", count: 8 },
    { id: "payment-forms", name: "Payment forms", icon: "💳", count: 26 },
    { id: "personal", name: "Personal", icon: "👤", count: 27 },
    { id: "productivity-forms", name: "Productivity forms", icon: "⚡", count: 18 },
    { id: "questionnaire", name: "Questionnaire", icon: "❓", count: 10 },
    { id: "quiz", name: "Quiz", icon: "🧩", count: 12 },
    { id: "quote-forms", name: "Quote forms", icon: "💬", count: 6 },
    { id: "registration-forms", name: "Registration forms", icon: "📝", count: 48 },
    { id: "rental-forms", name: "Rental forms", icon: "🏠", count: 10 },
    { id: "report-forms", name: "Report forms", icon: "📈", count: 9 },
    { id: "request-forms", name: "Request forms", icon: "🙏", count: 17 },
    { id: "reservation-forms", name: "Reservation forms", icon: "📅", count: 11 },
    { id: "retail-forms", name: "Retail forms", icon: "🛒", count: 37 },
    { id: "rsvp-forms", name: "RSVP forms", icon: "✉️", count: 13 },
    { id: "signup-forms", name: "Signup forms", icon: "📝", count: 26 },
    { id: "small-business-forms", name: "Small business forms", icon: "🏪", count: 115 },
    { id: "sponsorship-forms", name: "Sponsorship forms", icon: "🤝", count: 2 },
    { id: "subscription-forms", name: "Subscription forms", icon: "🔄", count: 4 },
    { id: "survey", name: "Survey", icon: "📋", count: 58 },
    { id: "tracking-forms", name: "Tracking forms", icon: "📍", count: 2 },
    { id: "volunteer-forms", name: "Volunteer forms", icon: "🤲", count: 5 },
    { id: "voting-forms", name: "Voting forms", icon: "🗳️", count: 15 },
    { id: "wedding-forms", name: "Wedding forms", icon: "💍", count: 8 },
];

export function getCategoryById(id: TemplateCategory): TemplateCategoryInfo | undefined {
    return templateCategories.find((cat) => cat.id === id);
}

export function getCategoryCount(id: TemplateCategory): number {
    return getCategoryById(id)?.count || 0;
}

