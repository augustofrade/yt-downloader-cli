
# Youtube Downloader CLI
Downloads Youtube videos either as music or video files

## Features
- Download videos as music (.mp3)
- Download videos (.mp4)
- Download a queue of videos with the `--queue` option flag
- Download Progress Bar
- Save downloaded files anywhere
- Generate logs (or don't) to keep track of downloaded files, with file and channel names and download size

## Installation
### Requirements
- Git
- [Node.js](https://nodejs.org) version **20.18.1 or higher**
- NPM

### Steps
Just run:
```bash
git clone https://github.com/augustofrade/yt-downloader-cli.git
cd yt-downloader-cli
npm run create
```

Or if you prefer to run each step of the installation separately:

```bash
git clone https://github.com/augustofrade/yt-downloader-cli.git
cd yt-downloader-cli
npm install
npm run build
npm i -g
```

Check if the CLI program was successfully installed:
```bash
ytdl help
```

## Run in Development Mode

You can run the CLI directly in development mode without compiling the TypeScript files manually.

### Option 1: Run with Typescript (no build required)
```bash
npm run ts -- <command> [options]
```

Example:
```bash
npm run ts -- config --dir /home/user/Downloads
```

### Options 2: Run transpiled JavaScript
If you prefer to compile Typescript to JavaScript manually:
```
npx tsc
node build/index.js <command> ...
```

Example:
```bash
npx tsc
node build/index -- config --dir /home/user/Downloads
```


## Usage

### Command Name
The CLI program name is `ytdl` .
Use: `ytdl <command>`


### Example
Example usage with input and output
```bash
$ ytdl download <url>


*Generating logs for downloaded files

Downloading <Video Name> by <Channel Name>
  Progress: [====================] XXXX/mbps 100% 1.4s
Finished downloading 9.23 MB.
```

### Available Commands
1. **Download**
	- **Command:** `ytdl download [url]`
	- **Description:** Downloads a video from the provided URL.
	- **Download a queue of videos:**
		- Downloads multiple videos in a queue by providing multiple URLs.
		- Use `--queue` or `-q`.
		- `ytdl download --queue [url1] [url2] ...`
	- **Change download directory:**
		- Sets the directory where files will be saved for **this session**.
		- Use `--dir` or `-d`.
		- `ytdl download [url] --dir [directory]`
	- **Select the download type**
		- Selects the download type. Accepted values are:
			- `audio` (default)
			- `video`
		- Use `--type` or `-t`
		- `ytdl download [url] --type [audio|video]`
2. **Configuration**
	- **Command:** `ytdl configs [option]=[value]`
	- **Description:** Sets configuration values for the downloader. If a configuration is not specified during the command call, the value set here (in the config file) will be used.
	- **Available options:**
		- `--dir` or `-d`: Sets the directory where files will be saved. The program will create it during the next startup if it does not exist.
		- `--log` or `-l`: Enable or disable logging after downloading.
	- **Example:**
		- `ytdl configs --dir /home/user/Music --log false`
	- **Show current configurations:**
		- `ytdl configs show`
3. **Help**
	- **Show general CLI help:**
		- `ytdl help`
	- **Show help for a specific command:**
		- `ytdl <command> --help`

## Storage

Data is stored under the *data/* directory in the root of the project. The default contents of this folder are:
- **configs.json**: file containing the configurations of the CLI application, such as **download directory**, **logging** and **default file format**.
- **logs.txt**: file containing logs with information about the downloaded files. Content won't be appended if the `--log` flag is passed when downloading or if the "generateLogs" option in **configs.json** is set to `false`.
- **downloads/**: directory containing all the downloaded content.


