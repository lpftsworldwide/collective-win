import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  Upload,
  FileCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Camera,
  CreditCard,
  Home,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

type KycStatus = 'pending' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'expired';
type DocumentType = 'passport' | 'drivers_license' | 'national_id' | 'proof_of_address' | 'bank_statement' | 'selfie';

interface KycVerification {
  id: string;
  status: KycStatus;
  submitted_at: string | null;
  rejection_reason: string | null;
}

interface KycDocument {
  id: string;
  document_type: DocumentType;
  file_name: string;
  status: KycStatus;
  uploaded_at: string;
}

const documentTypeLabels: Record<DocumentType, { label: string; icon: React.ReactNode; description: string }> = {
  passport: { 
    label: "Passport", 
    icon: <CreditCard className="w-5 h-5" />,
    description: "Photo page of your valid passport"
  },
  drivers_license: { 
    label: "Driver's License", 
    icon: <CreditCard className="w-5 h-5" />,
    description: "Front and back of your driver's license"
  },
  national_id: { 
    label: "National ID Card", 
    icon: <CreditCard className="w-5 h-5" />,
    description: "Front and back of your national ID"
  },
  proof_of_address: { 
    label: "Proof of Address", 
    icon: <Home className="w-5 h-5" />,
    description: "Utility bill or bank statement (< 3 months old)"
  },
  bank_statement: { 
    label: "Bank Statement", 
    icon: <CreditCard className="w-5 h-5" />,
    description: "Recent bank statement (< 3 months old)"
  },
  selfie: { 
    label: "Selfie with ID", 
    icon: <Camera className="w-5 h-5" />,
    description: "Photo of yourself holding your ID document"
  },
};

