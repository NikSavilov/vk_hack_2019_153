import React from "react";

export const TripleDotsIcon = page => {
  page = page.page;
  return (
    <svg
      width="38"
      height="10"
      viewBox="0 0 38 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 9C6.20914 9 8 7.20914 8 5C8 2.79086 6.20914 1 4 1C1.79086 1 0 2.79086 0 5C0 7.20914 1.79086 9 4 9Z"
        fill={page === 1 ? "#fff" : "transparent"}
        stroke={page !== 1 ? "#838897" : "none"}
        strokeOpacity={page !== 1 ? "0.590438" : "none"}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.5 9C20.7091 9 22.5 7.20914 22.5 5C22.5 2.79086 20.7091 1 18.5 1C16.2909 1 14.5 2.79086 14.5 5C14.5 7.20914 16.2909 9 18.5 9Z"
        fill={page === 2 ? "#fff" : "transparent"}
        stroke={page !== 2 ? "#838897" : "none"}
        strokeOpacity={page !== 2 ? "0.590438" : "none"}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33 9C35.2091 9 37 7.20914 37 5C37 2.79086 35.2091 1 33 1C30.7909 1 29 2.79086 29 5C29 7.20914 30.7909 9 33 9Z"
        fill={page === 3 ? "#fff" : "transparent"}
        stroke={page !== 3 ? "#838897" : "none"}
        strokeOpacity={page !== 3 ? "0.590438" : "none"}
      />
    </svg>
  );
};
