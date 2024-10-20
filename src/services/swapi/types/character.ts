import { Starship } from './starship';

export type Character = {
  id: string;
  name: string;
  height: string;
  mass: string;
  gender: string;
  starships: Starship[];
};

export type CharacterResponse = {
  name: string;
  height: string;
  mass: string;
  gender: string;
  starships: string[];
};
