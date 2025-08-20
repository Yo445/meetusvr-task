interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

export function InputField({ icon, error, ...props }: InputFieldProps) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#62626b]">
          {icon}
        </span>
      )}
      <input
        className={`w-full rounded-lg border ${
          error ? 'border-red-300' : 'border-gray-200'
        } bg-white py-3 ${
          icon ? 'pl-12' : 'pl-4'
        } pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-200`}
        {...props}
      />
    </div>
  );
}