const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const ProgressBar = require("progress");
var sanitize = require("sanitize-filename");

const { formatBytes } = require("./utils");
const { SettingsManager } = require("./SettingsManager");

class YtDownloader {
    static shouldGenerateLogs = false;

    static async _getVideoInfo(url) {
        if(!ytdl.validateURL(url)) return { error: "Invalid URL passed"};
        const info = await ytdl.getInfo(url);
        const respDetails = info.videoDetails;
        const format = ytdl.chooseFormat(info.formats, { filter: "audioonly" });

        return {
            title: respDetails.title,
            channelName: respDetails.author.name,
            bytes: format.contentLength
        };
    }

    static async downloadAudio(url, dir) {
        const videoInfo = await this._getVideoInfo(url);        
        if(videoInfo.error) {
            return console.log(chalk.bgRed(videoInfo.error));
        }
        
        await this._execDownload(videoInfo, { dir, url, format: "mp3" });
    }

    static _execDownload(videoInfo, downloadOptions) {
        const { dir, url, format } = downloadOptions;

        return new Promise(resolve => {
            console.log(`Downloading ${chalk.green(videoInfo.title)} by ${chalk.green(videoInfo.channelName)})`);
            
            const bufferBytes = [];
            const req = ytdl(url, {filter: "audioonly" });
            var bar = new ProgressBar('   Progress: [:bar] :rate/mbps :percent :etas', {
                complete: '=',
                incomplete: ' ',
                width: 20,
                total: parseInt(videoInfo.bytes)
            });
            
            req.on("data", (data) => {
                bufferBytes.push(data);
                bar.tick(data.length)
            });
            req.on("end", () => {
                const buffer = Buffer.concat(bufferBytes);
                const fullDir = path.join(dir, `${sanitize(videoInfo.title)}.${format}`);
                fs.writeFileSync(fullDir, buffer, "binary");
                console.log(`Finished downloading ${formatBytes(videoInfo.bytes)}.\n`);
                
                if(this.shouldGenerateLogs)
                    SettingsManager.generateLog(videoInfo);
                
                resolve();
            });
        })
    }

    static async downloadQueue(urls, dir) {

        for(let i = 0; i < urls.length; i++) {
            await this.downloadAudio(urls[i], dir);
        };
    }
}

module.exports = YtDownloader;