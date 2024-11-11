"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface WelcomeDialogProps {
  translations: any;
  onNameSave: (name: string) => void;
}

export function WelcomeDialog({ translations: t, onNameSave }: WelcomeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("user-name");
    if (!savedName) {
      setIsOpen(true);
    }
  }, []);

  const handleSave = () => {
    if (name.trim()) {
      localStorage.setItem("user-name", name.trim());
      onNameSave(name.trim());
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-gray-900/95 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>{t.welcome}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            placeholder={t.enterName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/5 border-white/10"
          />
          <Button
            onClick={handleSave}
            className="w-full bg-blue-600/80 hover:bg-blue-700/80"
          >
            {t.saveName}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}