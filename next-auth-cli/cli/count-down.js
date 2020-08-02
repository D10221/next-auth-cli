/**
 * @param {number} to
 * @param {number} wait
 */
export default async function* countDown(to, wait) {
  for (let i = 0; i < to; i++) {
    await new Promise((resolve) => setTimeout(resolve, wait));
    yield to - i;
  }
}
