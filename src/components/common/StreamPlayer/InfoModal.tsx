'use client';

import React, { ElementRef, useRef, useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { updateStream } from '@/actions/stream';
import { ImageFile } from '@/types/dto';
import { UploadButton } from '../UploadButton';
import { Tables } from '@/types/supabase';
import Image from 'next/image';

interface InfoCardProps {
  initialName: string;
  initialThumbnailUrl: string | null;
}

export const InfoModal = ({ initialName, initialThumbnailUrl }: InfoCardProps) => {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialName);
  const [thumbnail, setThumbnail] = useState<ImageFile>({
    preview: initialThumbnailUrl,
  });

  const closeRef = useRef<ElementRef<'button'>>(null);

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onChangeThumbnail = (file: File) => {
    setThumbnail({ file, preview: URL.createObjectURL(file) });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let formImageData = undefined;

    if (thumbnail.file) {
      formImageData = new FormData();
      formImageData.append('thumbnail', thumbnail.file);
    }

    startTransition(() => {
      updateStream({ name }, formImageData)
        .then(() => {
          toast({ variant: 'success', title: 'Stream updated' });
          closeRef.current?.click();
        })
        .catch(() => toast({ variant: 'destructive', title: 'Có lỗi xảy ra' }));
    });
  };

  console.log(thumbnail);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='link' size='sm' className='ml-auto'>
          Chỉnh sửa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin stream</DialogTitle>
        </DialogHeader>

        <form className='space-y-14' onSubmit={onSubmit}>
          <div className='space-y-2'>
            <Label>Name</Label>
            <Input
              placeholder='Nhập tên stream'
              value={name}
              onChange={onChangeName}
              disabled={isPending}
            />
          </div>

          <div className='space-y-2'>
            <div className='flex gap-4 items-center'>
              <Label>Thumbnail</Label>
              <UploadButton onChange={onChangeThumbnail} />
            </div>
            {thumbnail.preview && (
              <Image
                src={thumbnail.preview}
                alt={name}
                width={200}
                height={200}
                className='rounded-md overflow-hidden w-[200px] h-auto object-cover border border-white/10'
              />
            )}
          </div>

          <div className='flex justify-between'>
            <DialogClose ref={closeRef} asChild>
              <Button type='button' variant='ghost'>
                Hủy
              </Button>
            </DialogClose>
            <Button type='submit' variant='primary' disabled={isPending}>
              Lưu
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
