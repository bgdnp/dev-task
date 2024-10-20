import { CONFIG } from '@common/config';

export class ImageService {
  async getImage(characterId: string) {
    const url = `${CONFIG.imageSource}/${characterId}`;

    return await fetch(url)
      .then((response) => response.arrayBuffer())
      .then((buffer) => Buffer.from(buffer).toString('base64'));
  }
}
