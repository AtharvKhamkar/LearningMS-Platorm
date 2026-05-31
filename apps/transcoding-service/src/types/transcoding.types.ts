// apps/transcoding-service/src/types/transcoding.types.ts

import { ApiResponse } from "@app/common";

export interface ISqlFnResult<T> extends ApiResponse<T> { }

export interface S3EventRecord {
  eventName: string;
  s3: {
    bucket: { name: string };
    object: { key: string; size: number };
  };
}

export interface SqsS3Message {
  Records: S3EventRecord[];
}

export interface TranscodeJobRecord {
  jobId:        string;
  contentId:    string;
  lectureId:    string;
  courseId:     string;
  instructorId: string;
  status:       string;
  retryCount:   number;
  maxRetries:   number;
  resolutions:  string[];
  outputPath:   string;
}

export interface RenditionResult {
  resolution: string;
  storageKey: string;
  bandwidth:  number;
  width:      number;
  height:     number;
  fileSize:   number;
}

export interface TranscodeCompletedEvent {
  jobId:           string;
  lectureId:       string;
  courseId:        string;
  instructorId:    string;
  hlsMasterKey:    string;
  thumbnailKey:    string;
  durationSeconds: number;
  renditions:      RenditionResult[];
}

export interface RenditionResult {
  resolution: string;
  storageKey: string;
  bandwidth:  number;
  width:      number;
  height:     number;
  fileSize:   number;
}

export interface S3UploadResult {
  hlsMasterKey: string;
  thumbnailKey: string;
  renditions:   RenditionResult[];
}

export interface RenditionConfig {
  resolution:   string;
  width:        number;
  height:       number;
  videoBitrate: string;
  maxBitrate:   string;
  bufsize:      string;
  audioBitrate: string;
  bandwidth:    number;
}

export interface FfmpegOutput {
  durationSeconds: number;
  renditionDirs:   Array<{ resolution: string; dir: string }>;
  masterPlaylist:  string;
  thumbnailPath:   string;
}

export const RENDITION_CONFIGS: RenditionConfig[] = [
  {
    resolution:   '1080p',
    width:        1920,
    height:       1080,
    videoBitrate: '5000k',
    maxBitrate:   '5350k',
    bufsize:      '7500k',
    audioBitrate: '192k',
    bandwidth:    5192000,
  },
  {
    resolution:   '720p',
    width:        1280,
    height:       720,
    videoBitrate: '2500k',
    maxBitrate:   '2675k',
    bufsize:      '3750k',
    audioBitrate: '128k',
    bandwidth:    2628000,
  },
  {
    resolution:   '480p',
    width:        854,
    height:       480,
    videoBitrate: '1000k',
    maxBitrate:   '1070k',
    bufsize:      '1500k',
    audioBitrate: '128k',
    bandwidth:    1128000,
  },
  {
    resolution:   '360p',
    width:        640,
    height:       360,
    videoBitrate: '500k',
    maxBitrate:   '535k',
    bufsize:      '750k',
    audioBitrate: '96k',
    bandwidth:    596000,
  },
];

export type FnGetJobByStorageKey = ISqlFnResult<TranscodeJobRecord>;




