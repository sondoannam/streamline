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
  console.log(event);

  if (event.event === 'ingress_ended') {
    const { error } = await supabase
      .from('stream')
      .update({ is_live: false })
      .eq('ingress_id', event.ingressInfo?.ingressId!);

    if (error) {
      console.log(error);
      return new Response('Error updating stream ended', { status: 400 });
    }
  }

  if (event.event === 'ingress_started') {
    const { error } = await supabase
      .from('stream')
      .update({ is_live: true })
      .eq('ingress_id', event.ingressInfo?.ingressId!);

    if (error) {
      console.log(error);
      return new Response('Error updating stream started', { status: 400 });
    }
  }

  return new Response(`user with ingress id ${event.ingressInfo?.ingressId} is livestreaming`, {
    status: 200,
  });
}
