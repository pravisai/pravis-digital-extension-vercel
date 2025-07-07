'use client';

import { useState } from 'react';
import { signInWithGoogle } from '@/lib/firebase/auth';
import { fetchEmails } from '@/lib/gmail';

export default function EmailAssistantPage() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetchEmails = async () => {
    try {
      setLoading(true);
      const { accessToken } = await signInWithGoogle();

      if (!accessToken) {
        alert('No Gmail access token available.');
        return;
      }

      const messages = await fetchEmails(accessToken);
      setEmails(messages);
    } catch (error) {
      console.error('Error fetching emails:', error);
      alert('Failed to fetch emails. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">📬 Gmail Inbox</h1>

      <button
        onClick={handleFetchEmails}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Loading...' : 'Sign in with Google & Fetch Emails'}
      </button>

      <div className="space-y-4 mt-6">
        {emails.length === 0 && !loading && (
          <p className="text-gray-500">No emails yet. Click above to load.</p>
        )}

        {emails.map((email, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded shadow-sm bg-white"
          >
            <div className="font-semibold">📨 {email.subject}</div>
            <div className="text-sm text-gray-600">From: {email.from}</div>
            <div className="text-sm text-gray-500">Date: {email.date}</div>
            <div className="mt-2 text-sm text-gray-700">{email.snippet}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
