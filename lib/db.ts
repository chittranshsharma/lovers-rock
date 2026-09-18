import { neon } from "@neondatabase/serverless";

export const getDb = () => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL is not defined");
  return neon(dbUrl);
};

export interface VisitRecord {
  visit_count: number;
  is_return: boolean;
  stars_built: number;
}

/**
 * GAP 6 — Correct UPSERT SQL with RETURNING clause.
 * Uses ON CONFLICT on the `slug` unique key.
 */
export async function logVisit(slug: string): Promise<VisitRecord> {
  try {
    const sql = getDb();
    const rows = await sql`
      INSERT INTO visits (slug, visit_count)
      VALUES (${slug}, 1)
      ON CONFLICT (slug)
      DO UPDATE SET
        visit_count = visits.visit_count + 1,
        last_visit = now()
      RETURNING
        visit_count,
        stars_built,
        (visits.visit_count > 1) AS is_return_visit
    `;
    const row = rows[0];
    return {
      visit_count: row.visit_count,
      is_return: Boolean(row.is_return_visit),
      stars_built: row.stars_built ?? 0,
    };
  } catch (error) {
    console.error("Error logging visit:", error);
    return { visit_count: 1, is_return: false, stars_built: 0 };
  }
}

export async function incrementStars(slug: string): Promise<void> {
  try {
    const sql = getDb();
    await sql`
      UPDATE visits SET stars_built = stars_built + 1 WHERE slug = ${slug}
    `;
  } catch (error) {
    console.error("Error incrementing stars:", error);
  }
}

export async function recordReply(slug: string, message: string): Promise<{ success: boolean; error?: string }> {
  try {
    const sql = getDb();
    // GAP 8 — sanitize and length-guard before DB write
    const sanitized = message.replace(/<[^>]*>/g, "").trim();
    if (sanitized.length < 2 || sanitized.length > 400) {
      return { success: false, error: "Message must be 2–400 characters" };
    }
    await sql`
      INSERT INTO replies (slug, message) VALUES (${slug}, ${sanitized})
    `;
    return { success: true };
  } catch (error) {
    console.error("Error saving reply:", error);
    return { success: false, error: String(error) };
  }
}
