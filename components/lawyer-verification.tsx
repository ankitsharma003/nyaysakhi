'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircle,
  X as X,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Upload,
  Eye,
  Download,
  Shield,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { apiClient } from '@/lib/api'

interface VerificationDocument {
  id: string
  type:
    | 'bar_council_certificate'
    | 'degree_certificate'
    | 'identity_proof'
    | 'address_proof'
    | 'experience_certificate'
  name: string
  fileUrl: string
  status: 'pending' | 'verified' | 'rejected'
  uploadedAt: string
  verifiedAt?: string
  verifiedBy?: string
  rejectionReason?: string
  expiryDate?: string
}

interface VerificationStatus {
  overall: 'pending' | 'verified' | 'rejected' | 'partial'
  documents: VerificationDocument[]
  barCouncilStatus: 'pending' | 'verified' | 'rejected'
  identityStatus: 'pending' | 'verified' | 'rejected'
  educationStatus: 'pending' | 'verified' | 'rejected'
  experienceStatus: 'pending' | 'verified' | 'rejected'
  lastUpdated: string
  verificationScore: number
}

interface LawyerVerificationProps {
  lawyerId: string
  language?: 'en' | 'hi'
  onStatusUpdate?: (status: VerificationStatus) => void
}

export default function LawyerVerification({
  lawyerId,
  language = 'en',
  onStatusUpdate,
}: LawyerVerificationProps) {
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDocument, setSelectedDocument] =
    useState<VerificationDocument | null>(null)

  useEffect(() => {
    loadVerificationStatus()
  }, [lawyerId])

  const loadVerificationStatus = async () => {
    try {
      setLoading(true)
      // Mock verification status - in real app, this would be an API call
      const mockStatus: VerificationStatus = {
        overall: 'partial',
        documents: [
          {
            id: '1',
            type: 'bar_council_certificate',
            name: 'Bar Council Certificate',
            fileUrl: '/documents/bar_council_cert.pdf',
            status: 'verified',
            uploadedAt: '2024-01-15',
            verifiedAt: '2024-01-16',
            verifiedBy: 'Admin User',
            expiryDate: '2025-01-15',
          },
          {
            id: '2',
            type: 'degree_certificate',
            name: 'LLB Degree Certificate',
            fileUrl: '/documents/llb_degree.pdf',
            status: 'verified',
            uploadedAt: '2024-01-15',
            verifiedAt: '2024-01-16',
            verifiedBy: 'Admin User',
          },
          {
            id: '3',
            type: 'identity_proof',
            name: 'Aadhaar Card',
            fileUrl: '/documents/aadhaar.pdf',
            status: 'verified',
            uploadedAt: '2024-01-15',
            verifiedAt: '2024-01-16',
            verifiedBy: 'Admin User',
          },
          {
            id: '4',
            type: 'address_proof',
            name: 'Electricity Bill',
            fileUrl: '/documents/address_proof.pdf',
            status: 'pending',
            uploadedAt: '2024-01-20',
          },
          {
            id: '5',
            type: 'experience_certificate',
            name: 'Previous Firm Experience',
            fileUrl: '/documents/experience.pdf',
            status: 'rejected',
            uploadedAt: '2024-01-18',
            rejectionReason:
              'Document quality is poor. Please upload a clearer copy.',
          },
        ],
        barCouncilStatus: 'verified',
        identityStatus: 'verified',
        educationStatus: 'verified',
        experienceStatus: 'rejected',
        lastUpdated: '2024-01-20',
        verificationScore: 75,
      }
      setVerificationStatus(mockStatus)
      onStatusUpdate?.(mockStatus)
    } catch (error) {
      console.error('Error loading verification status:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    const statusMap = {
      verified: language === 'hi' ? 'सत्यापित' : 'Verified',
      rejected: language === 'hi' ? 'अस्वीकृत' : 'Rejected',
      pending: language === 'hi' ? 'लंबित' : 'Pending',
      partial: language === 'hi' ? 'आंशिक' : 'Partial',
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  const getDocumentTypeName = (type: string) => {
    const typeMap = {
      bar_council_certificate:
        language === 'hi'
          ? 'बार काउंसिल प्रमाणपत्र'
          : 'Bar Council Certificate',
      degree_certificate:
        language === 'hi' ? 'डिग्री प्रमाणपत्र' : 'Degree Certificate',
      identity_proof: language === 'hi' ? 'पहचान प्रमाण' : 'Identity Proof',
      address_proof: language === 'hi' ? 'पता प्रमाण' : 'Address Proof',
      experience_certificate:
        language === 'hi' ? 'अनुभव प्रमाणपत्र' : 'Experience Certificate',
    }
    return typeMap[type as keyof typeof typeMap] || type
  }

  const getVerificationScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleDocumentView = (document: VerificationDocument) => {
    setSelectedDocument(document)
  }

  const handleDocumentReupload = (documentId: string) => {
    // Handle document reupload
    console.log('Reupload document:', documentId)
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="py-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">
            {language === 'hi'
              ? 'सत्यापन स्थिति लोड हो रहा है...'
              : 'Loading verification status...'}
          </p>
        </div>
      </div>
    )
  }

  if (!verificationStatus) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <Card>
          <CardContent className="py-8 text-center">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-gray-600">
              {language === 'hi'
                ? 'सत्यापन स्थिति नहीं मिली'
                : 'Verification status not found'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {language === 'hi' ? 'वकील सत्यापन' : 'Lawyer Verification'}
        </h2>
        <p className="text-lg text-gray-600">
          {language === 'hi'
            ? 'वकील के दस्तावेजों और प्रमाणपत्रों की सत्यापन स्थिति'
            : 'Verification status of lawyer documents and certificates'}
        </p>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>
              {language === 'hi'
                ? 'कुल सत्यापन स्थिति'
                : 'Overall Verification Status'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getStatusIcon(verificationStatus.overall)}
              <div>
                <h3 className="text-lg font-semibold">
                  {getStatusText(verificationStatus.overall)}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'hi' ? 'अंतिम अपडेट:' : 'Last Updated:'}{' '}
                  {verificationStatus.lastUpdated}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-2xl font-bold ${getVerificationScoreColor(verificationStatus.verificationScore)}`}
              >
                {verificationStatus.verificationScore}%
              </div>
              <p className="text-sm text-gray-600">
                {language === 'hi' ? 'सत्यापन स्कोर' : 'Verification Score'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Status */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="mb-2 flex justify-center">
              {getStatusIcon(verificationStatus.barCouncilStatus)}
            </div>
            <h4 className="mb-1 font-semibold">
              {language === 'hi' ? 'बार काउंसिल' : 'Bar Council'}
            </h4>
            <p
              className={`text-sm ${getStatusColor(verificationStatus.barCouncilStatus)} rounded px-2 py-1`}
            >
              {getStatusText(verificationStatus.barCouncilStatus)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="mb-2 flex justify-center">
              {getStatusIcon(verificationStatus.identityStatus)}
            </div>
            <h4 className="mb-1 font-semibold">
              {language === 'hi' ? 'पहचान' : 'Identity'}
            </h4>
            <p
              className={`text-sm ${getStatusColor(verificationStatus.identityStatus)} rounded px-2 py-1`}
            >
              {getStatusText(verificationStatus.identityStatus)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="mb-2 flex justify-center">
              {getStatusIcon(verificationStatus.educationStatus)}
            </div>
            <h4 className="mb-1 font-semibold">
              {language === 'hi' ? 'शिक्षा' : 'Education'}
            </h4>
            <p
              className={`text-sm ${getStatusColor(verificationStatus.educationStatus)} rounded px-2 py-1`}
            >
              {getStatusText(verificationStatus.educationStatus)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="mb-2 flex justify-center">
              {getStatusIcon(verificationStatus.experienceStatus)}
            </div>
            <h4 className="mb-1 font-semibold">
              {language === 'hi' ? 'अनुभव' : 'Experience'}
            </h4>
            <p
              className={`text-sm ${getStatusColor(verificationStatus.experienceStatus)} rounded px-2 py-1`}
            >
              {getStatusText(verificationStatus.experienceStatus)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>{language === 'hi' ? 'दस्तावेज' : 'Documents'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {verificationStatus.documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(document.status)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {getDocumentTypeName(document.type)}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === 'hi' ? 'अपलोड किया गया:' : 'Uploaded:'}{' '}
                      {document.uploadedAt}
                    </p>
                    {document.verifiedAt && (
                      <p className="text-sm text-gray-600">
                        {language === 'hi' ? 'सत्यापित:' : 'Verified:'}{' '}
                        {document.verifiedAt}
                      </p>
                    )}
                    {document.rejectionReason && (
                      <p className="mt-1 text-sm text-red-600">
                        {language === 'hi'
                          ? 'अस्वीकरण कारण:'
                          : 'Rejection Reason:'}{' '}
                        {document.rejectionReason}
                      </p>
                    )}
                    {document.expiryDate && (
                      <p className="text-sm text-yellow-600">
                        {language === 'hi' ? 'समाप्ति तिथि:' : 'Expiry Date:'}{' '}
                        {document.expiryDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(document.status)}`}
                  >
                    {getStatusText(document.status)}
                  </span>

                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDocumentView(document)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {document.status === 'rejected' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDocumentReupload(document.id)}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {getDocumentTypeName(selectedDocument.type)}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDocument(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedDocument.status)}
                  <span
                    className={`rounded px-2 py-1 text-sm font-medium ${getStatusColor(selectedDocument.status)}`}
                  >
                    {getStatusText(selectedDocument.status)}
                  </span>
                </div>

                <div className="rounded-lg bg-gray-100 p-8 text-center">
                  <FileText className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                  <p className="mb-4 text-gray-600">
                    {language === 'hi'
                      ? 'दस्तावेज पूर्वावलोकन'
                      : 'Document Preview'}
                  </p>
                  <Button
                    onClick={() =>
                      window.open(selectedDocument.fileUrl, '_blank')
                    }
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {language === 'hi' ? 'डाउनलोड करें' : 'Download'}
                  </Button>
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    <strong>
                      {language === 'hi' ? 'अपलोड तिथि:' : 'Upload Date:'}
                    </strong>{' '}
                    {selectedDocument.uploadedAt}
                  </p>
                  {selectedDocument.verifiedAt && (
                    <p>
                      <strong>
                        {language === 'hi'
                          ? 'सत्यापन तिथि:'
                          : 'Verification Date:'}
                      </strong>{' '}
                      {selectedDocument.verifiedAt}
                    </p>
                  )}
                  {selectedDocument.verifiedBy && (
                    <p>
                      <strong>
                        {language === 'hi'
                          ? 'सत्यापित किया गया:'
                          : 'Verified By:'}
                      </strong>{' '}
                      {selectedDocument.verifiedBy}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
