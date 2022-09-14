const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const ProgressBar = require("progress");

class YtDownloader {
    static async _getVideoInfo(url) {
        const info = await ytdl.getInfo(url);
        const respDetails = info.videoDetails;
        const format = ytdl.chooseFormat(info.formats, { filter: "audioonly" });

        return {
            title: respDetails.title,
            channelName: respDetails.author.name,
            bytes: format.contentLength
        };
    }

    // static async downloadVideo(url, dir) {
    //         const videoInfo = await this._getVideoInfo(url);
    //         console.log(`Downloading ${chalk.green(videoInfo.title)} by ${chalk.green(videoInfo.channelName)}`);
    //         const fullDir = path.join(dir, `${videoInfo.title}.mp3`);
    //         ytdl(url, {filter: "audioonly" }).pipe(fs.createWriteStream( fullDir ));
    //         console.log("Download finished.\n");
    // }

    static async downloadVideo(url, dir) {
        const videoInfo = await this._getVideoInfo(url);        
        console.log(`Downloading ${chalk.green(videoInfo.title)} by ${chalk.green(videoInfo.channelName)}`);
        
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
            const fullDir = path.join(dir, `${videoInfo.title}.mp3`);
            fs.writeFileSync(fullDir, buffer, "binary");
            console.log("Download finished.\n");
        });
    }

    static async downloadBulk(urls, dir) {
        function sleep(ms) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        }

        for(let i = 0; i < urls.length; i++) {
            this.downloadVideo(urls[i], dir);
            await sleep(3000);
        };
    }
}

module.exports = YtDownloader;