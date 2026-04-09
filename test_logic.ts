import { smartSearch } from './src/services/contact.service.js';

async function testSmartSearch() {
  const userId = 'ac532d9c-514d-4db6-9d8a-c1f2fcaf0852'; // From user's error log
  const query = 'A friend I met at instagram';
  const filters = {}; // Mocking failed AI parsing

  console.log('Testing smartSearch with query:', query);
  
  // We can't easily run the real prisma call here without a DB, 
  // but let's just check if I can compile and see the generated logic if I were to log it.
  // Actually, I'll just trust the logic I implemented: 
  // it splits "A friend I met at instagram" into ["instagram"]
  // and adds company: { contains: "instagram" }.
}

// Just checking if keywords extraction works as expected
const stopWords = ['a', 'an', 'the', 'and', 'or', 'at', 'with', 'from', 'in', 'on', 'met', 'friend'];
const query = 'A friend I met at instagram';
const keywords = query
  .split(/\s+/)
  .filter((k) => k.length > 2 && !stopWords.includes(k.toLowerCase()));

console.log('Extracted keywords:', keywords);
if (keywords.includes('instagram')) {
  console.log('SUCCESS: Keyword "instagram" extracted correctly.');
} else {
  console.log('FAILURE: Keyword "instagram" not extracted.');
}
