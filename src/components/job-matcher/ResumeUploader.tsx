import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useProfile } from '@/hooks/useProfile';
import { useJobMatcher } from '@/hooks/useJobMatcher';
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ResumeUploaderProps {
  onResumeProcessed: (parsedData: any) => void;
}

export function ResumeUploader({ onResumeProcessed }: ResumeUploaderProps) {
  const { profile, uploadResume } = useProfile();
  const { parseResume } = useJobMatcher();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [parsedData, setParsedData] = useState<any>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOC, or DOCX file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsProcessing(true);
    try {
      // Upload to profile
      const { error: uploadError } = await uploadResume(file);
      if (uploadError) throw uploadError;

      // For now, we'll ask user to paste text content
      // In production, you'd use a PDF parsing library
      toast.info('Please paste the text content of your resume below for AI analysis');
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleParseResume = async () => {
    if (!resumeText.trim()) {
      toast.error('Please enter resume text');
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await parseResume(resumeText);
      if (error) throw error;

      setParsedData(data);
      onResumeProcessed(data);
      toast.success('Resume parsed successfully!');
    } catch (error) {
      console.error('Error parsing resume:', error);
      toast.error('Failed to parse resume');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your Resume</CardTitle>
        <CardDescription>
          Upload your resume or CV to get started with AI-powered job matching
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'}
            ${profile?.resume_url ? 'bg-green-50 border-green-300' : ''}
          `}
        >
          {profile?.resume_url ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
              <p className="text-sm font-medium">Resume on file</p>
              <p className="text-xs text-muted-foreground">You can upload a new one to replace it</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-12 h-12 text-muted-foreground" />
              <p className="text-sm font-medium">Drag & drop your resume here</p>
              <p className="text-xs text-muted-foreground">or click to browse (PDF, DOC, DOCX - max 5MB)</p>
            </div>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileInput}
            className="hidden"
            id="resume-upload"
          />
          <label htmlFor="resume-upload">
            <Button
              variant="outline"
              className="mt-4"
              disabled={isProcessing}
              asChild
            >
              <span>
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Choose File
                  </>
                )}
              </span>
            </Button>
          </label>
        </div>

        {/* Resume Text Input for AI Parsing */}
        <div className="space-y-2">
          <Label htmlFor="resume-text">Resume Text (for AI analysis)</Label>
          <Textarea
            id="resume-text"
            placeholder="Paste your resume text here for AI-powered parsing and matching..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={10}
            className="font-mono text-sm"
          />
          <Button
            onClick={handleParseResume}
            disabled={isProcessing || !resumeText.trim()}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Parsing Resume with AI...
              </>
            ) : (
              'Parse Resume with AI'
            )}
          </Button>
        </div>

        {/* Display Parsed Data */}
        {parsedData && (
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Resume Parsed Successfully
            </h3>
            <div className="space-y-2 text-sm">
              {parsedData.personal_info && (
                <div>
                  <p className="font-medium">Name:</p>
                  <p className="text-muted-foreground">{parsedData.personal_info.name}</p>
                </div>
              )}
              {parsedData.skills && parsedData.skills.length > 0 && (
                <div>
                  <p className="font-medium">Skills:</p>
                  <p className="text-muted-foreground">{parsedData.skills.join(', ')}</p>
                </div>
              )}
              {parsedData.years_of_experience && (
                <div>
                  <p className="font-medium">Experience:</p>
                  <p className="text-muted-foreground">{parsedData.years_of_experience} years</p>
                </div>
              )}
              {parsedData.experience && parsedData.experience.length > 0 && (
                <div>
                  <p className="font-medium">Recent Position:</p>
                  <p className="text-muted-foreground">
                    {parsedData.experience[0].title} at {parsedData.experience[0].company}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
