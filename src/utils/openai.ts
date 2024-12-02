import { ChatCompletionMessageParam } from 'openai/resources/chat';

// Prix par token en euros (approximatif)
const PRICING = {
  'gpt-4-turbo-preview': {
    input: 0.00001, // €0.01/1K tokens
    output: 0.00003  // €0.03/1K tokens
  },
  'gpt-4': {
    input: 0.00003,  // €0.03/1K tokens
    output: 0.00006  // €0.06/1K tokens
  },
  'gpt-3.5-turbo': {
    input: 0.000001, // €0.001/1K tokens
    output: 0.000002 // €0.002/1K tokens
  }
};

export interface CostEstimate {
  totalCost: number;
  inputTokens: number;
  outputTokens: number;
  model: string;
}

export const estimateCost = (
  model: string,
  messages: ChatCompletionMessageParam[],
  outputLength: number
): CostEstimate => {
  // Estimation approximative des tokens (4 caractères = ~1 token)
  const inputTokens = messages.reduce((acc, msg) => 
    acc + (msg.content?.length || 0) / 4, 0);
  const outputTokens = outputLength / 4;

  const pricing = PRICING[model as keyof typeof PRICING];
  const inputCost = inputTokens * pricing.input;
  const outputCost = outputTokens * pricing.output;

  return {
    totalCost: inputCost + outputCost,
    inputTokens: Math.ceil(inputTokens),
    outputTokens: Math.ceil(outputTokens),
    model
  };
};