# Youtube MP3 Downloader CLI
Downloads Youtube videos as .mp3 files.

## Features
- Download videos as MP3
- Download a queue of videos with the *queue* option
- Progress Bar

## Installation
1. Install all dependencies with `npm install`;
2. Build the typescript version with `npm run build`.

## Usage
### Available commands:
- **Download**: download videos.
`node build/index.js download [url]`
  - Download a queue of videos:
  `download -q [url] [url] ...` or `download --queue [url] [url] ...`

  - Change the download directory for the current queue/video:
  `download ... --dir=[value] ...` 

- **Settings**:  settings the downloader uses if not specified when calling the command.
`node build/index.js settings [option]=[value]`
  - Multiple options followed by values can be passed
  - Available options:
    - "--dir" ("-d"): Sets where the files will be saved
    - "--log" ("-l"): Sets wether the downloader should generate logs after downloading audio.
  - Show Settings: `node build/index.js settings show`

To view help:
`node build/index.js --help`

To view help for a specific command:
`node build/index.js <cmd> --help`