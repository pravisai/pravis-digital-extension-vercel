
"use client";

import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback } from 'react';
import type { Email } from '@/types/email';
import { fetchEmails } from '@/lib/gmail';
import { signInWithGoogle, getStoredAccessToken } from '@/lib/firebase/auth';

export type MailboxView = "Inbox" | "Starred" | "Sent" | "Drafts" | "Trash" | "Archived" | "Compose" | null;

interface EmailContextType {
    emails: Email[];
    filteredEmails: Email[];
    isFetchingEmails: boolean;
    fetchError: string | null;
    activeMailbox: MailboxView;
    selectedEmail: Email | null;
    handleFetchEmails: () => Promise<void>;
    setActiveMailbox: (mailbox: MailboxView) => void;
    setSelectedEmail: (email: Email | null) => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export const EmailProvider = ({ children }: { children: ReactNode }) => {
    const [emails, setEmails] = useState<Email[]>([]);
    const [isFetchingEmails, setIsFetchingEmails] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [activeMailbox, setActiveMailbox] = useState<MailboxView>(null);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

    const handleFetchEmails = useCallback(async () => {
        setIsFetchingEmails(true);
        setFetchError(null);
        setEmails([]);
        setSelectedEmail(null);
        if (!activeMailbox) {
            setActiveMailbox("Inbox");
        }

        try {
            let accessToken = getStoredAccessToken();

            if (!accessToken) {
                // If no token, initiate sign-in, which triggers a redirect.
                // The user will be redirected back and the main sign-in page will handle the token.
                // We show a loading state until that happens.
                await signInWithGoogle();
                return;
            }

            const result = await fetchEmails(accessToken);

            if (result.error) {
                console.warn('Gmail token error, attempting to re-authenticate:', result.error);
                // The token might be expired, so we trigger the redirect flow again.
                await signInWithGoogle();
                return;
            } else {
                setEmails(result.emails);
            }
        } catch (err: any) {
            if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
                console.error('Error in email fetching process:', err);
                let message = err.message || 'An unknown error occurred.';
                setFetchError(message);
            }
        } finally {
            setIsFetchingEmails(false);
        }
    }, [activeMailbox]);

    const filteredEmails = useMemo(() => emails.filter(email => {
        switch(activeMailbox) {
            case 'Inbox':
                return !email.labelIds?.includes('TRASH') && !email.labelIds?.includes('SENT');
            case 'Starred':
                return email.labelIds?.includes('STARRED');
            case 'Sent':
                return email.labelIds?.includes('SENT');
            case 'Trash':
                return email.labelIds?.includes('TRASH');
            case 'Drafts':
                return email.labelIds?.includes('DRAFT');
            default:
                return true;
        }
    }), [emails, activeMailbox]);

    const value = {
        emails,
        filteredEmails,
        isFetchingEmails,
        fetchError,
        activeMailbox,
        selectedEmail,
        handleFetchEmails,
        setActiveMailbox,
        setSelectedEmail,
    };

    return <EmailContext.Provider value={value}>{children}</EmailContext.Provider>;
};

export const useEmail = () => {
    const context = useContext(EmailContext);
    if (context === undefined) {
        throw new Error('useEmail must be used within an EmailProvider');
    }
    return context;
};
