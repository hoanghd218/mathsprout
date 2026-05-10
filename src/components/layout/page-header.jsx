// MathSprout — Common page header: back button + title + spacer.

import { useNavigate } from 'react-router';
import { IconButton, BackArrowIcon } from '../ui/button.jsx';

export function PageHeader({ title, to = '/dashboard' }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between mb-4">
      <IconButton aria-label="Back" onClick={() => navigate(to)}>
        <BackArrowIcon />
      </IconButton>
      <h2 className="font-display font-bold text-xl">{title}</h2>
      <span className="w-6" />
    </div>
  );
}
