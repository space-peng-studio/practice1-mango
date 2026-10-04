type MangoProps = {
  /** 每顆芒果的漸層 id 必須唯一 */
  id: string;
  /** 果皮漸層：亮部、中間、暗部 */
  colors?: [string, string, string];
  leaf?: boolean;
  className?: string;
};

export function Mango({
  id,
  colors = ["#ffd34e", "#ff9f1c", "#e8452c"],
  leaf = true,
  className,
}: MangoProps) {
  const [light, mid, dark] = colors;

  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-skin`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor={light} />
          <stop offset="55%" stopColor={mid} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
        <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8cc63f" />
          <stop offset="100%" stopColor="#3b7d20" />
        </linearGradient>
      </defs>
      <path
        d="M108 40 C160 40 188 88 178 140 C168 192 122 214 82 204 C42 194 20 154 30 112 C40 68 64 40 108 40 Z"
        fill={`url(#${id}-skin)`}
      />
      <ellipse
        cx="76"
        cy="94"
        rx="20"
        ry="34"
        fill="#fff"
        opacity="0.3"
        transform="rotate(25 76 94)"
      />
      <path
        d="M108 42 C106 32 108 24 114 18"
        stroke="#6b4423"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {leaf && (
        <>
          <path
            d="M114 20 C132 0 166 2 182 16 C162 30 134 34 114 20 Z"
            fill={`url(#${id}-leaf)`}
          />
          <path
            d="M118 20 C140 14 160 14 178 16"
            stroke="#2f6418"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
        </>
      )}
    </svg>
  );
}
