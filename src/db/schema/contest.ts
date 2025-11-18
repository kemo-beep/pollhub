import { boolean, pgTable, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth/user";

export const contest = pgTable("contest", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    slug: text("slug").notNull().unique(),

    // Settings
    isPublic: boolean("is_public").notNull().default(true),
    passcode: text("passcode"), // For private polls
    emailDomainRestriction: text("email_domain_restriction"), // e.g., "@company.com"

    // Voting restrictions
    oneVotePerDevice: boolean("one_vote_per_device").notNull().default(true),
    oneVotePerEmail: boolean("one_vote_per_email").notNull().default(false),
    oneVotePerAccount: boolean("one_vote_per_account").notNull().default(false),

    // Timing
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date").notNull(),

    // Results visibility
    showLiveResults: boolean("show_live_results").notNull().default(false),
    showResultsAfterEnd: boolean("show_results_after_end").notNull().default(true),

    // Customization
    customization: jsonb("customization").$type<{
        primaryColor?: string;
        secondaryColor?: string;
        backgroundColor?: string;
        backgroundImage?: string;
        backgroundOverlay?: string; // rgba color for overlay
        textColor?: string;
        accentColor?: string;
        fontFamily?: string;
        borderRadius?: string;
        buttonStyle?: "rounded" | "square" | "pill";
        headerImage?: string;
        logo?: string;
        customCSS?: string;
    }>(),

    // Metadata
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
});

export const category = pgTable("category", {
    id: text("id").primaryKey(),
    contestId: text("contest_id")
        .notNull()
        .references(() => contest.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    votingType: text("voting_type").notNull().default("rank"), // rank, pick-one, multiple-choice, rating, head-to-head
    maxRankings: integer("max_rankings"), // For rank type: limit number of ranked picks
    maxSelections: integer("max_selections"), // For multiple-choice: max selections allowed
    ratingScale: integer("rating_scale").default(5), // For rating type: 1-5, 1-10, etc.
    allowWriteIns: boolean("allow_write_ins").notNull().default(false),
    randomizeOrder: boolean("randomize_order").notNull().default(true),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contestant = pgTable("contestant", {
    id: text("id").primaryKey(),
    categoryId: text("category_id")
        .notNull()
        .references(() => category.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    avatar: text("avatar"), // URL to image
    bio: text("bio"), // Bio/Description (longer than description)
    socialLinks: jsonb("social_links").$type<{
        twitter?: string; // X/Twitter
        youtube?: string;
        facebook?: string;
        instagram?: string;
        website?: string;
        [key: string]: string | undefined;
    }>(),
    isWriteIn: boolean("is_write_in").notNull().default(false),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vote = pgTable("vote", {
    id: text("id").primaryKey(),
    contestId: text("contest_id")
        .notNull()
        .references(() => contest.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
        .notNull()
        .references(() => category.id, { onDelete: "cascade" }),

    // Voter identification
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    email: text("email"),
    deviceId: text("device_id"), // For device-based restrictions
    ipAddress: text("ip_address"),

    // Vote data: Flexible JSON structure based on voting type
    // For rank: { rankings: [id1, id2, id3, ...] }
    // For pick-one: { selection: "id" }
    // For multiple-choice: { selections: ["id1", "id2", ...] }
    // For rating: { ratings: { "id1": 5, "id2": 3, ... } }
    // For head-to-head: { comparisons: [{ winner: "id1", loser: "id2" }, ...] }
    voteData: jsonb("vote_data").$type<{
        rankings?: string[];
        selection?: string;
        selections?: string[];
        ratings?: Record<string, number>;
        comparisons?: Array<{ winner: string; loser: string }>;
    }>(),

    // Legacy field for backward compatibility (will be migrated to voteData)
    rankings: jsonb("rankings").$type<string[]>(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Contest = typeof contest.$inferSelect;
export type Category = typeof category.$inferSelect;
export type Contestant = typeof contestant.$inferSelect;
export type Vote = typeof vote.$inferSelect;

// Relations
export const contestRelations = relations(contest, ({ one, many }) => ({
    user: one(user, {
        fields: [contest.userId],
        references: [user.id],
    }),
    categories: many(category),
    votes: many(vote),
}));

export const categoryRelations = relations(category, ({ one, many }) => ({
    contest: one(contest, {
        fields: [category.contestId],
        references: [contest.id],
    }),
    contestants: many(contestant),
    votes: many(vote),
}));

export const contestantRelations = relations(contestant, ({ one }) => ({
    category: one(category, {
        fields: [contestant.categoryId],
        references: [category.id],
    }),
}));

export const voteRelations = relations(vote, ({ one }) => ({
    contest: one(contest, {
        fields: [vote.contestId],
        references: [contest.id],
    }),
    category: one(category, {
        fields: [vote.categoryId],
        references: [category.id],
    }),
    user: one(user, {
        fields: [vote.userId],
        references: [user.id],
    }),
}));

export type ContestWithRelations = Contest & {
    categories: (Category & {
        contestants: Contestant[];
    })[];
};

