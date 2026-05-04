export const indexByID = <T extends { id: string }>(items: T[]): Record<string, T | undefined> => {
  return Object.fromEntries(items.map((item) => [item.id, item] as const));
};
