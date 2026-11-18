---
license: cc-by-4.0
pretty_name: loved.music AI artists
language:
- en
size_categories:
- 1K<n<10K
tags:
- music
- ai-generated-music
- ai-detection
- spotify
- electronic-music
- tabular
configs:
- config_name: artists
  data_files: "ai-artists.csv"
  default: true
- config_name: full
  data_files: "ai-artists.json"
  field: "artists"
---

# loved.music AI artists

Spotify artist profiles that the [loved.music](https://loved.music) team (Vernon) reviewed by hand and assessed as
AI-generated projects.

**Browse the list on [loved.music/ai-artists](https://loved.music/ai-artists)** · Vernon, the crate-digging web app
for obscure electronic music: **[loved.music](https://loved.music)**

This is the team's assessment, not a ruling: we can be wrong, and an entry can be [contested](#contest-an-entry).

## Files

| Subset | File | Content |
|---|---|---|
| `artists` (default) | `ai-artists.csv` | one row per artist: `artist` (name), `id` (Spotify artist id) |
| `full` | `ai-artists.json` | the list as published on loved.music, with each artist's review date and tracks |

`ai-artists.csv` has the same `artist,id` format as [CennoxX's SpotifyAiArtists.csv](https://github.com/CennoxX/spotify-ai-blocker),
so blockers built on it can load this file as is.

Fields of each artist in `ai-artists.json` (`artists` array):

| Field | Meaning |
|---|---|
| `name` | the artist's name on Spotify |
| `spotify.artistId`, `spotify.artistUri`, `spotify.artistUrl` | the Spotify artist profile: the identifier of the entry |
| `verifiedAt` | when the team reviewed the artist (ISO 8601, UTC) |
| `tracks[]` | the artist's tracks in the Vernon catalog at review time |
| `tracks[].title`, `tracks[].isrc`, `tracks[].releaseDate` | title, ISRC and release date |
| `tracks[].popularity` | the track's popularity score at review time |
| `tracks[].artworkUrl` | the cover image |
| `tracks[].spotify` | `trackUri`, `trackUrl`, and `albumUri`, `albumUrl`, `albumName` (null when unknown) |

The file also carries `source`, `description`, `detection`, `contact`, `contestation` and `count`.

## A name is not an artist

Names are not unique on Spotify, and many AI projects take the name of a real artist. An entry is one Spotify artist
profile, identified by its Spotify artist id, never a name. Sharing a name with an entry does not mean you are
listed: only the profile with that exact id is. Match on the id.

## How artists get on the list

1. [Vernon](https://loved.music) digs new electronic music on Spotify. Candidate tracks are screened with the
   [SH Labs](https://shlabs.music) AI music detector.
2. A person reviews every flagged artist by hand before listing it. The detector alone never lists anyone, and its
   scores are not published.
3. Each artist is verified by hand, or released on a record label verified by hand as an AI-music farm.
4. Artists banned for other reasons (off-genre, etc.) are never listed.

## Updates

Synced daily from [loved.music/ai-artists.json](https://loved.music/ai-artists.json), through the GitHub mirror
[gounetmusic/loved-music-ai-artists](https://github.com/gounetmusic/loved-music-ai-artists), whose git history shows
every addition and removal with its date. Entries removed after a contest disappear here at the next sync.

## Limits

- An assessment by people, who can be wrong; detector scores are not part of the data.
- It only covers artists whose tracks reached Vernon's catalog, which is electronic music: it is not a census of AI
  music on Spotify.
- An artist's `tracks` are those Vernon had at review time, not their whole discography.

## Contest an entry

If you believe an entry is wrong, write to **contact@loved.music** or
[open an issue on GitHub](https://github.com/gounetmusic/loved-music-ai-artists/issues), with the Spotify artist id.
We review and remove mistakes promptly.

## License

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/): reuse the data freely, crediting "loved.music" with a link
to https://loved.music.
