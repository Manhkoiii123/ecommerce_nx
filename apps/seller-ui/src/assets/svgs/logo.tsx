import React from "react";

type LogoProps = {
  width?: number;
  height?: number;
  className?: string;
  showText?: boolean;
};

const Logo = ({
  width = 40,
  height = 40,
  className,
  showText = true,
}: LogoProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={showText ? "0 0 160 36" : "0 0 36 36"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ManhShop"
      role="img"
    >
      <rect width="36" height="36" rx="10" fill="#0085FF" />
      <path
        d="M10 26V10h4.2l3.8 10.2L21.8 10H26v16h-3.4V15.6L19.2 26h-2.4l-3.4-10.4V26H10z"
        fill="#FFFFFF"
      />
      {showText && (
        <text
          x="46"
          y="24"
          fill="#FFFFFF"
          fontFamily="var(--font-poppins), Poppins, sans-serif"
          fontSize="18"
          fontWeight="700"
          letterSpacing="0.2"
        >
          ManhShop
        </text>
      )}
    </svg>
  );
};

export default Logo;
