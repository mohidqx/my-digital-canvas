"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "primary" | "secondary" | "none";
  delay?: number;
  onClick?: () => void;
}

const glowMap = {
  primary: "hover:shadow-glow-md hover:border-primary/30",
  secondary: "hover:shadow-teal-md hover:border-secondary/30",
  none: "",
};

export function GlassCard({
  children,
  className,
  hover = true,
  glow = "primary",
  delay = 0,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 20,
        delay,
      }}
      whileHover={hover ? { y: -4 } : undefined}
      onClick={onClick}
      className={cn(
        "glass transition-all duration-300",
        hover && "cursor-default",
        onClick && "cursor-pointer",
        glow !== "none" && glowMap[glow],
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger container ─────────────────────────────────────────────────────────
export function StaggerContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.1 },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 120, damping: 20 },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
