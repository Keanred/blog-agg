import type { CommandHandler } from "../types/command";
import { fetchRssFeed } from "../feedFetcher";

export const aggHandler: CommandHandler = async (cmdName, ...args) => {
  const result = await fetchRssFeed("https://www.wagslane.dev/index.xml");
  console.log(JSON.stringify(result));
};

