'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { CheckCheck, Copy } from 'lucide-react';

interface CoppyButtonProps {
  value?: string;
}

export const CoppyButton = ({ value }: CoppyButtonProps) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const onCopy = () => {
    if (!value) return;

    setIsCopied(true);
    navigator.clipboard.writeText(value);
    setTimeout(() => setIsCopied(false), 1000);
  };

  const Icon = isCopied ? CheckCheck : Copy;

  return (
    <Button onClick={onCopy} disabled={!value || isCopied}>
      <Icon className='h-4 w-4' />
    </Button>
  );
};
