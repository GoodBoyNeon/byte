const BASE_URL = 'https://chatgpt.vulcanlabs.co';
const VERSION = 'v1';

type GPTCompletionResponseChoice = {
  text: string;
  index: number;
  logprobs: object | null;
  finish_reason: string;
};

export type GPTCompletionResponse = {
  id: string;
  object: 'text_completion';
  created: number;
  model: string;
  choices: GPTCompletionResponseChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export const askGPT = async (prompt: string) => {
  const res = await fetch(`${BASE_URL}/api/${VERSION}/completions`, {
    body: JSON.stringify({
      prompt,
      max_tokens: 50,
      temperature: 0,
      model: 'text-davinci-003',
    }),
    headers: {
      Authorization: `Bearer ${process.env.GPT_API_KEY}`,
      'User-Agent': 'Chat GPT Android 1.6.0 65 Android SDK: 33 (13)',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
  const resJson = (await res.json()) as GPTCompletionResponse;
  return resJson;
};
