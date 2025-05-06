import { verifyWhatsAppWebhook, handleWhatsAppWebhook } from '@/lib/whatsapp';

export async function GET(req: Request) {
  return verifyWhatsAppWebhook(req);
}

export async function POST(req: Request) {
  return handleWhatsAppWebhook(req);
}
