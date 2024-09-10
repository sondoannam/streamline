'use client';

import { useEffect, useRef, useState } from 'react';

import { Participant, Track } from 'livekit-client';

import { useTracks } from '@livekit/components-react';
import { FullscreenControl } from './FullscreenControl';
import { useEventListener } from 'usehooks-ts';
import { VolumeControl } from './VolumeControl';

interface LiveVideoProps {
  participant: Participant;
}

export const LiveVideo = ({ participant }: LiveVideoProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [volume, setVolume] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const onVolumeChange = (value: number) => {
    setVolume(+value);
    if (videoRef.current) {
      videoRef.current.muted = value === 0;
      videoRef.current.volume = +value / 100;
    }
  };

  const toggleMute = () => {
    const isMuted = volume === 0;

    setVolume(isMuted ? 50 : 0);

    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      videoRef.current.volume = isMuted ? 0.5 : 0;
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else if (wrapperRef?.current) {
      wrapperRef.current.requestFullscreen();
    }
  };

  const handleFullscreenChange = () => {
    const isFullscreen = document.fullscreenElement !== null;

    setIsFullscreen(isFullscreen);
  };

  useEffect(() => {
    onVolumeChange(0);
  }, []);

  useEventListener('fullscreenchange', handleFullscreenChange, wrapperRef);

  useTracks([Track.Source.Camera, Track.Source.Microphone])
    .filter((track) => track.participant.identity === participant.identity)
    .forEach((track) => {
      if (videoRef.current) {
        track.publication.track?.attach(videoRef.current);
      }
    });

  return (
    <div ref={wrapperRef} className='relative h-full flex'>
      <video ref={videoRef} width='100%' />
      <div className='absolute top-0 h-full w-full opacity-0 hover:opacity-100 hover:transition-all'>
        <div className='absolute bottom-0 flex h-14 w-full items-center justify-between bg-gradient-to-r from-neutral-900 px-4'>
          <VolumeControl onChange={onVolumeChange} onToggle={toggleMute} value={volume} />
          <FullscreenControl isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
        </div>
      </div>
    </div>
  );
};
