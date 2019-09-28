import React from "react";

export const ArrowIcon = ({className}) => {
  return (
    <svg
      width="42"
      height="16"
      viewBox="0 0 42 16"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d)">
        <path
          d="M37.3536 4.35355C37.5488 4.15829 37.5488 3.84171 37.3536 3.64645L34.1716 0.464466C33.9763 0.269204 33.6597 0.269204 33.4645 0.464466C33.2692 0.659728 33.2692 0.976311 33.4645 1.17157L36.2929 4L33.4645 6.82843C33.2692 7.02369 33.2692 7.34027 33.4645 7.53553C33.6597 7.7308 33.9763 7.7308 34.1716 7.53553L37.3536 4.35355ZM4 4.5H37V3.5H4V4.5Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_d"
          x="0"
          y="0.318024"
          width="41.5"
          height="15.364"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
