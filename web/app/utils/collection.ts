export const indexByID = <T extends { id: string }>(items: T[]) => {
  return Object.fromEntries(items.map((item) => [item.id, item] as const));
};
