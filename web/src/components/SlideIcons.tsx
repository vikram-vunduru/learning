// SVG illustration components for slide backgrounds
// Each icon is designed for Salesforce dark-navy slides

interface IconProps { size?: number; color?: string; className?: string }

export function BrainIcon({ size = 80, color = "#00a1e0", className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <ellipse cx="28" cy="36" rx="18" ry="22" stroke={color} strokeWidth="2.5" fill={`${color}12`} />
      <ellipse cx="52" cy="36" rx="18" ry="22" stroke={color} strokeWidth="2.5" fill={`${color}12`} />
      <line x1="40" y1="14" x2="40" y2="58" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
      {/* Neuron connections */}
      <circle cx="22" cy="28" r="3" fill={color} opacity="0.7" />
      <circle cx="32" cy="22" r="2.5" fill={color} opacity="0.7" />
      <circle cx="20" cy="42" r="3" fill={color} opacity="0.7" />
      <circle cx="34" cy="48" r="2.5" fill={color} opacity="0.7" />
      <circle cx="58" cy="28" r="3" fill={color} opacity="0.7" />
      <circle cx="48" cy="20" r="2.5" fill={color} opacity="0.7" />
      <circle cx="60" cy="44" r="3" fill={color} opacity="0.7" />
      <circle cx="46" cy="50" r="2.5" fill={color} opacity="0.7" />
      <line x1="22" y1="28" x2="32" y2="22" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="22" y1="28" x2="20" y2="42" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="32" y1="22" x2="34" y2="48" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="58" y1="28" x2="48" y2="20" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="58" y1="28" x2="60" y2="44" stroke={color} strokeWidth="1" opacity="0.4" />
      {/* Spark dots at tips */}
      <circle cx="40" cy="12" r="3" fill={color} opacity="0.9" />
      <circle cx="40" cy="60" r="3" fill={color} opacity="0.9" />
    </svg>
  );
}

export function NetworkIcon({ size = 80, color = "#9c59ff", className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      {/* Input layer */}
      {[18, 30, 42, 54].map((y, i) => (
        <circle key={i} cx="12" cy={y} r="5" stroke={color} strokeWidth="2" fill={`${color}20`} />
      ))}
      {/* Hidden layer 1 */}
      {[22, 36, 50].map((y, i) => (
        <circle key={i} cx="32" cy={y} r="5" stroke={color} strokeWidth="2" fill={`${color}30`} />
      ))}
      {/* Hidden layer 2 */}
      {[22, 36, 50].map((y, i) => (
        <circle key={i} cx="52" cy={y} r="5" stroke={color} strokeWidth="2" fill={`${color}30`} />
      ))}
      {/* Output layer */}
      {[30, 42].map((y, i) => (
        <circle key={i} cx="72" cy={y} r="5" stroke={color} strokeWidth="2" fill={`${color}40`} />
      ))}
      {/* Connections (input → h1) */}
      {[18, 30, 42, 54].flatMap((iy) => [22, 36, 50].map((hy) => (
        <line key={`${iy}-${hy}`} x1="17" y1={iy} x2="27" y2={hy} stroke={color} strokeWidth="0.8" opacity="0.3" />
      )))}
      {/* h1 → h2 */}
      {[22, 36, 50].flatMap((h1y) => [22, 36, 50].map((h2y) => (
        <line key={`h1${h1y}-h2${h2y}`} x1="37" y1={h1y} x2="47" y2={h2y} stroke={color} strokeWidth="0.8" opacity="0.3" />
      )))}
      {/* h2 → output */}
      {[22, 36, 50].flatMap((hy) => [30, 42].map((oy) => (
        <line key={`h2${hy}-o${oy}`} x1="57" y1={hy} x2="67" y2={oy} stroke={color} strokeWidth="1" opacity="0.4" />
      )))}
    </svg>
  );
}

