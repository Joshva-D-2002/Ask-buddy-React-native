import axios from 'axios';

const HF_API_TOKEN = '';

export const sendChatCompletion = async (messages: { role: string; content: string }[]) => {
  try {
    const response = await axios.post(
      'https://router.huggingface.co/v1/chat/completions',
      {
        model: 'deepseek-ai/DeepSeek-V3-0324:nebius', 
        messages,
        stream: false
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiText = response.data.choices?.[0]?.message?.content || 'No response';
    return aiText;
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};
