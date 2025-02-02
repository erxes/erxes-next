export const colors = [
  'tomato',
  'red',
  'ruby',
  'crimson',
  'pink',
  'plum',
  'purple',
  'violet',
  'iris',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'jade',
  'green',
  'grass',
  'bronze',
  'gold',
  'brown',
  'orange',
  'amber',
  'yellow',
  'lime',
  'mint',
  'sky',
] as const;

export const twColorClassNames = {
  tomato: 'bg-radix-tomato text-radix-tomato-foreground',
  red: 'bg-radix-red text-radix-red-foreground',
  ruby: 'bg-radix-ruby text-radix-ruby-foreground',
  crimson: 'bg-radix-crimson text-radix-crimson-foreground',
  pink: 'bg-radix-pink text-radix-pink-foreground',
  plum: 'bg-radix-plum text-radix-plum-foreground',
  purple: 'bg-radix-purple text-radix-purple-foreground',
  violet: 'bg-radix-violet text-radix-violet-foreground',
  iris: 'bg-radix-iris text-radix-iris-foreground',
  indigo: 'bg-radix-indigo text-radix-indigo-foreground',
  blue: 'bg-radix-blue text-radix-blue-foreground',
  cyan: 'bg-radix-cyan text-radix-cyan-foreground',
  teal: 'bg-radix-teal text-radix-teal-foreground',
  jade: 'bg-radix-jade text-radix-jade-foreground',
  green: 'bg-radix-green text-radix-green-foreground',
  grass: 'bg-radix-grass text-radix-grass-foreground',
  bronze: 'bg-radix-bronze text-radix-bronze-foreground',
  gold: 'bg-radix-gold text-radix-gold-foreground',
  brown: 'bg-radix-brown text-radix-brown-foreground',
  orange: 'bg-radix-orange text-radix-orange-foreground',
  amber: 'bg-radix-amber text-radix-amber-foreground',
  yellow: 'bg-radix-yellow text-radix-yellow-foreground',
  lime: 'bg-radix-lime text-radix-lime-foreground',
  mint: 'bg-radix-mint text-radix-mint-foreground',
  sky: 'bg-radix-sky text-radix-sky-foreground',
};

export type Color = (typeof colors)[number];

export const getColorByString = (str: string) => {
  const color = str.charAt(0).toLowerCase();
  return colors.includes(color as Color) ? color : 'sky';
};

export const stringToHslColor = (
  str: string,
  saturation: number,
  lightness: number
) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = hash % 360;
  return `hsl(${h}, ${saturation}%, ${lightness}%)`;
};
