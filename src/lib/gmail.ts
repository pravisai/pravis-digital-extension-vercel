// src/lib/gmail.ts

/**
 * Fetches the user's recent emails using Gmail API.
 * @param accessToken OAuth 2.0 access token from Firebase login
 */
export const fetchEmails = async (accessToken: string) => {
  const response = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=15',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error('Gmail API Error:', data);
    throw new Error('Failed to fetch emails from Gmail.');
  }

  if (!data.messages || data.messages.length === 0) {
    return []; // Return empty array if no messages
  }
  
  const getBody = (payload: any) => {
    let body = '';
    if (payload.body && payload.body.size > 0) {
      body = payload.body.data;
    } else if (payload.parts) {
      // Find the plain text part of the email
      const part = payload.parts.find(
        (p: any) => p.mimeType === 'text/plain'
      );
      if (part && part.body && part.body.data) {
        body = part.body.data;
      }
    }
    // Decode from base64, replacing URL-safe characters with standard base64 characters
    return body ? atob(body.replace(/-/g, '+').replace(/_/g, '/')) : '';
  };


  // Fetch each message's full content
  const messages = await Promise.all(
    data.messages.map(async (msg: { id: string }) => {
      const res = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
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
        sender,
        email,
        date:
          fullMsg.payload?.headers?.find((h: any) => h.name === 'Date')
            ?.value || '',
        read: !fullMsg.labelIds.includes('UNREAD'),
      };
    })
  );

  return messages;
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
    throw new Error('Failed to send email');
  }

  return await response.json();
};
