// Mirrors https://loved.music/ai-artists.json into this repo:
//   ai-artists.json  the list as published, minus its per-request `generatedAt`
//   ai-artists.csv   `artist,id` rows, the format of CennoxX's SpotifyAiArtists.csv
// and refreshes the artist count in README.md. Plain Node 22, no dependencies.
// Exits non-zero (and writes nothing) when the list looks broken.

import { existsSync, readFileSync, writeFileSync } from "node:fs";

const SOURCE = process.env.SOURCE_URL || "https://loved.music/ai-artists.json";
const JSON_FILE = "ai-artists.json";
const CSV_FILE = "ai-artists.csv";
const README = "README.md";
/** A drop larger than this share of the list (and than MAX_DROP_COUNT artists) is a broken source, not a review decision. */
const MAX_DROP = 0.2;
const MAX_DROP_COUNT = 5;

const SPOTIFY_ID = /^[0-9A-Za-z]{22}$/;

function fail(message) {
  console.error(`sync: ${message}`);
  process.exit(1);
}

/** RFC 4180 quoting; names only, ids never need it. */
const csvField = (s) => (/[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);

const res = await fetch(SOURCE, { signal: AbortSignal.timeout(30_000) });
if (!res.ok) fail(`${SOURCE} answered HTTP ${res.status}`);
const list = await res.json();

if (!Array.isArray(list.artists)) fail("no `artists` array");
if (list.count !== list.artists.length) fail(`count ${list.count} ≠ ${list.artists.length} artists`);
for (const a of list.artists) {
  if (!SPOTIFY_ID.test(a?.spotify?.artistId ?? "")) fail(`bad Spotify artist id: ${JSON.stringify(a?.spotify)}`);
  if (typeof a.name !== "string" || !a.name.trim()) fail(`no name for ${a.spotify.artistId}`);
}

if (existsSync(JSON_FILE)) {
  const before = JSON.parse(readFileSync(JSON_FILE, "utf8")).artists.length;
  const dropped = before - list.artists.length;
  if (dropped > MAX_DROP_COUNT && dropped > before * MAX_DROP) {
    fail(`list shrank from ${before} to ${list.artists.length}; refusing (fix the source or update by hand)`);
  }
}

// Stable order, so each commit's diff shows only real additions and removals.
const artists = [...list.artists].sort(
  (a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }) || a.spotify.artistId.localeCompare(b.spotify.artistId)
);
const { generatedAt: _generatedAt, ...rest } = list;
writeFileSync(JSON_FILE, JSON.stringify({ ...rest, artists }, null, 2) + "\n");

const rows = artists.map((a) => `${csvField(a.name.trim())},${a.spotify.artistId}`);
writeFileSync(CSV_FILE, ["artist,id", ...rows].join("\n") + "\n");

const readme = readFileSync(README, "utf8");
const counted = readme.replace(
  /<!-- count -->.*?<!-- \/count -->/s,
  `<!-- count -->${artists.length}<!-- /count -->`
);
if (counted !== readme) writeFileSync(README, counted);

console.log(`sync: ${artists.length} artists`);
