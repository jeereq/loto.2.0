"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Dices, History, ChartBar, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Statistics } from "@/components/Statistics";
import { LanguageSelector } from "@/components/LanguageSelector";
import { LotteryForm } from "@/components/LotteryForm";
import { Draw } from "@/types/lottery";
import { languages, translations, Language } from "@/lib/i18n";
import { DrawHistory } from "@/components/DrawHistory";
import { WelcomeDialog } from "@/components/WelcomeDialog";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [currentNumbers, setCurrentNumbers] = useState<number[]>([]);
  const [history, setHistory] = useState<Draw[]>([]);
  const [language, setLanguage] = useState<Language>(languages[0]);
  const [userName, setUserName] = useState<string>("");
  const { toast } = useToast();
  const t = translations[language.code as keyof typeof translations];

  useEffect(() => {
    const savedHistory = localStorage.getItem("lotto-history");
    const savedLanguage = localStorage.getItem("lotto-language");
    const savedName = localStorage.getItem("user-name");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedLanguage) {
      const lang = languages.find(l => l.code === savedLanguage);
      if (lang) setLanguage(lang);
    }
    if (savedName) setUserName(savedName);
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem("lotto-language", newLanguage.code);
  };

  const handleNewDraw = (draw: Draw) => {
    setHistory(prev => {
      const updated = [draw, ...prev];
      localStorage.setItem("lotto-history", JSON.stringify(updated));
      return updated;
    });
  };

  const updateGain = (index: number, gain: number) => {
    setHistory(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], gain };
      localStorage.setItem("lotto-history", JSON.stringify(updated));
      return updated;
    });

    toast({
      title: gain > 0 ? t.congratulations : t.betterLuck,
      description: gain > 0 
        ? `${t.gainRecorded} ${language.currencyFormat(gain)}`
        : t.nextTime,
    });
  };

  const NavigationContent = () => (
    <>
      <Link href="/stats">
        <Button variant="ghost" className="w-full justify-start">
          <ChartBar className="w-4 h-4 mr-2" />
          {t.stats}
        </Button>
      </Link>
      <Link href="/history">
        <Button variant="ghost" className="w-full justify-start">
          <History className="w-4 h-4 mr-2" />
          {t.history}
        </Button>
      </Link>
      <div className="mt-2">
        <LanguageSelector
          currentLanguage={language}
          onLanguageChange={handleLanguageChange}
          isMobile
        />
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 pb-20">
      <WelcomeDialog translations={t} onNameSave={setUserName} />
      
      <motion.main 
        className="max-w-6xl mx-auto space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Logo />
            <p className="text-blue-300/60 ml-1 text-sm md:text-base">
              {userName ? `${t.welcome}, ${userName}` : t.subtitle}
            </p>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/stats">
              <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10">
                <ChartBar className="w-4 h-4 mr-2" />
                {t.stats}
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10">
                <History className="w-4 h-4 mr-2" />
                {t.history}
              </Button>
            </Link>
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="bg-white/5 border-white/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-gray-900/95 border-white/10">
                <div className="flex flex-col gap-4 mt-8">
                  <NavigationContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          <div className="space-y-4 md:space-y-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsFormOpen(true)}
              className="cursor-pointer"
            >
              <Card className="p-6 md:p-8 bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/20 hover:border-blue-500/40 transition-all backdrop-blur-xl">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <motion.div
                    animate={{
                      rotate: generating ? 360 : 0,
                    }}
                    transition={{
                      duration: 2,
                      repeat: generating ? Infinity : 0,
                      ease: "linear",
                    }}
                  >
                    <Dices className="w-12 h-12 md:w-16 md:h-16 text-blue-400" />
                  </motion.div>
                  <h2 className="text-xl md:text-2xl font-bold text-center">{t.generate}</h2>
                  
                  <AnimatePresence>
                    {currentNumbers.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-wrap justify-center gap-2 md:gap-3 mt-4"
                      >
                        {currentNumbers.map((num, index) => (
                          <motion.div
                            key={index}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600/30 flex items-center justify-center text-base md:text-lg font-bold"
                          >
                            {num}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>

            <DrawHistory
              history={history.slice(0, 5)}
              language={language}
              translations={t}
              updateGain={updateGain}
            />
          </div>

          <Statistics
            history={history}
            language={language}
            translations={t}
          />
        </div>
      </motion.main>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-gray-900/95 border-white/10 w-[95%] max-w-lg mx-auto">
          <LotteryForm
            language={language}
            translations={t}
            onSuccess={(draw) => {
              handleNewDraw(draw);
              setIsFormOpen(false);
            }}
            setCurrentNumbers={setCurrentNumbers}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}