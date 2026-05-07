export const indexByID = <T extends { id: string }>(items: T[]): Record<string, T | undefined> => {
  return items.reduce<Record<string, T | undefined>>((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
};
