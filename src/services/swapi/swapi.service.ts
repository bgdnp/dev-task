import { Cache } from '@app/cache';
import { CONFIG } from '@common/config';
import { Character, CharacterResponse } from './types/character';
import { Starship } from './types/starship';
import { ImageService } from '@services/image';

type SwapiResponse = {
  next: string | null;
  results: CharacterResponse[];
};

export class SwapiService {
  @Cache({
    strategy: process.env.NODE_ENV === 'cloud' ? 's3' : 'file',
    key: 'search-result',
    ttl: 900 /* seconds */,
  })
  async searchPeople(keyword?: string): Promise<Character[]> {
    const url = `${CONFIG.dataSource}/people?search=${keyword ?? ''}`;
    const characters = await this.fetchPeople(url);

    return await this.transformResponse(characters);
  }

  private async fetchPeople(url: string): Promise<CharacterResponse[]> {
    const { next, results }: SwapiResponse = await fetch(url).then((response) => response.json());

    if (next) {
      return results.concat(await this.fetchPeople(next));
    }

    return results;
  }

  private async transformResponse(characters: CharacterResponse[]): Promise<Character[]> {
    const imageService = new ImageService();

    const promises = characters.map(async (item) => {
      const { name, height, mass, gender } = item;
      const id = (item as any).url.split('/').at(-2) as string;
      const starships = await this.getStarships(item.starships);
      const image = await imageService.getImage(id);

      return {
        id,
        name,
        height,
        mass,
        gender,
        starships,
        image,
      };
    });

    return await Promise.all(promises);
  }

  private async getStarships(urls: string[]): Promise<Starship[]> {
    return await Promise.all(
      urls.map(async (url) => {
        const data = await fetch(url).then((response) => response.json());

        const { name, model, manufacturer, starship_class } = data;

        return { name, model, manufacturer, starship_class };
      }),
    );
  }
}
