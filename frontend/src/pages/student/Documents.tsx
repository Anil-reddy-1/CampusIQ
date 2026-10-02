import { useState, useEffect } from 'react';
import { StudentLayout } from '../../components/layout';
import { Card, Button, Badge, Modal, Spinner } from '../../components/ui';
import {
  Upload,
  FileText,
  Search,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { documentsApi } from '../../services/api';
import { toast } from 'react-toastify';
import type { Document } from '../../types';

export function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; documentId: string | null }>({
    open: false,
    documentId: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    loadDocuments();
  }, [filterStatus]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await documentsApi.list(filterStatus ? { status: filterStatus } : undefined);
      setDocuments(docs);
    } catch (error: any) {
      toast.error('Failed to load documents');
      // Use mock data
      setDocuments(getMockDocuments());
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload PDF, PPTX, DOCX, or TXT files');
      return;
    }

    // Validate size (25MB)
    if (file.size > 25 * 1024 * 1024) {
      toast.error('File size must be less than 25MB');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      
      const doc = await documentsApi.upload(file, undefined, (progress) => {
        setUploadProgress(progress);
      });

      toast.success('Document uploaded successfully');
      setDocuments((prev) => [doc, ...prev]);
      
      // Poll for processing completion
      pollDocumentStatus(doc.id);
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const pollDocumentStatus = async (docId: string) => {
    let attempts = 0;
    const maxAttempts = 30;

    const poll = async () => {
      try {
        const doc = await documentsApi.getStatus(docId);
        
        setDocuments((prev) =>
          prev.map((d) => (d.id === docId ? doc : d))
        );

        if (doc.status === 'processing' && attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 2000);
        } else if (doc.status === 'ready') {
          toast.success(`${doc.title} is ready for chat!`);
        } else if (doc.status === 'failed') {
          toast.error(`Failed to process ${doc.title}`);
        }
      } catch (error) {
        console.error('Failed to check document status');
      }
    };

    poll();
  };

  const handleDelete = async () => {
    if (!deleteModal.documentId) return;

    try {
      await documentsApi.delete(deleteModal.documentId);
      toast.success('Document deleted');
      setDocuments((prev) => prev.filter((d) => d.id !== deleteModal.documentId));
      setDeleteModal({ open: false, documentId: null });
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete document');
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle size={16} className="text-secondary" />;
      case 'processing':
        return <Clock size={16} className="text-tertiary" />;
      case 'failed':
        return <AlertCircle size={16} className="text-error" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge variant="success">Ready</Badge>;
      case 'processing':
        return <Badge variant="warning">Processing</Badge>;
      case 'failed':
        return <Badge variant="error">Failed</Badge>;
      default:
        return null;
    }
  };

  const getFileIcon = (fileType: string) => {
    const icons: Record<string, string> = {
      pdf: '📄',
      pptx: '📊',
      docx: '📝',
      txt: '📃',
    };
    return icons[fileType] || '📄';
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-headline-lg text-on-surface">Knowledge Base</h1>
            <p className="text-body-md text-on-surface-variant">
              Upload and manage your study materials for AI-powered chat
            </p>
          </div>
          
          <label htmlFor="document-upload" className="inline-block cursor-pointer">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              uploading 
                ? 'bg-primary-300 text-white cursor-not-allowed' 
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}>
              <Upload size={18} />
              Upload Document
            </span>
            <input
              id="document-upload"
              type="file"
              className="hidden"
              accept=".pdf,.pptx,.docx,.txt"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <Card>
            <div className="flex items-center gap-4">
              <Spinner size="sm" />
              <div className="flex-1">
                <p className="font-label-md text-on-surface mb-2">Uploading document...</p>
                <div className="w-full bg-surface-variant rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
              <span className="text-label-md font-bold text-primary">{uploadProgress}%</span>
            </div>
          </Card>
        )}

        {/* Search and Filter */}
        <Card>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filterStatus === ''
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('ready')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filterStatus === 'ready'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                }`}
              >
                Ready
              </button>
              <button
                onClick={() => setFilterStatus('processing')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filterStatus === 'processing'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                }`}
              >
                Processing
              </button>
            </div>
          </div>
        </Card>

        {/* Documents List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Card className="text-center py-12">
            <FileText size={48} className="mx-auto mb-4 text-outline" />
            <h3 className="font-headline-md text-on-surface mb-2">
              {searchQuery ? 'No documents found' : 'No documents yet'}
            </h3>
            <p className="text-body-md text-on-surface-variant mb-6">
              {searchQuery
                ? 'Try a different search term'
                : 'Upload notes, slides, or study materials to get started'}
            </p>
            {!searchQuery && (
              <label htmlFor="document-upload-empty" className="inline-block cursor-pointer">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors">
                  <Upload size={18} />
                  Upload Your First Document
                </span>
                <input
                  id="document-upload-empty"
                  type="file"
                  className="hidden"
                  accept=".pdf,.pptx,.docx,.txt"
                  onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                />
              </label>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  {/* File Icon */}
                  <div className="w-12 h-12 bg-primary-container/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    {getFileIcon(doc.fileType)}
                  </div>

                  {/* Document Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-label-md font-bold text-on-surface truncate">
                        {doc.title}
                      </h3>
                      {getStatusIcon(doc.status)}
                    </div>
                    <div className="flex items-center gap-3 text-body-sm text-on-surface-variant">
                      <span className="uppercase">{doc.fileType}</span>
                      <span>•</span>
                      <span>{formatDate(doc.uploadedAt)}</span>
                      {doc.chunkCount && doc.status === 'ready' && (
                        <>
                          <span>•</span>
                          <span>{doc.chunkCount} chunks</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-3">
                    {getStatusBadge(doc.status)}
                    <button
                      onClick={() => setDeleteModal({ open: true, documentId: doc.id })}
                      className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card variant="outlined" className="bg-surface-container-low">
          <div className="flex gap-3">
            <AlertCircle className="text-primary flex-shrink-0" size={20} />
            <div>
              <h4 className="font-label-md font-bold text-on-surface mb-1">
                Supported File Types
              </h4>
              <p className="text-body-sm text-on-surface-variant">
                PDF, PowerPoint (.pptx), Word (.docx), and Text (.txt) files up to 25MB.
                Documents are processed and made searchable for AI chat.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, documentId: null })}
        title="Delete Document"
      >
        <p className="text-body-md text-on-surface-variant mb-6">
          Are you sure you want to delete this document? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => setDeleteModal({ open: false, documentId: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 size={18} />
            Delete
          </Button>
        </div>
      </Modal>
    </StudentLayout>
  );
}

function getMockDocuments(): Document[] {
  return [
    {
      id: '1',
      userId: 'user1',
      title: 'Operating Systems Notes.pdf',
      fileType: 'pdf',
      status: 'ready',
      uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      chunkCount: 45,
    },
    {
      id: '2',
      userId: 'user1',
      title: 'Database Systems Lecture 5.pptx',
      fileType: 'pptx',
      status: 'ready',
      uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      chunkCount: 32,
    },
    {
      id: '3',
      userId: 'user1',
      title: 'Data Structures Syllabus.docx',
      fileType: 'docx',
      status: 'processing',
      uploadedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
