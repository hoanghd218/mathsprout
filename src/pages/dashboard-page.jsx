// MathSprout — Dashboard with mascot tree, XP, streak, recommendation, quick nav

import { useNavigate } from 'react-router';
import { useApp } from '../context/app-context.jsx';
import { useToast } from '../components/ui/toast.jsx';
import { IconButton, PrimaryButton, SettingsIcon } from '../components/ui/button.jsx';
import {
  TOPICS,
  BADGES,
  PLAY_TIME_GOAL_15MIN_SEC,
  PLAY_TIME_GOAL_SEC,
  PLAY_TIME_GOAL_2H_SEC,
  PLAY_TIME_GOAL_3H_SEC,
  FUN_MATH_XP_THRESHOLD
} from '../data/topics.js';
import { getCurrentLevel, getNextLevel, getNextLesson } from '../lib/recommender.js';
import { SproutRecommendationCard } from '../components/sprout-assistant/sprout-recommendation-card.jsx';
import { useEffect } from 'react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const showToast = useToast();

  // Show pending bilingual badge toast
  useEffect(() => {
    if (state.lastBilingualBadge) {
      const badge = BADGES.find(b => b.code === 'bilingual');
      if (badge) showToast(`🏆 New badge: ${badge.name}!`, 'success');
      dispatch({ type: 'CONSUME_BILINGUAL_BADGE' });
    }
  }, [state.lastBilingualBadge, dispatch, showToast]);

  const u = state.user;
  const xp = state.progress.totalXP;
  const level = getCurrentLevel(xp);
  const nextLevel = getNextLevel(xp);
  const progressPct = nextLevel.min > level.min
    ? Math.min(100, ((xp - level.min) / (nextLevel.min - level.min)) * 100)
    : 100;

  const playSec = state.playTimeSec || 0;
  const playPct = Math.min(100, (playSec / PLAY_TIME_GOAL_3H_SEC) * 100);
  const playMin = Math.floor(playSec / 60);
  const playRemSec = playSec % 60;
  const trainingEarned = state.badges.includes('training');
  const playEarned1h = state.badges.includes('played_1_hour');
  const playEarned2h = state.badges.includes('played_2_hours');
  const starPlusEarned = state.badges.includes('star_plus');
  const funMathEarned = state.badges.includes('fun_math');
  // Milestones positioned along a 3h-scale bar.
  const milestone15mPct = (PLAY_TIME_GOAL_15MIN_SEC / PLAY_TIME_GOAL_3H_SEC) * 100;
  const milestone1hPct = (PLAY_TIME_GOAL_SEC / PLAY_TIME_GOAL_3H_SEC) * 100;
  const milestone2hPct = (PLAY_TIME_GOAL_2H_SEC / PLAY_TIME_GOAL_3H_SEC) * 100;
  const xpQualifies = xp >= FUN_MATH_XP_THRESHOLD;

  const previewLesson = getNextLesson(state, 10);
  const [recType, recTopic] = previewLesson.recommendation.split(':');
  const recText = (() => {
    const t = TOPICS[recTopic];
    if (recType === 'focus_weak' && t) return `Today let's focus on ${t.emoji} ${t.name} (you need practice here!)`;
    if (recType === 'learn_new' && t) return `Time to learn ${t.emoji} ${t.name} — let's go!`;
    if (recType === 'improve' && t) return `Let's improve ${t.emoji} ${t.name} today!`;
    return `You're doing great! Mixed practice today 💪`;
  })();

  function startLesson() {
    dispatch({ type: 'START_LESSON', count: 10 });
    navigate('/practice');
  }

  return (
    <section className="page">
      <div className="max-w-md mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display font-bold text-2xl text-green-500">🌱 MathSprout</h1>
          <IconButton aria-label="Settings" onClick={() => navigate('/settings')}>
            <SettingsIcon />
          </IconButton>
        </div>

        <div className="text-center">
          <h2 className="font-display text-2xl font-bold">Hi {u.nickname}! 👋</h2>
          <p className="text-gray-600 text-sm">Chào {u.nickname}! Sẵn sàng cho 10 phút hôm nay?</p>
        </div>

        <div className="bg-white rounded-3xl p-6 my-6 text-center shadow-md">
          <div className="tree-display">{level.emoji}</div>
          <div className="font-bold text-lg mt-2">{level.name}</div>
          <div className="streak-chip text-sm mt-1">🔥 {state.progress.streakDays}-day streak</div>

          <div className="mt-4">
            <div className="font-bold tnum">⭐ {xp} XP</div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden">
              <div className="xp-bar h-3 transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {nextLevel.min > xp ? `${nextLevel.min - xp} XP to ${nextLevel.name}` : 'Max level reached! 🎉'}
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-2xl p-4 mb-4 border-2 border-green-200">
          <div className="text-sm font-bold text-green-700 mb-1">🌱 Sprout's recommendation:</div>
          <div className="text-base">{recText}</div>
        </div>

        <div className="bg-amber-50 rounded-2xl p-4 mb-4 border-2 border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold text-amber-700">
              ⏰ Play Time Rewards {playEarned1h && '⏰'} {playEarned2h && '⏳'} {starPlusEarned && '🌟'} {funMathEarned && '🎉'}
            </div>
            <div className="text-xs tnum text-amber-700">
              {playMin}m {playRemSec}s / 180m
            </div>
          </div>
          <div className="relative w-full bg-amber-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 transition-all duration-500"
              style={{ width: `${playPct}%`, background: 'linear-gradient(90deg,#f59e0b,#fbbf24)' }}
            />
            <div
              className="absolute top-0 h-3 w-0.5 bg-amber-600"
              style={{ left: `${milestone15mPct}%` }}
              aria-hidden="true"
            />
            <div
              className="absolute top-0 h-3 w-0.5 bg-amber-600"
              style={{ left: `${milestone1hPct}%` }}
              aria-hidden="true"
            />
            <div
              className="absolute top-0 h-3 w-0.5 bg-amber-600"
              style={{ left: `${milestone2hPct}%` }}
              aria-hidden="true"
            />
          </div>
          <div className="flex justify-between text-[10px] text-amber-700 mt-1 font-bold">
            <span>0h</span>
            <span className={trainingEarned ? '' : 'opacity-50'}>15m 💪</span>
            <span className={playEarned1h ? '' : 'opacity-50'}>1h ⏰</span>
            <span className={playEarned2h ? '' : 'opacity-50'}>2h ⏳🌟</span>
            <span className={funMathEarned ? '' : 'opacity-50'}>3h 🎉</span>
          </div>
          <div className="text-xs text-amber-700 mt-2">
            {funMathEarned
              ? 'Đã unlock tất cả mốc — +1147 XP bonus đã cộng! 🎉'
              : playEarned2h
              ? `Star+ kích hoạt 🌟. Mốc 3h cần thêm ${xpQualifies ? '⏱️ giờ chơi' : `${FUN_MATH_XP_THRESHOLD - xp} XP nữa`} để nhận "Học toán vui vẻ" + 1147 XP.`
              : playEarned1h
              ? 'Đã unlock Play 1 Hour! Tiếp tục đến 2h để nhận Star+ và bonus câu dễ.'
              : '+11s mỗi câu hỏi → mở huy hiệu mỗi mốc giờ chơi.'}
          </div>
        </div>

        <PrimaryButton className="w-full text-lg py-5 mb-6" onClick={startLesson}>
          ▶ START TODAY'S LESSON
        </PrimaryButton>

        <SproutRecommendationCard />

        <button
          onClick={() => navigate('/chat')}
          className="w-full mt-6 rounded-2xl p-4 shadow text-left card-hover bg-linear-to-r from-emerald-50 to-green-100 border-2 border-green-200 flex items-center gap-3"
        >
          <div className="text-4xl">💬</div>
          <div className="flex-1">
            <div className="font-bold text-green-700">Chat with Sprout</div>
            <div className="text-xs text-gray-600">Hỏi Sprout bất kỳ câu hỏi toán nào</div>
          </div>
          <div className="text-2xl text-green-600">→</div>
        </button>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button onClick={startLesson} className="bg-white rounded-2xl p-4 shadow text-center card-hover">
            <div className="text-4xl">📚</div>
            <div className="font-bold mt-2">Practice</div>
          </button>
          <button onClick={() => navigate('/skill-map')} className="bg-white rounded-2xl p-4 shadow text-center card-hover">
            <div className="text-4xl">🗺️</div>
            <div className="font-bold mt-2">Skill Map</div>
          </button>
          <button onClick={() => navigate('/progress')} className="bg-white rounded-2xl p-4 shadow text-center card-hover">
            <div className="text-4xl">📊</div>
            <div className="font-bold mt-2">Progress</div>
          </button>
          <button onClick={() => navigate('/achievements')} className="bg-white rounded-2xl p-4 shadow text-center card-hover">
            <div className="text-4xl">🏆</div>
            <div className="font-bold mt-2">Badges</div>
          </button>
          <button onClick={() => navigate('/rewards')} className="bg-white rounded-2xl p-4 shadow text-center card-hover">
            <div className="text-4xl">🎁</div>
            <div className="font-bold mt-2">Phần thưởng</div>
          </button>
          <button onClick={() => navigate('/shop')} className="bg-white rounded-2xl p-4 shadow text-center card-hover">
            <div className="text-4xl">🛒</div>
            <div className="font-bold mt-2">Shop</div>
            <div className="text-xs text-gray-500 mt-1">Đổi XP lấy quà</div>
          </button>
        </div>
      </div>
    </section>
  );
}
