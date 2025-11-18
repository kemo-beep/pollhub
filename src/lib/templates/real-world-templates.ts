import { ContestTemplate } from "./contest-templates";

// Professional themes matching the reference design
const corporateGreenTheme: ContestTemplate["theme"] = {
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

const professionalBlueTheme: ContestTemplate["theme"] = {
    backgroundColor: "#1e3a5f",
    primaryColor: "#2d4a6b",
    secondaryColor: "#3d5a7b",
    textColor: "#ffffff",
    accentColor: "#3b82f6",
    inputBackground: "#2d4a6b",
    inputBorder: "#3d5a7b",
    buttonColor: "#ffffff",
    buttonTextColor: "#1e3a5f",
};

const elegantPurpleTheme: ContestTemplate["theme"] = {
    backgroundColor: "#4a1e5f",
    primaryColor: "#5d2d7b",
    secondaryColor: "#6d3d8b",
    textColor: "#ffffff",
    accentColor: "#a855f7",
    inputBackground: "#5d2d7b",
    inputBorder: "#6d3d8b",
    buttonColor: "#ffffff",
    buttonTextColor: "#4a1e5f",
};

// Real-world, production-ready templates with comprehensive data
export const realWorldTemplates: ContestTemplate[] = [
    // Job Application Form
    {
        id: "job-application-software-engineer",
        name: "Software Engineer Job Application",
        description: "Comprehensive job application form for software engineering positions",
        icon: "💻",
        category: "employment-forms",
        theme: professionalBlueTheme,
        template: {
            name: "Software Engineer - Application Form",
            description: "Apply for our software engineering position",
            categories: [
                {
                    name: "Years of Experience",
                    description: "Select your experience level",
                    votingType: "pick-one",
                    contestants: [
                        { name: "Entry Level (0-2 years)", description: "Recent graduate or junior developer" },
                        { name: "Mid Level (3-5 years)", description: "Experienced developer" },
                        { name: "Senior Level (6-10 years)", description: "Senior developer" },
                        { name: "Lead/Principal (10+ years)", description: "Lead or principal engineer" },
                    ],
                },
                {
                    name: "Primary Programming Languages",
                    description: "Select all languages you're proficient in",
                    votingType: "multiple-choice",
                    contestants: [
                        { name: "JavaScript/TypeScript", description: "Frontend and Node.js" },
                        { name: "Python", description: "Backend and data science" },
                        { name: "Java", description: "Enterprise applications" },
                        { name: "C#/.NET", description: "Microsoft stack" },
                        { name: "Go", description: "Systems programming" },
                        { name: "Rust", description: "Systems programming" },
                        { name: "PHP", description: "Web development" },
                    ],
                },
                {
                    name: "Preferred Work Arrangement",
                    description: "What work arrangement works best for you?",
                    votingType: "pick-one",
                    contestants: [
                        { name: "Remote Only", description: "100% remote work" },
                        { name: "Hybrid", description: "Mix of remote and office" },
                        { name: "On-site", description: "Office-based work" },
                    ],
                },
            ],
        },
    },
    // Customer Satisfaction Survey
    {
        id: "customer-satisfaction-comprehensive",
        name: "Customer Satisfaction Survey",
        description: "Comprehensive customer feedback survey with multiple rating categories",
        icon: "⭐",
        category: "feedback",
        theme: corporateGreenTheme,
        template: {
            name: "Customer Satisfaction Survey",
            description: "Help us improve by sharing your experience",
            categories: [
                {
                    name: "Overall Experience Rating",
                    description: "Rate your overall experience (1-5 stars)",
                    votingType: "rating",
                    contestants: [
                        { name: "Overall Satisfaction", description: "How satisfied are you overall?" },
                    ],
                },
                {
                    name: "Service Quality Ratings",
                    description: "Rate each aspect of our service",
                    votingType: "rating",
                    contestants: [
                        { name: "Product Quality", description: "Quality of products/services" },
                        { name: "Customer Support", description: "Helpfulness of support team" },
                        { name: "Delivery Speed", description: "How fast was delivery?" },
                        { name: "Value for Money", description: "Was it worth the price?" },
                        { name: "Website/App Experience", description: "Ease of use" },
                    ],
                },
                {
                    name: "Likelihood to Recommend",
                    description: "How likely are you to recommend us?",
                    votingType: "pick-one",
                    contestants: [
                        { name: "Very Likely (9-10)", description: "Definitely would recommend" },
                        { name: "Likely (7-8)", description: "Probably would recommend" },
                        { name: "Neutral (5-6)", description: "Might recommend" },
                        { name: "Unlikely (3-4)", description: "Probably wouldn't recommend" },
                        { name: "Very Unlikely (0-2)", description: "Definitely wouldn't recommend" },
                    ],
                },
            ],
        },
    },
    // Event Registration - Conference
    {
        id: "tech-conference-registration",
        name: "Tech Conference Registration",
        description: "Complete conference registration with session selection and meal preferences",
        icon: "🎤",
        category: "event-registration",
        theme: elegantPurpleTheme,
        template: {
            name: "Tech Conference 2025 - Registration",
            description: "Register for our annual technology conference",
            categories: [
                {
                    name: "Registration Package",
                    description: "Choose your registration package",
                    votingType: "pick-one",
                    contestants: [
                        { name: "Full Conference Pass", description: "All 3 days, all sessions - $599" },
                        { name: "Single Day Pass", description: "One day access - $249" },
                        { name: "Student Pass", description: "Student discount - $199" },
                        { name: "Virtual Pass", description: "Online access only - $149" },
                    ],
                },
                {
                    name: "Workshop Sessions",
                    description: "Select up to 3 workshops you'd like to attend",
                    votingType: "multiple-choice",
                    contestants: [
                        { name: "React Advanced Patterns", description: "Advanced React techniques" },
                        { name: "AI/ML Fundamentals", description: "Introduction to AI/ML" },
                        { name: "Cloud Architecture", description: "AWS/Azure best practices" },
                        { name: "DevOps Pipeline", description: "CI/CD and automation" },
                        { name: "Database Design", description: "Scalable database design" },
                        { name: "Security Best Practices", description: "Application security" },
                    ],
                },
                {
                    name: "Dietary Preferences",
                    description: "Select your dietary requirements",
                    votingType: "multiple-choice",
                    contestants: [
                        { name: "Vegetarian", description: "Vegetarian meals" },
                        { name: "Vegan", description: "Vegan meals" },
                        { name: "Gluten-Free", description: "Gluten-free options" },
                        { name: "Halal", description: "Halal certified" },
                        { name: "Kosher", description: "Kosher certified" },
                        { name: "No Restrictions", description: "No dietary restrictions" },
                    ],
                },
            ],
        },
    },
    // Product Feature Prioritization
    {
        id: "product-feature-prioritization",
        name: "Product Feature Prioritization",
        description: "Let users vote on which features to build next - ranked choice voting",
        icon: "🚀",
        category: "business-forms",
        theme: corporateGreenTheme,
        template: {
            name: "Product Feature Roadmap 2025",
            description: "Help us prioritize which features to build next",
            categories: [
                {
                    name: "Feature Priority Ranking",
                    description: "Rank features from most important (1) to least important",
                    votingType: "rank",
                    contestants: [
                        { name: "Dark Mode", description: "Dark theme for better night viewing" },
                        { name: "Mobile App", description: "Native iOS and Android apps" },
                        { name: "API Access", description: "Public API for integrations" },
                        { name: "Advanced Analytics", description: "Detailed usage analytics" },
                        { name: "Multi-language Support", description: "Support for 10+ languages" },
                        { name: "Export to PDF", description: "Export reports as PDF" },
                        { name: "Real-time Collaboration", description: "Live collaboration features" },
                        { name: "Custom Integrations", description: "Zapier, Slack, etc." },
                    ],
                },
            ],
        },
    },
    // Employee Performance Review
    {
        id: "employee-performance-review",
        name: "Employee Performance Review",
        description: "Comprehensive 360-degree performance review with ratings",
        icon: "📊",
        category: "human-resources",
        theme: professionalBlueTheme,
        template: {
            name: "Q4 2024 Performance Review",
            description: "Evaluate employee performance across key areas",
            categories: [
                {
                    name: "Core Competencies Rating",
                    description: "Rate performance in core areas (1-5 scale)",
                    votingType: "rating",
                    contestants: [
                        { name: "Technical Skills", description: "Job-specific technical abilities" },
                        { name: "Communication", description: "Verbal and written communication" },
                        { name: "Teamwork", description: "Collaboration and cooperation" },
                        { name: "Problem Solving", description: "Analytical and creative thinking" },
                        { name: "Leadership", description: "Influence and guidance" },
                    ],
                },
                {
                    name: "Goal Achievement",
                    description: "How well were quarterly goals met?",
                    votingType: "pick-one",
                    contestants: [
                        { name: "Exceeded Expectations", description: "Surpassed all goals" },
                        { name: "Met Expectations", description: "Achieved all goals" },
                        { name: "Partially Met", description: "Some goals achieved" },
                        { name: "Did Not Meet", description: "Goals not achieved" },
                    ],
                },
            ],
        },
    },
    // Course Registration
    {
        id: "online-course-registration",
        name: "Online Course Registration",
        description: "Register for online courses with course selection and schedule preferences",
        icon: "🎓",
        category: "education",
        theme: elegantPurpleTheme,
        template: {
            name: "Spring 2025 Course Registration",
            description: "Register for your courses this semester",
            categories: [
                {
                    name: "Course Selection",
                    description: "Select all courses you want to enroll in",
                    votingType: "multiple-choice",
                    contestants: [
                        { name: "Introduction to Web Development", description: "HTML, CSS, JavaScript basics" },
                        { name: "Advanced React", description: "Hooks, Context, Performance" },
                        { name: "Node.js Backend Development", description: "Server-side JavaScript" },
                        { name: "Database Design", description: "SQL and NoSQL databases" },
                        { name: "UI/UX Design Principles", description: "Design thinking and prototyping" },
                        { name: "DevOps Fundamentals", description: "Docker, Kubernetes, CI/CD" },
                    ],
                },
                {
                    name: "Preferred Schedule",
                    description: "When would you prefer to take classes?",
                    votingType: "pick-one",
                    contestants: [
                        { name: "Morning (9 AM - 12 PM)", description: "Early morning classes" },
                        { name: "Afternoon (1 PM - 4 PM)", description: "Afternoon classes" },
                        { name: "Evening (6 PM - 9 PM)", description: "Evening classes" },
                        { name: "Weekend", description: "Saturday/Sunday classes" },
                        { name: "Flexible", description: "Any time works" },
                    ],
                },
            ],
        },
    },
    // Restaurant Menu Selection
    {
        id: "restaurant-menu-selection",
        name: "Restaurant Menu Selection",
        description: "Catering menu selection with dietary options",
        icon: "🍽️",
        category: "hospitality-forms",
        theme: corporateGreenTheme,
        template: {
            name: "Catering Menu Selection",
            description: "Select items for your event catering",
            categories: [
                {
                    name: "Main Courses",
                    description: "Select up to 3 main courses",
                    votingType: "multiple-choice",
                    contestants: [
                        { name: "Grilled Salmon", description: "Fresh Atlantic salmon with herbs" },
                        { name: "Beef Tenderloin", description: "Prime cut with red wine sauce" },
                        { name: "Chicken Parmesan", description: "Breaded chicken with marinara" },
                        { name: "Vegetarian Risotto", description: "Creamy mushroom risotto" },
                        { name: "Pasta Primavera", description: "Fresh vegetables in white sauce" },
                    ],
                },
                {
                    name: "Side Dishes",
                    description: "Select all sides you'd like",
                    votingType: "multiple-choice",
                    contestants: [
                        { name: "Roasted Vegetables", description: "Seasonal vegetables" },
                        { name: "Mashed Potatoes", description: "Creamy mashed potatoes" },
                        { name: "Caesar Salad", description: "Classic Caesar with croutons" },
                        { name: "Garden Salad", description: "Mixed greens with vinaigrette" },
                        { name: "Garlic Bread", description: "Fresh baked with garlic butter" },
                    ],
                },
                {
                    name: "Dietary Requirements",
                    description: "Select any dietary restrictions",
                    votingType: "multiple-choice",
                    contestants: [
                        { name: "Vegetarian", description: "No meat" },
                        { name: "Vegan", description: "No animal products" },
                        { name: "Gluten-Free", description: "No gluten" },
                        { name: "Nut Allergy", description: "No nuts" },
                        { name: "Dairy-Free", description: "No dairy products" },
                    ],
                },
            ],
        },
    },
    // Vendor Selection
    {
        id: "vendor-selection-process",
        name: "Vendor Selection Process",
        description: "Rank vendors for a procurement decision",
        icon: "🏢",
        category: "business-forms",
        theme: professionalBlueTheme,
        template: {
            name: "IT Vendor Selection Q1 2025",
            description: "Help us select the best vendor for our IT needs",
            categories: [
                {
                    name: "Vendor Ranking",
                    description: "Rank vendors from best (1) to least preferred",
                    votingType: "rank",
                    contestants: [
                        { name: "TechCorp Solutions", description: "Enterprise software provider" },
                        { name: "CloudServices Inc", description: "Cloud infrastructure specialist" },
                        { name: "DataSystems Pro", description: "Data management solutions" },
                        { name: "SecureNet Technologies", description: "Security-focused provider" },
                        { name: "InnovateIT Group", description: "Innovative tech solutions" },
                    ],
                },
                {
                    name: "Evaluation Criteria",
                    description: "Rate each vendor on key criteria (1-5 scale)",
                    votingType: "rating",
                    contestants: [
                        { name: "Price Competitiveness", description: "Cost-effectiveness" },
                        { name: "Technical Capability", description: "Technical expertise" },
                        { name: "Support Quality", description: "Customer support level" },
                        { name: "Implementation Speed", description: "Time to deploy" },
                        { name: "Scalability", description: "Ability to scale" },
                    ],
                },
            ],
        },
    },
    // Patient Intake Form
    {
        id: "patient-intake-form",
        name: "Patient Intake Form",
        description: "Medical patient intake with symptoms and history",
        icon: "🏥",
        category: "health-care-forms",
        theme: corporateGreenTheme,
        template: {
            name: "New Patient Intake Form",
            description: "Help us understand your medical history and current concerns",
            categories: [
                {
                    name: "Primary Reason for Visit",
                    description: "What is the main reason for your visit today?",
                    votingType: "pick-one",
                    contestants: [
                        { name: "Annual Checkup", description: "Routine physical examination" },
                        { name: "Specific Symptom", description: "Experiencing specific symptoms" },
                        { name: "Follow-up", description: "Follow-up appointment" },
                        { name: "Medication Review", description: "Review current medications" },
                        { name: "Preventive Care", description: "Vaccinations, screenings" },
                    ],
                },
                {
                    name: "Current Symptoms",
                    description: "Select all symptoms you're currently experiencing",
                    votingType: "multiple-choice",
                    contestants: [
                        { name: "Fever", description: "Elevated body temperature" },
                        { name: "Headache", description: "Head pain or pressure" },
                        { name: "Fatigue", description: "Tiredness or weakness" },
                        { name: "Pain", description: "Any body pain" },
                        { name: "Nausea", description: "Feeling sick to stomach" },
                        { name: "Dizziness", description: "Feeling lightheaded" },
                    ],
                },
                {
                    name: "Pain Level",
                    description: "Rate your current pain level (0-10 scale)",
                    votingType: "rating",
                    contestants: [
                        { name: "Current Pain Level", description: "How would you rate your pain?" },
                    ],
                },
            ],
        },
    },
    // Team Building Activity Selection
    {
        id: "team-building-activity",
        name: "Team Building Activity Selection",
        description: "Vote on team building activities for company retreat",
        icon: "👥",
        category: "human-resources",
        theme: elegantPurpleTheme,
        template: {
            name: "Q1 Team Building Activities",
            description: "Help us plan fun team building activities",
            categories: [
                {
                    name: "Activity Preferences",
                    description: "Rank activities from most preferred (1) to least",
                    votingType: "rank",
                    contestants: [
                        { name: "Escape Room Challenge", description: "Team puzzle solving" },
                        { name: "Cooking Class", description: "Learn to cook together" },
                        { name: "Outdoor Adventure", description: "Hiking or outdoor sports" },
                        { name: "Volunteer Work", description: "Community service project" },
                        { name: "Game Tournament", description: "Board games or video games" },
                        { name: "Art Workshop", description: "Creative art session" },
                    ],
                },
                {
                    name: "Preferred Time",
                    description: "When would you prefer the activity?",
                    votingType: "pick-one",
                    contestants: [
                        { name: "Weekday Afternoon", description: "During work hours" },
                        { name: "Weekday Evening", description: "After work" },
                        { name: "Saturday", description: "Weekend morning/afternoon" },
                        { name: "Sunday", description: "Weekend day" },
                    ],
                },
            ],
        },
    },
    // Product Launch Feedback
    {
        id: "product-launch-feedback",
        name: "Product Launch Feedback",
        description: "Collect comprehensive feedback on a new product launch",
        icon: "🚀",
        category: "marketing",
        theme: professionalBlueTheme,
        template: {
            name: "Product Launch Feedback - Q1 2025",
            description: "Share your thoughts on our new product",
            categories: [
                {
                    name: "Product Feature Ratings",
                    description: "Rate each feature (1-5 stars)",
                    votingType: "rating",
                    contestants: [
                        { name: "User Interface", description: "Ease of use and design" },
                        { name: "Performance", description: "Speed and responsiveness" },
                        { name: "Features", description: "Usefulness of features" },
                        { name: "Value", description: "Value for money" },
                        { name: "Support", description: "Customer support quality" },
                    ],
                },
                {
                    name: "Purchase Likelihood",
                    description: "How likely are you to purchase?",
                    votingType: "pick-one",
                    contestants: [
                        { name: "Definitely Will Buy", description: "100% certain" },
                        { name: "Probably Will Buy", description: "75% likely" },
                        { name: "Might Buy", description: "50/50 chance" },
                        { name: "Probably Won't Buy", description: "25% likely" },
                        { name: "Definitely Won't Buy", description: "0% chance" },
                    ],
                },
                {
                    name: "Missing Features",
                    description: "What features are missing? (Select all that apply)",
                    votingType: "multiple-choice",
                    contestants: [
                        { name: "Mobile App", description: "Need mobile application" },
                        { name: "API Access", description: "Need API integration" },
                        { name: "More Integrations", description: "Connect with other tools" },
                        { name: "Better Analytics", description: "More detailed reports" },
                        { name: "Custom Branding", description: "White-label options" },
                    ],
                },
            ],
        },
    },
    // Employee Onboarding Survey
    {
        id: "employee-onboarding-survey",
        name: "Employee Onboarding Survey",
        description: "Collect feedback from new employees about their onboarding experience",
        icon: "📋",
        category: "human-resources",
        theme: corporateGreenTheme,
        template: {
            name: "New Employee Onboarding Feedback",
            description: "Help us improve the onboarding process",
            categories: [
                {
                    name: "Onboarding Experience Ratings",
                    description: "Rate different aspects of your onboarding (1-5 scale)",
                    votingType: "rating",
                    contestants: [
                        { name: "Orientation Session", description: "Initial orientation quality" },
                        { name: "Documentation", description: "Clarity of documentation" },
                        { name: "Training Materials", description: "Quality of training resources" },
                        { name: "Mentor Support", description: "Helpfulness of assigned mentor" },
                        { name: "IT Setup", description: "Ease of getting set up with tools" },
                    ],
                },
                {
                    name: "Areas for Improvement",
                    description: "What could we improve? (Select all that apply)",
                    votingType: "multiple-choice",
                    contestants: [
                        { name: "More Hands-on Training", description: "Need more practical exercises" },
                        { name: "Better Documentation", description: "Documentation needs improvement" },
                        { name: "Faster IT Setup", description: "IT setup took too long" },
                        { name: "More Team Introductions", description: "Want to meet more team members" },
                        { name: "Clearer Expectations", description: "Need clearer role expectations" },
                    ],
                },
            ],
        },
    },
    // Software Feature Request Voting
    {
        id: "software-feature-requests",
        name: "Software Feature Requests",
        description: "Let users vote on which features to prioritize in your software",
        icon: "💡",
        category: "business-forms",
        theme: elegantPurpleTheme,
        template: {
            name: "Feature Request Voting - Q2 2025",
            description: "Help us decide which features to build next",
            categories: [
                {
                    name: "Feature Priority Ranking",
                    description: "Rank features from highest priority (1) to lowest",
                    votingType: "rank",
                    contestants: [
                        { name: "Dark Mode Theme", description: "Dark theme for better night viewing" },
                        { name: "Mobile App (iOS/Android)", description: "Native mobile applications" },
                        { name: "Public API", description: "REST API for integrations" },
                        { name: "Advanced Search", description: "Enhanced search capabilities" },
                        { name: "Bulk Operations", description: "Perform actions on multiple items" },
                        { name: "Custom Workflows", description: "Create custom automation workflows" },
                        { name: "Export to Excel", description: "Export data to Excel format" },
                        { name: "Real-time Notifications", description: "Push notifications for updates" },
                    ],
                },
                {
                    name: "Feature Categories",
                    description: "Which category of features is most important?",
                    votingType: "pick-one",
                    contestants: [
                        { name: "User Experience", description: "UI/UX improvements" },
                        { name: "Performance", description: "Speed and optimization" },
                        { name: "Integrations", description: "Third-party integrations" },
                        { name: "Reporting", description: "Analytics and reporting" },
                        { name: "Security", description: "Security enhancements" },
                    ],
                },
            ],
        },
    },
    // Customer Support Ticket Priority
    {
        id: "support-ticket-priority",
        name: "Support Ticket Priority Assessment",
        description: "Help prioritize customer support tickets based on urgency and impact",
        icon: "🎧",
        category: "customer-service-forms",
        theme: professionalBlueTheme,
        template: {
            name: "Support Ticket Priority Assessment",
            description: "Evaluate and prioritize support tickets",
            categories: [
                {
                    name: "Urgency Level",
                    description: "How urgent is this issue?",
                    votingType: "pick-one",
                    contestants: [
                        { name: "Critical", description: "System down, blocking all users" },
                        { name: "High", description: "Major feature broken, affecting many users" },
                        { name: "Medium", description: "Minor issue, workaround available" },
                        { name: "Low", description: "Cosmetic issue, no impact on functionality" },
                    ],
                },
                {
                    name: "Impact Assessment",
                    description: "Rate the impact of this issue (1-5 scale)",
                    votingType: "rating",
                    contestants: [
                        { name: "User Impact", description: "How many users are affected?" },
                        { name: "Business Impact", description: "Impact on business operations" },
                        { name: "Revenue Impact", description: "Impact on revenue" },
                    ],
                },
            ],
        },
    },
    // Course Evaluation
    {
        id: "course-evaluation-form",
        name: "Course Evaluation Form",
        description: "Comprehensive course evaluation with instructor and content ratings",
        icon: "📚",
        category: "education",
        theme: corporateGreenTheme,
        template: {
            name: "Course Evaluation - Spring 2025",
            description: "Help us improve our courses by sharing your feedback",
            categories: [
                {
                    name: "Instructor Ratings",
                    description: "Rate the instructor on various aspects (1-5 scale)",
                    votingType: "rating",
                    contestants: [
                        { name: "Knowledge of Subject", description: "Instructor expertise" },
                        { name: "Clarity of Explanation", description: "How well concepts were explained" },
                        { name: "Engagement", description: "How engaging was the instructor?" },
                        { name: "Responsiveness", description: "How responsive to questions?" },
                        { name: "Organization", description: "How well organized was the course?" },
                    ],
                },
                {
                    name: "Course Content Rating",
                    description: "Rate the course content (1-5 scale)",
                    votingType: "rating",
                    contestants: [
                        { name: "Content Quality", description: "Quality of course materials" },
                        { name: "Relevance", description: "Relevance to your goals" },
                        { name: "Difficulty Level", description: "Appropriate difficulty" },
                        { name: "Practical Application", description: "Real-world applicability" },
                    ],
                },
                {
                    name: "Overall Course Rating",
                    description: "How would you rate this course overall?",
                    votingType: "pick-one",
                    contestants: [
                        { name: "Excellent (5/5)", description: "Outstanding course" },
                        { name: "Very Good (4/5)", description: "Great course with minor issues" },
                        { name: "Good (3/5)", description: "Decent course" },
                        { name: "Fair (2/5)", description: "Needs improvement" },
                        { name: "Poor (1/5)", description: "Significant issues" },
                    ],
                },
            ],
        },
    },
    // Vendor Evaluation
    {
        id: "vendor-evaluation",
        name: "Vendor Evaluation Form",
        description: "Comprehensive vendor evaluation for procurement decisions",
        icon: "🏢",
        category: "business-forms",
        theme: professionalBlueTheme,
        template: {
            name: "Vendor Evaluation - Q1 2025",
            description: "Evaluate potential vendors for our procurement process",
            categories: [
                {
                    name: "Vendor Comparison Ranking",
                    description: "Rank vendors from best (1) to least preferred",
                    votingType: "rank",
                    contestants: [
                        { name: "Vendor A - Enterprise Solutions", description: "Large enterprise provider" },
                        { name: "Vendor B - Startup Innovators", description: "Innovative startup" },
                        { name: "Vendor C - Established Player", description: "Well-established company" },
                        { name: "Vendor D - Boutique Specialist", description: "Specialized boutique firm" },
                    ],
                },
                {
                    name: "Evaluation Criteria Ratings",
                    description: "Rate each vendor on key criteria (1-5 scale)",
                    votingType: "rating",
                    contestants: [
                        { name: "Price Competitiveness", description: "Cost-effectiveness" },
                        { name: "Technical Capability", description: "Technical expertise" },
                        { name: "Support Quality", description: "Customer support" },
                        { name: "Implementation Speed", description: "Time to deploy" },
                        { name: "Scalability", description: "Ability to scale" },
                        { name: "Security", description: "Security standards" },
                    ],
                },
            ],
        },
    },
    // Event Venue Selection
    {
        id: "event-venue-selection",
        name: "Event Venue Selection",
        description: "Vote on venue options for company events",
        icon: "🏛️",
        category: "event-registration",
        theme: elegantPurpleTheme,
        template: {
            name: "Annual Company Retreat - Venue Selection",
            description: "Help us choose the perfect venue",
            categories: [
                {
                    name: "Venue Ranking",
                    description: "Rank venues from most preferred (1) to least",
                    votingType: "rank",
                    contestants: [
                        { name: "Mountain Resort", description: "Scenic mountain location" },
                        { name: "Beach Hotel", description: "Oceanfront property" },
                        { name: "City Conference Center", description: "Downtown location" },
                        { name: "Countryside Estate", description: "Rural retreat" },
                        { name: "Luxury Resort", description: "High-end resort" },
                    ],
                },
                {
                    name: "Venue Features",
                    description: "What features are most important? (Select all)",
                    votingType: "multiple-choice",
                    contestants: [
                        { name: "Swimming Pool", description: "Pool access" },
                        { name: "Spa Facilities", description: "Spa and wellness" },
                        { name: "Golf Course", description: "Golf access" },
                        { name: "Beach Access", description: "Beach nearby" },
                        { name: "Hiking Trails", description: "Outdoor activities" },
                        { name: "Fine Dining", description: "High-quality restaurants" },
                    ],
                },
            ],
        },
    },
];

