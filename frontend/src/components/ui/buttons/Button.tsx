interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ isLoading, children, ...props }) => {
  return (
    <button
      {...props}
      disabled={props.disabled || isLoading}
      className={`w-full py-3 px-4 bg-gray-900 text-neutral-50 font-semibold rounded-lg shadow hover:shadow-lg 
        focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed ${
          props.className || ""
        }`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center space-x-2">
          <svg
            className="animate-spin h-5 w-5 text-neutral-50"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
