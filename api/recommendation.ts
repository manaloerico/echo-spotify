import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env['OPENAI_API_KEY']! });

export const config = { runtime: 'edge' };

export default async function handler(req: any) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
    });
  }

  try {
    const body = await req.json();
    const { songs } = body;

    if (!songs || songs.length === 0) {
      return new Response(JSON.stringify({ error: 'No songs provided' }), {
        status: 400,
      });
    }

    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a music recommendation assistant.',
        },
        {
          role: 'user',
          content: `Suggest a playlist based on these songs: ${songs.join(
            ', '
          )}. Return JSON.`,
        },
      ],
    });

    const suggestionsText = aiResponse.choices[0].message.content;
    const suggestions = JSON.parse(suggestionsText);

    return new Response(JSON.stringify({ suggestions }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate playlist' }),
      { status: 500 }
    );
  }
}
