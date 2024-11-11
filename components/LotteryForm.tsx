"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Language } from "@/lib/i18n";
import { Draw } from "@/types/lottery";
import { motion, AnimatePresence } from "framer-motion";

interface LotteryFormProps {
  language: Language;
  translations: any;
  onSuccess: (draw: Draw) => void;
  setCurrentNumbers: (numbers: number[]) => void;
}

export function LotteryForm({ language, translations: t, onSuccess, setCurrentNumbers }: LotteryFormProps) {
  const [numberCount, setNumberCount] = useState(6);
  const [maxNumber, setMaxNumber] = useState(49);
  const [bet, setBet] = useState(2);
  const [useCustomNumbers, setUseCustomNumbers] = useState(false);
  const [customNumbers, setCustomNumbers] = useState("");
  const [generating, setGenerating] = useState(false);

  const generateNumbers = () => {
    setGenerating(true);
    setCurrentNumbers([]);

    let numbers: number[];
    if (useCustomNumbers) {
      numbers = Array.from(new Set(
        customNumbers.split(",")
          .map(n => parseInt(n.trim()))
          .filter(n => !isNaN(n) && n > 0 && n <= maxNumber)
      )).slice(0, numberCount);
    } else {
      numbers = [];
      while (numbers.length < numberCount) {
        const num = Math.floor(Math.random() * maxNumber) + 1;
        if (!numbers.includes(num)) {
          numbers.push(num);
        }
      }
    }

    numbers.sort((a, b) => a - b);

    const animateNumbers = async () => {
      for (let i = 0; i < numbers.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setCurrentNumbers(numbers.slice(0, i + 1));
      }
      setGenerating(false);

      const draw: Draw = {
        numbers,
        date: new Date().toISOString(),
        bet,
        gain: null
      };
      onSuccess(draw);
    };

    animateNumbers();
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      generateNumbers();
    }} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t.numberCount}</Label>
          <Input
            type="number"
            min="1"
            max="10"
            value={numberCount}
            onChange={(e) => setNumberCount(parseInt(e.target.value))}
            className="bg-white/5 border-white/10"
          />
        </div>
        <div className="space-y-2">
          <Label>{t.maxNumber}</Label>
          <Input
            type="number"
            min="10"
            max="99"
            value={maxNumber}
            onChange={(e) => setMaxNumber(parseInt(e.target.value))}
            className="bg-white/5 border-white/10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t.bet}</Label>
        <Input
          type="number"
          min="1"
          step="0.1"
          value={bet}
          onChange={(e) => setBet(parseFloat(e.target.value))}
          className="bg-white/5 border-white/10"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="custom-numbers"
          checked={useCustomNumbers}
          onCheckedChange={setUseCustomNumbers}
        />
        <Label htmlFor="custom-numbers">{t.useCustomNumbers}</Label>
      </div>

      <AnimatePresence>
        {useCustomNumbers && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2 overflow-hidden"
          >
            <Label>{t.customNumbers}</Label>
            <Input
              placeholder="1, 2, 3, 4, 5, 6"
              value={customNumbers}
              onChange={(e) => setCustomNumbers(e.target.value)}
              className="bg-white/5 border-white/10"
            />
            <p className="text-sm text-white/60">{t.duplicateWarning}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        disabled={generating}
        className="w-full bg-blue-600/80 hover:bg-blue-700/80"
      >
        {generating ? t.generating : t.generate}
      </Button>
    </form>
  );
}