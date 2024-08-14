/**
 * sleeps the given number of seconds
 * @example
 * await sleep(1)
 * @param {number} n
 * @returns async sleep
 */
export async function sleep(n: number): Promise<void> {
  return new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, n * 1000);
  });
}
