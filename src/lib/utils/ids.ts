import { nanoid } from "nanoid";

export function generateId(prefix?: string): string {
    const id = nanoid(12);
    return prefix ? `${prefix}_${id}` : id;
}

export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove special characters
        .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

