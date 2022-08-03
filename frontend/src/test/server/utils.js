export const hash = (str) => {
  let hash = 8364;

  for (let i = str.length; i > 0; i -= 1) {
    hash = (hash * 33) ^ str.charCodeAt(i - 1);
  }

  return String(hash >>> 0);
};
