'use client';

import { ElementRef, useRef, useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { updateUser } from '@/actions/user';
import { toast } from '@/components/ui/use-toast';

interface BioModalProps {
  initialValue: string | null;
}

export const BioModal = ({ initialValue }: BioModalProps) => {
  const [bio, setBio] = useState(initialValue ?? '');
  const [isPending, startTransition] = useTransition();

  const closeRef = useRef<ElementRef<'button'>>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      updateUser({ bio })
        .then(() => {
          toast({ variant: 'success', title: 'Cập nhật bio thành công' });
          closeRef.current?.click();
        })
        .catch(() => {
          toast({ variant: 'destructive', title: 'Có lỗi xảy ra' });
        });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='link' size='sm' className='ml-auto'>
          Cập nhật
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật Bio</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className='space-y-4'>
          <Textarea
            placeholder='Nhập bio của bạn'
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            disabled={isPending}
            className='resize-none'
          />
          <div className='flex justify-between'>
            <DialogClose ref={closeRef} asChild>
              <Button type='button' variant='ghost' disabled={isPending}>
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
