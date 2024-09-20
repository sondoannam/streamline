'use client';

import { ElementRef, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

/**
 *
 * @param file
 * @param callback
 * This function generates a data URL from a file and calls the callback function with the result.
 */
function generateDataUrl(file: File, callback: (imageUrl: string) => void) {
  const reader = new FileReader();
  reader.onload = () => callback(reader.result as string);
  reader.readAsDataURL(file);
}

interface UploadButtonProps {
  label?: string;
  name?: string;
  onChange: (file: File) => void;
}

export const UploadButton = ({ label, name, onChange }: UploadButtonProps) => {
  const inputRef = useRef<ElementRef<'input'>>(null);

  const onClick = () => {
    inputRef.current?.click();
  };

  return (
    <Button type='button' variant='primary' onClick={onClick}>
      <ImageIcon className='h-5 w-5' />
      <p className='text-sm ml-1'>{label ?? 'Tải ảnh'}</p>
      <Input
        accept='image/*'
        ref={inputRef}
        onChange={(e) => {
          const targetFiles = e.target.files;
          if (targetFiles) {
            if (targetFiles[0].type.includes('image')) {
              // Handle image upload
              // generateDataUrl(targetFiles[0], onChange);
              onChange(targetFiles[0]);
            } else {
              toast({ variant: 'destructive', title: 'Chỉ nhận file có định dạng ảnh' });
            }
          }
        }}
        type='file'
        name={name}
        className='hidden'
      />
    </Button>
  );
};
