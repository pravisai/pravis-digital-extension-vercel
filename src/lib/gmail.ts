
'use server';

import type { Email } from '@/types/email';

/**
 * Fetches the user's recent emails using Gmail API.
 * Now includes automatic token validation.
 */
export const fetchEmails = async (accessToken?: string): Promise<{ emails: Email[], error: string | null }> => {
  // If no token provided, this means we need to check client-side token
  if (!accessToken) {
    return { 
      emails: [], 
      error: 'No access token provided. Please sign out and sign in again to refresh your Gmail permissions.' 
    };
  }

  const response = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=100',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    let errorMessage = 'An unknown error occurred while fetching the email list.';
    
    if (response.status === 401) {
      errorMessage = 'Your Gmail session has expired. Please sign out and sign in again to refresh permissions.';
    } else {
      try {
        const data = await response.json();
        errorMessage = data?.error?.message || `An error occurred: ${response.statusText}`;
        console.error('Gmail API Error:', data);
      } catch (e) {
        errorMessage = await response.text();
        console.error('Gmail API Error (non-JSON response):', errorMessage);
      }
    }
    return { emails: [], error: errorMessage };
  }

  const data = await response.json();

  if (!data.messages || data.messages.length === 0) {
    return { emails: [], error: null };
  }
  
  const findTextPlainPart = (parts: any[]): any | undefined => {
    for (const part of parts) {
        if (part.mimeType === 'text/plain') {
            return part;
        }
        if (part.parts) {
            const found = findTextPlainPart(part.parts);
            if (found) {
                return found;
            }
        }
    }
    return undefined;
  };

  const getBody = (payload: any) => {
      let bodyData = '';
      if (payload.body?.size > 0 && !payload.parts) {
          bodyData = payload.body.data;
      } 
      else if (payload.parts) {
          const plainTextPart = findTextPlainPart(payload.parts);
          if (plainTextPart?.body?.data) {
              bodyData = plainTextPart.body.data;
          }
      }
      
      if (bodyData) {
          try {
              // Decode from base64, replacing URL-safe characters
              return atob(bodyData.replace(/-/g, '+').replace(/_/g, '/'));
          } catch (e) {
              console.error("Error decoding base64 email body:", e);
              return ''; // Return empty string on decoding failure
          }
      }
      // Fallback to snippet if no body is found
      return payload.snippet || '';
  };


  const messagesPromises = data.messages.map(async (msg: { id: string }) => {
    try {
      const res = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: 'no-store',
        }
      );

      if (!res.ok) {
        console.error(`Failed to fetch email ${msg.id}:`, await res.clone().json().catch(() => res.text()));
        return null; // Return null for failed emails instead of throwing
      }
      
      const fullMsg = await res.json();
      
      const fromHeader = fullMsg.payload?.headers?.find((h: any) => h.name === 'From')?.value || '';
      const emailMatch = fromHeader.match(/<(.+)>/);
      const sender = fromHeader.split('<')[0].replace(/"/g, '').trim();
      const email = emailMatch ? emailMatch[1] : '';

      return {
        id: fullMsg.id,
        body: getBody(fullMsg.payload) || fullMsg.snippet,
        subject:
          fullMsg.payload?.headers?.find((h: any) => h.name === 'Subject')
            ?.value || 'No Subject',
        sender: sender || 'Unknown Sender',
        email: email || 'No email address',
        date:
          fullMsg.payload?.headers?.find((h: any) => h.name === 'Date')
            ?.value || new Date().toISOString(),
        read: !fullMsg.labelIds.includes('UNREAD'),
        labelIds: fullMsg.labelIds || [],
      };
    } catch(error) {
      console.error(`Error processing email ${msg.id}:`, error);
      return null;
    }
  });

  const messages = await Promise.all(messagesPromises);

  const validMessages = messages.filter((msg): msg is NonNullable<typeof msg> => msg !== null);
  return { emails: validMessages, error: null };
};

/**
 * Sends an email using Gmail API.
 * @param accessToken OAuth 2.0 access token
 * @param to Recipient email address
 * @param subject Subject of the email
 * @param body Body content of the email
 */
export const sendEmail = async (
  accessToken: string,
  to: string,
  subject: string,
  body: string
) => {
  const email = [
    'Content-Type: text/plain; charset="UTF-8"',
    'MIME-Version: 1.0',
    'Content-Transfer-Encoding: 7bit',
    `To: ${to}`,
    `Subject: ${subject}`,
    '',
    body,
  ].join('\n');

  const encodedEmail = btoa(unescape(encodeURIComponent(email)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedEmail,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Failed to send email:', errorData);
    throw new Error(errorData?.error?.message || 'Failed to send email');
  }

  return await response.json();
};
