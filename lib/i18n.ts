export interface Language {
  code: string;
  name: string;
  flag: string;
  symbol: string;
  currencyFormat: (amount: number) => string;
}

export const languages: Language[] = [
  {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    symbol: '€',
    currencyFormat: (amount: number) => 
      new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    symbol: '$',
    currencyFormat: (amount: number) => 
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }
];

export const translations = {
  fr: {
    title: 'LottoGen Pro',
    subtitle: 'Générateur de numéros de loterie professionnel',
    welcome: 'Bienvenue',
    enterName: 'Entrez votre nom',
    saveName: 'Enregistrer',
    generate: 'Générer les numéros',
    generating: 'Génération en cours...',
    numberCount: 'Nombre de numéros',
    maxNumber: 'Nombre maximum',
    bet: 'Mise',
    useCustomNumbers: 'Utiliser des numéros personnalisés',
    customNumbers: 'Vos numéros (séparés par des virgules)',
    duplicateWarning: 'Les doublons seront automatiquement supprimés',
    history: 'Historique',
    noHistory: 'Aucun tirage enregistré',
    enterGains: 'Saisir les gains',
    stats: 'Statistiques',
    totalBets: 'Total misé',
    totalGains: 'Total gagné',
    winRate: 'Taux de réussite',
    numberFrequency: 'Fréquence des numéros',
    congratulations: 'Félicitations !',
    betterLuck: 'Pas de chance...',
    gainRecorded: 'Gain enregistré :',
    nextTime: 'La prochaine fois sera la bonne !',
    mostFrequent: 'Numéros les plus fréquents',
    leastFrequent: 'Numéros les moins fréquents',
    winningStreak: 'Plus longue série gagnante',
    losingStreak: 'Plus longue série perdante',
    averageBet: 'Mise moyenne',
    averageGain: 'Gain moyen',
    bestWin: 'Meilleur gain',
    worstLoss: 'Pire perte',
    profitability: 'Rentabilité',
    profitable: 'Rentable',
    unprofitable: 'Non rentable'
  },
  en: {
    title: 'LottoGen Pro',
    subtitle: 'Professional Lottery Number Generator',
    welcome: 'Welcome',
    enterName: 'Enter your name',
    saveName: 'Save',
    generate: 'Generate numbers',
    generating: 'Generating...',
    numberCount: 'Number count',
    maxNumber: 'Maximum number',
    bet: 'Bet',
    useCustomNumbers: 'Use custom numbers',
    customNumbers: 'Your numbers (comma separated)',
    duplicateWarning: 'Duplicates will be automatically removed',
    history: 'History',
    noHistory: 'No draws recorded',
    enterGains: 'Enter winnings',
    stats: 'Statistics',
    totalBets: 'Total bets',
    totalGains: 'Total winnings',
    winRate: 'Win rate',
    numberFrequency: 'Number frequency',
    congratulations: 'Congratulations!',
    betterLuck: 'Better luck next time...',
    gainRecorded: 'Winnings recorded:',
    nextTime: 'Next time will be the one!',
    mostFrequent: 'Most frequent numbers',
    leastFrequent: 'Least frequent numbers',
    winningStreak: 'Longest winning streak',
    losingStreak: 'Longest losing streak',
    averageBet: 'Average bet',
    averageGain: 'Average gain',
    bestWin: 'Best win',
    worstLoss: 'Worst loss',
    profitability: 'Profitability',
    profitable: 'Profitable',
    unprofitable: 'Unprofitable'
  }
};