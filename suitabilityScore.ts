function countVowels(str: string): number {
  const matches = str.match(/[aeiou]/gi);
  return matches ? matches.length : 0;
}

function countConsonants(str: string): number {
  const matches = str.match(/[bcdfghjklmnpqrstvwxyz]/gi);
  return matches ? matches.length : 0;
}

function getCommonFactor(a: number, b: number): number {
  return b === 0 ? a : getCommonFactor(b, a % b);
}

export function calculateSS(d: string, s: string): number {
  let base: number = 0;

  base = s.length % 2 == 0 ? countVowels(d) * 1.5 : countConsonants(d);
  return getCommonFactor(s.length, d.length) > 1 ? base * 1.5 : base;
}
