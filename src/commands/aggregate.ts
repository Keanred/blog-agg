import type { CommandHandler } from "../types/commandTypes";
import { fetchRssFeed } from "../feedFetcher";
import { markFeedFetched, getNextFeedToFetch } from "../lib/db/queries/feeds";
import { createPost } from "../lib/db/queries/posts";
import type { RSSFeed } from "../types/rss";

export const formatDateIntl = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) throw new Error(`Invalid date: ${dateStr}`);
  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return `${dateFormatter.format(date)} ${timeFormatter.format(date)}`;
};

export const scrapeFeeds = async () => {
  const feed = await getNextFeedToFetch();
  if (!feed) {
    console.log("No feeds to fetch");
    return;
  }
  await markFeedFetched(feed.id);
  const result: RSSFeed = await fetchRssFeed(feed.url);

  for (const item of result.channel.item) {
    const formattedDate = formatDateIntl(item.pubDate) ?? new Date();
    await createPost(
      feed.id,
      item.title,
      item.link,
      item.description,
      new Date(formattedDate),
    );
  }
};

const parseDuration = (durationStr: string): number => {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  if (!match) {
    throw new Error(
      "Invalid duration format. Use formats like '10s', '5m', '1h', or '500ms'.",
    );
  }
  const value = parseInt(match[1]!, 10);
  const unit = match[2]!;
  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      throw new Error("Unsupported time unit. Use 'ms', 's', 'm', or 'h'.");
  }
};

export const aggregateCommand: CommandHandler = async (cmdName, ...args) => {
  const [timeBetweenReqs] = args;
  if (!timeBetweenReqs || typeof timeBetweenReqs !== "string") {
    console.error("Usage: agg time_between_reqs");
    return;
  }
  console.log(`Collecting feeds every ${timeBetweenReqs}`);
  const durationMs = parseDuration(timeBetweenReqs);
  scrapeFeeds().catch((error) => {
    console.error("Error scraping feeds:", error);
  });
  const interval = setInterval(() => {
    scrapeFeeds().catch((error) => {
      console.error("Error scraping feeds:", error);
    });
  }, durationMs);
  await new Promise((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve(null);
    });
  });
};
