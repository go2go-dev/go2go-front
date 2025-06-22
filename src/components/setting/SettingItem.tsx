import { ChevronRight } from 'lucide-react';

interface SettingsItemProps {
  title: string;
  hasArrow?: boolean;
  rightText?: string;
  onClick?: () => void;
}

export default function SettingItem({
  title,
  hasArrow = true,
  rightText,
  onClick,
}: SettingsItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-4 px-6 bg-white hover:bg-gray-50 transition-colors"
    >
      <span className="text-base text-gray-900">{title}</span>
      <div className="flex items-center">
        {rightText && <span className="text-gray-500 text-sm mr-2">{rightText}</span>}
        {hasArrow && <ChevronRight className="w-4 h-4 text-gray-400" />}
      </div>
    </button>
  );
}
