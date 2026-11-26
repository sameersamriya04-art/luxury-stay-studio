// Removes the previous build's bundle folder so old hashed files don't pile up.
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
const bundle = fileURLToPath(new URL("../../bundle", import.meta.url));
rmSync(bundle, { recursive: true, force: true });
console.log("cleaned", bundle);
