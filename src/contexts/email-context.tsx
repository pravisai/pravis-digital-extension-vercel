
"use client";

import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback } from 'react';
import type { Email } from '@/types/email';
import { fetchEmails } from '@/lib/gmail';
import { getValidAccessToken, signOutUser, signInWithGoogle } from '@/lib/firebase/auth';

export type MailboxView = "Inbox" | "Starred" | "Sent" | "Drafts" | "Trash" | "Archived" | "Compose" | "All Mail" | null;

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
    refreshGmailAccess: () => Promise<void>;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export const EmailProvider = ({ children }: { children: ReactNode }) => {
    const [emails, setEmails] = useState<Email[]>([]);
    const [isFetchingEmails, setIsFetchingEmails] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [activeMailbox, setActiveMailbox] = useState<MailboxView>("All Mail");
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

    const handleFetchEmails = useCallback(async () => {
        setIsFetchingEmails(true);
        setFetchError(null);
        setSelectedEmail(null);
        
        try {
            const validToken = getValidAccessToken();
            
            if (!validToken) {
              setFetchError('Your Gmail session has expired. Please refresh your access.');
              setIsFetchingEmails(false);
              setEmails([]);
              return;
            }
            
            const result = await fetchEmails(validToken);

            if (result.error) {
                console.warn('Gmail fetch error:', result.error);
                if (result.error.toLowerCase().includes('expired') || result.error.toLowerCase().includes('invalid')) {
                     setFetchError('Your Gmail session has expired. Please refresh your access.');
                } else {
                    setFetchError(result.error);
                }
                setEmails([]);
            } else {
                setEmails(result.emails);
                setActiveMailbox("All Mail"); // Correctly set view after fetching
            }
        } catch (err: any) {
            console.error('Error in email fetching process:', err);
            let message = err.message || 'An unknown error occurred.';
            setFetchError(message);
            setEmails([]);
        } finally {
            setIsFetchingEmails(false);
        }
    }, []);

    const refreshGmailAccess = useCallback(async () => {
        setIsFetchingEmails(true);
        setFetchError(null);
        try {
            await signOutUser();
            const { accessToken } = await signInWithGoogle();
            if (accessToken) {
                // After getting a new token, refetch emails
                const result = await fetchEmails(accessToken);
                if (result.error) throw new Error(result.error);
                setEmails(result.emails);
                setActiveMailbox("All Mail");
            } else {
                setFetchError("Failed to get a new access token. Please try signing in again.");
            }
        } catch (error: any) {
             if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
                console.error("Re-authentication failed:", error);
                setFetchError("Re-authentication failed. Please try again.");
            }
        } finally {
            setIsFetchingEmails(false);
        }
    }, []);

    const filteredEmails = useMemo(() => {
        if (activeMailbox === "All Mail") {
            return emails;
        }
        return emails.filter(email => {
            switch(activeMailbox) {
                case 'Inbox':
                    return !email.labelIds?.includes('TRASH') && !email.labelIds?.includes('SENT') && !email.labelIds?.includes('DRAFT');
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
        });
    }, [emails, activeMailbox]);

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
        refreshGmailAccess,
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
