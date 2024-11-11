"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Language } from "@/lib/i18n";
import { Draw } from "@/types/lottery";
import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface DrawHistoryProps {
  history: Draw[];
  language: Language;
  translations: any;
  updateGain: (index: number, gain: number) => void;
}

export function DrawHistory({ history, language, translations: t, updateGain }: DrawHistoryProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [gainInput, setGainInput] = useState("");

  const handleSubmitGain = (index: number) => {
    const gain = parseFloat(gainInput);
    if (!isNaN(gain)) {
      updateGain(index, gain);
      setEditingIndex(null);
      setGainInput("");
    }
  };

  if (history.length === 0) {
    return (
      <Card className="p-6 md:p-8 bg-white/5 backdrop-blur-xl border-white/10 text-center text-white/60">
        {t.noHistory}
      </Card>
    );
  }

  return (
    <Card className="p-4 md:p-6 bg-white/5 backdrop-blur-xl border-white/10">
      <h3 className="text-base md:text-lg font-semibold mb-4">{t.history}</h3>
      <div className="space-y-3 md:space-y-4">
        {history.map((draw, index) => (
          <motion.div
            key={draw.date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 md:p-4 rounded-lg bg-white/5 space-y-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs md:text-sm text-white/60">
                  {format(new Date(draw.date), "PPp")}
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2 mt-2">
                  {draw.numbers.map((num, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-xs md:text-sm font-medium"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs md:text-sm font-medium">
                {language.currencyFormat(draw.bet)}
              </p>
            </div>

            {editingIndex === index ? (
              <div className="flex gap-2 mt-2">
                <Input
                  type="number"
                  value={gainInput}
                  onChange={(e) => setGainInput(e.target.value)}
                  placeholder="0.00"
                  className="bg-white/5 border-white/10 text-sm"
                />
                <Button
                  onClick={() => handleSubmitGain(index)}
                  className="bg-blue-600/80 hover:bg-blue-700/80"
                  size="sm"
                >
                  OK
                </Button>
              </div>
            ) : (
              <div className="flex justify-between items-center mt-2">
                {draw.gain !== null ? (
                  <p className={`text-xs md:text-sm font-medium ${
                    draw.gain > draw.bet ? "text-green-400" : "text-red-400"
                  }`}>
                    {language.currencyFormat(draw.gain)}
                  </p>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() => setEditingIndex(index)}
                    className="text-xs md:text-sm text-white/60 hover:text-white h-8"
                  >
                    {t.enterGains}
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </Card>
  );
}