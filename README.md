# Youtube MP3 Downloader CLI
Downloads Youtube videos as .mp3 files.

## Features
- Download videos as MP3
- Download a queue of videos with the *queue* option
- Progress Bar
- Save downloaded files anywhere
- Generate logs (or don't) to keep track of downloaded files, with file name, channel name and download sizes

## Installation
```
git clone https://github.com/augustofrade/yt-downloader-cli.git
cd yt-downloader-cli
npm run create
```

Or you can run each step of the installation separately:

```
git clone https://github.com/augustofrade/yt-downloader-cli.git
cd yt-downloader-cli
npm install
npm run build
npm i -g
```

## Usage
### Command name
The command name is `ytdl`.

### Available commands:
- **Download**: download videos.
`ytdl download [url]`
  - Download a queue of videos:
  `download -q [url] [url] ...` or `download --queue [url] [url] ...`

  - Change the download directory for the current queue/video:
  `download ... --dir=[value] ...` 
  
  - Change the download type:
  `download ... --type=[value] ...`. Accepted values: **audio**|**video**. Default value: audio.

- **Configurations**: Configuration values the downloader uses if not specified when calling the command.
`ytdl configs [option]=[value]`
  - Multiple options followed by values can be passed
  - Available options:
    - "--dir" ("-d"): Sets where the files will be saved.
    - "--log" ("-l"): Sets wether the downloader should generate logs after downloading audio.
  - Show Configurations: `ytdl configs show`

To view help:
`ytdl --help`

To view help for a specific command:
`ytdl <cmd> --help`
