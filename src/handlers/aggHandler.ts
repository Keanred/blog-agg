import type { CommandHandler } from "../types/command";
import { fetchRssFeed } from "../feedFetcher";

// Add an agg command. Later this will be our long-running aggregator service.
// For now, we'll just use it to fetch a single feed and ensure our parsing works.
// It should fetch the feed found at https://www.wagslane.dev/index.xml and print the entire object to the console.

export const aggHandler: CommandHandler = async (cmdName, ...args) => {
  const result = await fetchRssFeed("https://www.wagslane.dev/index.xml");
  console.log(JSON.stringify(result));
};
