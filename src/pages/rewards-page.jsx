// MathSprout — Rewards page: 3 milestone tiers + earned/locked status

import { useApp } from '../context/app-context.jsx';
import { PageHeader } from '../components/layout/page-header.jsx';
import {
  PLAY_TIME_GOAL_5MIN_SEC,
  PLAY_TIME_GOAL_10MIN_SEC,
  PLAY_TIME_GOAL_15MIN_SEC,
  PLAY_TIME_GOAL_20MIN_SEC,
  PLAY_TIME_GOAL_25MIN_SEC,
  PLAY_TIME_GOAL_30MIN_SEC,
  PLAY_TIME_GOAL_35MIN_SEC,
  PLAY_TIME_GOAL_40MIN_SEC,
  PLAY_TIME_GOAL_45MIN_SEC,
  PLAY_TIME_GOAL_50MIN_SEC,
  PLAY_TIME_GOAL_55MIN_SEC,
  PLAY_TIME_GOAL_SEC,
  PLAY_TIME_GOAL_1H25MIN_SEC,
  PLAY_TIME_GOAL_2H_SEC,
  PLAY_TIME_GOAL_3H_SEC,
  FUN_MATH_XP_THRESHOLD,
  FUN_MATH_BONUS_XP,
  EASY_BONUS_COUNT,
  PLAY_TIME_CREDIT_SEC,
  STUDY_5MIN_BONUS_XP,
  STUDY_TOGETHER_BONUS_XP,
  STUDY_FOCUSED_BONUS_XP,
  STUDY_GOOD_KID_BONUS_XP,
  TRAINING_PRO_BONUS_XP,
  STUDY_TALENT_BONUS_XP,
  STUDY_CONCENTRATE_BONUS_XP,
  TRAINING_SUPER_BONUS_XP,
  STAR_GOLD_BONUS_XP,
  STAR_SHINING_BONUS_XP,
  STAR_SUPER_SHINING_BONUS_XP
} from '../data/topics.js';

// Tiered reward catalogue. Each tier lists the perks unlocked when its condition is met.
const TIERS = [
  {
    id: 'tier_5min',
    label: '5 phút — Học 5 phút',
    emoji: '⏱️',
    requireSec: PLAY_TIME_GOAL_5MIN_SEC,
    badges: ['study_5min'],
    perks: [
      `Bonus +${STUDY_5MIN_BONUS_XP} XP một lần`,
      'Huy hiệu ⏱️ Học 5 phút'
    ]
  },
  {
    id: 'tier_10min',
    label: '10 phút — Học cùng nhau',
    emoji: '🤝',
    requireSec: PLAY_TIME_GOAL_10MIN_SEC,
    badges: ['study_together'],
    perks: [
      `Bonus +${STUDY_TOGETHER_BONUS_XP} XP một lần`,
      'Huy hiệu 🤝 Học cùng nhau'
    ]
  },
  {
    id: 'tier_15min',
    label: '15 phút — Tập luyện',
    emoji: '💪',
    requireSec: PLAY_TIME_GOAL_15MIN_SEC,
    badges: ['training'],
    perks: [
      `+${PLAY_TIME_CREDIT_SEC}s tích luỹ mỗi câu hỏi`,
      'Huy hiệu 💪 Tập luyện'
    ]
  },
  {
    id: 'tier_20min',
    label: '20 phút — Tập trung học bài',
    emoji: '😄',
    requireSec: PLAY_TIME_GOAL_20MIN_SEC,
    badges: ['study_focused'],
    perks: [
      `Bonus +${STUDY_FOCUSED_BONUS_XP} XP một lần`,
      'Huy hiệu 😄 Tập trung học bài'
    ]
  },
  {
    id: 'tier_25min',
    label: '25 phút — Bé học bài ngoan',
    emoji: '🎒',
    requireSec: PLAY_TIME_GOAL_25MIN_SEC,
    badges: ['study_good_kid'],
    perks: [
      `Bonus +${STUDY_GOOD_KID_BONUS_XP} XP một lần`,
      'Huy hiệu 🎒 Bé học bài ngoan'
    ]
  },
  {
    id: 'tier_30min',
    label: '30 phút — Tập luyện Pro',
    emoji: '💪',
    requireSec: PLAY_TIME_GOAL_30MIN_SEC,
    badges: ['training_pro'],
    perks: [
      `Bonus +${TRAINING_PRO_BONUS_XP} XP một lần`,
      'Huy hiệu 💪 Tập luyện Pro'
    ]
  },
  {
    id: 'tier_35min',
    label: '35 phút — Bé tài năng',
    emoji: '🎖️',
    requireSec: PLAY_TIME_GOAL_35MIN_SEC,
    badges: ['study_talent'],
    perks: [
      `Bonus +${STUDY_TALENT_BONUS_XP} XP một lần`,
      'Huy hiệu 🎖️ Bé tài năng'
    ]
  },
  {
    id: 'tier_40min',
    label: '40 phút — Tập trung học bài',
    emoji: '📖',
    requireSec: PLAY_TIME_GOAL_40MIN_SEC,
    badges: ['study_concentrate'],
    perks: [
      `Bonus +${STUDY_CONCENTRATE_BONUS_XP} XP một lần`,
      'Huy hiệu 📖 Tập trung học bài'
    ]
  },
  {
    id: 'tier_45min',
    label: '45 phút — Tập luyện siêu năng',
    emoji: '🦸',
    requireSec: PLAY_TIME_GOAL_45MIN_SEC,
    badges: ['training_super'],
    perks: [
      `Bonus +${TRAINING_SUPER_BONUS_XP} XP một lần`,
      'Huy hiệu 🦸 Tập luyện siêu năng'
    ]
  },
  {
    id: 'tier_50min',
    label: '50 phút — Ngôi sao vàng',
    emoji: '⭐',
    requireSec: PLAY_TIME_GOAL_50MIN_SEC,
    badges: ['star_gold'],
    perks: [
      `Bonus +${STAR_GOLD_BONUS_XP} XP một lần`,
      'Huy hiệu ⭐ Ngôi sao vàng'
    ]
  },
  {
    id: 'tier_55min',
    label: '55 phút — Ngôi sao toả sáng',
    emoji: '🌟',
    requireSec: PLAY_TIME_GOAL_55MIN_SEC,
    badges: ['star_shining'],
    perks: [
      `Bonus +${STAR_SHINING_BONUS_XP} XP một lần`,
      'Huy hiệu 🌟 Ngôi sao toả sáng'
    ]
  },
  {
    id: 'tier_1h',
    label: '1 tiếng — Play 1 Hour',
    emoji: '⏰',
    requireSec: PLAY_TIME_GOAL_SEC,
    badges: ['played_1_hour'],
    perks: [
      `+${PLAY_TIME_CREDIT_SEC}s mỗi câu hỏi tích lũy về 1 tiếng`,
      'Huy hiệu ⏰ Play 1 Hour'
    ]
  },
  {
    id: 'tier_1h25min',
    label: '1 tiếng 25 phút — Ngôi sao siêu sáng',
    emoji: '✨',
    requireSec: PLAY_TIME_GOAL_1H25MIN_SEC,
    badges: ['star_super_shining'],
    perks: [
      `Bonus +${STAR_SUPER_SHINING_BONUS_XP} XP một lần`,
      'Huy hiệu ✨ Ngôi sao siêu sáng'
    ]
  },
  {
    id: 'tier_2h',
    label: '2 tiếng — Play 2 Hours',
    emoji: '⏳',
    requireSec: PLAY_TIME_GOAL_2H_SEC,
    badges: ['played_2_hours', 'star_plus'],
    perks: [
      'Huy hiệu ⏳ Play 2 Hours',
      'Huy hiệu 🌟 Star+',
      `Mỗi bài học có thêm ${EASY_BONUS_COUNT} câu warm-up dễ`
    ]
  },
  {
    id: 'tier_3h',
    label: '3 tiếng — Học toán vui vẻ',
    emoji: '🎉',
    requireSec: PLAY_TIME_GOAL_3H_SEC,
    requireXP: FUN_MATH_XP_THRESHOLD,
    badges: ['fun_math'],
    perks: [
      'Huy hiệu 🎉 Học toán vui vẻ',
      `Bonus +${FUN_MATH_BONUS_XP} XP một lần`,
      `Điều kiện: chơi đủ 3 tiếng VÀ có ≥ ${FUN_MATH_XP_THRESHOLD} XP`
    ]
  }
];

