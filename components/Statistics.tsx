"use client";

import { Card } from "@/components/ui/card";
import { Language } from "@/lib/i18n";
import { Draw } from "@/types/lottery";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Percent } from "lucide-react";

interface StatisticsProps {
  history: Draw[];
  language: Language;
  translations: any;
}

export function Statistics({ history, language, translations: t }: StatisticsProps) {
  const totalBets = history.reduce((sum, draw) => sum + draw.bet, 0);
  const totalGains = history.reduce((sum, draw) => sum + (draw.gain || 0), 0);
  const balance = totalGains - totalBets;
  const winRate = history.length > 0 
    ? (history.filter(draw => (draw.gain || 0) > draw.bet).length / history.length * 100).toFixed(1)
    : 0;

  // Calculate number frequency
  const numberFrequency: { [key: number]: number } = {};
  history.forEach(draw => {
    draw.numbers.forEach(num => {
      numberFrequency[num] = (numberFrequency[num] || 0) + 1;
    });
  });

  const chartData = Object.entries(numberFrequency)
    .map(([number, frequency]) => ({
      number: parseInt(number),
      frequency
    }))
    .sort((a, b) => a.number - b.number);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white/60">{t.totalBets}</h4>
              <TrendingDown className="h-4 w-4 text-red-400" />
            </div>
            <p className="text-2xl font-bold mt-2">{language.currencyFormat(totalBets)}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white/60">{t.totalGains}</h4>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold mt-2">{language.currencyFormat(totalGains)}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white/60">{t.winRate}</h4>
              <Percent className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold mt-2">{winRate}%</p>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 bg-white/5 hover:bg-white/10 transition-colors h-[300px]">
          <h4 className="text-sm font-medium text-white/60 mb-4">{t.numberFrequency}</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="number" 
                stroke="#ffffff60"
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#ffffff60"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(17, 24, 39, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              />
              <Bar 
                dataKey="frequency" 
                fill="rgba(59, 130, 246, 0.5)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>
    </div>
  );
}