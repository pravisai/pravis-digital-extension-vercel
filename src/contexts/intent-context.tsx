
"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Intent {
  action: string;
  params: Record<string, any>;
}

interface IntentContextType {
  intent: Intent | null;
  setIntent: (intent: Intent | null) => void;
  clearIntent: () => void;
  handleIntent: (intent: Intent) => void;
}

const IntentContext = createContext<IntentContextType | undefined>(undefined);

export const IntentProvider = ({ children }: { children: ReactNode }) => {
    const [intent, setIntent] = useState<Intent | null>(null);
    const router = useRouter();

    const clearIntent = useCallback(() => {
        setIntent(null);
    }, []);
    
    const handleIntent = useCallback((intentToHandle: Intent) => {
        console.log("Handling intent:", intentToHandle);
        switch (intentToHandle.action) {
            case 'navigateToEmailCompose':
                setIntent(intentToHandle); // Set intent for pre-filling
                router.push('/dashboard/email-assistant'); // Navigate to the landing page first
                break;
            case 'navigateToCalendar':
                setIntent(intentToHandle);
                router.push('/dashboard/tasks');
                break;
            // Add other navigation cases here
            default:
                console.warn(`Unhandled intent action: ${intentToHandle.action}`);
        }
    }, [router]);

    const value = {
        intent,
        setIntent,
        clearIntent,
        handleIntent,
    };

    return <IntentContext.Provider value={value}>{children}</IntentContext.Provider>;
};

export const useIntent = () => {
    const context = useContext(IntentContext);
    if (context === undefined) {
        throw new Error('useIntent must be used within an IntentProvider');
    }
    return context;
};
