import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contest } from "@/db/schema";
import { getServerSession } from "@/lib/auth/get-session";
import { eq } from "drizzle-orm";
import { z } from "zod";

const customizationSchema = z.object({
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    backgroundImage: z.string().url().optional().or(z.literal("")),
    backgroundOverlay: z.string().optional(), // RGBA string
    textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    fontFamily: z.string().optional(),
    borderRadius: z.string().optional(),
    buttonStyle: z.enum(["rounded", "square", "pill"]).optional(),
    headerImage: z.string().url().optional().or(z.literal("")),
    logo: z.string().url().optional().or(z.literal("")),
    customCSS: z.string().max(5000).optional(),
});

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const customization = customizationSchema.parse(body);

        // Verify contest ownership
        const foundContest = await db.query.contest.findFirst({
            where: (contests, { eq }) => eq(contests.id, id),
        });

        if (!foundContest) {
            return NextResponse.json(
                { error: "Contest not found" },
                { status: 404 }
            );
        }

        if (foundContest.userId !== session.user.id) {
            return NextResponse.json(
                { error: "Unauthorized - Not contest owner" },
                { status: 403 }
            );
        }

        // Update customization (merge with existing)
        const existingCustomization = foundContest.customization || {};
        const updatedCustomization = {
            ...existingCustomization,
            ...customization,
        };

        await db
            .update(contest)
            .set({
                customization: updatedCustomization,
                updatedAt: new Date(),
            })
            .where(eq(contest.id, id));

        return NextResponse.json({
            success: true,
            customization: updatedCustomization,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Error updating customization:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession();

        const foundContest = await db.query.contest.findFirst({
            where: (contests, { eq }) => eq(contests.id, id),
        });

        if (!foundContest) {
            return NextResponse.json(
                { error: "Contest not found" },
                { status: 404 }
            );
        }

        // Only owner can view customization settings
        if (session?.user?.id !== foundContest.userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        return NextResponse.json({
            customization: foundContest.customization || {},
        });
    } catch (error) {
        console.error("Error fetching customization:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

