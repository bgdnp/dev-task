export interface CacheStrategy {
  save<T>(key: string, data: T): Promise<void>;

  load<T>(key: string, ttl?: number): Promise<T | null>;
}
