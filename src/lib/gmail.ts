// src/lib/gmail.ts

/**
 * Fetches the user's recent emails using Gmail API.
 * @param accessToken OAuth 2.0 access token from Firebase login
 */
export const fetchEmails = async (accessToken: string) => {
    const response = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:all&maxResults=5'
,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  
    const data = await response.json();
console.log('Raw Gmail API response:', data);

if (!data.messages || data.messages.length === 0) {
  throw new Error('No messages found in your Gmail inbox.');
}

  
    // Optional: fetch each message's full content (snippet)
    const messages = await Promise.all(
      data.messages.map(async (msg: { id: string }) => {
        const res = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const fullMsg = await res.json();
        return {
          id: fullMsg.id,
          snippet: fullMsg.snippet,
          subject:
            fullMsg.payload?.headers?.find((h: any) => h.name === 'Subject')
              ?.value || 'No Subject',
          from:
            fullMsg.payload?.headers?.find((h: any) => h.name === 'From')
              ?.value || '',
          date:
            fullMsg.payload?.headers?.find((h: any) => h.name === 'Date')
              ?.value || '',
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
    const email = `
      To: ${to}
      Subject: ${subject}
  
      ${body}
    `;
  
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
      throw new Error('Failed to send email');
    }
  
    return await response.json();
  };
  