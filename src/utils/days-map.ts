import { getVideos } from './asset-generator';
import { compressVideo } from './asset-generator';
import { generateQRCode } from './asset-generator';

export type Days = {
  [hash: string]: true;
};

export async function getDays() {
  const days: Days = {};
  const videos = getVideos();

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];

    await compressVideo({ video });
    await generateQRCode({ video });

    days[video.hash] = true;
  }

  return days;
}
