'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function IntegrityAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Привет! Я IntegrityAI — ваш помощник в работе с платформой IntegrityOS. Чем могу помочь?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Вызов API (будет работать после подключения GPT API)
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.message) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Fallback на mock ответ, если API не подключен
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: getMockResponse(userMessage.content),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error calling AI API:', error);
      // Fallback на mock ответ при ошибке
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getMockResponse(userMessage.content),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getMockResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('привет') || lowerInput.includes('здравствуй')) {
      return 'Здравствуйте! Я IntegrityAI. Могу помочь с анализом данных, объяснить методы диагностики, найти объекты или ответить на вопросы о платформе.';
    }
    
    if (lowerInput.includes('критичность') || lowerInput.includes('риск')) {
      return 'Критичность объекта определяется на основе данных диагностики:\n\n• **Норма** (зеленый) - объект в хорошем состоянии\n• **Средняя** (желтый) - требуется внимание, возможны дефекты\n• **Высокая** (красный) - критическое состояние, требуется немедленное вмешательство\n\nХотите узнать больше о конкретном объекте?';
    }
    
    if (lowerInput.includes('метод') || lowerInput.includes('vik') || lowerInput.includes('pvk')) {
      return 'Методы контроля в IntegrityOS:\n\n• **VIK** - Визуально-измерительный контроль\n• **PVK** - Пневматический контроль\n• **MPK** - Магнитопорошковый контроль\n• **UZK** - Ультразвуковой контроль\n• **RGK** - Радиографический контроль\n\nКаждый метод имеет свои особенности применения. О каком методе хотите узнать подробнее?';
    }
    
    if (lowerInput.includes('объект') || lowerInput.includes('найти')) {
      return 'Я могу помочь найти объекты по различным критериям:\n\n• По названию\n• По магистрали (MT-01, MT-02, MT-03)\n• По критичности\n• По методу диагностики\n\nЧто именно вас интересует?';
    }
    
    if (lowerInput.includes('помощь') || lowerInput.includes('помоги')) {
      return 'Я могу помочь с:\n\n✅ Анализом данных объектов\n✅ Объяснением методов диагностики\n✅ Поиском объектов и информации\n✅ Интерпретацией параметров\n✅ Генерацией отчетов\n\nПросто задайте вопрос, и я постараюсь помочь!';
    }
    
    return 'Спасибо за вопрос! В будущем я смогу давать более детальные ответы, когда будет подключен AI API. Пока что могу помочь с базовыми вопросами о платформе IntegrityOS.';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickSuggestions = [
    'Что означает критичность?',
    'Объясни метод VIK',
    'Найди объекты на MT-02',
    'Как работает AI-анализ?',
  ];

  return (
    <>
      {/* Floating Button - всегда видимая плавающая кнопка */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 10000,
          pointerEvents: 'none',
        }}
      >
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer shadow-xl"
          style={{
            background: 'linear-gradient(135deg, var(--color-dark-blue) 0%, var(--color-blue) 100%)',
            boxShadow: '0 8px 32px rgba(33, 52, 72, 0.4)',
            pointerEvents: 'auto',
          }}
        >
          {isOpen ? (
            <X className="h-7 w-7 text-white" />
          ) : (
            <MessageCircle className="h-7 w-7 text-white" />
          )}
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] rounded-xl border shadow-2xl flex flex-col overflow-hidden"
            style={{
              borderColor: 'var(--color-light-blue)',
              background: 'var(--color-white)',
              boxShadow: '0 20px 60px rgba(33, 52, 72, 0.3)',
              zIndex: 10001,
              position: 'fixed',
              pointerEvents: 'auto',
            }}
          >
            {/* Header */}
            <div
              className="p-4 border-b flex items-center justify-between"
              style={{
                borderColor: 'var(--color-light-blue)',
                background: 'linear-gradient(135deg, var(--color-dark-blue) 0%, var(--color-blue) 100%)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white" style={{ fontFamily: 'var(--font-jost)' }}>
                    IntegrityAI
                  </div>
                  <div className="text-xs text-white/80" style={{ fontFamily: 'var(--font-geist)' }}>
                    AI ассистент
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: 'var(--color-cream)' }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'var(--color-blue)' }}
                    >
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'rounded-br-sm'
                        : 'rounded-bl-sm'
                    }`}
                    style={{
                      background: message.role === 'user' ? 'var(--color-dark-blue)' : 'var(--color-white)',
                      color: message.role === 'user' ? 'var(--color-white)' : 'var(--color-dark-blue)',
                      fontFamily: 'var(--font-geist)',
                      boxShadow: '0 2px 8px rgba(33, 52, 72, 0.1)',
                    }}
                  >
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
                    <div
                      className="text-xs mt-1.5 opacity-60"
                      style={{ fontFamily: 'var(--font-geist)' }}
                    >
                      {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'var(--color-light-blue)' }}
                    >
                      <User className="h-4 w-4" style={{ color: 'var(--color-dark-blue)' }} />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'var(--color-blue)' }}
                  >
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div
                    className="rounded-lg rounded-bl-sm p-3"
                    style={{
                      background: 'var(--color-white)',
                      fontFamily: 'var(--font-geist)',
                      boxShadow: '0 2px 8px rgba(33, 52, 72, 0.1)',
                    }}
                  >
                    <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'var(--color-blue)' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length === 1 && !isLoading && (
              <div className="px-4 pt-2 pb-2 border-t" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
                <div className="text-xs mb-2" style={{ fontFamily: 'var(--font-geist)', color: 'var(--color-blue)' }}>
                  Попробуйте спросить:
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputValue(suggestion);
                        inputRef.current?.focus();
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs transition-all hover:scale-105"
                      style={{
                        background: 'var(--color-cream)',
                        color: 'var(--color-dark-blue)',
                        fontFamily: 'var(--font-geist)',
                        border: '1px solid var(--color-light-blue)',
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t" style={{ borderColor: 'var(--color-light-blue)', background: 'var(--color-white)' }}>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Задайте вопрос..."
                  disabled={isLoading}
                  className="flex-1 p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    borderColor: 'var(--color-light-blue)',
                    background: 'var(--color-white)',
                    fontFamily: 'var(--font-geist)',
                    color: 'var(--color-dark-blue)',
                    '--tw-ring-color': 'var(--color-dark-blue)',
                  } as React.CSSProperties}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  style={{
                    background: 'var(--color-dark-blue)',
                    color: 'var(--color-white)',
                  }}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

