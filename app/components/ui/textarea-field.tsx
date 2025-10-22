type TextareaFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  error?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
};

export function TextareaField({
  id,
  label,
  value,
  onChange,
  icon,
  error,
  placeholder,
  rows = 3,
  required,
  disabled,
}: TextareaFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label} {required && "*"}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 pointer-events-none">
            {icon}
          </div>
        )}
        <textarea
          id={id}
          name={id}
          rows={rows}
          required={required}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${
            icon ? "pl-10" : "pl-4"
          } pr-4 py-2 rounded-lg border ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
