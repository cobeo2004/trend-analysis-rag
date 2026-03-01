import "server-only";
import { checkAndInitStep } from "./00-check-status";
import { parseCSVStep } from "./01-parse-csv";
import { generateEmbeddingsStep } from "./02-generate-embeddings";
import { markCompletedStep } from "./03-mark-completed";

export const processTrendsWorkflow = async () => {
  "use workflow";

  // Step 0: Check if already processed, initialize if not
  const { alreadyCompleted } = await checkAndInitStep();
  if (alreadyCompleted) {
    return { status: "already_completed" };
  }

  // Step 1: Parse CSV and insert data
  const { totalRows } = await parseCSVStep();

  // Step 2: Generate embeddings in batches
  let batchIndex = 0;
  let done = false;
  while (!done) {
    const result = await generateEmbeddingsStep(batchIndex);
    done = result.done;
    batchIndex++;
  }

  // Step 3: Mark as completed
  await markCompletedStep(totalRows);

  return { status: "completed", totalRows };
};
