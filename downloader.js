const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

class YtDownloader {
    static async _getVideoInfo(url) {
        const info = await ytdl.getInfo(url);
        const respDetails = info.videoDetails;

        return {
            title: respDetails.title,
            channelName: respDetails.author.name
        };
    }

    static async downloadVideo(url, dir) {
            const videoInfo = await this._getVideoInfo(url);
            console.log(`Downloading ${chalk.green(videoInfo.title)} by ${chalk.green(videoInfo.channelName)}`);
            const fullDir = path.join(dir, `${videoInfo.title}.mp3`);
            ytdl(url, {filter: "audioonly" }).pipe(fs.createWriteStream( fullDir ));
            console.log("Download finished.\n");
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