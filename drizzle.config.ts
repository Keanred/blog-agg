import { defineConfig } from "drizzle-kit";
import * as fs from "fs";
import * as path from "path";

const configPath = path.join(__dirname, ".gatorconfig.json");
if (!fs.existsSync(configPath)) {
  throw new Error("Config file not found. Please run 'gator config' to set up your configuration.");
}
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

export default defineConfig({
  schema: "src/lib/db/schema.ts",
  out: "src/lib/db",
  dialect: "postgresql",
  dbCredentials: {
    url: config.dbUrl,
  },
});
