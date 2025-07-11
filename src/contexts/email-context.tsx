
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
                const { accessToken: newAccessToken } = await signInWithGoogle();
                if (!newAccessToken) throw new Error('Failed to obtain Gmail access token during login.');
                accessToken = newAccessToken;
            }

            const result = await fetchEmails(accessToken);

            if (result.error) {
                console.warn('Gmail token error, attempting to re-authenticate:', result.error);
                const { accessToken: refreshedToken } = await signInWithGoogle();
                if (!refreshedToken) throw new Error('Unable to re-authenticate with Google.');
                
                const retryResult = await fetchEmails(refreshedToken);
                if (retryResult.error) throw new Error(retryResult.error);
                setEmails(retryResult.emails);
            } else {
                setEmails(result.emails);
            }
        } catch (err: any) {
            console.error('Error in email fetching process:', err);
            let message = err.message || 'An unknown error occurred.';
            if (err.code === 'auth/popup-closed-by-user') {
                message = 'The sign-in popup was closed. Please try again.';
            }
            setFetchError(message);
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
