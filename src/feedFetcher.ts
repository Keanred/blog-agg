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
    return feedText;
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
