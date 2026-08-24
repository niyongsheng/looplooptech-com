export default function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="87.5 -32.5 665 665"
      fill="none"
      stroke="currentColor"
      strokeLinejoin="miter"
      className={className}
      aria-hidden="true"
    >
      {/* 柔光层：与核心光段同步流动（略宽一圈 + blur，形成光晕） */}
      <g className="logo-loop-glow">
        <path
          className="logo-loop-stroke"
          d="M180 180 L420 50 L660 180 L660 420 L420 550 L180 420 Z"
          strokeWidth="34"
          pathLength="100"
        />
        <path className="logo-loop-stroke" d="M180 420 L660 180" strokeWidth="14" pathLength="100" />
        <path className="logo-loop-stroke" d="M660 180 L660 420" strokeWidth="34" pathLength="100" />
      </g>
      {/* 核心光段：六边形外框（pathLength 归一化，供 CSS 环流动画使用） */}
      <path
        className="logo-loop-stroke"
        d="M180 180 L420 50 L660 180 L660 420 L420 550 L180 420 Z"
        strokeWidth="30"
        pathLength="100"
      />
      {/* 核心光段：内斜透视细线（与整体一同参与环流动画） */}
      <path className="logo-loop-stroke" d="M180 420 L660 180" strokeWidth="10" pathLength="100" />
      {/* 核心光段：右侧开放竖段（与整体一同参与环流动画） */}
      <path className="logo-loop-stroke" d="M660 180 L660 420" strokeWidth="30" pathLength="100" />
    </svg>
  );
}
