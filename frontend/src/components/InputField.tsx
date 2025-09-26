import { LucideIcon } from "lucide-react";

interface FormInputProps {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  error?: string;
  rightElement?: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  rightElement,
}) => {
  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all duration-200
            ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;
