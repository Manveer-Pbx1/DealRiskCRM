import React, { useState, useEffect } from 'react';
import { EnhancedDeal } from '../../types';
import { useEmail } from '../../hooks/useEmail/useEmail';

interface EmailDraftModalProps {
  deal: EnhancedDeal;
  onClose: () => void;
  opportunityData: any;
}

export const EmailDraftModal: React.FC<EmailDraftModalProps> = ({
  deal,
  onClose,
  opportunityData,
}) => {
  const [emailContent, setEmailContent] = useState('');
  const [subject, setSubject] = useState(`Follow-up: ${deal.name}`);
  const { isGenerating, isSending, error, generateEmailContent, sendEmail, clearError } = useEmail();

  useEffect(() => {
    const loadEmailContent = async () => {
      try {
        const content = await generateEmailContent(opportunityData);
        setEmailContent(content);
      } catch (err) {
        setEmailContent('Failed to generate email content. Please try again.');
      }
    };

    loadEmailContent();
  }, []);

  const handleSend = async () => {
    if (!deal.company) {
      alert('No email address available for this contact');
      return;
    }

    try {
      await sendEmail({
        to: deal.company,
        subject,
        body: emailContent,
      });
      alert('Email sent successfully!');
      onClose();
    } catch (err) {
      alert('Failed to send email. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Draft Email</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 font-bold text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To:
            </label>
            <input
              type="email"
              value={deal.company}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject:
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email subject"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message:
            </label>
            {isGenerating ? (
              <div className="flex items-center justify-center p-8 bg-gray-50 rounded-md">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-gray-600">Generating email content...</span>
              </div>
            ) : (
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="Email body will be generated here..."
              />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isSending || isGenerating || !emailContent}
            className={`px-4 py-2 text-white rounded-md transition-colors ${
              isSending || isGenerating || !emailContent
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSending ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </div>
    </div>
  );
};
