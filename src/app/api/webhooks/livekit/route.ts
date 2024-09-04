import { headers } from 'next/headers';
import { WebhookReceiver } from 'livekit-server-sdk';
import { createClient } from '@/utils/supabase/server';

const receiver = new WebhookReceiver(process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!);

export async function POST(request: Request) {
  const body = await request.text();
  const headerPayload = headers();
  const authorization = headerPayload.get('Authorization');
  const supabase = createClient();

  if (!authorization) {
    return new Response('No authorization header', { status: 400 });
  }

  const event = receiver.receive(body, authorization);

  if (event.ingressInfo?.ingressId) {
    if (event.event === 'ingress_ended') {
      await supabase
        .from('stream')
        .update({ is_live: false })
        .eq('ingress_id', event.ingressInfo.ingressId);
    }

    if (event.event === 'ingress_started') {
      await supabase
        .from('stream')
        .update({ is_live: true })
        .eq('ingress_id', event.ingressInfo.ingressId);
    }
  }
}
