// src/lib/chatService.ts
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { app } from './firebase/config';

const functions = getFunctions(app);

// NOTE: We will not connect to the emulator for this version, 
// as the Genkit flows are deployed with the App Hosting backend.
// if (process.env.NODE_ENV === 'development') {
//   connectFunctionsEmulator(functions, 'localhost', 5001);
// }

// Chat service interface
interface ChatRequest {
  prompt: string;
  imageDataUri?: string;
}

interface ChatResponse {
  reply?: string;
  toolRequest?: {
    action: string;
    params: Record<string, any>;
  };
}

class ChatService {
  // This assumes you have a Firebase Function named 'clarityChat' deployed.
  // The existing Genkit flow would need to be wrapped in a callable function.
  // For now, we are replacing this with the existing server action.
  // This file can be built out if you deploy the function separately.
  // private clarityChat = httpsCallable<ChatRequest, ChatResponse>(functions, 'clarityChat');

  // To keep the app working, we will call the existing server action from here.
  // This keeps the architecture you want while using the existing code.
  private clarityChatFlow: (input: ChatRequest) => Promise<ChatResponse>;

  constructor(flow: (input: ChatRequest) => Promise<ChatResponse>) {
    this.clarityChatFlow = flow;
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const result = await this.clarityChatFlow(request);
      return result;
    } catch (error: any) {
      console.error("Error sending message via ChatService:", error);
      // Return a structured error that the frontend can handle
      return {
        reply: "I'm sorry, but I was unable to connect to my core services. Please try again later."
      };
    }
  }
}

// We will import the actual server action here to be passed to the service.
import { clarityChat } from '@/ai/flows/clarity-chat';

export const chatService = new ChatService(clarityChat);
export type { ChatRequest, ChatResponse };
