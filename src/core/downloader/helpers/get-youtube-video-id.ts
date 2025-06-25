import { Result } from "../../../types/result";

export function getYoutubeVideoId(url: string): Result<string> {
  let urlObj: URL;
  try {
    urlObj = new URL(url);
  } catch {
    return Result.Failure<string>(`Invalid YouTube video URL: ${url}`);
  }

  let videoId: string | null = null;
  const pathname = urlObj.pathname.substring(1);

  if (
    (urlObj.hostname === "youtube.com" || urlObj.hostname === "music.youtube.com") &&
    pathname === "watch"
  ) {
    videoId = urlObj.searchParams.get("v");
  } else if (urlObj.hostname === "youtu.be") {
    videoId = pathname !== "" ? pathname : null;
  }

  if (videoId) {
    return Result.Success<string>(videoId);
  }

  return Result.Failure<string>(`Invalid YouTube video URL: ${url}`);
}
