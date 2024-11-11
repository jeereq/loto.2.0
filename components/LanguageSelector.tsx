"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { languages } from "@/lib/i18n";
import { Language } from "@/lib/i18n";

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  isMobile?: boolean;
}

export function LanguageSelector({ currentLanguage, onLanguageChange, isMobile }: LanguageSelectorProps) {
  if (isMobile) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={currentLanguage.code === lang.code ? "default" : "outline"}
            className={`w-full ${
              currentLanguage.code === lang.code 
                ? "bg-blue-600/80 hover:bg-blue-700/80" 
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
            onClick={() => onLanguageChange(lang)}
          >
            <span className="mr-2 text-lg">{lang.flag}</span>
            {lang.name}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10">
          <span className="mr-2 text-lg">{currentLanguage.flag}</span>
          <span className="mr-1">{currentLanguage.name}</span>
          <span className="text-white/60">({currentLanguage.symbol})</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-900/95 border-white/10">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onLanguageChange(lang)}
            className="hover:bg-white/10 cursor-pointer"
          >
            <span className="mr-2 text-lg">{lang.flag}</span>
            {lang.name}
            <span className="ml-2 text-white/60">({lang.symbol})</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}