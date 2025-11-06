import React from "react";

const ConfeedLogo: React.FC = () => {
  return (
    <svg
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
    >
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="1" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Chat/Message bubble with stars */}
      <g transform="translate(400, 280)">
        {/* Main message bubble */}
        <rect
          x="-120"
          y="-80"
          width="240"
          height="160"
          rx="30"
          fill="url(#gradient1)"
          opacity="0.9"
        >
          <animate
            attributeName="y"
            values="-80;-82;-80"
            dur="3s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Message tail */}
        <path
          d="M -60,80 L -70,110 L -40,80 Z"
          fill="url(#gradient1)"
          opacity="0.9"
        >
          <animate
            attributeName="opacity"
            values="0.9;0.7;0.9"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>

        {/* Three stars for rating */}
        <g transform="translate(-70, 0)">
          <path
            d="M 0,-16 L 4,-4 L 16,-4 L 6,4 L 10,16 L 0,8 L -10,16 L -6,4 L -16,-4 L -4,-4 Z"
            fill="#FCD34D"
          >
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        <g transform="translate(0, 0)">
          <path
            d="M 0,-16 L 4,-4 L 16,-4 L 6,4 L 10,16 L 0,8 L -10,16 L -6,4 L -16,-4 L -4,-4 Z"
            fill="#FCD34D"
          >
            <animate
              attributeName="opacity"
              values="1;0.8;1"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        <g transform="translate(70, 0)">
          <path
            d="M 0,-16 L 4,-4 L 16,-4 L 6,4 L 10,16 L 0,8 L -10,16 L -6,4 L -16,-4 L -4,-4 Z"
            fill="#FCD34D"
          >
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </g>

      {/* Text */}
      <text
        x="400"
        y="560"
        fontFamily="Arial, sans-serif"
        fontSize="112"
        fontWeight="bold"
        fill="#1E293B"
        textAnchor="middle"
      >
        Confeed
      </text>
      <text
        x="400"
        y="620"
        fontFamily="Arial, sans-serif"
        fontSize="32"
        fill="#64748B"
        textAnchor="middle"
      >
        Conference Feedback
      </text>
    </svg>
  );
};

export default ConfeedLogo;