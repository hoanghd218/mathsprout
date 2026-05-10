// MathSprout — Progress: stats grid + last 7 days bar chart

import { useApp } from '../context/app-context.jsx';
import { PageHeader } from '../components/layout/page-header.jsx';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getLast7Days(attempts) {
  const today = new Date();
  const out = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const dayStart = d.getTime();
    const dayEnd = dayStart + 86400000;
    const count = attempts.filter(a => a.timestamp >= dayStart && a.timestamp < dayEnd).length;
    out.push({ label: DAY_LABELS[d.getDay()], count });
  }
  return out;
}

export default function ProgressPage() {
  const { state } = useApp();
  const totalAttempts = state.attempts.length;
  const correctCount = state.attempts.filter(a => a.isCorrect).length;
  const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

  const last7 = getLast7Days(state.attempts);
  const maxCount = Math.max(1, ...last7.map(d => d.count));

  return (
    <section className="page">
      <div className="max-w-md mx-auto p-6">
        <PageHeader title="📊 Progress" />

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow text-center">
            <div className="text-3xl">⭐</div>
            <div className="text-2xl font-bold tnum">{state.progress.totalXP}</div>
            <div className="text-xs text-gray-600">Total XP</div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow text-center">
            <div className="text-3xl">🔥</div>
            <div className="text-2xl font-bold tnum">{state.progress.streakDays}</div>
            <div className="text-xs text-gray-600">Day Streak</div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow text-center">
            <div className="text-3xl">📝</div>
            <div className="text-2xl font-bold tnum">{totalAttempts}</div>
            <div className="text-xs text-gray-600">Questions</div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow text-center">
            <div className="text-3xl">🎯</div>
            <div className="text-2xl font-bold tnum">{accuracy}%</div>
            <div className="text-xs text-gray-600">Accuracy</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow">
          <div className="font-bold mb-3">📅 Last 7 days</div>
          <div className="flex items-end gap-1 h-32">
            {last7.map((d, i) => {
              const heightPct = (d.count / maxCount) * 100;
              return (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div className="text-xs mb-1 font-bold tnum">{d.count}</div>
                  <div
                    className="w-full bg-green-400 rounded-t"
                    style={{ height: `${Math.max(4, heightPct)}%`, minHeight: '4px' }}
                  />
                  <div className="text-xs mt-1 text-gray-600">{d.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
