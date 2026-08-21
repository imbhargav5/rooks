import {
  generateHook,
  printGenerationResult,
  validateHookOptions,
} from "./generator.mjs";

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help" || argument === "-h") {
      result.help = true;
      continue;
    }
    if (!argument.startsWith("--"))
      throw new Error(`Unexpected argument: ${argument}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--"))
      throw new Error(`Missing value for ${argument}`);
    result[argument.slice(2)] = value;
    index += 1;
  }
  return result;
}

function usage() {
  console.log(`Usage:
  pnpm create:cli --name useIdle --description "Detects idle state." --category browser --entrypoint rooks

Required flags:
  --name         camelCase public hook name beginning with use
  --description  one-sentence hook description
  --category     documentation category
  --entrypoint   rooks, rooks/experimental, or rooks/temporal`);
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    usage();
    process.exit(0);
  }
  const errors = validateHookOptions(options);
  if (errors.length > 0) {
    usage();
    throw new Error(errors.join("\n"));
  }
  const result = generateHook(options);
  printGenerationResult(result);
} catch (error) {
  console.error(`\nHook generation failed:\n${error.message}`);
  process.exit(1);
}
