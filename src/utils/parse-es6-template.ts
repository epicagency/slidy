import { IObject } from '../defs';

/**
 * Source: https://gist.github.com/smeijer/6580740a0ff468960a5257108af1384e
 */
function get(path: string, obj: IObject, fb = `$\{${path}}`): string {
  return (path
    .split('.')
    .reduce((res, key) => res[key] || fb, obj) as unknown) as string;
}

export function parseTpl(template: string, map: IObject, fallback?: string) {
  return template.replace(/\$\{.+?}/g, (match: string) => {
    const path = match.substr(2, match.length - 3).trim();

    return get(path, map, fallback);
  });
}
