import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

import ffmpegPath from 'ffmpeg-static';
import QRCode from 'qrcode';

import { execSync } from 'child_process';

const inputPath = path.join(process.cwd(), 'videos');
const outputPath = path.join(process.cwd(), 'src/__generated');

type Video = {
  hash: string;
  videoName: string;
  inputPath: string;
  outputPath: string;
};

export function getVideos(): Video[] {
  const videos = fs.readdirSync(inputPath)
    .filter((videoName) => videoName.endsWith('.mp4'))
    .map((videoName) => ({
      hash: crypto
        .createHash('md5')
        .update(videoName)
        .digest('hex'),

      videoName,
      inputPath,
      outputPath,
    }));

  return videos;
}

type CompressVideoProps = {
  video: Video;
};

export async function compressVideo(props: CompressVideoProps) {
  const { video } = props;

  const videoInput = path.join(video.inputPath, video.videoName);
  const videoOutput = path.join(video.outputPath, `${video.hash}.mp4`);
  
  if (fs.existsSync(videoOutput))
    return;

  const command = [
    ffmpegPath,
    
    '-n',
    `-i '${videoInput}'`,
    '-vcodec', 'libx264',
    '-s', '600x600',
    '-crf', '25',
    '-an',

    `'${videoOutput}'`,
  ];

  try {
    console.log('Compressing video:', video.videoName);

    execSync(command.join(' '), {
      stdio: ['pipe', 'pipe', 'ignore'],
    });

    console.log('Compressed video:', videoOutput);
  } catch (error) {
    console.error('Failed to compress video:', video.videoName);
    console.error(error);
  }
}

type GenerateQRCodeProps = {
  video: Video;
};

export async function generateQRCode(props: GenerateQRCodeProps) {
  const { video } = props;

  const qrPath = path.join(video.outputPath, `${video.hash}.png`);
  const qrText = video.hash;

  if (fs.existsSync(qrPath))
    return;

  await QRCode.toFile(qrPath, qrText, {
    errorCorrectionLevel: 'high',
    width: 1024,
    margin: 4,
  });
}