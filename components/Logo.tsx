"use client";

import { Dices } from "lucide-react";
import { motion } from "framer-motion";

export function Logo() {
  return (
    <motion.div 
      className="flex items-center gap-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <motion.div
          animate={{ 
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <Dices className="w-10 h-10 text-blue-400" />
        </motion.div>
        <motion.div
          className="absolute -inset-1 bg-blue-500/20 blur-lg rounded-full"
          animate={{ 
            opacity: [0.5, 0.8, 0.5],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        />
      </div>
      <div className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
        LottoGen
        <span className="text-blue-400/80 text-sm ml-1">Pro</span>
      </div>
    </motion.div>
  );
}