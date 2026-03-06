# blog-agg

`blog-agg` is a TypeScript CLI for tracking RSS feeds in PostgreSQL. It lets you register users, add and follow feeds, fetch new posts on an interval, and browse posts from the feeds a user follows.

## What it does

- Stores users, feeds, follow relationships, and posts in PostgreSQL.
- Fetches RSS feeds with `fast-xml-parser`.
- Uses Drizzle ORM for schema management and queries.
- Runs as a CLI through `tsx`.

## Tech stack

- TypeScript
- Node.js
- PostgreSQL
- Drizzle ORM and Drizzle Kit
- `tsx` for local execution

## Prerequisites

- Node.js 20+
- npm
- A running PostgreSQL instance

## Installation

```bash
npm install
```

## Configuration

Create a `.gatorconfig.json` file in the project root.

Example:

```json
{
  "dbUrl": "postgres://username:password@localhost:5432/blog_agg",
  "currentUserName": "exampleUser"
}
```

Notes:

- `dbUrl` is required for all database access and for Drizzle migrations.
- `currentUserName` is also validated when the app reads config. In practice, that means the file needs both keys present before running commands.
- After you run `register` or `login`, the CLI rewrites `currentUserName` automatically.

## Database setup

Generate migrations if needed:

```bash
npm run generate
```

Apply migrations:

```bash
npm run migrate
```

The schema creates four tables:

- `users`
- `feeds`
- `feed_follows`
- `posts`

## Running the CLI

The app is executed through the `start` script:

```bash
npm start -- <command> [args]
```

Examples in this README use that form.

## Commands

### `register <username>`

Creates a user and sets that user as the active account in `.gatorconfig.json`.

```bash
npm start -- register alice
```

### `login <username>`

Switches the active account to an existing user.

```bash
npm start -- login alice
```

### `users`

Lists all users. The active user is marked as `(current)`.

```bash
npm start -- users
```

### `addfeed <name> <url>`

Creates a feed owned by the active user and automatically follows it.

```bash
npm start -- addfeed "Hacker News" "https://hnrss.org/frontpage"
```

### `feeds`

Lists all feeds in the database.

```bash
npm start -- feeds
```

### `follow <url>`

Follows an existing feed for the active user.

```bash
npm start -- follow "https://hnrss.org/frontpage"
```

### `following`

Lists feeds followed by the active user.

```bash
npm start -- following
```

### `unfollow <url>`

Stops following a feed for the active user.

```bash
npm start -- unfollow "https://hnrss.org/frontpage"
```

### `agg <duration>`

Starts the feed aggregator loop. It fetches one feed at a time, choosing the feed with the oldest `last_fetched_at`, and keeps running until interrupted.

Supported duration suffixes:

- `ms`
- `s`
- `m`
- `h`

Examples:

```bash
npm start -- agg 30s
npm start -- agg 5m
```

Stop the process with `Ctrl+C`.

### `browse [limit]`

Shows posts from feeds followed by the active user, ordered by newest `published_at` first.

If no limit is provided, the default is `2`.

```bash
npm start -- browse
npm start -- browse 10
```

### `reset`

Deletes users from the database.

```bash
npm start -- reset
```

Use this carefully. The rest of the data model is linked to users through foreign keys.

## Development notes

- Entry point: `src/main.ts`
- Commands live in `src/commands/`
- Database schema lives in `src/lib/db/schema.ts`
- Query helpers live in `src/lib/db/queries/`

## Scripts

```bash
npm start
npm test
npm run generate
npm run migrate
npm run reset
```

## Current behavior worth knowing

- `browse` only prints post title, feed name, and URL.
- `agg` is a long-running process and does not exit on its own.
- Duplicate posts are skipped by checking for an existing `(feedId, url)` pair before insertion.