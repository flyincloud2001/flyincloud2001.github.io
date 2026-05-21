export default function Room() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none',
    }}>
      <svg
        viewBox="0 0 1200 680"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Back wall */}
        <rect x="0" y="0" width="1200" height="680" fill="#0d0f1a" />

        {/* Floor */}
        <rect x="0" y="578" width="1200" height="102" fill="#111320" />
        <line x1="0" y1="578" x2="1200" y2="578" stroke="#1c1f30" strokeWidth="2" />

        {/* ── Left floor-to-ceiling window ── */}
        <g data-id="window">
          {/* Snow scene outside */}
          <rect x="48" y="58" width="264" height="520" fill="#0b1220" />
          {/* Stars / distant snowflakes */}
          {[
            [80, 90], [140, 110], [200, 80], [260, 100], [90, 180],
            [170, 160], [240, 200], [100, 280], [220, 310], [150, 370],
            [80, 420], [200, 450], [260, 390], [120, 500], [240, 510],
            [70, 340], [180, 250], [260, 280], [110, 140], [290, 160],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={1.5 + (i % 3) * 0.8} fill="rgba(220,235,255,0.55)" />
          ))}
          {/* Ground snow */}
          <ellipse cx="180" cy="578" rx="140" ry="18" fill="#1a2035" />
          {/* Window frame border */}
          <rect x="48" y="58" width="264" height="520" fill="none" stroke="#261c0e" strokeWidth="14" />
          {/* Horizontal pane dividers */}
          <line x1="48" y1="231" x2="312" y2="231" stroke="#261c0e" strokeWidth="8" />
          <line x1="48" y1="405" x2="312" y2="405" stroke="#261c0e" strokeWidth="8" />
          {/* Vertical center divider */}
          <line x1="180" y1="58" x2="180" y2="578" stroke="#261c0e" strokeWidth="8" />
        </g>

        {/* ── TV on back wall ── */}
        <g data-id="tv">
          <rect x="478" y="95" width="244" height="160" rx="6" fill="#080a10" />
          <rect x="478" y="95" width="244" height="160" rx="6" fill="none" stroke="#1e2235" strokeWidth="4" />
          {/* Screen (off / dark blue) */}
          <rect x="488" y="104" width="224" height="142" rx="3" fill="#0b0e1c" />
          {/* TV stand */}
          <rect x="571" y="255" width="58" height="18" rx="3" fill="#181a28" />
          <rect x="565" y="273" width="70" height="6" rx="2" fill="#181a28" />
        </g>

        {/* ── Sofa + cushions ── */}
        <g data-id="sofa">
          {/* Back rest */}
          <rect x="348" y="382" width="504" height="92" rx="10" fill="#1b1829" />
          {/* Seat */}
          <rect x="348" y="468" width="504" height="72" rx="5" fill="#231f34" />
          {/* Left arm */}
          <rect x="330" y="382" width="32" height="158" rx="8" fill="#1b1829" />
          {/* Right arm */}
          <rect x="838" y="382" width="32" height="158" rx="8" fill="#1b1829" />
          {/* Cushions on back */}
          <rect x="358" y="390" width="158" height="78" rx="6" fill="#241f36" />
          <rect x="526" y="390" width="160" height="78" rx="6" fill="#241f36" />
          <rect x="696" y="390" width="136" height="78" rx="6" fill="#241f36" />
        </g>

        {/* ── Coffee table ── */}
        <g data-id="coffee-table">
          <rect x="438" y="548" width="324" height="18" rx="4" fill="#16131f" />
          <rect x="448" y="566" width="10" height="14" rx="2" fill="#110f1a" />
          <rect x="742" y="566" width="10" height="14" rx="2" fill="#110f1a" />
        </g>

        {/* ── Fireplace (right back wall) ── */}
        <g data-id="fireplace">
          {/* Mantle shelf */}
          <rect x="868" y="288" width="212" height="22" rx="3" fill="#2c1e0e" />
          {/* Left pillar */}
          <rect x="868" y="310" width="22" height="268" fill="#2c1e0e" />
          {/* Right pillar */}
          <rect x="1058" y="310" width="22" height="268" fill="#2c1e0e" />
          {/* Opening */}
          <rect x="890" y="310" width="168" height="268" rx="4" fill="#060810" />
          {/* Flames */}
          <ellipse cx="950" cy="556" rx="22" ry="32" fill="#b83810" opacity="0.85" />
          <ellipse cx="984" cy="542" rx="28" ry="44" fill="#d44c14" opacity="0.85" />
          <ellipse cx="1018" cy="554" rx="20" ry="30" fill="#b83810" opacity="0.85" />
          <ellipse cx="984" cy="528" rx="17" ry="32" fill="#f07020" opacity="0.9" />
          <ellipse cx="984" cy="514" rx="9" ry="22" fill="#fdb040" opacity="0.95" />
        </g>

        {/* ── Stairs to second floor (far right) ── */}
        <g data-id="stairs">
          <rect x="1070" y="552" width="120" height="26" rx="2" fill="#181b28" />
          <rect x="1090" y="526" width="100" height="26" rx="2" fill="#181b28" />
          <rect x="1110" y="500" width="80"  height="26" rx="2" fill="#181b28" />
          <rect x="1130" y="474" width="60"  height="26" rx="2" fill="#181b28" />
          <rect x="1150" y="448" width="40"  height="26" rx="2" fill="#181b28" />
          <rect x="1170" y="422" width="22"  height="26" rx="2" fill="#181b28" />
          {/* Handrail */}
          <line x1="1075" y1="551" x2="1175" y2="421" stroke="#26293c" strokeWidth="4" strokeLinecap="round" />
          {/* Balusters */}
          <line x1="1090" y1="578" x2="1075" y2="551" stroke="#26293c" strokeWidth="3" />
          <line x1="1130" y1="578" x2="1112" y2="500" stroke="#26293c" strokeWidth="3" />
          <line x1="1170" y1="578" x2="1152" y2="448" stroke="#26293c" strokeWidth="3" />
        </g>

        {/* ── Cat (bottom-left corner) ── */}
        <g data-id="cat" transform="translate(178, 546)">
          {/* Tail */}
          <path d="M22 24 Q44 8 38 -10" fill="none" stroke="#c8a070" strokeWidth="6" strokeLinecap="round" />
          {/* Body */}
          <ellipse cx="0" cy="22" rx="20" ry="16" fill="#c8a070" />
          {/* Head */}
          <circle cx="0" cy="2" r="16" fill="#c8a070" />
          {/* Left ear */}
          <polygon points="-12,-12 -20,-28 -4,-18" fill="#c8a070" />
          <polygon points="-12,-13 -18,-26 -5,-19" fill="#d4927a" />
          {/* Right ear */}
          <polygon points="12,-12 20,-28 4,-18" fill="#c8a070" />
          <polygon points="12,-13 18,-26 5,-19" fill="#d4927a" />
          {/* Eyes */}
          <ellipse cx="-6" cy="0" rx="3.5" ry="4.5" fill="#1a0e08" />
          <ellipse cx="6"  cy="0" rx="3.5" ry="4.5" fill="#1a0e08" />
          {/* Eye shine */}
          <circle cx="-5" cy="-1" r="1" fill="rgba(255,255,255,0.6)" />
          <circle cx="7"  cy="-1" r="1" fill="rgba(255,255,255,0.6)" />
          {/* Nose */}
          <ellipse cx="0" cy="5" rx="2" ry="1.5" fill="#e87080" />
          {/* Whiskers */}
          <line x1="-18" y1="5" x2="-4" y2="6" stroke="#e8d0a0" strokeWidth="1" opacity="0.7" />
          <line x1="-18" y1="8" x2="-4" y2="8" stroke="#e8d0a0" strokeWidth="1" opacity="0.7" />
          <line x1="4"  y1="6" x2="18" y2="5" stroke="#e8d0a0" strokeWidth="1" opacity="0.7" />
          <line x1="4"  y1="8" x2="18" y2="8" stroke="#e8d0a0" strokeWidth="1" opacity="0.7" />
          {/* Paws */}
          <ellipse cx="-12" cy="36" rx="7" ry="4" fill="#c8a070" />
          <ellipse cx="12"  cy="36" rx="7" ry="4" fill="#c8a070" />
        </g>

      </svg>
    </div>
  )
}
