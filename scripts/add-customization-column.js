import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL || process.env.DIRECT_URL);

async function addCustomizationColumn() {
    try {
        console.log("Adding customization column to contest table...");

        // Check if column already exists
        const result = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'contest' AND column_name = 'customization'
    `;

        if (result.length > 0) {
            console.log("Column 'customization' already exists. Skipping...");
            process.exit(0);
        }

        // Add the column
        await sql`ALTER TABLE "contest" ADD COLUMN "customization" jsonb;`;

        console.log("✓ Successfully added 'customization' column to contest table");
        process.exit(0);
    } catch (error) {
        console.error("Error adding column:", error);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

addCustomizationColumn();

