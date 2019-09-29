import React, { useState } from "react";

//39c3a5
export const CompletedIcon = ({ onClick, initFill = "white" }) => {
  const [fill, setFill] = useState(initFill);
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      onClick={e => {
        onClick(e);
        if (fill === "white") {
          setFill("#39c3a5");
        } else {
          setFill("white");
        }
      }}
    >
      <circle cx="17" cy="17" r="17" fill={fill} />
      <rect x="5" y="5" width="24" height="24" fill="url(#pattern0)" />
      <mask
        id="mask0"
        maskUnits="userSpaceOnUse"
        x="5"
        y="5"
        width="24"
        height="24"
      >
        <rect x="5" y="5" width="24" height="24" fill="url(#pattern1)" />
      </mask>
      <g mask="url(#mask0)">
        <rect x="5" y="5" width="24" height="24" fill="#8C8C8C" />
      </g>
      <defs>
        <pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0" transform="scale(0.00666667)" />
        </pattern>
        <pattern
          id="pattern1"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0" transform="scale(0.00666667)" />
        </pattern>
        <image
          id="image0"
          width="150"
          height="150"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
};
