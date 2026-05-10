// MathSprout — Sprout AI assistant modal: streams a bilingual explanation
// of the current question. Renders into a portal at document.body.
//
// Props:
//   open, onClose
//   question     — { questionEn, questionVi, answer, topic }
//   userAnswer   — string|number (use '(not yet answered)' for practice/stuck mode)
//   isCorrect    — boolean (ignored when userAnswer === '(not yet answered)')
//   grade, age   — for age-appropriate vocabulary

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useExplainStream } from './use-explain-stream.js';
import { speak } from '../../lib/speech.js';
import { PrimaryButton, PillButton, SpeakerIcon } from '../ui/button.jsx';

export function SproutModal({
  open,
  onClose,
  question,
  userAnswer,
  isCorrect,
  grade,
  age
}) {
  const { status, en, vi, error, start, reset } = useExplainStream();
  const closeBtnRef = useRef(null);

  // Start streaming when modal opens; clean up on close.
  useEffect(() => {
    if (!open) { reset(); return; }
    start({ question, userAnswer, isCorrect, grade, age });

    // ESC to close + lock body scroll while open
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the close button so keyboard users can dismiss easily
    setTimeout(() => closeBtnRef.current?.focus(), 50);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="sprout-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sprout-modal-title"
    >
      <div className="sprout-modal-card" onClick={(e) => e.stopPropagation()}>
        <header className="sprout-modal-header">
          <div className="text-3xl" aria-hidden="true">🌱</div>
          <div className="flex-1">
            <div id="sprout-modal-title" className="font-display font-bold text-lg">
              Sprout đang giải thích…
            </div>
            <div className="text-xs text-gray-500">Sprout is explaining…</div>
          </div>
          <button
            ref={closeBtnRef}
            className="sprout-close-btn"
            aria-label="Close"
            onClick={onClose}
          >
            ✕
          </button>
        </header>

        {status === 'streaming' && !en && !vi && (
          <div className="sprout-loading">
            <span className="sprout-bounce" aria-hidden="true">🌱</span>
            <span className="ml-2">Sprout đang suy nghĩ...</span>
          </div>
        )}

        {(en || (status !== 'idle' && status !== 'error')) && (
          <ExplanationPanel
            flag="🇬🇧"
            label="English"
            text={en}
            lang="en-US"
            isStreaming={status === 'streaming'}
            onSpeak={() => speak(en, 'en-US')}
          />
        )}

        {(vi || (status !== 'idle' && status !== 'error')) && (
          <ExplanationPanel
            flag="🇻🇳"
            label="Tiếng Việt"
            text={vi}
            lang="vi-VN"
            isStreaming={status === 'streaming'}
            onSpeak={() => speak(vi, 'vi-VN')}
          />
        )}

        {status === 'error' && (
          <div className="sprout-error">
            <div className="font-bold">😴 Sprout đang nghỉ ngơi</div>
            <div className="text-sm mt-1">Thử lại sau nhé! / Try again later.</div>
            {error?.message && (
              <div className="text-xs text-gray-500 mt-2 break-words">
                {error.message}
              </div>
            )}
          </div>
        )}

        <PrimaryButton className="w-full mt-4" onClick={onClose}>
          {status === 'done' ? '👍 Hiểu rồi! / Got it!' : 'Đóng / Close'}
        </PrimaryButton>
      </div>
    </div>,
    document.body
  );
}

function ExplanationPanel({ flag, label, text, isStreaming, onSpeak }) {
  return (
    <section className="sprout-panel">
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold text-sm">
          <span aria-hidden="true">{flag}</span> {label}
        </div>
        <PillButton
          onClick={onSpeak}
          disabled={!text || isStreaming}
          aria-label={`Listen in ${label}`}
        >
          <SpeakerIcon />
          <span className="text-xs">Listen</span>
        </PillButton>
      </div>
      <div className="text-base leading-relaxed whitespace-pre-wrap">
        {text || <span className="text-gray-400">…</span>}
        {isStreaming && text && <span className="sprout-cursor" aria-hidden="true">▍</span>}
      </div>
    </section>
  );
}
