import React from "react";

interface FormCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  error?: string;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-1">
      <div className="flex items-start">
        <input
          type="checkbox"
          className={`mt-1 w-4 h-4 bg-gray-800 border-gray-800 rounded focus:ring-purple-500 focus:ring-offset-gray-900 ${className}`}
          {...props}
        />
        <label htmlFor={props.id} className="ml-2 text-sm text-gray-400">
          {label}
        </label>
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};
