const SRCBIN_URL = 'https://sourceb.in';
const SRCBIN_API_ROUTE = `${SRCBIN_URL}/api/bins`;

export const srcbinify = async (content: string, name?: string) => {
  const res = await fetch(SRCBIN_API_ROUTE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: [
        {
          name,
          content,
          languageId: 222,
        },
      ],
    }),
  });
  return `${SRCBIN_URL}/${(await res.json()).key}`;
};
