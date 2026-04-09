import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const query = 'A friend I met at instagram';

async function test() {
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

  console.log(JSON.stringify(JSON.parse(response.choices[0].message.content), null, 2));
}

test();
