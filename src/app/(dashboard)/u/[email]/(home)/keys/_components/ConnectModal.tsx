'use client';

import React from 'react';

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

const ConnectModal = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant='primary'>Kết nối</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thiết lập kết nối</DialogTitle>
        </DialogHeader>

        <Select>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Đầu vào' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='RTMP'>RTMP</SelectItem>
            <SelectItem value='WHIP'>WHIP</SelectItem>
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
          <DialogClose>
            <Button variant='ghost'>Cancel</Button>
          </DialogClose>
          <Button variant='primary'>Kết nối</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectModal;
