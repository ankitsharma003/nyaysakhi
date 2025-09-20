'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatFileSize } from '@/lib/utils'
import { UploadProgress } from '@/types'

interface DocumentUploadProps {
  onUpload: (files: File[]) => void
  maxFiles?: number
  maxSize?: number
  acceptedTypes?: string[]
  language?: 'en' | 'hi'
  token?: string
}

export default function DocumentUpload({
  onUpload,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  // acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.tiff'],
  language = 'en',
  token,
}: DocumentUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [queuedCount, setQueuedCount] = useState(0)

  // Check online status
  useEffect(() => {
    const checkStatus = () => {
      setIsOnline(navigator.onLine)
    }

    checkStatus()

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true)
      setQueuedCount(0)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newProgress: UploadProgress[] = acceptedFiles.map((file) => ({
        file,
        progress: 0,
        status: 'uploading',
      }))

      setUploadProgress((prev) => [...prev, ...newProgress])
      setIsProcessing(true)

      if (isOnline) {
        // Online upload - simulate progress
        acceptedFiles.forEach((file, index) => {
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
              const updated = [...prev]
              const fileIndex = prev.length - acceptedFiles.length + index
              if (updated[fileIndex]) {
                updated[fileIndex].progress += Math.random() * 30
                if (updated[fileIndex].progress >= 100) {
                  updated[fileIndex].progress = 100
                  updated[fileIndex].status = 'processing'
                  clearInterval(progressInterval)

                  // Simulate processing completion
                  setTimeout(() => {
                    setUploadProgress((prev) => {
                      const updated = [...prev]
                      updated[fileIndex].status = 'completed'
                      return updated
                    })
                    setIsProcessing(false)
                    onUpload([file])
                  }, 2000)
                }
              }
              return updated
            })
          }, 200)
        })
      } else {
        // Offline mode - show queued status
        setUploadProgress((prev) => {
          const updated = [...prev]
          const startIndex = prev.length - acceptedFiles.length
          for (let i = 0; i < acceptedFiles.length; i++) {
            updated[startIndex + i].progress = 100
            updated[startIndex + i].status = 'queued'
          }
          return updated
        })

        setQueuedCount((prev) => prev + acceptedFiles.length)
        setIsProcessing(false)

        // Still call onUpload for UI consistency
        onUpload(acceptedFiles)
      }
    },
    [onUpload, isOnline, language, token]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/tiff': ['.tiff'],
    },
  })

  const removeFile = (index: number) => {
    setUploadProgress((prev) => prev.filter((_, i) => i !== index))
  }

  const getStatusIcon = (status: UploadProgress['status']) => {
    switch (status) {
      case 'uploading':
        return (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        )
      case 'processing':
        return (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent" />
        )
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'queued':
        return <WifiOff className="h-4 w-4 text-orange-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusText = (status: UploadProgress['status']) => {
    if (language === 'hi') {
      switch (status) {
        case 'uploading':
          return 'अपलोड हो रहा है...'
        case 'processing':
          return 'प्रोसेसिंग...'
        case 'completed':
          return 'पूर्ण'
        case 'queued':
          return 'कतारबद्ध'
        case 'error':
          return 'त्रुटि'
        default:
          return ''
      }
    } else {
      switch (status) {
        case 'uploading':
          return 'Uploading...'
        case 'processing':
          return 'Processing...'
        case 'completed':
          return 'Completed'
        case 'queued':
          return 'Queued'
        case 'error':
          return 'Error'
        default:
          return ''
      }
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={cn(
              'cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors',
              isDragActive
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              {language === 'hi' ? 'दस्तावेज़ अपलोड करें' : 'Upload Documents'}
            </h3>
            <p className="mb-4 text-gray-600">
              {language === 'hi'
                ? 'फ़ाइलों को यहाँ खींचें या क्लिक करके चुनें'
                : 'Drag files here or click to select'}
            </p>
            <p className="text-sm text-gray-500">
              {language === 'hi'
                ? `PDF, JPG, PNG, TIFF (अधिकतम ${formatFileSize(maxSize)})`
                : `PDF, JPG, PNG, TIFF (Max ${formatFileSize(maxSize)})`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Offline Status */}
      {!isOnline && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <WifiOff className="h-5 w-5 text-orange-600" />
              <div>
                <h4 className="font-medium text-orange-800">
                  {language === 'hi' ? 'ऑफ़लाइन मोड' : 'Offline Mode'}
                </h4>
                <p className="text-sm text-orange-700">
                  {language === 'hi'
                    ? `आपके दस्तावेज़ कतारबद्ध हैं (${queuedCount} फ़ाइलें)। ऑनलाइन होने पर अपलोड हो जाएंगे।`
                    : `Your documents are queued (${queuedCount} files). They will upload when you're back online.`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Online Status */}
      {isOnline && queuedCount > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Wifi className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-medium text-green-800">
                  {language === 'hi' ? 'ऑनलाइन मोड' : 'Online Mode'}
                </h4>
                <p className="text-sm text-green-700">
                  {language === 'hi'
                    ? 'कतारबद्ध दस्तावेज़ अपलोड हो रहे हैं...'
                    : 'Queued documents are uploading...'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              {language === 'hi' ? 'अपलोड प्रगति' : 'Upload Progress'}
            </h3>
            <div className="space-y-3">
              {uploadProgress.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(item.file.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(item.status)}
                    <span className="text-sm text-gray-600">
                      {getStatusText(item.status)}
                    </span>
                    {item.status === 'completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <p className="text-lg font-medium text-gray-900">
                {language === 'hi'
                  ? 'दस्तावेज़ प्रोसेस हो रहे हैं...'
                  : 'Processing documents...'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
