import { TemplateCategory } from "./template-categories";
import { realWorldTemplates } from "./real-world-templates";

export interface TemplateTheme {
    backgroundColor: string;
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    accentColor: string;
    inputBackground: string;
    inputBorder: string;
    buttonColor: string;
    buttonTextColor: string;
}

export interface ContestTemplate {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: TemplateCategory;
    thumbnail?: string; // Optional preview image
    theme?: TemplateTheme; // Custom theme for this template
    template: {
        name: string;
        description: string;
        categories: Array<{
            name: string;
            description?: string;
            votingType: "rank" | "pick-one" | "multiple-choice" | "rating" | "head-to-head";
            contestants: Array<{
                name: string;
                description?: string;
            }>;
        }>;
    };
}

export const contestTemplates: ContestTemplate[] = [
    // Include real-world templates first
    ...realWorldTemplates,
    // Original basic templates
    {
        id: "talent-show",
        name: "Talent Show",
        description: "Rank performers in a talent competition",
        icon: "🎤",
        category: "most-popular",
        template: {
            name: "Talent Show 2025",
            description: "Vote for your favorite performers!",
            categories: [
                {
                    name: "Best Performance",
                    description: "Rank the performers from best to least favorite",
                    votingType: "rank",
                    contestants: [
                        { name: "Performer 1", description: "Singer" },
                        { name: "Performer 2", description: "Dancer" },
                        { name: "Performer 3", description: "Musician" },
                        { name: "Performer 4", description: "Comedian" },
                        { name: "Performer 5", description: "Magician" },
                    ],
                },
            ],
        },
    },
    {
        id: "community-awards",
        name: "Community Awards",
        description: "Vote for the best local businesses or people",
        icon: "🏆",
        category: "most-popular",
        template: {
            name: "Community Awards 2025",
            description: "Recognize the best in our community",
            categories: [
                {
                    name: "Best Local Business",
                    description: "Vote for your favorite local business",
                    votingType: "rank",
                    contestants: [
                        { name: "Business 1", description: "Restaurant" },
                        { name: "Business 2", description: "Cafe" },
                        { name: "Business 3", description: "Shop" },
                        { name: "Business 4", description: "Service" },
                    ],
                },
            ],
        },
    },
    {
        id: "student-election",
        name: "Student Election",
        description: "Fair voting for student body elections",
        icon: "🎓",
        category: "voting-forms",
        template: {
            name: "Student Body Election",
            description: "Vote for your student representatives",
            categories: [
                {
                    name: "President",
                    description: "Vote for student body president",
                    votingType: "rank",
                    contestants: [
                        { name: "Candidate 1", description: "Running for President" },
                        { name: "Candidate 2", description: "Running for President" },
                        { name: "Candidate 3", description: "Running for President" },
                    ],
                },
            ],
        },
    },
    {
        id: "product-features",
        name: "Product Feature Voting",
        description: "Let your team vote on which features to prioritize",
        icon: "💡",
        category: "business-forms",
        template: {
            name: "Feature Prioritization",
            description: "Help us decide which features to build next",
            categories: [
                {
                    name: "New Features",
                    description: "Rank features by priority",
                    votingType: "rank",
                    contestants: [
                        { name: "Feature 1", description: "Dark mode" },
                        { name: "Feature 2", description: "Mobile app" },
                        { name: "Feature 3", description: "API access" },
                        { name: "Feature 4", description: "Analytics dashboard" },
                    ],
                },
            ],
        },
    },
    {
        id: "dating-show",
        name: "Dating Show / Fantasy League",
        description: "Rank contestants in a fun prediction game",
        icon: "❤️",
        category: "event-registration",
        template: {
            name: "Dating Show",
            description: "Who will find love?",
            categories: [
                {
                    name: "Contestants",
                    description: "Rank the contestants",
                    votingType: "rank",
                    contestants: [
                        { name: "Contestant 1", description: "Age 28, Teacher" },
                        { name: "Contestant 2", description: "Age 32, Engineer" },
                        { name: "Contestant 3", description: "Age 26, Designer" },
                        { name: "Contestant 4", description: "Age 30, Doctor" },
                    ],
                },
            ],
        },
    },
    {
        id: "art-contest",
        name: "Art/Design Contest",
        description: "Rank creative submissions fairly",
        icon: "🎨",
        category: "most-popular",
        template: {
            name: "Art Contest 2025",
            description: "Vote for your favorite artwork",
            categories: [
                {
                    name: "Best Artwork",
                    description: "Rank the submissions",
                    votingType: "rank",
                    contestants: [
                        { name: "Artwork 1", description: "Digital Art" },
                        { name: "Artwork 2", description: "Painting" },
                        { name: "Artwork 3", description: "Sculpture" },
                        { name: "Artwork 4", description: "Photography" },
                    ],
                },
            ],
        },
    },
    {
        id: "team-decision",
        name: "Team Decision Making",
        description: "Democratic voting for team choices",
        icon: "👥",
        category: "business-forms",
        template: {
            name: "Team Decision",
            description: "Help the team make a decision",
            categories: [
                {
                    name: "Options",
                    description: "Rank your preferred options",
                    votingType: "rank",
                    contestants: [
                        { name: "Option 1", description: "First option" },
                        { name: "Option 2", description: "Second option" },
                        { name: "Option 3", description: "Third option" },
                    ],
                },
            ],
        },
    },
    {
        id: "content-creator",
        name: "Content Creator Poll",
        description: "Let your audience vote on content ideas",
        icon: "📺",
        category: "event-registration",
        template: {
            name: "What Should I Create Next?",
            description: "Help me decide what content to make",
            categories: [
                {
                    name: "Content Ideas",
                    description: "Rank the ideas you want to see",
                    votingType: "rank",
                    contestants: [
                        { name: "Idea 1", description: "Tutorial video" },
                        { name: "Idea 2", description: "Vlog" },
                        { name: "Idea 3", description: "Review" },
                        { name: "Idea 4", description: "Challenge" },
                    ],
                },
            ],
        },
    },
    // Appointment Forms
    {
        id: "veterinary-appointment",
        name: "Veterinary Clinic Appointment",
        description: "Book appointments for pet care services",
        icon: "🐾",
        category: "appointment-forms",
        template: {
            name: "Veterinary Clinic Appointment",
            description: "Schedule your pet's appointment",
            categories: [
                {
                    name: "Service Type",
                    description: "Select the service you need",
                    votingType: "pick-one",
                    contestants: [
                        { name: "General Checkup", description: "Routine health examination" },
                        { name: "Vaccination", description: "Pet vaccinations" },
                        { name: "Grooming", description: "Pet grooming services" },
                        { name: "Emergency", description: "Urgent care" },
                    ],
                },
            ],
        },
    },
    {
        id: "dental-appointment",
        name: "Dental Appointment Form",
        description: "Book your dental appointment",
        icon: "🦷",
        category: "appointment-forms",
        template: {
            name: "Dental Appointment",
            description: "Schedule your dental visit",
            categories: [
                {
                    name: "Appointment Type",
                    description: "Choose your appointment type",
                    votingType: "pick-one",
                    contestants: [
                        { name: "Cleaning", description: "Regular dental cleaning" },
                        { name: "Consultation", description: "Initial consultation" },
                        { name: "Treatment", description: "Dental treatment" },
                    ],
                },
            ],
        },
    },
    {
        id: "salon-reservation",
        name: "Salon Reservation Form",
        description: "Book your salon appointment",
        icon: "💇",
        category: "appointment-forms",
        template: {
            name: "Salon Reservation",
            description: "Reserve your salon service",
            categories: [
                {
                    name: "Service",
                    description: "Select your preferred service",
                    votingType: "pick-one",
                    contestants: [
                        { name: "Haircut", description: "Hair cutting service" },
                        { name: "Hair Color", description: "Hair coloring" },
                        { name: "Styling", description: "Hair styling" },
                        { name: "Treatment", description: "Hair treatment" },
                    ],
                },
            ],
        },
    },
    // Event Registration
    {
        id: "conference-registration",
        name: "Conference Registration",
        description: "Register for our upcoming conference",
        icon: "🎤",
        category: "event-registration",
        template: {
            name: "Conference Registration 2025",
            description: "Join us for an amazing conference",
            categories: [
                {
                    name: "Registration Package",
                    description: "Choose your registration package",
                    votingType: "pick-one",
                    contestants: [
                        { name: "Full Pass", description: "Access to all sessions" },
                        { name: "Day Pass", description: "Single day access" },
                        { name: "Virtual Pass", description: "Online access" },
                    ],
                },
            ],
        },
    },
    {
        id: "workshop-registration",
        name: "Workshop Registration",
        description: "Sign up for our workshop",
        icon: "🎓",
        category: "event-registration",
        template: {
            name: "Workshop Registration",
            description: "Register for our educational workshop",
            categories: [
                {
                    name: "Workshop Selection",
                    description: "Select the workshop you want to attend",
                    votingType: "multiple-choice",
                    contestants: [
                        { name: "Web Development", description: "Learn web development" },
                        { name: "Design Principles", description: "Master design" },
                        { name: "Marketing Strategy", description: "Marketing workshop" },
                    ],
                },
            ],
        },
    },
    // Voting Forms
    {
        id: "board-election",
        name: "Board Election",
        description: "Vote for board members",
        icon: "👔",
        category: "voting-forms",
        template: {
            name: "Board Election 2025",
            description: "Elect your board representatives",
            categories: [
                {
                    name: "Board Positions",
                    description: "Rank candidates for each position",
                    votingType: "rank",
                    contestants: [
                        { name: "Candidate A", description: "Experienced leader" },
                        { name: "Candidate B", description: "Innovative thinker" },
                        { name: "Candidate C", description: "Community advocate" },
                    ],
                },
            ],
        },
    },
    {
        id: "award-voting",
        name: "Award Voting",
        description: "Vote for award winners",
        icon: "🏆",
        category: "voting-forms",
        template: {
            name: "Annual Awards 2025",
            description: "Vote for your favorites",
            categories: [
                {
                    name: "Best of the Year",
                    description: "Rank your top choices",
                    votingType: "rank",
                    contestants: [
                        { name: "Nominee 1", description: "Outstanding achievement" },
                        { name: "Nominee 2", description: "Excellence in service" },
                        { name: "Nominee 3", description: "Innovation award" },
                    ],
                },
            ],
        },
    },
    // Feedback Forms
    {
        id: "customer-feedback",
        name: "Customer Feedback",
        description: "Collect customer feedback and ratings",
        icon: "⭐",
        category: "feedback",
        template: {
            name: "Customer Feedback Survey",
            description: "Help us improve by sharing your feedback",
            categories: [
                {
                    name: "Service Rating",
                    description: "Rate our services",
                    votingType: "rating",
                    contestants: [
                        { name: "Service Quality", description: "How was the service?" },
                        { name: "Staff Friendliness", description: "Rate our staff" },
                        { name: "Value for Money", description: "Was it worth it?" },
                    ],
                },
            ],
        },
    },
    {
        id: "product-feedback",
        name: "Product Feedback",
        description: "Rate and review products",
        icon: "📦",
        category: "feedback",
        template: {
            name: "Product Feedback",
            description: "Share your thoughts on our products",
            categories: [
                {
                    name: "Product Ratings",
                    description: "Rate each product",
                    votingType: "rating",
                    contestants: [
                        { name: "Product A", description: "Feature-rich product" },
                        { name: "Product B", description: "User-friendly design" },
                        { name: "Product C", description: "Great value" },
                    ],
                },
            ],
        },
    },
    // Survey Forms
    {
        id: "satisfaction-survey",
        name: "Satisfaction Survey",
        description: "Measure customer satisfaction",
        icon: "📊",
        category: "survey",
        template: {
            name: "Customer Satisfaction Survey",
            description: "Tell us about your experience",
            categories: [
                {
                    name: "Satisfaction Ratings",
                    description: "Rate your satisfaction level",
                    votingType: "rating",
                    contestants: [
                        { name: "Overall Experience", description: "How satisfied are you?" },
                        { name: "Product Quality", description: "Rate product quality" },
                        { name: "Customer Support", description: "Rate support service" },
                    ],
                },
            ],
        },
    },
    // RSVP Forms
    {
        id: "wedding-rsvp",
        name: "Wedding RSVP",
        description: "RSVP for wedding celebration",
        icon: "💍",
        category: "rsvp-forms",
        template: {
            name: "Wedding RSVP",
            description: "Please confirm your attendance",
            categories: [
                {
                    name: "Attendance",
                    description: "Will you be attending?",
                    votingType: "pick-one",
                    contestants: [
                        { name: "Yes, I'll be there!", description: "Accepting with pleasure" },
                        { name: "Sorry, can't make it", description: "Regretfully declining" },
                    ],
                },
            ],
        },
    },
    {
        id: "party-rsvp",
        name: "Party RSVP",
        description: "RSVP for the party",
        icon: "🎉",
        category: "rsvp-forms",
        template: {
            name: "Party RSVP",
            description: "Join us for a celebration",
            categories: [
                {
                    name: "RSVP",
                    description: "Confirm your attendance",
                    votingType: "pick-one",
                    contestants: [
                        { name: "Attending", description: "Count me in!" },
                        { name: "Not Attending", description: "Can't make it" },
                    ],
                },
            ],
        },
    },
    // Quiz Forms
    {
        id: "knowledge-quiz",
        name: "Knowledge Quiz",
        description: "Test your knowledge with this quiz",
        icon: "🧩",
        category: "quiz",
        template: {
            name: "Knowledge Quiz",
            description: "Answer questions to test your knowledge",
            categories: [
                {
                    name: "Quiz Questions",
                    description: "Select the correct answers",
                    votingType: "multiple-choice",
                    contestants: [
                        { name: "Question 1", description: "What is the capital?" },
                        { name: "Question 2", description: "Who invented it?" },
                        { name: "Question 3", description: "When did it happen?" },
                    ],
                },
            ],
        },
    },
];

export function getTemplateById(id: string): ContestTemplate | undefined {
    return contestTemplates.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: TemplateCategory): ContestTemplate[] {
    return contestTemplates.filter((t) => t.category === category);
}

export function searchTemplates(query: string): ContestTemplate[] {
    const lowerQuery = query.toLowerCase();
    return contestTemplates.filter(
        (t) =>
            t.name.toLowerCase().includes(lowerQuery) ||
            t.description.toLowerCase().includes(lowerQuery) ||
            t.template.name.toLowerCase().includes(lowerQuery) ||
            t.template.description.toLowerCase().includes(lowerQuery)
    );
}

