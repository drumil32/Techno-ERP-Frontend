import React from 'react';

interface AddMoreDataBtnProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  btnClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
}

export const AddMoreDataBtn: React.FC<AddMoreDataBtnProps> = ({
  icon,
  label,
  onClick,
  btnClassName = '',
  iconClassName = '',
  labelClassName = '',
  disabled
}) => {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer flex items-center gap-2 text-sm border rounded px-3 py-2 upload-materials-border-box transition ${btnClassName} hover:bg-gray-100`}
      disabled={undefined}
    >
      <span className={`text-lg font-inter ${iconClassName}`}>{icon}</span>
      <div className={`font-inter ${labelClassName}`}>{label}</div>
    </button>
  );
};
