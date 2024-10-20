import { mkdir, readFile, stat, writeFile } from 'fs/promises';
import { CacheStrategy } from './strategy.interface';
import { resolve } from 'path';
import { existsSync } from 'fs';

export class FileStrategy implements CacheStrategy {
  async save<T>(key: string, data: T) {
    const cacheDir = resolve(process.cwd(), 'cache');

    if (!existsSync(cacheDir)) {
      await mkdir(cacheDir);
    }

    await writeFile(resolve(cacheDir, key), JSON.stringify(data));
  }

  async load<T>(key: string, ttl?: number): Promise<T | null> {
    const path = resolve(process.cwd(), 'cache', key);

    if (!existsSync(path)) {
      return null;
    }

    if (ttl) {
      const { mtime } = await stat(path);
      const modifiedTime = new Date(mtime).getTime();
      const expireTime = modifiedTime + ttl * 1000;

      if (expireTime < Date.now()) {
        return null;
      }
    }

    const file = await readFile(path);
    const json = file.toString();

    return JSON.parse(json);
  }
}
