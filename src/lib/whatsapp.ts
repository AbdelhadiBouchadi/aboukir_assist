'use server';

import { headers } from 'next/headers';
import { processMessage } from './actions';

const WHATSAPP_PHONE_NUMBER = process.env.WHATSAPP_PHONE_NUMBER;
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY;
const WHATSAPP_BUSINESS_ID = process.env.WHATSAPP_BUSINESS_ID;
const WHATSAPP_API_URL = `https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER}/messages`;

export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${WHATSAPP_BUSINESS_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${WHATSAPP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}

export async function verifyWhatsAppWebhook(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Verify webhook
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }

  return new Response('Forbidden', { status: 403 });
}

export async function handleWhatsAppWebhook(req: Request) {
  const body = await req.json();

  // Handle messages
  if (body.object === 'whatsapp_business_account') {
    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.value.messages) {
          for (const message of change.value.messages) {
            await processIncomingMessage(message);
          }
        }
      }
    }
    return new Response('OK', { status: 200 });
  }

  return new Response('Bad Request', { status: 400 });
}

async function processIncomingMessage(message: any) {
  const phoneNumber = message.from;
  const messageContent = message.text.body;

  // Detect language and process message
  const response = await processMessage(
    phoneNumber,
    messageContent,
    /[\u0600-\u06FF]/.test(messageContent) ? 'ARABIC' : 'FRENCH'
  );

  // Send response back via WhatsApp
  await sendWhatsAppMessage(phoneNumber, response.response);
}
