import { NextResponse } from 'next/server';

// Указываем, что route динамический
export const dynamic = 'force-dynamic';

// POST /api/ai/chat - Чат с AI ассистентом
export async function POST(request: Request) {
  try {
    const { messages: _messages } = await request.json();
    // messages будет использоваться при подключении реального API
    void _messages;

    // TODO: Подключить реальный GPT API
    // Пример:
    // const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     model: 'gpt-4',
    //     messages: [
    //       {
    //         role: 'system',
    //         content: 'Ты IntegrityAI - AI ассистент платформы IntegrityOS для контроля магистральных трубопроводов. Помогай пользователям с анализом данных, объясняй методы диагностики, находи объекты и отвечай на вопросы о платформе.',
    //       },
    //       ...messages,
    //     ],
    //   }),
    // });
    // const data = await response.json();
    // return NextResponse.json({ message: data.choices[0].message.content });

    // Временный mock ответ
    return NextResponse.json(
      {
        message: 'AI API еще не подключен. Пожалуйста, добавьте OPENAI_API_KEY в .env файл и раскомментируйте код в route.ts',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in AI chat:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

