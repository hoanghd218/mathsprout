// MathSprout — Signup form: nickname, age, grade, buddy avatar

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/app-context.jsx';
import { useToast } from '../components/ui/toast.jsx';
import { ChoiceButton, PrimaryButton } from '../components/ui/button.jsx';
import { TextInput } from '../components/ui/input.jsx';

const AGES = [6, 7, 8, 9, 10, 11];
const GRADES = [1, 2, 3, 4, 5];
const AVATARS = ['🌱', '🐱', '🐶', '🤖', '🦄', '🐼'];

export default function SignupPage() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const showToast = useToast();

  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState(null);
  const [grade, setGrade] = useState(null);
  const [avatar, setAvatar] = useState('🌱');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = nickname.trim();
    if (!trimmed) return showToast('Please enter your name / Hãy nhập tên', 'error');
    if (!age) return showToast('Please select your age / Hãy chọn tuổi', 'error');
    if (!grade) return showToast('Please select your grade / Hãy chọn lớp', 'error');

    dispatch({
      type: 'SIGN_UP',
      user: { nickname: trimmed, age, grade, avatar, createdAt: Date.now() }
    });
    showToast(`Welcome, ${trimmed}! 🌱`, 'success');
    navigate('/dashboard');
  }

  return (
    <section className="page">
      <div className="max-w-md mx-auto p-6 pt-8">
        <div className="text-center text-6xl mascot">🌱</div>
        <h2 className="font-display text-3xl font-bold text-center mt-4">Hi! Let's get to know you!</h2>
        <p className="text-gray-600 text-center text-sm">(Chào! Để mình làm quen!)</p>

        <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
          <div>
            <label className="block font-bold mb-1">What should I call you?</label>
            <p className="text-sm text-gray-500 mb-2">(Bạn muốn được gọi là gì?)</p>
            <TextInput
              type="text"
              placeholder="Type your name..."
              maxLength={20}
              autoComplete="off"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-bold mb-1">How old are you?</label>
            <p className="text-sm text-gray-500 mb-2">(Bạn bao nhiêu tuổi?)</p>
            <div className="flex flex-wrap gap-2">
              {AGES.map(a => (
                <ChoiceButton key={a} selected={age === a} onClick={() => setAge(a)}>
                  {a}
                </ChoiceButton>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">What grade are you in?</label>
            <p className="text-sm text-gray-500 mb-2">(Bạn học lớp mấy?)</p>
            <div className="flex flex-wrap gap-2">
              {GRADES.map(g => (
                <ChoiceButton key={g} selected={grade === g} onClick={() => setGrade(g)}>
                  {g}
                </ChoiceButton>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">Choose your buddy:</label>
            <p className="text-sm text-gray-500 mb-2">(Chọn bạn đồng hành:)</p>
            <div className="flex flex-wrap gap-2">
              {AVATARS.map(av => (
                <ChoiceButton key={av} selected={avatar === av} onClick={() => setAvatar(av)}>
                  {av}
                </ChoiceButton>
              ))}
            </div>
          </div>

          <PrimaryButton type="submit" className="w-full mt-6">▶ NEXT</PrimaryButton>
        </form>
      </div>
    </section>
  );
}
