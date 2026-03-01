import { libsqlClient } from "./db";

export async function setupVectorTable() {
  await libsqlClient.execute(
    "ALTER TABLE TrendEntry ADD COLUMN embedding F32_BLOB(1536)",
  );
}

export async function setupVectorIndex() {
  await libsqlClient.execute(
    "CREATE INDEX IF NOT EXISTS trends_vector_idx ON TrendEntry(libsql_vector_idx(embedding))",
  );
}

export async function ensureVectorSupport() {
  try {
    // Check if embedding column exists
    const result = await libsqlClient.execute(
      "SELECT sql FROM sqlite_master WHERE type='table' AND name='TrendEntry'",
    );
    const sql = result.rows[0]?.sql as string | undefined;

    if (sql && !sql.includes("embedding")) {
      await setupVectorTable();
    }

    await setupVectorIndex();
  } catch (error) {
    // Vector index may already exist or libsql may not support vectors in local mode
    console.warn("Vector setup warning:", error);
  }
}
