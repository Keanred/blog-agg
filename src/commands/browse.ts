import { getPostsForUser } from "../lib/db/queries/posts";
import type { UserCommandHandler } from "../types/commandTypes";

function exitWithError(message: string): never {
	console.log(message);
	process.exit(1);
}

const parseLimit = (rawLimit?: string): number | undefined => {
	if (!rawLimit) {
		return undefined;
	}

	const limit = Number.parseInt(rawLimit, 10);
	if (Number.isNaN(limit) || limit < 1) {
		exitWithError("Usage: browse [limit]");
	}

	return limit;
};

export const browseCommand: UserCommandHandler = async (
	cmdName,
	user,
	...args
) => {
	if (args.length > 1) {
		exitWithError("Usage: browse [limit]");
	}

	const limit = parseLimit(args[0]);
	const posts =
		limit === undefined
			? await getPostsForUser(user.id)
			: await getPostsForUser(user.id, limit);

	if (posts.length === 0) {
		console.log(`No posts found for ${user.name}`);
		return;
	}

	for (const post of posts) {
		console.log(`* ${post.title}`);
		console.log(`  Feed: ${post.feedName}`);
		console.log(`  URL: ${post.url}`);
	}
};
