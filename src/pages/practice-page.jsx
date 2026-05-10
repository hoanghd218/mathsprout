// MathSprout — Practice page: question display, hint, listen, bilingual toggle, submit

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/app-context.jsx';
import { useToast } from '../components/ui/toast.jsx';
import { TOPICS, BADGES } from '../data/topics.js';
import {
  IconButton,
  PrimaryButton,
  SecondaryButton,
  PillButton,
  BackArrowIcon,
  TranslateIcon,
  SpeakerIcon
} from '../components/ui/button.jsx';
import { AnswerInput, validateAnswer } from '../components/practice/answer-input.jsx';
import { SproutButton } from '../components/sprout-assistant/sprout-button.jsx';
import { SproutModal } from '../components/sprout-assistant/sprout-modal.jsx';
import { speak } from '../lib/speech.js';

// Show "Need Sprout's help?" ghost button after this many ms of thinking.
const SPROUT_HINT_DELAY_MS = 30_000;

export default function PracticePage() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const showToast = useToast();
  const inputRef = useRef(null);

  const [answer, setAnswer] = useState('');
  const [hintShown, setHintShown] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [sproutHintVisible, setSproutHintVisible] = useState(false);
  const [sproutOpen, setSproutOpen] = useState(false);

  const lesson = state.currentLesson;
  const q = lesson?.questions[lesson.currentIndex];

  // Reset per-question state when index changes
  useEffect(() => {
    setAnswer('');
    setHintShown(false);
    setHintUsed(false);
    setQuestionStartTime(Date.now());
    setSproutHintVisible(false);
    setSproutOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);

    // Reveal the gentle Sprout offer after 30s of thinking time.
    const t = setTimeout(() => setSproutHintVisible(true), SPROUT_HINT_DELAY_MS);
    return () => clearTimeout(t);
  }, [lesson?.currentIndex]);

  // Bilingual badge toast forwarding
  useEffect(() => {
    if (state.lastBilingualBadge) {
      const badge = BADGES.find(b => b.code === 'bilingual');
      if (badge) showToast(`🏆 New badge: ${badge.name}!`, 'success');
      dispatch({ type: 'CONSUME_BILINGUAL_BADGE' });
    }
  }, [state.lastBilingualBadge, dispatch, showToast]);

  if (!lesson || !q) {
    return (
      <section className="page">
        <div className="max-w-md mx-auto p-6 text-center">
          <p className="text-lg">No active lesson.</p>
          <PrimaryButton className="mt-4" onClick={() => navigate('/dashboard')}>Back to dashboard</PrimaryButton>
        </div>
      </section>
    );
  }

  const showVi = state.settings.bilingualMode;
  const total = lesson.questions.length;
  const idx = lesson.currentIndex;
  const progressPct = (idx / total) * 100;
  const topicInfo = TOPICS[q.topic];

  function handleHint() {
    setHintShown(true);
    setHintUsed(true);
  }

  function handleSubmit() {
    const validationError = validateAnswer(q, answer);
    if (validationError) return showToast(validationError, 'error');
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);

    dispatch({
      type: 'RECORD_ATTEMPT',
      question: q,
      userAnswer: String(answer).trim(),
      timeSpent,
      hintUsed
    });

    navigate('/result');
  }

  return (
    <section className="page">
      <div className="max-w-md mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <IconButton aria-label="Back to dashboard" onClick={() => navigate('/dashboard')}>
            <BackArrowIcon />
          </IconButton>
          <span className="text-sm font-bold tnum px-3 py-1 rounded-full bg-white shadow-sm border border-gray-100">
            Question {idx + 1} of {total}
          </span>
          <span className="w-6" />
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
          <div className="practice-bar h-2 transition-all" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="inline-flex items-center gap-2 text-sm mb-3 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700">
          <span aria-hidden="true">📘</span>
          <span className="font-bold">Topic:</span>
          <span className="font-extrabold">{topicInfo.emoji} {topicInfo.name}</span>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md">
          <div className="text-2xl sm:text-3xl font-bold text-center font-display leading-snug">{q.questionEn}</div>
          {showVi && <div className="text-base text-center mt-3 text-gray-600">{q.questionVi}</div>}

          <div className="flex gap-2 justify-center mt-5 flex-wrap">
            <PillButton
              aria-label="Toggle Vietnamese translation"
              onClick={() => dispatch({ type: 'TOGGLE_BILINGUAL' })}
            >
              <TranslateIcon />
              <span>{showVi ? '🇬🇧 Hide Vietnamese' : '🇻🇳 Show Vietnamese'}</span>
            </PillButton>
            <PillButton aria-label="Listen to question" onClick={() => speak(q.questionEn, 'en-US')}>
              <SpeakerIcon />
              <span>Listen</span>
            </PillButton>
          </div>
        </div>

        <div className="mt-6">
          <label className="block font-bold mb-2">Your answer:</label>
          <AnswerInput
            question={q}
            value={answer}
            onChange={setAnswer}
            onEnter={handleSubmit}
            inputRef={inputRef}
          />
        </div>

        {hintShown && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mt-4 text-sm">
            💡 {q.hint || 'Think step by step!'}
          </div>
        )}

        {sproutHintVisible && !sproutOpen && (
          <div className="mt-4 flex justify-center">
            <SproutButton variant="ghost" onClick={() => setSproutOpen(true)}>
              Cần Sprout giúp? / Need Sprout's help?
            </SproutButton>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <SecondaryButton className="flex-1" onClick={handleHint}>❓ Hint</SecondaryButton>
          <PrimaryButton style={{ flex: 2 }} onClick={handleSubmit}>✓ SUBMIT</PrimaryButton>
        </div>
      </div>

      <SproutModal
        open={sproutOpen}
        onClose={() => setSproutOpen(false)}
        question={q}
        userAnswer="(not yet answered)"
        isCorrect={false}
        grade={state.user?.grade ?? 2}
        age={state.user?.age ?? 7}
      />
    </section>
  );
}
