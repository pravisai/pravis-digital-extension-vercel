'use client';

import { useState } from 'react';
import { signInWithGoogle } from '@/lib/firebase/auth';
import { fetchEmails, sendEmail } from '@/lib/gmail';

export default function EmailPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Email send form state
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleLoginAndFetchEmails = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const { accessToken } = await signInWithGoogle();
      if (!accessToken) throw new Error('No access token received');

      setAccessToken(accessToken);

      const fetchedEmails = await fetchEmails(accessToken);
      setEmails(fetchedEmails);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      if (!accessToken) throw new Error('Please log in first.');

      setLoading(true);
      setError(null);
      setSuccess(null);

      await sendEmail(accessToken, to, subject, body);

      setSuccess('Email sent successfully!');
      setTo('');
      setSubject('');
      setBody('');
    } catch (err: any) {
      setError(err.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Email Assistant</h1>

      <button
        onClick={handleLoginAndFetchEmails}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Login with Gmail & Fetch Emails
      </button>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <div>
        <h2 className="text-xl font-semibold mt-4">Recent Emails</h2>
        <ul className="mt-4 space-y-4">
          {emails.map((email, index) => (
            <li key={index} className="p-4 border rounded shadow">
              <p><strong>Subject:</strong> {email.subject}</p>
              <p><strong>From:</strong> {email.from}</p>
              <p><strong>Date:</strong> {email.date}</p>
              <p><strong>Snippet:</strong> {email.snippet}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Send a New Email</h2>
        <input
          type="email"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="block w-full p-2 mt-2 border rounded"
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="block w-full p-2 mt-2 border rounded"
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="block w-full p-2 mt-2 border rounded h-32"
        />
        <button
          onClick={handleSendEmail}
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Send Email
        </button>
      </div>
    </div>
  );
}