function fmtSec(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
}

export default function RewardsPage() {
  const { state } = useApp();
  const playSec = state.playTimeSec || 0;
  const xp = state.progress.totalXP || 0;
  const totalEarned = TIERS.filter(t => t.badges.every(b => state.badges.includes(b))).length;

  return (
    <section className="page">
      <div className="max-w-md mx-auto p-6">
        <PageHeader title="🎁 Phần thưởng" />

        <p className="text-center mb-4 tnum text-sm text-gray-600">
          {totalEarned} / {TIERS.length} mốc đã mở khoá
        </p>

        <div className="bg-amber-50 rounded-2xl p-4 mb-4 border-2 border-amber-200 text-sm">
          <div className="flex justify-between">
            <span className="font-bold text-amber-700">⏱️ Đã chơi</span>
            <span className="tnum text-amber-700">{fmtSec(playSec)}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-bold text-amber-700">⭐ XP</span>
            <span className="tnum text-amber-700">{xp}</span>
          </div>
        </div>

        <div className="space-y-3">
          {TIERS.map(tier => {
            const earned = tier.badges.every(b => state.badges.includes(b));
            const timeOk = playSec >= tier.requireSec;
            const xpOk = tier.requireXP == null || xp >= tier.requireXP;
            const progressPct = Math.min(100, (playSec / tier.requireSec) * 100);

            return (
              <div
                key={tier.id}
                className={`rounded-2xl p-4 shadow border-2 ${
                  earned
                    ? 'bg-green-50 border-green-300'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{earned ? tier.emoji : '🔒'}</span>
                    <div>
                      <div className="font-bold">{tier.label}</div>
                      <div className="text-xs text-gray-500">
                        Cần {Math.floor(tier.requireSec / 60)} phút chơi
                        {tier.requireXP ? ` + ${tier.requireXP} XP` : ''}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      earned
                        ? 'bg-green-200 text-green-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {earned ? 'ĐÃ MỞ' : 'Khoá'}
                  </span>
                </div>

                {!earned && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mt-2">
                      <div
                        className="h-2 transition-all"
                        style={{
                          width: `${progressPct}%`,
                          background: timeOk ? '#10b981' : '#fbbf24'
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {!timeOk && `Còn ${fmtSec(tier.requireSec - playSec)} chơi`}
                      {timeOk && !xpOk && `Đủ giờ! Cần thêm ${tier.requireXP - xp} XP`}
                      {timeOk && xpOk && 'Đủ điều kiện — sẽ mở ở câu kế tiếp!'}
                    </div>
                  </>
                )}

                <ul className="mt-3 space-y-1">
                  {tier.perks.map((perk, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className={earned ? 'text-green-600' : 'text-gray-400'}>
                        {earned ? '✓' : '•'}
                      </span>
                      <span className={earned ? '' : 'text-gray-600'}>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
