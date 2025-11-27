import React from "react";

const Logo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M50 5L15 25V75L50 95L85 75V25L50 5Z"
        className="fill-primary/20 stroke-primary"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M50 20V80"
        className="stroke-primary"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M25 35L75 65"
        className="stroke-primary"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M75 35L25 65"
        className="stroke-primary"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="50" cy="50" r="10" className="fill-primary" />
    </svg>
  );
};

export default Logo;
