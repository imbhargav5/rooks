import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import {
  CATEGORIES,
  ENTRYPOINTS,
  generateHook,
  printGenerationResult,
} from "./generator.mjs";

const prompt = input.isTTY ? createInterface({ input, output }) : undefined;
let pipedAnswers;
if (!input.isTTY) {
  let pipedInput = "";
  for await (const chunk of input) pipedInput += chunk;
  pipedAnswers = pipedInput.split(/\r?\n/);
}

async function ask(question) {
  if (prompt) return prompt.question(question);
  output.write(question);
  return pipedAnswers?.shift() ?? "";
}

try {
  const name = (await ask("Hook name (for example, useIdle): ")).trim();
  const description = (await ask("Description: ")).trim();
  const entrypoint = (
    await ask(`Entrypoint (${ENTRYPOINTS.join(", ")}): `)
  ).trim();
  const suggestedCategory =
    entrypoint === "rooks/experimental"
      ? "experimental"
      : entrypoint === "rooks/temporal"
        ? "temporal"
        : "state";
  const category =
    (
      await ask(`Category (${CATEGORIES.join(", ")}) [${suggestedCategory}]: `)
    ).trim() || suggestedCategory;

  const result = generateHook({ name, description, category, entrypoint });
  printGenerationResult(result);
} catch (error) {
  console.error(`\nHook generation failed:\n${error.message}`);
  process.exitCode = 1;
} finally {
  prompt?.close();
}
