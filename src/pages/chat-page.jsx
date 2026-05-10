// MathSprout — Full-page chat with Sprout. Open-ended bilingual math Q&A
// + homework solver: attach a photo of a math problem and Sprout reads it
// (auto-routes to a vision model on the server).

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/app-context.jsx';
import { useChatStream } from '../components/sprout-assistant/use-chat-stream.js';
import { speak } from '../lib/speech.js';
import { compressImage } from '../lib/image-utils.js';
import {
  IconButton,
  PrimaryButton,
  PillButton,
  BackArrowIcon,
  SpeakerIcon
} from '../components/ui/button.jsx';

const SUGGESTIONS_EN = [
  'How do I add 27 + 35?',
  "What's a fraction?",
  'Help me read the clock at 3:45.',
  'Why is 6 × 7 = 42?'
];

export default function ChatPage() {
  const navigate = useNavigate();
  const { state } = useApp();
  const u = state.user;
  const grade = u?.grade ?? 2;
  const age = u?.age ?? 7;

  const { messages, status, error, send, reset, abort } = useChatStream({ grade, age });
  const [input, setInput] = useState('');
  const [attached, setAttached] = useState(null); // { dataUrl } or null
  const [attaching, setAttaching] = useState(false);
  const [attachError, setAttachError] = useState('');
  const scrollerRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom on new content
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function onPickImage(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;
    setAttachError('');
    setAttaching(true);
    try {
      const dataUrl = await compressImage(file);
      setAttached({ dataUrl });
    } catch (err) {
      setAttachError(err?.message || 'Could not load image.');
    } finally {
      setAttaching(false);
    }
  }

  function clearAttached() {
    setAttached(null);
    setAttachError('');
  }

  function onSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (status === 'streaming') return;
    if (!text && !attached) return;
    const images = attached ? [attached.dataUrl] : [];
    send(text, images);
    setInput('');
    setAttached(null);
    inputRef.current?.focus();
  }

  function quickAsk(q) {
    if (status === 'streaming') return;
    send(q);
  }

  const canSend = !attaching && status !== 'streaming' && (!!input.trim() || !!attached);

  return (
    <section className="page">
      <div className="chat-layout">
        <header className="chat-header">
          <IconButton aria-label="Back" onClick={() => navigate('/dashboard')}>
            <BackArrowIcon />
          </IconButton>
          <div className="flex-1">
            <h1 className="font-display font-bold text-lg">🌱 Chat with Sprout</h1>
            <p className="text-xs text-gray-500">Hỏi hoặc chụp ảnh bài tập / Ask or snap a homework photo</p>
          </div>
          {messages.length > 0 && (
            <PillButton onClick={reset} aria-label="Clear chat">
              <span className="text-xs">🗑 Clear</span>
            </PillButton>
          )}
        </header>

        <div className="chat-scroll" ref={scrollerRef}>
          {messages.length === 0 && (
            <div className="chat-empty">
              <div className="text-5xl mb-3">🌱</div>
              <div className="font-display font-bold text-xl">Hi {u?.nickname || 'friend'}! 👋</div>
              <p className="text-gray-600 mt-1 text-sm">
                Em gõ câu hỏi toán, hoặc bấm 📷 để chụp/upload ảnh bài tập — Sprout sẽ giải theo lớp {grade} nhé!
              </p>
              <div className="chat-suggestions">
                {SUGGESTIONS_EN.map((s) => (
                  <button
                    key={s}
                    className="chat-suggestion"
                    onClick={() => quickAsk(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, idx) => (
            <ChatBubble
              key={m.id}
              message={m}
              isLast={idx === messages.length - 1}
              isStreaming={status === 'streaming'}
            />
          ))}

          {status === 'error' && (
            <div className="sprout-error mx-2">
              <div className="font-bold">😴 Sprout đang nghỉ ngơi</div>
              <div className="text-sm mt-1">Thử lại sau nhé! / Try again later.</div>
              {error?.message && (
                <div className="text-xs text-gray-500 mt-2 break-words">{error.message}</div>
              )}
            </div>
          )}
        </div>

        {(attached || attaching || attachError) && (
          <div className="chat-preview-row">
            {attaching && <span className="chat-preview-status">📷 Đang xử lý ảnh…</span>}
            {attached && (
              <div className="chat-preview-thumb">
                <img src={attached.dataUrl} alt="homework preview" />
                <button
                  type="button"
                  className="chat-preview-remove"
                  onClick={clearAttached}
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </div>
            )}
            {attached && (
              <span className="chat-preview-status">Ảnh đã sẵn sàng. Em có thể thêm câu hỏi rồi gửi.</span>
            )}
          </div>
        )}
        {attachError && <div className="chat-attach-error">{attachError}</div>}

        <form className="chat-composer" onSubmit={onSubmit}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onPickImage}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="chat-attach"
            onClick={() => fileInputRef.current?.click()}
            disabled={attaching || status === 'streaming'}
            aria-label="Attach homework photo"
            title="Chụp / Upload ảnh bài tập"
          >
            📷
          </button>
          <input
            ref={inputRef}
            className="chat-input"
            type="text"
            placeholder={attached ? 'Thêm câu hỏi (tùy chọn)…' : 'Hỏi Sprout... / Ask Sprout...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={status === 'streaming'}
            autoFocus
          />
          {status === 'streaming' ? (
            <button type="button" className="chat-send chat-stop" onClick={abort} aria-label="Stop">
              ⏹
            </button>
          ) : (
            <PrimaryButton
              type="submit"
              className="chat-send"
              disabled={!canSend}
              aria-label="Send"
            >
              ➤
            </PrimaryButton>
          )}
        </form>
      </div>
    </section>
  );
}

function ChatBubble({ message, isLast, isStreaming }) {
  if (message.role === 'user') {
    const imgs = message.images || [];
    return (
      <div className="chat-row chat-row-user">
        <div className="chat-bubble chat-bubble-user">
          {imgs.length > 0 && (
            <div className="chat-bubble-image">
              <img src={imgs[0]} alt="homework" />
            </div>
          )}
          {message.en && <div>{message.en}</div>}
        </div>
      </div>
    );
  }

  const showCursor = isLast && isStreaming;
  const empty = !message.en && !message.vi;

  return (
    <div className="chat-row chat-row-bot">
      <div className="chat-mascot" aria-hidden="true">🌱</div>
      <div className="chat-bubble chat-bubble-bot">
        {empty && showCursor && (
          <div className="text-gray-500 text-sm">
            <span className="sprout-bounce" aria-hidden="true">🌱</span>
            <span className="ml-2">Sprout đang suy nghĩ...</span>
          </div>
        )}

        {message.en && (
          <div className="chat-lang">
            <div className="chat-lang-head">
              <span className="chat-flag">🇬🇧</span>
              <PillButton
                onClick={() => speak(message.en, 'en-US')}
                disabled={!message.en || showCursor}
                aria-label="Listen English"
              >
                <SpeakerIcon />
                <span className="text-xs">Listen</span>
              </PillButton>
            </div>
            <div className="chat-lang-text">
              {message.en}
              {showCursor && !message.vi && <span className="sprout-cursor" aria-hidden="true">▍</span>}
            </div>
          </div>
        )}

        {message.vi && (
          <div className="chat-lang chat-lang-vi">
            <div className="chat-lang-head">
              <span className="chat-flag">🇻🇳</span>
              <PillButton
                onClick={() => speak(message.vi, 'vi-VN')}
                disabled={!message.vi || showCursor}
                aria-label="Listen Vietnamese"
              >
                <SpeakerIcon />
                <span className="text-xs">Listen</span>
              </PillButton>
            </div>
            <div className="chat-lang-text">
              {message.vi}
              {showCursor && <span className="sprout-cursor" aria-hidden="true">▍</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
