import React from 'react';

interface InputFieldProps {
  icon: React.ReactNode;
  placeholder: string;
  type?: 'text' | 'password' | 'email';
  value?: string;
  onChange?: (value: string) => void;
}

export function InputField({
  icon,
  placeholder,
  type = 'text',
  value,
  onChange,
}: InputFieldProps) {
  const isFilled = Boolean(value && value.trim().length > 0);

  return (
    <div
      className={`relative rounded-lg shrink-0 w-full ${
        isFilled ? 'bg-[#e9f0fe]' : 'bg-[rgba(255,255,255,0.4)]'
      }`}
    >
      <div
        aria-hidden="true"
        className="absolute border border-[#ffffff] border-solid inset-0 pointer-events-none rounded-lg"
      />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-3 items-center justify-start p-[16px] relative w-full">
          {icon}
          <input
            type={type}
            value={value}
            onChange={e => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="bg-transparent border-none outline-none font-['ABeeZee:Regular',_sans-serif] leading-normal not-italic flex-1 text-[#1a1a1e] text-[16px] placeholder:text-[#62626b]"
          />
        </div>
      </div>
    </div>
  );
}