export function ChartIcon({ size = 80, color = "#1589ee", className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <rect x="8" y="60" width="10" height="14" rx="2" fill={color} opacity="0.4" />
      <rect x="24" y="44" width="10" height="30" rx="2" fill={color} opacity="0.55" />
      <rect x="40" y="30" width="10" height="44" rx="2" fill={color} opacity="0.7" />
      <rect x="56" y="16" width="10" height="58" rx="2" fill={color} opacity="0.85" />
      {/* Trend line */}
      <polyline points="13,60 29,44 45,29 61,14" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Dots on trend */}
      {[[13,60],[29,44],[45,29],[61,14]].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={color} />
      ))}
      {/* Arrow */}
      <polyline points="55,10 65,14 61,24" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function SparkleTextIcon({ size = 80, color = "#9c59ff", className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      {/* Document */}
      <rect x="12" y="10" width="44" height="56" rx="5" stroke={color} strokeWidth="2" fill={`${color}10`} />
      {/* Text lines */}
      <line x1="20" y1="25" x2="48" y2="25" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="20" y1="33" x2="48" y2="33" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="20" y1="41" x2="38" y2="41" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* Blinking cursor */}
      <rect x="40" y="38" width="3" height="8" rx="1" fill={color} opacity="0.9" />
      {/* Sparkles */}
      <path d="M62 12 L63.5 16 L68 17.5 L63.5 19 L62 23 L60.5 19 L56 17.5 L60.5 16 Z" fill={color} opacity="0.9" />
      <path d="M70 30 L71 33 L74 34 L71 35 L70 38 L69 35 L66 34 L69 33 Z" fill={color} opacity="0.7" />
      <path d="M58 52 L59 55 L62 56 L59 57 L58 60 L57 57 L54 56 L57 55 Z" fill={color} opacity="0.6" />
    </svg>
  );
}

export function ShieldIcon({ size = 80, color = "#00a1e0", className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <path d="M40 8 L66 18 L66 40 C66 56 40 72 40 72 C40 72 14 56 14 40 L14 18 Z"
        stroke={color} strokeWidth="2.5" fill={`${color}12`} strokeLinejoin="round" />
      {/* Inner shield accent */}
      <path d="M40 16 L58 23.5 L58 40 C58 51 40 62 40 62 C40 62 22 51 22 40 L22 23.5 Z"
        stroke={color} strokeWidth="1" fill={`${color}08`} strokeLinejoin="round" opacity="0.5" />
      {/* Check mark */}
      <polyline points="28,40 36,48 54,30" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Glow dot at top */}
      <circle cx="40" cy="8" r="3" fill={color} opacity="0.8" />
    </svg>
  );
}

export function DatabaseIcon({ size = 80, color = "#3ba755", className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      {/* Cylinder stack */}
      <ellipse cx="40" cy="20" rx="24" ry="8" stroke={color} strokeWidth="2" fill={`${color}20`} />
      <rect x="16" y="20" width="48" height="16" fill={`${color}12`} />
      <ellipse cx="40" cy="36" rx="24" ry="8" stroke={color} strokeWidth="2" fill={`${color}20`} />
      <rect x="16" y="36" width="48" height="16" fill={`${color}12`} />
      <ellipse cx="40" cy="52" rx="24" ry="8" stroke={color} strokeWidth="2" fill={`${color}25`} />
      {/* Side lines */}
      <line x1="16" y1="20" x2="16" y2="52" stroke={color} strokeWidth="2" />
      <line x1="64" y1="20" x2="64" y2="52" stroke={color} strokeWidth="2" />
      {/* Data flow dots */}
      <circle cx="32" cy="28" r="2.5" fill={color} opacity="0.7" />
      <circle cx="40" cy="28" r="2.5" fill={color} opacity="0.7" />
      <circle cx="48" cy="28" r="2.5" fill={color} opacity="0.7" />
      {/* Arrow out */}
      <line x1="64" y1="36" x2="74" y2="36" stroke={color} strokeWidth="2" strokeDasharray="3 2" />
      <polyline points="70,32 74,36 70,40" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function ScalesIcon({ size = 80, color = "#ffb75d", className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      {/* Centre pole */}
      <line x1="40" y1="14" x2="40" y2="66" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Base */}
      <line x1="28" y1="66" x2="52" y2="66" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* Horizontal beam */}
      <line x1="12" y1="26" x2="68" y2="26" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="40" cy="26" r="4" fill={color} />
      {/* Left pan chains */}
      <line x1="16" y1="26" x2="14" y2="42" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <line x1="20" y1="26" x2="22" y2="42" stroke={color} strokeWidth="1.5" opacity="0.7" />
      {/* Left pan */}
      <path d="M10 42 Q16 52 22 42" stroke={color} strokeWidth="2" fill={`${color}30`} />
      {/* Right pan chains */}
      <line x1="60" y1="26" x2="58" y2="42" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <line x1="64" y1="26" x2="66" y2="42" stroke={color} strokeWidth="1.5" opacity="0.7" />
      {/* Right pan */}
      <path d="M58 42 Q64 52 70 42" stroke={color} strokeWidth="2" fill={`${color}30`} />
    </svg>
  );
}

