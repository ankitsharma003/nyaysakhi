'use client'

import { useState, useEffect } from 'react'
import {
  FileText,
  Calendar,
  User,
  Scale,
  MapPin,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import VoicePlayer from '@/components/voice-player'
import { ExtractedData } from '@/types'
import { formatDate, formatDateHindi } from '@/lib/utils'

interface DocumentAnalyzerProps {
  extractedData: ExtractedData
  onEdit: (field: keyof ExtractedData, value: string) => void
  onSave: () => void
  language?: 'en' | 'hi'
}

export default function DocumentAnalyzer({
  extractedData,
  onEdit,
  onSave,
  language = 'en',
}: DocumentAnalyzerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<ExtractedData>(extractedData)

  useEffect(() => {
    setEditedData(extractedData)
  }, [extractedData])

  const handleEdit = (field: keyof ExtractedData, value: string) => {
    setEditedData((prev) => ({ ...prev, [field]: value }))
    onEdit(field, value)
  }

  const handleSave = () => {
    onSave()
    setIsEditing(false)
  }

  const generateSummary = () => {
    const data = editedData
    const parts = []

    if (data.caseNumber) {
      parts.push(
        language === 'hi'
          ? `मुकदमा संख्या: ${data.caseNumber}`
          : `Case Number: ${data.caseNumber}`
      )
    }

    if (data.caseTitle) {
      parts.push(
        language === 'hi'
          ? `मुकदमा शीर्षक: ${data.caseTitle}`
          : `Case Title: ${data.caseTitle}`
      )
    }

    if (data.judgeName) {
      parts.push(
        language === 'hi'
          ? `न्यायाधीश: ${data.judgeName}`
          : `Judge: ${data.judgeName}`
      )
    }

    if (data.nextHearingDate) {
      const date = new Date(data.nextHearingDate)
      const formattedDate =
        language === 'hi' ? formatDateHindi(date) : formatDate(date)
      parts.push(
        language === 'hi'
          ? `अगली सुनवाई: ${formattedDate}`
          : `Next Hearing: ${formattedDate}`
      )
    }

    if (data.caseStatus) {
      parts.push(
        language === 'hi'
          ? `स्थिति: ${data.caseStatus}`
          : `Status: ${data.caseStatus}`
      )
    }

    if (data.courtName) {
      parts.push(
        language === 'hi'
          ? `अदालत: ${data.courtName}`
          : `Court: ${data.courtName}`
      )
    }

    if (data.caseType) {
      parts.push(
        language === 'hi'
          ? `प्रकार: ${data.caseType}`
          : `Type: ${data.caseType}`
      )
    }

    return parts.length > 0
      ? parts.join('. ') + '.'
      : language === 'hi'
        ? 'कोई जानकारी उपलब्ध नहीं है।'
        : 'No information available.'
  }

  const getFieldLabel = (field: string) => {
    if (language === 'hi') {
      const labels: Record<string, string> = {
        caseNumber: 'मुकदमा संख्या',
        caseTitle: 'मुकदमा शीर्षक',
        judgeName: 'न्यायाधीश का नाम',
        nextHearingDate: 'अगली सुनवाई की तारीख',
        caseStatus: 'मुकदमे की स्थिति',
        courtName: 'न्यायालय का नाम',
        caseType: 'मुकदमे का प्रकार',
        parties: 'पक्षकार',
      }
      return labels[field] || field
    } else {
      const labels: Record<string, string> = {
        caseNumber: 'Case Number',
        caseTitle: 'Case Title',
        judgeName: 'Judge Name',
        nextHearingDate: 'Next Hearing Date',
        caseStatus: 'Case Status',
        courtName: 'Court Name',
        caseType: 'Case Type',
        parties: 'Parties',
      }
      return labels[field] || field
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceText = (confidence: number) => {
    if (language === 'hi') {
      if (confidence >= 0.8) return 'उच्च विश्वसनीयता'
      if (confidence >= 0.6) return 'मध्यम विश्वसनीयता'
      return 'कम विश्वसनीयता'
    } else {
      if (confidence >= 0.8) return 'High Confidence'
      if (confidence >= 0.6) return 'Medium Confidence'
      return 'Low Confidence'
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            {language === 'hi' ? 'दस्तावेज़ विश्लेषण' : 'Document Analysis'}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`text-sm font-medium ${getConfidenceColor(extractedData.confidence)}`}
          >
            {getConfidenceText(extractedData.confidence)} (
            {Math.round(extractedData.confidence * 100)}%)
          </span>
          <Button
            variant={isEditing ? 'default' : 'outline'}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing
              ? language === 'hi'
                ? 'समाप्त करें'
                : 'Finish Editing'
              : language === 'hi'
                ? 'संपादित करें'
                : 'Edit'}
          </Button>
        </div>
      </div>

      {/* Extracted Data Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Case Number */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Scale className="h-5 w-5 text-indigo-600" />
              <span>{getFieldLabel('caseNumber')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <input
                type="text"
                value={editedData.caseNumber || ''}
                onChange={(e) => handleEdit('caseNumber', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                placeholder={
                  language === 'hi'
                    ? 'मुकदमा संख्या दर्ज करें'
                    : 'Enter case number'
                }
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900">
                {extractedData.caseNumber ||
                  (language === 'hi' ? 'नहीं मिला' : 'Not found')}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Case Title */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <FileText className="h-5 w-5 text-indigo-600" />
              <span>{getFieldLabel('caseTitle')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <input
                type="text"
                value={editedData.caseTitle || ''}
                onChange={(e) => handleEdit('caseTitle', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                placeholder={
                  language === 'hi'
                    ? 'मुकदमा शीर्षक दर्ज करें'
                    : 'Enter case title'
                }
              />
            ) : (
              <p className="text-gray-900">
                {extractedData.caseTitle ||
                  (language === 'hi' ? 'नहीं मिला' : 'Not found')}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Judge Name */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <User className="h-5 w-5 text-indigo-600" />
              <span>{getFieldLabel('judgeName')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <input
                type="text"
                value={editedData.judgeName || ''}
                onChange={(e) => handleEdit('judgeName', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                placeholder={
                  language === 'hi'
                    ? 'न्यायाधीश का नाम दर्ज करें'
                    : 'Enter judge name'
                }
              />
            ) : (
              <p className="text-gray-900">
                {extractedData.judgeName ||
                  (language === 'hi' ? 'नहीं मिला' : 'Not found')}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Next Hearing Date */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <span>{getFieldLabel('nextHearingDate')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <input
                type="date"
                value={
                  editedData.nextHearingDate
                    ? new Date(editedData.nextHearingDate)
                        .toISOString()
                        .split('T')[0]
                    : ''
                }
                onChange={(e) => handleEdit('nextHearingDate', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                aria-label={
                  language === 'hi'
                    ? 'अगली सुनवाई की तारीख'
                    : 'Next hearing date'
                }
              />
            ) : (
              <p className="text-gray-900">
                {extractedData.nextHearingDate
                  ? language === 'hi'
                    ? formatDateHindi(extractedData.nextHearingDate)
                    : formatDate(extractedData.nextHearingDate)
                  : language === 'hi'
                    ? 'नहीं मिला'
                    : 'Not found'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Case Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <AlertCircle className="h-5 w-5 text-indigo-600" />
              <span>{getFieldLabel('caseStatus')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <select
                value={editedData.caseStatus || ''}
                onChange={(e) => handleEdit('caseStatus', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                aria-label={
                  language === 'hi' ? 'मुकदमे की स्थिति' : 'Case status'
                }
              >
                <option value="">
                  {language === 'hi' ? 'स्थिति चुनें' : 'Select status'}
                </option>
                <option value="pending">
                  {language === 'hi' ? 'लंबित' : 'Pending'}
                </option>
                <option value="disposed">
                  {language === 'hi' ? 'निपटाया गया' : 'Disposed'}
                </option>
                <option value="adjourned">
                  {language === 'hi' ? 'स्थगित' : 'Adjourned'}
                </option>
                <option value="dismissed">
                  {language === 'hi' ? 'खारिज' : 'Dismissed'}
                </option>
              </select>
            ) : (
              <p className="text-gray-900">
                {extractedData.caseStatus ||
                  (language === 'hi' ? 'नहीं मिला' : 'Not found')}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Court Name */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <MapPin className="h-5 w-5 text-indigo-600" />
              <span>{getFieldLabel('courtName')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <input
                type="text"
                value={editedData.courtName || ''}
                onChange={(e) => handleEdit('courtName', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                placeholder={
                  language === 'hi'
                    ? 'न्यायालय का नाम दर्ज करें'
                    : 'Enter court name'
                }
              />
            ) : (
              <p className="text-gray-900">
                {extractedData.courtName ||
                  (language === 'hi' ? 'नहीं मिला' : 'Not found')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Raw Text Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {language === 'hi' ? 'निकाला गया पाठ' : 'Extracted Text'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 overflow-y-auto rounded-lg bg-gray-50 p-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {extractedData.rawText}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Voice Player */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {language === 'hi' ? 'आवाज़ सुनें' : 'Listen to Summary'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VoicePlayer
            text={generateSummary()}
            language={language}
            className="mb-4"
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            {language === 'hi' ? 'रद्द करें' : 'Cancel'}
          </Button>
          <Button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {language === 'hi' ? 'सहेजें' : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  )
}
