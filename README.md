# Youtube MP3 Downloader CLI
Downloads Youtube videos as .mp3 files.

## Features
- Download videos as MP3
- Download a queue of videos with the *bulk* option
- Progress Bar

## Usage
### Available commands:
- **Download**: download videos.
`node index.js download [url]`
	- Download a queue of videos:
	`download -q [url] [url] ...` or `download --queue [url] [url] ...`
	- Change the download directory for the current queue/video:
	`download ... --dir=[value] ...` 

- **Settings**:  settings the downloader uses.
`node index.js settings [option]=[value]`
	- Multiple options followed by values can be passed
	- Available options:
		- "--dir": Sets where the files will be saved

To view help:
`node index.js --help`
To view help for a specific command:
`node index.js <cmd> --help`

### Installation
On the directory of the application run:
`npm install`