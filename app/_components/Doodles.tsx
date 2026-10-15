// Decorative stickers from the landing page design. Desktop shows them at the
// hero's edges; phones and tablets show a smaller set, and hide the rest.
// Pure decoration: aria-hidden, pointer-events off, never blocks the form.

const STICKERS = [
  "d-play", "d-heart", "d-strip", "d-rec", "d-bubble", "d-ig", "d-tt", "d-note", "d-spark1", "d-spark2", "d-clap",
];

export default function Doodles() {
  return (
    <div aria-hidden="true" className="doodles pointer-events-none absolute inset-x-0 top-0 hidden">
      <div className="dd d-play rv rv-sticker" style={{ ["--i" as string]: 0 } as React.CSSProperties}>
        <svg width="62" height="62" viewBox="0 0 64 64" fill="none" className="dd-in">
          <rect x="4" y="8" width="56" height="48" rx="14" fill="#B4636D" stroke="#141414" strokeWidth="3" />
          <path d="M26 21 L26 43 L45 32 Z" fill="#fff" stroke="#141414" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="dd d-heart rv rv-sticker" style={{ ["--i" as string]: 1 } as React.CSSProperties}>
        <svg width="44" height="40" viewBox="0 0 48 44" fill="none" className="dd-in">
          <path d="M24 40 C8 28 3 18 9 10 C14 4 22 6 24 12 C26 6 34 4 39 10 C45 18 40 28 24 40 Z" fill="#E3B8B5" stroke="#141414" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="dd d-rec rv rv-sticker" style={{ ["--i" as string]: 2 } as React.CSSProperties}>
        <svg width="100" height="35" viewBox="0 0 110 38" fill="none" className="dd-in">
          <rect x="2" y="2" width="106" height="34" rx="17" fill="#fff" stroke="#141414" strokeWidth="3" />
          <circle className="rec-dot" cx="23" cy="19" r="7" fill="#D62839" />
          <text x="40" y="25" fontFamily="JetBrains Mono, ui-monospace, Menlo, monospace" fontSize="16" fontWeight="700" fill="#141414">REC</text>
        </svg>
      </div>
      <div className="dd d-bubble rv rv-sticker" style={{ ["--i" as string]: 3 } as React.CSSProperties}>
        <svg width="150" height="58" viewBox="0 0 160 62" fill="none" className="dd-in">
          <path d="M14 4 H146 Q156 4 156 14 V38 Q156 48 146 48 H62 L46 60 L48 48 H14 Q4 48 4 38 V14 Q4 4 14 4 Z" fill="#F6EBDD" stroke="#141414" strokeWidth="3" strokeLinejoin="round" />
          <text x="80" y="32" textAnchor="middle" fontFamily="Bricolage Grotesque, Helvetica Neue, Arial, sans-serif" fontSize="17" fontWeight="800" fill="#141414">no dead air</text>
        </svg>
      </div>
      <div className="dd d-ig rv rv-sticker" style={{ ["--i" as string]: 4 } as React.CSSProperties}>
        <svg width="62" height="50" viewBox="0 0 62 50" fill="none" className="dd-in">
          <rect x="3" y="3" width="56" height="44" rx="8" fill="#141414" />
          <rect x="11" y="9" width="6" height="6" rx="1.5" fill="#fff" />
          <rect x="11" y="21" width="6" height="6" rx="1.5" fill="#fff" />
          <rect x="11" y="33" width="6" height="6" rx="1.5" fill="#fff" />
          <rect x="45" y="9" width="6" height="6" rx="1.5" fill="#fff" />
          <rect x="45" y="21" width="6" height="6" rx="1.5" fill="#fff" />
          <rect x="45" y="33" width="6" height="6" rx="1.5" fill="#fff" />
          <rect x="22" y="9" width="18" height="34" rx="3" fill="#F6D5BD" stroke="#141414" strokeWidth="2" />
        </svg>
      </div>
      <div className="dd d-tt rv rv-sticker" style={{ ["--i" as string]: 5 } as React.CSSProperties}>
        <svg width="60" height="54" viewBox="0 0 64 60" fill="none" className="dd-in">
          <rect x="6" y="24" width="52" height="32" rx="5" fill="#fff" stroke="#141414" strokeWidth="3" />
          <path d="M14 38 H50 M14 47 H38" stroke="#141414" strokeWidth="3" strokeLinecap="round" />
          <g transform="rotate(-9 6 24)">
            <rect x="6" y="9" width="52" height="14" rx="3" fill="#141414" />
            <path d="M17 9 L11 23 M29 9 L23 23 M41 9 L35 23 M53 9 L47 23" stroke="#fff" strokeWidth="4" />
          </g>
        </svg>
      </div>
      <div className="dd d-note rv rv-sticker" style={{ ["--i" as string]: 6 } as React.CSSProperties}>
        <svg width="44" height="52" viewBox="0 0 44 52" fill="none" className="dd-in">
          <path d="M16 38 V9 L38 4 V33" stroke="#141414" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 17 L38 12" stroke="#141414" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="10" cy="40" rx="8" ry="6.5" fill="#B4636D" stroke="#141414" strokeWidth="3" />
          <ellipse cx="32" cy="35" rx="8" ry="6.5" fill="#B4636D" stroke="#141414" strokeWidth="3" />
        </svg>
      </div>
      <div className="dd d-spark-l rv rv-sticker" style={{ ["--i" as string]: 6 } as React.CSSProperties}>
        <svg width="30" height="30" viewBox="0 0 32 32" fill="none" className="dd-in">
          <path d="M16 2 C17 11 21 15 30 16 C21 17 17 21 16 30 C15 21 11 17 2 16 C11 15 15 11 16 2 Z" fill="#FFD58A" stroke="#141414" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="dd d-spark-r rv rv-sticker" style={{ ["--i" as string]: 7 } as React.CSSProperties}>
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none" className="dd-in">
          <path d="M16 2 C17 11 21 15 30 16 C21 17 17 21 16 30 C15 21 11 17 2 16 C11 15 15 11 16 2 Z" fill="#F2A7B0" stroke="#141414" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export { STICKERS };
