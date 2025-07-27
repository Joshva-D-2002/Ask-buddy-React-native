import { InferenceClient } from '@huggingface/inference';

const client = new InferenceClient("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");

export const sendChatCompletion = async (messages: { role: string; content: string }[]) => {
  try {
    const res = await client.chatCompletion({
      provider: 'nebius',
      model: 'deepseek-ai/DeepSeek-V3-0324',
      messages
    });
    const aiText = res.choices?.[0]?.message?.content || 'No response';
    return aiText;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

