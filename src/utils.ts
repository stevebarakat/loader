export function extractFileName(filename: string) {
  const pattern = /\/?([^/]+)\.\w+$/;
  const matches = filename.match(pattern);
  return matches ? matches[1] : "";
}

export function capitalizeFirstLetter(string: string) {
  return string[0].toUpperCase() + string.slice(1);
}
