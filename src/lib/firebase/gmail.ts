// src/lib/gmail.ts

/**
 * Fetches the user's recent emails using Gmail API.
 * @param accessToken OAuth 2.0 access token from Firebase login
 */
export const fetchEmails = async (accessToken: string) => {
    const response = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  
    const data = await response.json();
  
    if (!data.messages) {
      throw new Error('No messages found.');
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
            fullMsg.payload?.headers?.find(
              (h: any) => h.name === 'Subject'
            )?.value || 'No Subject',
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
  