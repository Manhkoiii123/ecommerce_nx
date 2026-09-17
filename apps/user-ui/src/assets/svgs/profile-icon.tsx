import React from "react";

type ProfileIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

const ProfileIcon = ({
  size = 28,
  color = "currentColor",
  className,
}: ProfileIconProps) => {
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
      <circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth="1.8" />
      <path
        d="M5.5 19.5C5.5 16.4624 8.41015 14 12 14C15.5899 14 18.5 16.4624 18.5 19.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default ProfileIcon;