export function AgentIcon({ size = 80, color = "#00a1e0", className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      {/* Head */}
      <rect x="22" y="14" width="36" height="32" rx="8" stroke={color} strokeWidth="2.5" fill={`${color}15`} />
      {/* Eyes */}
      <circle cx="32" cy="28" r="5" fill={color} opacity="0.8" />
      <circle cx="48" cy="28" r="5" fill={color} opacity="0.8" />
      <circle cx="33" cy="27" r="2" fill="white" opacity="0.9" />
      <circle cx="49" cy="27" r="2" fill="white" opacity="0.9" />
      {/* Antenna */}
      <line x1="40" y1="14" x2="40" y2="6" stroke={color} strokeWidth="2" />
      <circle cx="40" cy="5" r="3" fill={color} />
      {/* Body */}
      <rect x="26" y="48" width="28" height="20" rx="5" stroke={color} strokeWidth="2" fill={`${color}12`} />
      {/* Buttons */}
      <circle cx="34" cy="56" r="3" fill={color} opacity="0.6" />
      <circle cx="46" cy="56" r="3" fill={color} opacity="0.6" />
      {/* Arms */}
      <line x1="22" y1="52" x2="14" y2="60" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="58" y1="52" x2="66" y2="60" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function SalesforceCloudIcon({ size = 80, color = "#0176d3", className = "" }: IconProps) {
  return (
    <svg width={size} height={size * 0.68} viewBox="0 0 120 82" fill="none" className={className}>
      <path
        d="M50 16C55 7 65 2 76 2C91 2 104 13 105 28C110 25 115 29 115 35C115 41.5 109.5 47 103 47H22C13.2 47 6 39.8 6 31C6 22.8 12.2 16.2 20.2 15.4C20.6 5.8 28.6 -1 38.2 -1C42.8 -1 47 1 50 4.8"
        fill={color}
        opacity="0.9"
      />
      {/* Lightning bolt */}
      <path d="M58 52 L48 68 L57 68 L42 86 L68 66 L58 66 Z" fill="white" opacity="0.9" />
    </svg>
  );
}

export function EyeIcon({ size = 80, color = "#06b6d4", className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      {/* Outer eye */}
      <path d="M8 40 C20 18 60 18 72 40 C60 62 20 62 8 40 Z" stroke={color} strokeWidth="2.5" fill={`${color}10`} />
      {/* Iris */}
      <circle cx="40" cy="40" r="12" stroke={color} strokeWidth="2.5" fill={`${color}20`} />
      {/* Pupil */}
      <circle cx="40" cy="40" r="5" fill={color} opacity="0.9" />
      {/* Shine */}
      <circle cx="43" cy="37" r="2.5" fill="white" opacity="0.7" />
      {/* Lashes top */}
      <line x1="30" y1="22" x2="29" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="40" y1="18" x2="40" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="50" y1="22" x2="51" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function WarnIcon({ size = 80, color = "#ffb75d", className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <path d="M40 8 L72 68 H8 Z" stroke={color} strokeWidth="2.5" fill={`${color}12`} strokeLinejoin="round" />
      <line x1="40" y1="30" x2="40" y2="50" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="40" cy="60" r="3.5" fill={color} />
    </svg>
  );
}

export function ChatIcon({ size = 80, color = "#9c59ff", className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      {/* Main bubble */}
      <rect x="8" y="10" width="52" height="36" rx="10" stroke={color} strokeWidth="2.5" fill={`${color}12`} />
      {/* Tail */}
      <path d="M22 46 L16 58 L32 46" fill={`${color}12`} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {/* Dots */}
      <circle cx="22" cy="28" r="4" fill={color} opacity="0.8" />
      <circle cx="34" cy="28" r="4" fill={color} opacity="0.8" />
      <circle cx="46" cy="28" r="4" fill={color} opacity="0.8" />
      {/* Small reply bubble */}
      <rect x="36" y="46" width="34" height="22" rx="7" stroke={color} strokeWidth="2" fill={`${color}20`} opacity="0.7" />
      <line x1="44" y1="55" x2="62" y2="55" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      <line x1="44" y1="62" x2="56" y2="62" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

// Map slide title keywords → icon component + color
export function getSlideIcon(slideTitle: string, lectureTitle: string, accentColor: string): React.ReactNode {
  const text = `${slideTitle} ${lectureTitle}`.toLowerCase();

  if (/neural|deep learning|backprop|layer/.test(text))
    return <NetworkIcon size={90} color={accentColor} className="anim-float" />;

  if (/brain|what is ai|introduction|artificial intelligence|narrow|general/.test(text))
    return <BrainIcon size={90} color={accentColor} className="anim-float" />;

  if (/predict|forecast|lead scor|chart|trend|regression|supervised|machine learn|ml type/.test(text))
    return <ChartIcon size={90} color={accentColor} className="anim-float" />;

  if (/llm|language model|token|embedding|generative|gpt|claude|gemini/.test(text))
    return <SparkleTextIcon size={90} color={accentColor} className="anim-float" />;

  if (/prompt|prompting|zero-shot|few-shot|chain/.test(text))
    return <ChatIcon size={90} color={accentColor} className="anim-float" />;

  if (/trust layer|shield|masking|privacy|zero data|security|gdpr|compliance/.test(text))
    return <ShieldIcon size={90} color={accentColor} className="anim-float" />;

  if (/rag|retrieval|grounding|database|data cloud|training data|structured|unstructured|quality/.test(text))
    return <DatabaseIcon size={90} color={accentColor} className="anim-float" />;

  if (/agent|copilot|agentforce|robot/.test(text))
    return <AgentIcon size={90} color={accentColor} className="anim-float" />;

  if (/ethic|principle|responsible|trusted/.test(text))
    return <ScalesIcon size={90} color={accentColor} className="anim-float" />;

  if (/bias|hallucination|limitation|warn/.test(text))
    return <WarnIcon size={90} color={accentColor} className="anim-float" />;

  if (/transparen|explainab|magnif|audit/.test(text))
    return <EyeIcon size={90} color={accentColor} className="anim-float" />;

  if (/human oversight|accountability|oversight/.test(text))
    return <EyeIcon size={90} color={accentColor} className="anim-float" />;

  if (/salesforce|einstein|platform|cloud|lightning/.test(text))
    return <SalesforceCloudIcon size={90} color={accentColor} className="anim-float" />;

  // Default: Salesforce cloud
  return <SalesforceCloudIcon size={80} color={accentColor} className="anim-float" />;
}
