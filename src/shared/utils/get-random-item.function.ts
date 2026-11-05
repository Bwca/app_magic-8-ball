export function getRandomItem<T>(items: Readonly<T[]>): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}
