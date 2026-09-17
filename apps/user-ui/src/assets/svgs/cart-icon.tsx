import React from "react";

type CartIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

const CartIcon = ({
  size = 28,
  color = "currentColor",
  className,
}: CartIconProps) => {
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
        d="M3.5 5H5.2L6.4 14.2C6.55 15.35 7.55 16.2 8.7 16.2H17.3C18.4 16.2 19.35 15.4 19.55 14.3L20.5 9H6.8"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="19.5" r="1.3" fill={color} />
      <circle cx="17" cy="19.5" r="1.3" fill={color} />
    </svg>
  );
};

export default CartIcon;
