'use server';

import {
  processMessage,
  updatePatientLanguage,
  updatePatientState,
  getPatientById,
  createConversationWithResponse,
} from './actions';
import { RESPONSES, getServiceByNumericText } from './dentistry';
import { ConversationState } from '../types';

const WHATSAPP_PHONE_NUMBER = process.env.WHATSAPP_PHONE_NUMBER;
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY;
const WHATSAPP_BUSINESS_ID = process.env.WHATSAPP_BUSINESS_ID;
const WHATSAPP_API_URL = `https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER}/messages`;

export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    console.log('Sending message:', { to, message });

    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WHATSAPP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'text',
        text: {
          preview_url: false,
          body: message,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('WhatsApp API error response:', error);
      throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    console.log('WhatsApp API success:', result);
    return result;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}

export async function sendLanguageSelectionMessage(
  to: string,
  welcomeMessage: string
) {
  try {
    console.log('Sending language selection message:', { to, welcomeMessage });

    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WHATSAPP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text: welcomeMessage,
          },
          action: {
            buttons: [
              {
                type: 'reply',
                reply: {
                  id: 'lang_fr',
                  title: 'Français',
                },
              },
              {
                type: 'reply',
                reply: {
                  id: 'lang_ar',
                  title: 'العربية',
                },
              },
            ],
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('WhatsApp API error response:', error);
      throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    console.log('WhatsApp language selection success:', result);
    return result;
  } catch (error) {
    console.error('Error sending language selection message:', error);
    throw error;
  }
}

export async function sendAppointmentConfirmationMessage(
  to: string,
  question: string
) {
  try {
    console.log('Sending appointment confirmation message:', { to, question });

    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WHATSAPP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text: question,
          },
          action: {
            buttons: [
              {
                type: 'reply',
                reply: {
                  id: 'appointment_yes',
                  title: 'Oui',
                },
              },
              {
                type: 'reply',
                reply: {
                  id: 'appointment_no',
                  title: 'Non',
                },
              },
            ],
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('WhatsApp API error response:', error);
      throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    console.log('WhatsApp appointment confirmation success:', result);
    return result;
  } catch (error) {
    console.error('Error sending appointment confirmation message:', error);
    throw error;
  }
}

export async function sendArabicAppointmentConfirmationMessage(
  to: string,
  question: string
) {
  try {
    console.log('Sending Arabic appointment confirmation message:', {
      to,
      question,
    });

    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WHATSAPP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text: question,
          },
          action: {
            buttons: [
              {
                type: 'reply',
                reply: {
                  id: 'appointment_yes',
                  title: 'نعم',
                },
              },
              {
                type: 'reply',
                reply: {
                  id: 'appointment_no',
                  title: 'لا',
                },
              },
            ],
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('WhatsApp API error response:', error);
      throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    console.log('WhatsApp Arabic appointment confirmation success:', result);
    return result;
  } catch (error) {
    console.error(
      'Error sending Arabic appointment confirmation message:',
      error
    );
    throw error;
  }
}

export async function verifyWhatsAppWebhook(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  console.log('Verifying webhook:', { mode, token });

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('Webhook verified successfully');
    return new Response(challenge, { status: 200 });
  }

  console.log('Webhook verification failed');
  return new Response('Forbidden', { status: 403 });
}

export async function handleWhatsAppWebhook(req: Request) {
  try {
    const body = await req.json();
    console.log('Received webhook:', JSON.stringify(body, null, 2));

    // Handle test webhook payload
    if (body.field === 'messages' && body.value?.messages) {
      console.log('Processing test webhook');
      for (const message of body.value.messages) {
        await processIncomingMessage(message, body.value);
      }
      return new Response('OK', { status: 200 });
    }

    // Handle real webhook from WhatsApp
    if (body.object === 'whatsapp_business_account') {
      console.log('Processing business account webhook');
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.value?.messages) {
            for (const message of change.value.messages) {
              await processIncomingMessage(message, change.value);
            }
          }
        }
      }
      return new Response('OK', { status: 200 });
    }

    console.log('Invalid webhook payload');
    return new Response('Bad Request', { status: 400 });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

