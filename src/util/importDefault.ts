export const importDefault = async (path: string) => {
  return await (
    await import(path)
  ).default;
};
