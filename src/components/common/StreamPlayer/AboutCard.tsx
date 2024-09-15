'use client';

import { VerifyMark } from '@/components/common/VerifyMark';
import { BioModal } from './BioModal';

interface AboutCardProps {
  hostName: string;
  hostIdentity: string;
  viewerIdentity: string;
  bio: string | null;
  followedByCount: number;
}

export const AboutCard = ({
  hostName,
  hostIdentity,
  viewerIdentity,
  bio,
  followedByCount,
}: AboutCardProps) => {
  const hostAsViewer = `host-${hostIdentity}`;
  const isHost = viewerIdentity === hostAsViewer;

  if (!isHost) return null;

  return (
    <div className='px-4'>
      <div className='group rounded-xl bg-background p-6 lg:p-10 flex flex-col gap-y-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-x-2 font-semibold text-lg lg:text-2xl'>
            About {hostName}
            <VerifyMark />
          </div>

          {isHost && <BioModal initialValue={bio} />}
        </div>

        <div className='text-sm text-muted-foreground'>
          <span>{followedByCount}</span> người theo dõi
        </div>
        <p className='text-small'>
          {bio ?? 'Người dùng này chưa chia sẻ thông tin nào về bản thân'}
        </p>
      </div>
    </div>
  );
};