async function processIncomingMessage(message: any, value: any) {
  try {
    const phoneNumber = message.from;
    const name = value.contacts?.[0]?.profile?.name;

    // Get or create patient and check conversation state
    const patient = await getPatientById(phoneNumber, name);
    const patientLang = patient?.language || 'FRENCH';
    const isArabic = patientLang === 'ARABIC';
    const conversationState =
      patient?.conversationState || ConversationState.WELCOME;

    console.log('Processing message for patient:', {
      phoneNumber,
      name,
      language: patientLang,
      state: conversationState,
    });

    // Handle interactive responses (button clicks)
    if (message.type === 'interactive' && message.interactive?.button_reply) {
      const buttonId = message.interactive.button_reply.id;

      // Handle language selection
      if (buttonId === 'lang_fr') {
        await updatePatientLanguage(phoneNumber, 'FRENCH', name);
        await updatePatientState(
          phoneNumber,
          ConversationState.SERVICE_SELECTION
        );

        // Send service menu in French
        await sendWhatsAppMessage(phoneNumber, RESPONSES.serviceMenu.fr);

        // Record this in the conversation
        await createConversationWithResponse(
          patient.id,
          'Language selection: French',
          RESPONSES.serviceMenu.fr,
          true
        );

        return;
      } else if (buttonId === 'lang_ar') {
        await updatePatientLanguage(phoneNumber, 'ARABIC', name);
        await updatePatientState(
          phoneNumber,
          ConversationState.SERVICE_SELECTION
        );

        // Send service menu in Arabic
        await sendWhatsAppMessage(phoneNumber, RESPONSES.serviceMenu.ar);

        // Record this in the conversation
        await createConversationWithResponse(
          patient.id,
          'Language selection: Arabic',
          RESPONSES.serviceMenu.ar,
          true
        );

        return;
      }

      // Handle appointment confirmation responses
      else if (buttonId === 'appointment_yes') {
        await updatePatientState(
          phoneNumber,
          ConversationState.GENERAL_CONVERSATION
        );
        const response = isArabic
          ? RESPONSES.appointmentYes.ar
          : RESPONSES.appointmentYes.fr;

        await sendWhatsAppMessage(phoneNumber, response);

        // Record this in the conversation
        await createConversationWithResponse(
          patient.id,
          'Appointment confirmation: Yes',
          response,
          true
        );

        return;
      } else if (buttonId === 'appointment_no') {
        await updatePatientState(
          phoneNumber,
          ConversationState.GENERAL_CONVERSATION
        );
        const response = isArabic
          ? RESPONSES.appointmentNo.ar
          : RESPONSES.appointmentNo.fr;

        await sendWhatsAppMessage(phoneNumber, response);

        // Record this in the conversation
        await createConversationWithResponse(
          patient.id,
          'Appointment confirmation: No',
          response,
          true
        );

        return;
      }
    }

    // If this is a new user without language selection, send welcome message
    if (conversationState === ConversationState.WELCOME) {
      await sendLanguageSelectionMessage(
        phoneNumber,
        RESPONSES.welcome.message
      );

      // Record this in the conversation
      await createConversationWithResponse(
        patient.id,
        '[Initial contact]',
        RESPONSES.welcome.message,
        true
      );

      return;
    }

    // Process regular text messages
    if (message.type === 'text') {
      const messageContent = message.text?.body;
      if (!messageContent) return;

      // Handle different conversation states
      if (conversationState === ConversationState.SERVICE_SELECTION) {
        // Try to match the message to a service
        const service = getServiceByNumericText(messageContent);

        if (service) {
          // Update patient state and last selected service
          await updatePatientState(
            phoneNumber,
            ConversationState.APPOINTMENT_CONFIRMATION,
            service.id
          );

          // Send service information
          const serviceResponse = isArabic
            ? service.responseAr
            : service.responseFr;
          await sendWhatsAppMessage(phoneNumber, serviceResponse);

          // Record this in the conversation
          await createConversationWithResponse(
            patient.id,
            `Service selection: ${isArabic ? service.nameAr : service.nameFr}`,
            serviceResponse,
            true
          );

          // Ask about appointment
          const appointmentQuestion = isArabic
            ? RESPONSES.appointmentQuestion.ar
            : RESPONSES.appointmentQuestion.fr;

          if (isArabic) {
            await sendArabicAppointmentConfirmationMessage(
              phoneNumber,
              appointmentQuestion
            );
          } else {
            await sendAppointmentConfirmationMessage(
              phoneNumber,
              appointmentQuestion
            );
          }

          return;
        }

        // If no service matched, fall back to the script matching system
        await fallbackToScriptMatching(
          phoneNumber,
          messageContent,
          patientLang,
          name,
          patient
        );
        return;
      }

      // Default: use the existing script matching system
      await fallbackToScriptMatching(
        phoneNumber,
        messageContent,
        patientLang,
        name,
        patient
      );
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
}

// Helper function to use the existing script matching system
async function fallbackToScriptMatching(
  phoneNumber: string,
  messageContent: string,
  language: 'ARABIC' | 'FRENCH',
  name?: string,
  patient?: any
) {
  console.log('Falling back to script matching for:', {
    phoneNumber,
    messageContent,
  });

  // If the patient is in a structured flow, move them to general conversation
  if (
    patient &&
    patient.conversationState !== ConversationState.GENERAL_CONVERSATION
  ) {
    await updatePatientState(
      phoneNumber,
      ConversationState.GENERAL_CONVERSATION
    );
  }

  // Use the existing script matching logic
  const response = await processMessage(
    phoneNumber,
    messageContent,
    language === 'ARABIC' ? 'ARABIC' : 'FRENCH',
    name
  );

  // Message is already sent by processMessage
  return response;
}
