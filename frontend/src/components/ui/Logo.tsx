const Logo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Head */}
      <circle
        cx="12"
        cy="5"
        r="3.5"
        className="stroke-primary/40"
        strokeWidth="2"
      />

      {/* Collar */}
      <path
        d="M9 9H15"
        className="stroke-primary/40"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Body */}
      <path
        d="M10 9L8 18H16L14 9H10Z"
        className="stroke-primary/40"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Base */}
      <path
        d="M6 18H18V20C18 20.5523 17.5523 21 17 21H7C6.44772 21 6 20.5523 6 20V18Z"
        className="stroke-primary/40"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Logo;
