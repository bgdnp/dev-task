import { CacheService } from './cache.service';

type CacheProps = {
  strategy: 's3' | 'file';
  key: string;
  ttl?: number;
};

export function Cache(props: CacheProps) {
  const cache = new CacheService(props.strategy, props.ttl);

  return function <TMethod extends Function>(target: TMethod) {
    return async function (this: any, ...args: any[]) {
      const key = args[0] ? props.key + '-' + args[0] : props.key;
      let data = await cache.load(key);

      if (!data) {
        data = await target.call(this, ...args);
        await cache.save(key, data);
      }

      return data;
    } as unknown as TMethod;
  };
}
