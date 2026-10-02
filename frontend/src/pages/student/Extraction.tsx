import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentLayout } from '../../components/layout';
import { Card, Button, Spinner } from '../../components/ui';
import { Upload, Camera, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { extractionApi } from '../../services/api';
import { toast } from 'react-toastify';
import type { ExtractionJob, DocumentType } from '../../types';

export function Extraction() {
  const navigate = useNavigate();
  const [view, setView] = useState<'upload' | 'review' | 'processing'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [documentType, setDocumentType] = useState<DocumentType | ''>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractionJob, setExtractionJob] = useState<ExtractionJob | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error('Please upload a valid image (JPG, PNG) or PDF file');
      return;
    }

    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    
    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setView('processing');
      setUploadProgress(0);

      // Upload file
      const job = await extractionApi.upload(
        file,
        documentType || undefined,
        (progress) => setUploadProgress(progress)
      );

      setExtractionJob(job);

      // Poll for completion
      pollExtractionStatus(job.id);
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
      setView('upload');
    }
  };

  const pollExtractionStatus = async (jobId: string) => {
    const maxAttempts = 30;
    let attempts = 0;

    const poll = async () => {
      try {
        const job = await extractionApi.getJob(jobId);
        setExtractionJob(job);

        if (job.status === 'needs_review') {
          setExtractedData(job.rawExtraction);
          setView('review');
        } else if (job.status === 'failed') {
          toast.error('Extraction failed. Please try again or enter data manually.');
          setView('upload');
        } else if (job.status === 'processing' || job.status === 'pending') {
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(poll, 2000);
          } else {
            toast.error('Extraction is taking too long. Please check back later.');
            navigate('/');
          }
        }
      } catch (error: any) {
        toast.error('Failed to check extraction status');
        setView('upload');
      }
    };

    poll();
  };

  const handleConfirm = async () => {
    if (!extractionJob || !extractedData) return;

    try {
      let result;
      
      switch (extractionJob.documentType) {
        case 'timetable':
          result = await extractionApi.confirmTimetable(extractionJob.id, {
            entries: extractedData.entries,
            semester_start_date: '2024-09-01', // TODO: Add date picker
            semester_end_date: '2024-12-31',
          });
          break;
        case 'result':
          result = await extractionApi.confirmResult(extractionJob.id, extractedData);
          break;
        case 'exam_schedule':
          result = await extractionApi.confirmExamSchedule(extractionJob.id, extractedData);
          break;
        case 'deadline':
          result = await extractionApi.confirmDeadline(extractionJob.id, extractedData);
          break;
        default:
          throw new Error('Unknown document type');
      }

      toast.success(`Confirmed successfully! ${result.createdRecords} records created.`);
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to confirm extraction');
    }
  };

  const handleReject = async () => {
    if (!extractionJob) return;

    try {
      await extractionApi.reject(extractionJob.id);
      toast.info('Extraction discarded');
      setView('upload');
      setFile(null);
      setPreviewUrl('');
      setExtractedData(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject extraction');
    }
  };

  const resetUpload = () => {
    setFile(null);
    setPreviewUrl('');
    setDocumentType('');
    setUploadProgress(0);
    setView('upload');
  };

  // Upload View
  if (view === 'upload') {
    return (
      <StudentLayout title="Upload Document" subtitle="Step 1">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Document Type Selector */}
          <Card>
            <h3 className="font-headline-md text-on-surface mb-4">What are you uploading?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { type: 'timetable', label: 'Timetable', icon: 'table_chart' },
                { type: 'result', label: 'Results', icon: 'receipt_long' },
                { type: 'exam_schedule', label: 'Exam Schedule', icon: 'event_note' },
                { type: 'deadline', label: 'Assignment', icon: 'assignment' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => setDocumentType(item.type as DocumentType)}
                  className={`p-4 rounded-xl border transition-all ${
                    documentType === item.type
                      ? 'border-primary/40 bg-primary-light'
                      : 'border-transparent bg-surface-container-low hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl block mb-2">
                    {item.icon}
                  </span>
                  <span className="font-label-md text-on-surface">{item.label}</span>
                </button>
              ))}
            </div>
            {!documentType && (
              <p className="text-body-sm text-on-surface-variant mt-3">
                Or upload first, and we'll auto-detect the type
              </p>
            )}
          </Card>

          {/* Upload Area */}
          <Card>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative p-12 text-center border-2 border-dashed rounded-2xl transition-colors ${
                isDragging
                  ? 'border-primary/40 bg-primary-light'
                  : 'border-outline-variant/60'
              }`}
            >
              {!file ? (
                <>
                  <Upload className="mx-auto mb-4 text-outline" size={48} />
                  <h3 className="font-headline-md text-on-surface mb-2">
                    Drop your document here
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mb-4">
                    or click to browse (JPG, PNG, PDF up to 10MB)
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm bg-primary-light text-primary hover:bg-primary/10 transition-colors">
                      <FileText size={18} />
                      Browse Files
                    </span>
                  </label>
                  <div className="mt-4">
                    <Button variant="ghost" size="sm">
                      <Camera size={18} />
                      Use Camera
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-xl"
                    />
                  )}
                  <div className="flex items-center justify-center gap-3">
                    <FileText size={20} className="text-primary" />
                    <span className="font-label-md text-on-surface">{file.name}</span>
                    <button
                      onClick={resetUpload}
                      className="p-1 hover:bg-surface-container-low rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <Button onClick={handleUpload} size="lg">
                    <Upload size={18} />
                    Upload & Extract
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Info Card */}
          <Card variant="outlined" className="bg-surface-container-low">
            <div className="flex gap-3">
              <AlertCircle className="text-primary flex-shrink-0" size={20} />
              <div>
                <h4 className="font-label-md font-bold text-on-surface mb-1">
                  How it works
                </h4>
                <ul className="text-body-sm text-on-surface-variant space-y-1 list-disc list-inside">
                  <li>Upload a photo or scan of your document</li>
                  <li>AI extracts structured data in seconds</li>
                  <li>Review and confirm the extracted information</li>
                  <li>Auto-sync to Google Calendar (if connected)</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </StudentLayout>
    );
  }

  // Processing View
  if (view === 'processing') {
    return (
      <StudentLayout title="Processing Document" subtitle="Step 2">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center p-12">
            <Spinner size="lg" className="mx-auto mb-6" />
            <h3 className="font-headline-md text-on-surface mb-2">
              Reading your document...
            </h3>
            <p className="text-body-md text-on-surface-variant mb-6">
              Our AI is extracting structured data. This usually takes 5-15 seconds.
            </p>
            {uploadProgress > 0 && (
              <div className="w-full bg-surface-variant rounded-full h-2 mb-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            <p className="text-body-sm text-on-surface-variant">
              {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : 'Extracting data...'}
            </p>
          </Card>
        </div>
      </StudentLayout>
    );
  }

  // Review View
  return (
    <StudentLayout title="Review & Confirm" subtitle="Step 3">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Confidence Banner */}
        {extractionJob?.confidence === 'low' && (
          <Card className="bg-[#fff8f1] border-[#ffead6]">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-tertiary-container flex-shrink-0" size={20} />
              <div>
                <h4 className="font-label-md font-bold text-on-surface mb-1">
                  Low Confidence Detection
                </h4>
                <p className="text-body-sm text-on-surface-variant">
                  Please carefully review all highlighted fields. The image quality may affect accuracy.
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Document */}
          <Card>
            <h3 className="font-headline-md text-on-surface mb-4">Original Document</h3>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Original"
                className="w-full rounded-xl"
              />
            ) : (
              <div className="aspect-video bg-surface-container-low rounded-lg flex items-center justify-center">
                <FileText size={48} className="text-outline" />
              </div>
            )}
          </Card>

          {/* Extracted Data */}
          <Card>
            <h3 className="font-headline-md text-on-surface mb-4">Extracted Information</h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
              {extractedData && renderExtractedFields()}
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-outline-variant/20">
              <Button variant="outline" onClick={handleReject} className="flex-1">
                <X size={18} />
                Discard
              </Button>
              <Button onClick={handleConfirm} className="flex-1">
                <CheckCircle size={18} />
                Confirm & Save
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );

  function renderExtractedFields() {
    if (!extractedData || !extractionJob) return null;

    switch (extractionJob.documentType) {
      case 'timetable':
        return extractedData.entries?.map((entry: any, index: number) => (
          <div key={index} className="p-3 bg-surface-container-low rounded-lg">
            <div className="grid grid-cols-2 gap-2 text-body-sm">
              <div>
                <span className="text-on-surface-variant">Day:</span>
                <span className="ml-2 font-medium">{entry.day_of_week}</span>
              </div>
              <div>
                <span className="text-on-surface-variant">Time:</span>
                <span className="ml-2 font-medium">
                  {entry.start_time} - {entry.end_time}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-on-surface-variant">Subject:</span>
                <span className="ml-2 font-medium">{entry.subject_name}</span>
              </div>
              {entry.location && (
                <div className="col-span-2">
                  <span className="text-on-surface-variant">Location:</span>
                  <span className="ml-2 font-medium">{entry.location}</span>
                </div>
              )}
            </div>
          </div>
        ));

      case 'result':
        return (
          <>
            <div className="p-3 bg-primary-container/10 rounded-lg">
              <span className="font-label-md font-bold">{extractedData.exam_label}</span>
            </div>
            {extractedData.subjects?.map((subject: any, index: number) => (
              <div key={index} className="p-3 bg-surface-container-low rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-label-md">{subject.subject_name}</span>
                  <span className="font-headline-md font-bold text-primary">
                    {subject.marks_obtained}/{subject.max_marks}
                  </span>
                </div>
              </div>
            ))}
          </>
        );

      default:
        return <pre className="text-xs">{JSON.stringify(extractedData, null, 2)}</pre>;
    }
  }
}
