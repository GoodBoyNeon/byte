const BASE_URL =
  'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001';

type BardPrompt = {
  text: string;
};

export const askBard = async (prompt: BardPrompt) => {
  const res = await fetch(
    `${BASE_URL}::generateText?key=${process.env.BARD_API_KEY}`,
    {
      body: JSON.stringify({
        prompt,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }
  );
  return await res.json();
};
