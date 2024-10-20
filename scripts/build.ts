import { readdirSync } from 'fs';
import { resolve } from 'path';
import { build } from 'esbuild';

const entryPoints = (path = './src/functions'): string[] => {
  return readdirSync(resolve(path)).reduce((agg: string[], entry: string) => {
    if (entry.endsWith('.spec.ts')) return agg;
    if (entry.endsWith('.ts')) return [...agg, `${path}/${entry}`];

    return [...agg, ...entryPoints(`${path}/${entry}`)];
  }, []);
};

build({
  entryPoints: entryPoints(),
  entryNames: '[dir]/[name]/index',
  target: 'es2022',
  format: 'cjs',
  platform: 'node',
  tsconfig: 'tsconfig.json',
  outdir: 'dist',
  bundle: true,
  treeShaking: true,
  minify: false,
});
