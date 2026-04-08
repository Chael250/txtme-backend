import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface SearchFilters {
  name?: string;
  company?: string;
  role?: string;
  time_context?: string;
  location?: string;
}

export const parseQuery = async (query: string): Promise<SearchFilters> => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Extract structured search filters from user queries for a contact management app.
Return ONLY a JSON object with the following fields:
- name: (string) person's name or part of it
- company: (string) company name
- role: (string) job title or role
- time_context: (string) e.g., "last week", "yesterday", "long ago"
- location: (string) address, city, or specific meeting point

If a field is not found, omit it from the JSON.`,
      },
      {
        role: 'user',
        content: query,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  if (!content) return {};
  
  return JSON.parse(content) as SearchFilters;
};
