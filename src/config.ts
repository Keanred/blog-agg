import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path'

type Config = {
  dbUrl: string;
  currentUserName: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const validateConfig = (config: Config) => {
  if (!config.dbUrl) {
    throw new Error('Database URL is required in the configuration.');
  }
  if (!config.currentUserName) {
    throw new Error('Current username is required in the configuration.');
  }
};

export const setUser = (config: Config) => {
  const configPath = path.join(__dirname, '../.gatorconfig.json');
  validateConfig(config);
  fs.writeFileSync(configPath, JSON.stringify(config));
};

export const readConfig = (): Config => {
  const configPath = path.join(__dirname, '../.gatorconfig.json');
  if (!fs.existsSync(configPath)) {
    throw new Error('Config file not found. Please run "gator config" to set up your configuration.');
  }
  const configData = fs.readFileSync(configPath, 'utf-8');
  validateConfig(JSON.parse(configData));
  return JSON.parse(configData);
}
