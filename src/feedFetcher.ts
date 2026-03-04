import { XMLParser } from "fast-xml-parser";
import type { RSSFeed, RSSItem } from "./types/rss";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => {
  return typeof value === "object" && value !== null;
};

const toRssItem = (value: unknown): RSSItem | null => {
  if (!isRecord(value)) {
    return null;
  }

  const title = value.title;
  const description = value.description;
  const link = value.link;
  const pubDate = value.pubDate;

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof link !== "string" ||
    typeof pubDate !== "string"
  ) {
    return null;
  }

  return {
    title,
    description,
    link,
    pubDate,
  };
};

const extractItems = (item: unknown): RSSItem[] => {
  if (Array.isArray(item)) {
    return item
      .map((value) => toRssItem(value))
      .filter((value): value is RSSItem => value !== null);
  }

  const parsedItem = toRssItem(item);
  return parsedItem ? [parsedItem] : [];
};

export const fetchRssFeed = async (feedUrl: string) => {
  try {
    const response = await fetch(feedUrl, {
      method: "GET",
      headers: {
        "User-Agent": "gator",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }
    const feedText = await response.text();
    const parser = new XMLParser();
    const feedData = parser.parse(feedText);
    const channelInfo = extractChannelInfo(feedData);
    return channelInfo;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching RSS feed: ${error.message}`);
      throw error;
    } else {
      console.error("Unknown error fetching RSS feed", error);
      throw error;
    }
  }
};

const extractChannelInfo = (feedData: unknown): RSSFeed => {
  if (!isRecord(feedData) || !isRecord(feedData.rss) || !isRecord(feedData.rss.channel)) {
    throw new Error("Invalid RSS feed format: missing channel element");
  }

  const channel = feedData.rss.channel;
  const title = channel.title;
  const link = channel.link;
  const description = channel.description;

  if (
    typeof title !== "string" ||
    typeof link !== "string" ||
    typeof description !== "string"
  ) {
    throw new Error("Invalid RSS feed format: invalid channel field types");
  }

  return {
    channel: {
      title,
      link,
      description,
      item: extractItems(channel.item),
    },
  };
};
