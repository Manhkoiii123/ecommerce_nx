import React from "react";

type HeartIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

const HeartIcon = ({
  size = 28,
  color = "currentColor",
  className,
}: HeartIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 20.5S4.5 15.8 4.5 10.2C4.5 7.5 6.6 5.5 9.2 5.5C10.7 5.5 11.9 6.3 12 7.1C12.1 6.3 13.3 5.5 14.8 5.5C17.4 5.5 19.5 7.5 19.5 10.2C19.5 15.8 12 20.5 12 20.5Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default HeartIcon;
