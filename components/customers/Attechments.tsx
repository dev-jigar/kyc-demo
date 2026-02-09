import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  Image as ImageIcon,
  Loader2,
  Paperclip,
} from "lucide-react";
import { FC, useEffect, useState } from "react";

type Attachment = {
  name: string;
  data?: string;
  url?: string;
};

type AttachmentRecord = {
  id: string;
  status: string;
  createdAt: string;
  attachments: [Attachment];
};

type Props = {
  userId: string;
};

export const AttachmentsCard: FC<Props> = ({ userId }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [records, setRecords] = useState<AttachmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  async function loadAttachments(userId: string) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/kyc/invites/${userId}/documents`);
      const data = await res.json();
      setRecords(Array.isArray(data?.response) ? data?.response : []);
    } catch (err) {
      console.error("Failed to load attachments", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAttachments(userId);
  }, [userId]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Paperclip className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-gray-900">
              Uploaded Attachments
            </h2>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            {isExpanded ? "Collapse" : "Expand"}
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6 space-y-3">
          {error ? (
            <div className="flex flex-col items-center py-10">
              <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
              <p className="text-sm font-medium text-gray-900">
                Failed to load attachments
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center py-10">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
              <p className="text-sm text-gray-600">Loading attachments...</p>
            </div>
          ) : records.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">
              No attachments found
            </p>
          ) : (
            records.map((record) => {
              const attachment = record.attachments[0];

              return (
                <div
                  key={record.id}
                  className="flex items-center justify-between rounded-lg border bg-gray-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-emerald-50 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-emerald-600" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Status: {record.status}
                      </p>
                    </div>
                  </div>

                  {attachment.url && (
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </a>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Collapsed Footer */}
      {!isExpanded && !isLoading && !error && records.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            {records.length} uploaded attachment{records.length > 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
};