const statusColors: Record<KycStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  submitted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  under_review: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  approved: "bg-green-500/20 text-green-400 border-green-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
  expired: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const KYCVerification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [verification, setVerification] = useState<KycVerification | null>(null);
  const [documents, setDocuments] = useState<KycDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType | "">("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchKycStatus = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch or create KYC verification record
      const { data: kycData, error: kycError } = await supabase
        .from('kyc_verifications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (kycError) throw kycError;

      if (!kycData) {
        // Create new verification record
        const { data: newKyc, error: createError } = await supabase
          .from('kyc_verifications')
          .insert({ user_id: user.id })
          .select()
          .single();
        
        if (createError) throw createError;
        setVerification(newKyc);
      } else {
        setVerification(kycData);
      }

      // Fetch documents
      const { data: docsData, error: docsError } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (docsError) throw docsError;
      setDocuments(docsData || []);

    } catch (error) {
      console.error('Error fetching KYC status:', error);
      toast({
        title: "Error",
        description: "Failed to load verification status.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchKycStatus();
  }, [user, navigate, fetchKycStatus]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a JPEG, PNG, WebP, or PDF file.",
          variant: "destructive",
        });
        return;
      }
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Maximum file size is 10MB.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!user || !verification || !selectedDocType || !selectedFile) {
      toast({
        title: "Missing Information",
        description: "Please select a document type and file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${selectedDocType}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Create document record
      const { error: docError } = await supabase
        .from('kyc_documents')
        .insert({
          verification_id: verification.id,
          user_id: user.id,
          document_type: selectedDocType,
          file_name: selectedFile.name,
          file_path: filePath,
          file_size_bytes: selectedFile.size,
          mime_type: selectedFile.type,
        });

      if (docError) throw docError;

      // Update verification status if still pending
      if (verification.status === 'pending') {
        await supabase
          .from('kyc_verifications')
          .update({ 
            status: 'submitted',
            submitted_at: new Date().toISOString(),
          })
          .eq('id', verification.id);
      }

      toast({
        title: "Document Uploaded",
        description: "Your document has been submitted for review.",
      });

      // Reset and refresh
      setSelectedDocType("");
      setSelectedFile(null);
      fetchKycStatus();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getProgress = () => {
    const requiredDocs: DocumentType[] = ['passport', 'proof_of_address', 'selfie'];
    const uploadedTypes = new Set(documents.map(d => d.document_type));
    const completed = requiredDocs.filter(t => uploadedTypes.has(t)).length;
    return (completed / requiredDocs.length) * 100;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-premium-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-gaming-dark/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-premium-gold">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-premium-gold" />
              <h1 className="text-xl font-bold text-premium-gold">Identity Verification (KYC)</h1>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Status Card */}
        <Card className="bg-gaming-card border-border mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {verification?.status === 'approved' ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : verification?.status === 'rejected' ? (
                  <XCircle className="w-8 h-8 text-red-500" />
                ) : (
                  <Clock className="w-8 h-8 text-yellow-500" />
                )}
                <div>
                  <CardTitle className="text-foreground">Verification Status</CardTitle>
                  <CardDescription>
                    {verification?.status === 'approved' 
                      ? "Your identity has been verified"
                      : "Complete verification to enable withdrawals"
                    }
                  </CardDescription>
                </div>
              </div>
              <Badge className={statusColors[verification?.status || 'pending']}>
                {verification?.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Verification Progress</span>
                  <span className="text-premium-gold font-medium">{Math.round(getProgress())}%</span>
                </div>
                <Progress value={getProgress()} className="h-2" />
              </div>

              {verification?.status === 'rejected' && verification.rejection_reason && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                    <div>
                      <p className="font-medium text-red-400">Verification Rejected</p>
                      <p className="text-sm text-foreground/80 mt-1">
                        {verification.rejection_reason}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {verification?.status === 'approved' && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium text-green-400">Verification Complete</p>
                      <p className="text-sm text-foreground/80">
                        You can now make withdrawals from your account.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upload Section - Only show if not approved */}
        {verification?.status !== 'approved' && (
          <Card className="bg-gaming-card border-border mb-6">
            <CardHeader>
              <CardTitle className="text-premium-gold flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Documents
              </CardTitle>
              <CardDescription>
                Upload the required documents to verify your identity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Document Type Selection */}
              <div className="space-y-2">
                <Label>Document Type</Label>
                <Select 
                  value={selectedDocType} 
                  onValueChange={(value) => setSelectedDocType(value as DocumentType)}
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(documentTypeLabels).map(([type, info]) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-2">
                          {info.icon}
                          <span>{info.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedDocType && (
                  <p className="text-xs text-muted-foreground">
                    {documentTypeLabels[selectedDocType].description}
                  </p>
                )}
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>Select File</Label>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileSelect}
                  className="bg-background border-border"
                />
                {selectedFile && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <Button
                onClick={handleUpload}
                disabled={!selectedDocType || !selectedFile || isUploading}
                className="w-full bg-gradient-to-r from-premium-gold to-premium-gold-dark"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Required Documents Checklist */}
        <Card className="bg-gaming-card border-border mb-6">
          <CardHeader>
            <CardTitle className="text-premium-gold flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(['passport', 'proof_of_address', 'selfie'] as DocumentType[]).map((docType) => {
                const uploaded = documents.find(d => d.document_type === docType);
                const info = documentTypeLabels[docType];
                
                return (
                  <div 
                    key={docType}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      uploaded ? 'bg-green-500/10 border-green-500/30' : 'bg-background/50 border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {info.icon}
                      <div>
                        <p className="font-medium">{info.label}</p>
                        <p className="text-xs text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                    {uploaded ? (
                      <Badge className={statusColors[uploaded.status]}>
                        {uploaded.status === 'submitted' ? 'Pending Review' : uploaded.status.toUpperCase()}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Required
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Previously Uploaded Documents */}
        {documents.length > 0 && (
          <Card className="bg-gaming-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Uploaded Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border"
                  >
                    <div>
                      <p className="font-medium text-sm">{documentTypeLabels[doc.document_type]?.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.file_name} • {new Date(doc.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={statusColors[doc.status]}>
                      {doc.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Box */}
        <div className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-400">Your Privacy is Protected</p>
              <p className="text-sm text-foreground/80 mt-1">
                All documents are encrypted and stored securely. We only use your information 
                for identity verification as required by anti-money laundering regulations.
                Your data is handled in compliance with GDPR and international data protection laws.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KYCVerification;