"use client";

import { motion } from "framer-motion";

export const PageLoader = ({ className, ...props }: any) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      role="status"
      aria-live="polite"
      {...props}
    />
  );
};