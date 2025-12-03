import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ElementType;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  className = "",
  icon: Icon,
  ...props
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          className={`w-full px-4 ${
            Icon ? "pl-10" : ""
          } py-2.5 bg-gray-800/50 border rounded-lg text-white placeholder:text-gray-500 focus:outline-none transition-colors ${
            error
              ? "border-red-500/50 focus:border-red-500"
              : "border-gray-800 focus:border-purple-500/50"
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
