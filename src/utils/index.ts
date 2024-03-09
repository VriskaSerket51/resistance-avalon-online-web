export function countFreq<T>(arr: T[]) {
  const mp = new Map<T, number>();

  arr.forEach((e) => {
    if (mp.has(e)) {
      mp.set(e, mp.get(e)! + 1);
    } else {
      mp.set(e, 1);
    }
  });

  return [...mp.entries()];
}
