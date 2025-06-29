import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-xl font-bold font-headline text-primary">
      <BrainCircuit className="h-7 w-7" />
      <span>MathWhiz</span>
    </Link>
  );
}
