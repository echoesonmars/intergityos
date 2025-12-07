import { NextResponse } from 'next/server';

// Указываем, что route динамический
export const dynamic = 'force-dynamic';

// POST /api/ai/chat - Чат с AI ассистентом
export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    // Проверяем наличие API ключа
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          message: 'OpenAI API ключ не настроен. Пожалуйста, добавьте OPENAI_API_KEY в .env.local файл.',
        },
        { status: 200 }
      );
    }

    // Подключаем реальный GPT API
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Используем более доступную модель
          messages: [
            {
              role: 'system',
              content: 'Ты IntegrityAI - AI ассистент платформы IntegrityOS для контроля магистральных трубопроводов в Казахстане. Помогай пользователям с анализом данных, объясняй методы диагностики (VIK, PVK, MPK, UZK, RGK), находи объекты и отвечай на вопросы о платформе. Отвечай на русском языке, будь дружелюбным и профессиональным.',
            },
            ...messages.map((msg: { role: string; content: string }) => ({
              role: msg.role,
              content: msg.content,
            })),
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return NextResponse.json({ 
          message: data.choices[0].message.content 
        });
      } else {
        throw new Error('Invalid response from OpenAI API');
      }
    } catch (apiError) {
      console.error('OpenAI API request failed:', apiError);
      // Fallback на mock ответ при ошибке API
      return NextResponse.json(
        {
          message: 'Не удалось подключиться к OpenAI API. Проверьте API ключ и подключение к интернету.',
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error in AI chat:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

