import React from "react";

type StripeLogoProps = {
  size?: number;
  className?: string;
};

const StripeLogo = ({ size = 20, className }: StripeLogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Stripe"
      role="img"
    >
      <rect width="24" height="24" rx="6" fill="#635BFF" />
      <path
        fill="#FFFFFF"
        d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.759 6.008 2.143 4.358 3.559 3.652 5.479 3.652 7.785c0 4.063 2.455 5.796 6.41 7.274 2.585.92 3.46 1.574 3.46 2.554 0 .966-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"
        transform="translate(2.2 2.2) scale(0.82)"
      />
    </svg>
  );
};

export default StripeLogo;
