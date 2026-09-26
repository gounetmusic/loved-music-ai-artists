# loved.music AI artists

Spotify artists that the [loved.music](https://loved.music) team (Vernon) reviewed by hand and identified as AI-generated projects, aka AI slop.

**<!-- count -->80<!-- /count --> artists**, identified by Spotify artist id. Updated daily from [loved.music/ai-artists.json](https://loved.music/ai-artists.json).

## Files

| File | Format | Raw URL |
|---|---|---|
| `ai-artists.csv` | `artist,id` (Spotify artist id), same format as [CennoxX's SpotifyAiArtists.csv](https://github.com/CennoxX/spotify-ai-blocker) | https://raw.githubusercontent.com/gounetmusic/loved-music-ai-artists/main/ai-artists.csv |
| `ai-artists.json` | the full list as published by loved.music: Spotify links, review date, the artist's tracks at review time (title, ISRC, album) | https://raw.githubusercontent.com/gounetmusic/loved-music-ai-artists/main/ai-artists.json |

Blockers built on CennoxX's CSV can load `ai-artists.csv` as is. Names are not identifiers: match on the Spotify artist id.

## How artists get on the list

1. [Vernon](https://loved.music) digs new electronic music on Spotify. Candidate tracks are screened with the [SH Labs](https://shlabs.music) AI music detector.
2. A person reviews every flagged artist by hand before listing it. The detector alone never lists anyone, and its scores are not published.
3. Artists banned for other reasons (off-genre, etc.) are never listed.

The git history shows every addition and removal, with its date.

## Contest an entry

If you believe an entry is wrong, write to **contact@loved.music** or [open an issue](https://github.com/gounetmusic/loved-music-ai-artists/issues). We review and remove mistakes promptly; removals reach this repo on the next daily sync.

## License

The data is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/): reuse it freely, crediting "loved.music" with a link to https://loved.music. The sync script is MIT. See [LICENSE](LICENSE).

Please do not open pull requests that edit the list files: they are overwritten by the daily sync. Suggest an artist or a correction by issue or email instead.
