import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { CacheStrategy } from './strategy.interface';

export class S3Strategy implements CacheStrategy {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client();
  }

  async save<T>(key: string, data: T) {
    const command = new PutObjectCommand({
      Bucket: process.env.CACHE_BUCKET_NAME,
      Key: key,
      Body: Buffer.from(JSON.stringify(data)),
    });

    await this.s3.send(command);
  }

  async load<T>(key: string, ttl?: number): Promise<T | null> {
    const command = new GetObjectCommand({
      Bucket: process.env.CACHE_BUCKET_NAME,
      Key: key,
    });

    try {
      const data = await this.s3.send(command);

      if (ttl) {
        const modifiedTime = data.LastModified?.getTime() ?? 0;
        const expireTime = modifiedTime + ttl * 1000;

        if (expireTime < Date.now()) {
          return null;
        }
      }

      if (!data.Body) {
        return null;
      }

      const json = await data.Body.transformToString();

      return JSON.parse(json);
    } catch (err: any) {
      if (err?.name === 'NoSuchKey') {
        return null;
      }

      throw err;
    }
  }
}
