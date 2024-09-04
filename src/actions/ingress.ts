'use server';

import { RootPath } from '@/constants/enum';
import { getSelf } from '@/lib/auth-service';
import { removeEmailTrail } from '@/utils';
import { createClient } from '@/utils/supabase/server';
import {
  IngressAudioEncodingPreset,
  IngressVideoEncodingPreset,
  IngressInput,
  IngressClient,
  RoomServiceClient,
//   TrackSource,
  type CreateIngressOptions,
//   IngressVideoOptions,
//   IngressAudioOptions,
} from 'livekit-server-sdk';
import { TrackSource } from "livekit-server-sdk/dist/proto/livekit_models";

import { revalidatePath } from 'next/cache';

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_API_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!,
);

const ingressClient = new IngressClient(process.env.LIVEKIT_API_URL!);

export const resetIngresses = async (hostIdentity: string) => {
  const ingresses = await ingressClient.listIngress({
    roomName: hostIdentity,
  });
  console.log(ingresses);
  const rooms = await roomService.listRooms([hostIdentity]);

  for (const room of rooms) {
    await roomService.deleteRoom(room.name);
  }

  for (const ingress of ingresses) {
    if (ingress.ingressId) {
      console.log('delete ingress', ingress.ingressId);
      await ingressClient.deleteIngress(ingress.ingressId);
    }
  }
};

export const createIngress = async (ingressType: IngressInput) => {
  const supabase = createClient();
  const self = await getSelf();

  const username = removeEmailTrail(self.email);

  await resetIngresses(self.id);

  const options: CreateIngressOptions = {
    name: username,
    roomName: self.id,
    participantName: username,
    participantIdentity: self.id,
  };

  if (ingressType === IngressInput.WHIP_INPUT) {
    options.bypassTranscoding = true;

    // version 2.x
    // options.enableTranscoding = false;
  } else {
    // old version
    options.video = {
        source: TrackSource.CAMERA,
        preset: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
    }

    options.audio = {
        source: TrackSource.MICROPHONE,
        preset: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
    }

    // version 2.x
    // options.video = new IngressVideoOptions({
    //   source: TrackSource.CAMERA,
    //   encodingOptions: {
    //     case: 'preset',
    //     value: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
    //   },
    // });

    // options.audio = new IngressAudioOptions({
    //   source: TrackSource.MICROPHONE,
    //   encodingOptions: {
    //     case: 'preset',
    //     value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
    //   },
    // });
  }

  const ingress = await ingressClient.createIngress(ingressType, options);

  if (!ingress || !ingress.url || !ingress.streamKey) {
    throw new Error('Ingress creation failed');
  }

  const { error } = await supabase
    .from('stream')
    .update({
      ingress_id: ingress.ingressId,
      server_url: ingress.url,
      stream_key: ingress.streamKey,
    })
    .eq('user_id', self.id);

  if (error) {
    throw new Error('Failed to update stream ingress');
  }

  revalidatePath(`${RootPath.Profile}/${username}/keys`);
  console.log('ingress: ', ingress);
  return JSON.parse(JSON.stringify(ingress));
};
