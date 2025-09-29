import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon";
  animated?: boolean;
}

export function Logo({ 
  className, 
  size = "md", 
  variant = "full",
  animated = false 
}: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: 20, width: 180 },
    md: { icon: 40, text: 24, width: 220 },
    lg: { icon: 48, text: 28, width: 260 },
    xl: { icon: 64, text: 36, width: 320 }
  };

  const currentSize = sizes[size];
  const iconSize = currentSize.icon;
  const totalWidth = variant === "icon" ? iconSize : currentSize.width;
  const totalHeight = iconSize;

  const LogoWrapper = animated ? motion.svg : "svg";
  const animationProps = animated ? {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5, type: "spring", stiffness: 100 },
    whileHover: { scale: 1.05 }
  } : {};

  return (
    <LogoWrapper
      width={totalWidth}
      height={totalHeight}
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      className={cn("select-none", className)}
      xmlns="http://www.w3.org/2000/svg"
      {...animationProps}
    >
      {/* Define gradients */}
      <defs>
        <linearGradient id="logoGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="logoGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="logoGradient3" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
        <filter id="logoShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.1"/>
        </filter>
      </defs>

      {/* Icon Group */}
      <g filter="url(#logoShadow)">
        {/* Hexagonal Hub Background */}
        <path
          d={`M ${iconSize * 0.5} ${iconSize * 0.05} 
              L ${iconSize * 0.95} ${iconSize * 0.275} 
              L ${iconSize * 0.95} ${iconSize * 0.725} 
              L ${iconSize * 0.5} ${iconSize * 0.95} 
              L ${iconSize * 0.05} ${iconSize * 0.725} 
              L ${iconSize * 0.05} ${iconSize * 0.275} Z`}
          fill="url(#logoGradient1)"
          opacity="0.1"
        />

        {/* Central Hub Circle */}
        <circle
          cx={iconSize * 0.5}
          cy={iconSize * 0.5}
          r={iconSize * 0.18}
          fill="url(#logoGradient2)"
        />

        {/* Tool Elements - Wrench Shape */}
        <g transform={`translate(${iconSize * 0.15}, ${iconSize * 0.15})`}>
          <path
            d={`M 0 ${iconSize * 0.15} 
                L ${iconSize * 0.12} ${iconSize * 0.03} 
                Q ${iconSize * 0.15} 0 ${iconSize * 0.18} ${iconSize * 0.03}
                L ${iconSize * 0.06} ${iconSize * 0.15}
                Q ${iconSize * 0.03} ${iconSize * 0.18} 0 ${iconSize * 0.15} Z`}
            fill="url(#logoGradient3)"
            opacity="0.9"
          />
        </g>

        {/* Tool Elements - Gear Shape */}
        <g transform={`translate(${iconSize * 0.65}, ${iconSize * 0.6})`}>
          <circle
            cx={iconSize * 0.1}
            cy={iconSize * 0.1}
            r={iconSize * 0.08}
            fill="none"
            stroke="url(#logoGradient2)"
            strokeWidth={iconSize * 0.02}
          />
          {/* Gear teeth */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <rect
              key={i}
              x={iconSize * 0.095}
              y={-iconSize * 0.01}
              width={iconSize * 0.01}
              height={iconSize * 0.03}
              fill="url(#logoGradient2)"
              transform={`rotate(${angle} ${iconSize * 0.1} ${iconSize * 0.1})`}
            />
          ))}
        </g>

        {/* Tool Elements - File/Document Shape */}
        <g transform={`translate(${iconSize * 0.6}, ${iconSize * 0.15})`}>
          <path
            d={`M 0 0 
                L ${iconSize * 0.12} 0 
                L ${iconSize * 0.18} ${iconSize * 0.06}
                L ${iconSize * 0.18} ${iconSize * 0.24}
                L 0 ${iconSize * 0.24} Z`}
            fill="url(#logoGradient3)"
            opacity="0.8"
          />
          <path
            d={`M ${iconSize * 0.12} 0 
                L ${iconSize * 0.12} ${iconSize * 0.06}
                L ${iconSize * 0.18} ${iconSize * 0.06}`}
            fill="url(#logoGradient2)"
            opacity="0.9"
          />
        </g>

        {/* Tool Elements - Lock Shape */}
        <g transform={`translate(${iconSize * 0.15}, ${iconSize * 0.55})`}>
          <rect
            x={0}
            y={iconSize * 0.06}
            width={iconSize * 0.15}
            height={iconSize * 0.12}
            rx={iconSize * 0.02}
            fill="url(#logoGradient2)"
            opacity="0.85"
          />
          <path
            d={`M ${iconSize * 0.03} ${iconSize * 0.06}
                L ${iconSize * 0.03} ${iconSize * 0.03}
                Q ${iconSize * 0.03} 0 ${iconSize * 0.075} 0
                Q ${iconSize * 0.12} 0 ${iconSize * 0.12} ${iconSize * 0.03}
                L ${iconSize * 0.12} ${iconSize * 0.06}`}
            fill="none"
            stroke="url(#logoGradient2)"
            strokeWidth={iconSize * 0.02}
            opacity="0.85"
          />
        </g>

        {/* Connecting Lines */}
        <g opacity="0.3">
          <line
            x1={iconSize * 0.5}
            y1={iconSize * 0.5}
            x2={iconSize * 0.25}
            y2={iconSize * 0.25}
            stroke="url(#logoGradient1)"
            strokeWidth={iconSize * 0.015}
          />
          <line
            x1={iconSize * 0.5}
            y1={iconSize * 0.5}
            x2={iconSize * 0.75}
            y2={iconSize * 0.25}
            stroke="url(#logoGradient1)"
            strokeWidth={iconSize * 0.015}
          />
          <line
            x1={iconSize * 0.5}
            y1={iconSize * 0.5}
            x2={iconSize * 0.25}
            y2={iconSize * 0.65}
            stroke="url(#logoGradient1)"
            strokeWidth={iconSize * 0.015}
          />
          <line
            x1={iconSize * 0.5}
            y1={iconSize * 0.5}
            x2={iconSize * 0.75}
            y2={iconSize * 0.7}
            stroke="url(#logoGradient1)"
            strokeWidth={iconSize * 0.015}
          />
        </g>

        {/* Central Hub Highlight */}
        <circle
          cx={iconSize * 0.5}
          cy={iconSize * 0.5}
          r={iconSize * 0.08}
          fill="white"
          opacity="0.9"
        />
      </g>

      {/* Text (if variant is "full") */}
      {variant === "full" && (
        <text
          x={iconSize + 12}
          y={iconSize * 0.5}
          fill="currentColor"
          fontSize={currentSize.text}
          fontWeight="700"
          fontFamily="'Inter', system-ui, -apple-system, sans-serif"
          alignmentBaseline="middle"
          dominantBaseline="middle"
          textAnchor="start"
        >
          AltafToolsHub
        </text>
      )}
    </LogoWrapper>
  );
}

export function LogoIcon({ className, size = "md", animated = false }: Omit<LogoProps, "variant">) {
  return <Logo className={className} size={size} variant="icon" animated={animated} />;
}

export function LogoFull({ className, size = "md", animated = false }: Omit<LogoProps, "variant">) {
  return <Logo className={className} size={size} variant="full" animated={animated} />;
}