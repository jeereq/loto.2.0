"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Target, Award } from "lucide-react";
import Link from "next/link";
import { Language, languages } from "@/lib/i18n";
import { Draw } from "@/types/lottery";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { motion } from "framer-motion";

export default function StatsPage() {
  const [history, setHistory] = useState<Draw[]>([]);
  const [language, setLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("lotto-history");
    const savedLanguage = localStorage.getItem("lotto-language");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    if (savedLanguage) {
      const lang = languages.find(l => l.code === savedLanguage);
      if (lang) setLanguage(lang);
    }
  }, []);

  // Calcul des statistiques
  const numberFrequency: { [key: number]: number } = {};
  history.forEach(draw => {
    draw.numbers.forEach(num => {
      numberFrequency[num] = (numberFrequency[num] || 0) + 1;
    });
  });

  const sortedNumbers = Object.entries(numberFrequency)
    .sort(([, a], [, b]) => b - a)
    .map(([number, frequency]) => ({
      number: parseInt(number),
      frequency
    }));

  const mostFrequent = sortedNumbers.slice(0, 5);
  const leastFrequent = sortedNumbers.slice(-5).reverse();

  const profitData = history.map((draw, index) => ({
    index,
    profit: draw.gain ? draw.gain - draw.bet : -draw.bet
  }));

  const cumulativeProfit = history.reduce((acc, draw, index) => {
    const previousProfit = index > 0 ? acc[index - 1].total : 0;
    const currentProfit = draw.gain ? draw.gain - draw.bet : -draw.bet;
    acc.push({
      index,
      total: previousProfit + currentProfit
    });
    return acc;
  }, [] as { index: number; total: number }[]);

  const averageBet = history.reduce((sum, draw) => sum + draw.bet, 0) / history.length;
  const averageGain = history.reduce((sum, draw) => sum + (draw.gain || 0), 0) / history.length;
  const bestWin = Math.max(...history.map(draw => (draw.gain || 0) - draw.bet));
  const worstLoss = Math.min(...history.map(draw => (draw.gain || 0) - draw.bet));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center text-white/80 hover:text-white">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </Link>
          <h1 className="text-3xl font-bold">Statistiques détaillées</h1>
          <div className="w-20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Numéros les plus fréquents
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mostFrequent}>
                <XAxis dataKey="number" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(17, 24, 39, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="frequency" fill="rgba(59, 130, 246, 0.5)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Évolution des gains
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={cumulativeProfit}>
                <XAxis dataKey="index" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(17, 24, 39, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 md:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm text-white/60">Mise moyenne</h4>
                <p className="text-2xl font-bold">
                  {language.currencyFormat(averageBet)}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm text-white/60">Gain moyen</h4>
                <p className="text-2xl font-bold">
                  {language.currencyFormat(averageGain)}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm text-white/60">Meilleur gain</h4>
                <p className="text-2xl font-bold text-green-400">
                  {language.currencyFormat(bestWin)}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm text-white/60">Pire perte</h4>
                <p className="text-2xl font-bold text-red-400">
                  {language.currencyFormat(Math.abs(worstLoss))}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}