'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function SearchForm() {
  const [motorCode, setMotorCode] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (motorCode.trim()) {
      router.push(`/motors/${encodeURIComponent(motorCode.trim())}`);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/20 text-primary rounded-full p-3 w-fit mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
        </div>
        <CardTitle className="text-2xl font-headline">Buscador de Motores</CardTitle>
        <CardDescription>Ingresa un código de motor para encontrarlo y sus equivalentes.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="p. ej. M-B3-4-H"
            value={motorCode}
            onChange={(e) => setMotorCode(e.target.value)}
            className="flex-grow"
            aria-label="Motor Code"
          />
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" /> Buscar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
