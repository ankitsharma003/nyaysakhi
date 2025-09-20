'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, FileText, Image, File, X, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'

export default function DocumentUploadPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-lg font-medium text-gray-900">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files).filter((file) => {
      const validTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ]
      return validTypes.includes(file.type)
    })

    setUploadedFiles((prev) => [...prev, ...newFiles])
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-green-600" />
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-600" />
    } else {
      return <File className="h-8 w-8 text-blue-600" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return

    setUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          // Show success message
          setTimeout(() => {
            router.push('/documents')
          }, 2000)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/documents"
                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Documents</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
              >
                {language === 'en' ? 'हिंदी' : 'English'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'hi' ? 'दस्तावेज़ अपलोड करें' : 'Upload Documents'}
          </h1>
          <p className="mt-2 text-gray-600">
            {language === 'hi'
              ? 'अपने कानूनी दस्तावेज़ अपलोड करें और AI विश्लेषण प्राप्त करें'
              : 'Upload your legal documents and get AI analysis'}
          </p>
        </div>

        {/* Upload Area */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>
                {language === 'hi' ? 'फ़ाइलें अपलोड करें' : 'Upload Files'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileInput}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label={
                  language === 'hi' ? 'फ़ाइल अपलोड करें' : 'Upload files'
                }
              />

              <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {language === 'hi'
                  ? 'फ़ाइलें खींचें और छोड़ें'
                  : 'Drag and drop files'}
              </h3>
              <p className="mb-4 text-gray-600">
                {language === 'hi'
                  ? 'या ब्राउज़ करने के लिए क्लिक करें'
                  : 'or click to browse'}
              </p>
              <p className="text-sm text-gray-500">
                {language === 'hi'
                  ? 'PDF, DOC, DOCX, JPG, PNG (अधिकतम 10MB प्रति फ़ाइल)'
                  : 'PDF, DOC, DOCX, JPG, PNG (max 10MB per file)'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {language === 'hi' ? 'अपलोड की गई फ़ाइलें' : 'Uploaded Files'} (
                {uploadedFiles.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-center space-x-4">
                      {getFileIcon(file)}
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {file.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Progress */}
        {uploading && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  {language === 'hi' ? 'अपलोड हो रहा है...' : 'Uploading...'}
                </h3>
                <div className="mb-2 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {uploadProgress}% {language === 'hi' ? 'पूर्ण' : 'complete'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Button */}
        {uploadedFiles.length > 0 && !uploading && (
          <div className="flex justify-center">
            <Button
              onClick={handleUpload}
              size="lg"
              className="bg-indigo-600 px-8 hover:bg-indigo-700"
            >
              <Upload className="mr-2 h-5 w-5" />
              {language === 'hi' ? 'अपलोड करें' : 'Upload Files'}
            </Button>
          </div>
        )}

        {/* File Type Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>
              {language === 'hi'
                ? 'समर्थित फ़ाइल प्रकार'
                : 'Supported File Types'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="text-center">
                <FileText className="mx-auto mb-2 h-8 w-8 text-red-600" />
                <h4 className="font-medium text-gray-900">PDF</h4>
                <p className="text-sm text-gray-600">
                  {language === 'hi'
                    ? 'दस्तावेज़ और रिपोर्ट'
                    : 'Documents and reports'}
                </p>
              </div>
              <div className="text-center">
                <File className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                <h4 className="font-medium text-gray-900">DOC/DOCX</h4>
                <p className="text-sm text-gray-600">
                  {language === 'hi' ? 'Word दस्तावेज़' : 'Word documents'}
                </p>
              </div>
              <div className="text-center">
                <Image className="mx-auto mb-2 h-8 w-8 text-green-600" />
                <h4 className="font-medium text-gray-900">JPG/PNG</h4>
                <p className="text-sm text-gray-600">
                  {language === 'hi' ? 'छवि फ़ाइलें' : 'Image files'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
