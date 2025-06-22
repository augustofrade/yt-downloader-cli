import { FileFormat } from "./types";

export interface ErrorMessage {
  error: string;
}

export function isErrorMessage(i: any): i is ErrorMessage {
  return (i as ErrorMessage).error != undefined;
}

export interface VideoInfo {
  title: string;
  channelName: string;
  bytes: string;
}

export interface DownloadOptions {
  dir: string;
  url: string;
  format: FileFormat;
}

export interface DownloadFlags {
  dir: string;
  url: string;
  queue: string[];
}
