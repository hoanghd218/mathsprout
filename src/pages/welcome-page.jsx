// MathSprout — Welcome / landing page

import { useNavigate } from 'react-router';
import { PrimaryButton } from '../components/ui/button.jsx';

export default function WelcomePage() {
  const navigate = useNavigate();
  return (
    <section className="page">
      <div className="max-w-md mx-auto px-6 pt-16 sm:pt-24 pb-10 text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur border border-green-100 text-xs font-bold tracking-wide text-green-700 uppercase shadow-sm">
          <span aria-hidden="true">✨</span> STEMFEST 2026
        </span>
        <div className="text-9xl mascot leading-none mt-8">🌱</div>
        <h1 className="font-display text-5xl sm:text-6xl font-extrabold text-green-600 mt-6 tracking-tight">MathSprout</h1>
        <p className="text-lg text-gray-700 mt-6 font-bold leading-snug">
          "10 minutes a day,<br />
          <span className="text-green-600">BIG progress</span> all year"
        </p>
        <p className="text-sm text-gray-500 mt-2 italic">10 phút mỗi ngày — Tiến bộ lớn cả năm</p>

        <PrimaryButton className="mt-10 w-full sm:w-auto" onClick={() => navigate('/signup')}>
          <span aria-hidden="true">🚀</span>
          <span>GET STARTED</span>
        </PrimaryButton>

        <p className="text-xs text-gray-400 mt-10">Made with <span aria-hidden="true">❤️</span> by Trần Nhật Minh</p>
      </div>
    </section>
  );
}
