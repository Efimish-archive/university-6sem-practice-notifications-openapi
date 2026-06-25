import fs from "fs/promises";
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";

const response = await fetch("http://localhost:3000/json");
const json = await response.json();
const markdown = await createMarkdownFromOpenApi(json);
await fs.writeFile("docs/openapi.md", markdown)
