// MathSprout — Result page: shows correct/incorrect, XP, explanation; advances or finishes

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/app-context.jsx';
import { useToast } from '../components/ui/toast.jsx';
import { PrimaryButton } from '../components/ui/button.jsx';
import { SproutButton } from '../components/sprout-assistant/sprout-button.jsx';
import { SproutModal } from '../components/sprout-assistant/sprout-modal.jsx';
import { celebrate } from '../lib/celebrate.js';
import { BADGES } from '../data/topics.js';

export default function ResultPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const showToast = useToast();
  const [sproutOpen, setSproutOpen] = useState(false);

  const result = state.lastResult;
  const lesson = state.currentLesson;
  const userGrade = state.user?.grade ?? 2;
  const userAge = state.user?.age ?? 7;

  useEffect(() => {
    if (!result || !lesson) {
      navigate('/dashboard');
      return;
    }
    if (result.isCorrect) celebrate();
    if (result.newBadges?.length) {
      result.newBadges.forEach(code => {
        const badge = BADGES.find(b => b.code === code);
        if (badge) showToast(`🏆 New badge: ${badge.name}!`, 'success');
      });
    }
  }, [result, lesson, navigate, showToast]);

  if (!result || !lesson) return null;

  const { isCorrect, xpGained, question, userAnswer } = result;
  const isLast = lesson.currentIndex + 1 >= lesson.questions.length;

  function handleNext() {
    if (isLast) {
      const recent = state.attempts.slice(-lesson.questions.length);
      const correctCount = recent.filter(a => a.isCorrect).length;
      dispatch({ type: 'FINISH_LESSON' });
      showToast(`🎊 Lesson complete! ${correctCount}/${lesson.questions.length} correct`, 'success');
      celebrate();
      navigate('/dashboard');
    } else {
      dispatch({ type: 'ADVANCE_QUESTION' });
      navigate('/practice');
    }
  }

  return (
    <section className="page">
      <div className="max-w-md mx-auto p-6 pt-8">
        <div className={`result-card ${isCorrect ? 'correct' : 'incorrect'} rounded-3xl p-8 text-center shadow-lg`}>
          <div className="text-7xl mb-2">{isCorrect ? '✅' : '😅'}</div>
          <div className="text-4xl mb-2">{isCorrect ? '🎉' : ''}</div>
          <h2 className="font-display text-3xl font-bold">
            {isCorrect ? 'AWESOME!' : 'Almost there!'}
          </h2>
          <p className="text-gray-600 mt-1">
            {isCorrect ? '(Tuyệt vời!)' : '(Gần đúng rồi!)'}
          </p>

          <div className="mt-6 text-2xl font-bold text-yellow-600 tnum">
            {isCorrect ? `+${xpGained} XP ⭐` : 'Keep going!'}
          </div>

          {!isCorrect && (
            <div className="mt-4 text-base">
              Your answer: <strong>{userAnswer}</strong><br />
              Correct answer: <strong>{question.answer}</strong>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 mt-6 shadow">
          <div className="font-bold text-green-600 mb-2">🌱 Sprout explains:</div>
          <div className="text-base mb-2">🇬🇧 {question.explanation.en}</div>
          <div className="text-sm text-gray-600">🇻🇳 {question.explanation.vi}</div>
        </div>

        <div className="mt-4 flex justify-center">
          <SproutButton onClick={() => setSproutOpen(true)}>
            {isCorrect ? 'Hỏi Sprout giải sâu hơn' : 'Hỏi Sprout giải thích'}
          </SproutButton>
        </div>

        <PrimaryButton className="w-full mt-6 text-lg" onClick={handleNext}>
          {isLast ? '🏁 Finish Lesson' : '▶ Next Question'}
        </PrimaryButton>
      </div>

      <SproutModal
        open={sproutOpen}
        onClose={() => setSproutOpen(false)}
        question={question}
        userAnswer={userAnswer}
        isCorrect={isCorrect}
        grade={userGrade}
        age={userAge}
      />
    </section>
  );
}
