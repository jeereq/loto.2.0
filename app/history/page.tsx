"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Language, languages } from "@/lib/i18n";
import { Draw } from "@/types/lottery";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, Trash2, PlusCircle, MinusCircle } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function HistoryPage() {
  const [history, setHistory] = useState<Draw[]>([]);
  const [language, setLanguage] = useState<Language>(languages[0]);
  const [editingDraw, setEditingDraw] = useState<Draw | null>(null);
  const [gainInput, setGainInput] = useState("");
  const { toast } = useToast();

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

  const updateDraw = (draw: Draw) => {
    const gain = parseFloat(gainInput);
    if (!isNaN(gain)) {
      const updatedHistory = history.map(d => 
        d.date === draw.date ? { ...d, gain } : d
      );
      setHistory(updatedHistory);
      localStorage.setItem("lotto-history", JSON.stringify(updatedHistory));
      setEditingDraw(null);
      setGainInput("");

      toast({
        title: gain > draw.bet ? "Gain enregistré !" : "Perte enregistrée",
        description: language.currencyFormat(gain),
        variant: gain > draw.bet ? "default" : "destructive",
      });
    }
  };

  const deleteDraw = (draw: Draw) => {
    const updatedHistory = history.filter(d => d.date !== draw.date);
    setHistory(updatedHistory);
    localStorage.setItem("lotto-history", JSON.stringify(updatedHistory));
    
    toast({
      title: "Tirage supprimé",
      variant: "destructive",
    });
  };

  const totalBets = history.reduce((sum, draw) => sum + draw.bet, 0);
  const totalGains = history.reduce((sum, draw) => sum + (draw.gain || 0), 0);
  const balance = totalGains - totalBets;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center text-white/80 hover:text-white">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </Link>
          <h1 className="text-3xl font-bold">Historique complet</h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white/60">Total misé</h3>
              <MinusCircle className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-2xl font-bold">{language.currencyFormat(totalBets)}</p>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white/60">Total gagné</h3>
              <PlusCircle className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold">{language.currencyFormat(totalGains)}</p>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white/60">Balance</h3>
              {balance >= 0 ? (
                <PlusCircle className="w-4 h-4 text-green-400" />
              ) : (
                <MinusCircle className="w-4 h-4 text-red-400" />
              )}
            </div>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {language.currencyFormat(Math.abs(balance))}
            </p>
          </Card>
        </div>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-white/5">
                <TableHead>Date</TableHead>
                <TableHead>Numéros</TableHead>
                <TableHead>Mise</TableHead>
                <TableHead>Gain/Perte</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((draw, index) => (
                <TableRow key={draw.date} className="hover:bg-white/5">
                  <TableCell className="font-medium">
                    {format(new Date(draw.date), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {draw.numbers.map((num, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-sm font-medium"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{language.currencyFormat(draw.bet)}</TableCell>
                  <TableCell>
                    {draw.gain !== null ? (
                      <span className={draw.gain > draw.bet ? 'text-green-400' : 'text-red-400'}>
                        {language.currencyFormat(draw.gain)}
                      </span>
                    ) : (
                      "Non défini"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => setEditingDraw(draw)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900/95 border-white/10">
                          <DialogHeader>
                            <DialogTitle>Définir le gain/perte</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div className="flex gap-4">
                              <Input
                                type="number"
                                value={gainInput}
                                onChange={(e) => setGainInput(e.target.value)}
                                placeholder="Montant"
                                className="bg-white/5 border-white/10"
                              />
                              <Button
                                onClick={() => editingDraw && updateDraw(editingDraw)}
                                className="bg-blue-600/80 hover:bg-blue-700/80"
                              >
                                Enregistrer
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => deleteDraw(draw)}
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}