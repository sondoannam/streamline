'use client';

import { ElementRef, useRef, useState, useTransition } from 'react';

import { IngressInput } from 'livekit-server-sdk';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createIngress } from '@/actions/ingress';
import { toast } from '@/components/ui/use-toast';

const RTMP = String(IngressInput.RTMP_INPUT);
const WHIP = String(IngressInput.WHIP_INPUT);

type IngressType = typeof RTMP | typeof WHIP;

const ConnectModal = () => {
  const closeRef = useRef<ElementRef<'button'>>(null);
  const [ingressType, setIngressType] = useState<IngressType>(RTMP);
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(() => {
      createIngress(parseInt(ingressType))
        .then(() => {
          toast({
            variant: 'success',
            title: 'Thiết lập kết nối thành công',
          });

          closeRef.current?.click();
        })
        .catch(() =>
          toast({
            variant: 'destructive',
            title: 'Có lỗi xảy ra',
          }),
        );
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='primary'>Kết nối</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thiết lập kết nối</DialogTitle>
        </DialogHeader>

        <Select
          value={ingressType}
          onValueChange={(value) => setIngressType(value)}
          disabled={isPending}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Đầu vào' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={RTMP}>RTMP</SelectItem>
            <SelectItem value={WHIP}>WHIP</SelectItem>
          </SelectContent>
        </Select>

        <Alert>
          <AlertTriangle className='h-4 w-4' />
          <AlertTitle>Cảnh báo!</AlertTitle>
          <AlertDescription>
            Hành động này sẽ đặt lại toàn bộ stream key hiện tại của bạn.
          </AlertDescription>
        </Alert>

        <div className='flex justify-between'>
          <DialogClose ref={closeRef} asChild>
            <Button variant='ghost'>Cancel</Button>
          </DialogClose>
          <Button variant='primary' onClick={onSubmit} disabled={isPending}>
            Kết nối
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectModal;
