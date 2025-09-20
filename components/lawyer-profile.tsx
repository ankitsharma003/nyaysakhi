'use client'

import { useState, useEffect } from 'react'
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Award,
  MessageCircle,
  Users,
  CheckCircle,
  X,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { apiClient } from '@/lib/api'

interface LawyerProfile {
  id: string
  name: string
  email: string
  phone: string
  location: string
  city: string
  state: string
  pincode: string
  specializations: string[]
  experience: number
  languages: string[]
  education: Education[]
  certifications: Certification[]
  barCouncilNumber: string
  barCouncilState: string
  yearOfEnrollment: number
  rating: number
  totalReviews: number
  hourlyRate: number
  consultationFee: number
  availability: Availability
  bio: string
  profileImage?: string
  verified: boolean
  responseTime: string
  successRate: number
  totalCases: number
}

interface Education {
  degree: string
  institution: string
  year: number
  field: string
}

interface Certification {
  name: string
  issuingBody: string
  year: number
  validUntil?: string
}

interface Availability {
  monday: TimeSlot[]
  tuesday: TimeSlot[]
  wednesday: TimeSlot[]
  thursday: TimeSlot[]
  friday: TimeSlot[]
  saturday: TimeSlot[]
  sunday: TimeSlot[]
}

interface TimeSlot {
  start: string
  end: string
  available: boolean
}

interface Review {
  id: string
  clientName: string
  rating: number
  comment: string
  date: string
  caseType: string
  verified: boolean
}

interface LawyerProfileProps {
  lawyerId: string
  language?: 'en' | 'hi'
  onClose?: () => void
  onBookAppointment?: (lawyer: LawyerProfile) => void
}

export default function LawyerProfile({
  lawyerId,
  language = 'en',
  onClose,
  onBookAppointment,
}: LawyerProfileProps) {
  const [lawyer, setLawyer] = useState<LawyerProfile | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<
    'overview' | 'reviews' | 'availability'
  >('overview')
  const [selectedDay, setSelectedDay] = useState<string>('monday')

  useEffect(() => {
    loadLawyerProfile()
    loadReviews()
  }, [lawyerId])

  const loadLawyerProfile = async () => {
    try {
      setLoading(true)
      // Mock data - in real app, this would be an API call
      const mockLawyer: LawyerProfile = {
        id: lawyerId,
        name: 'Dr. Rajesh Kumar Sharma',
        email: 'rajesh.sharma@law.com',
        phone: '+91 98765 43210',
        location: 'Sector 15, Noida',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
        specializations: [
          language === 'hi' ? 'आपराधिक कानून' : 'Criminal Law',
          language === 'hi' ? 'पारिवारिक कानून' : 'Family Law',
          language === 'hi' ? 'संपत्ति कानून' : 'Property Law',
        ],
        experience: 15,
        languages: ['Hindi', 'English', 'Punjabi'],
        education: [
          {
            degree: 'LLB',
            institution: 'Delhi University',
            year: 2005,
            field: 'Law',
          },
          {
            degree: 'LLM',
            institution: 'National Law School of India University',
            year: 2007,
            field: 'Criminal Law',
          },
        ],
        certifications: [
          {
            name: 'Certified Criminal Lawyer',
            issuingBody: 'Bar Council of India',
            year: 2008,
          },
          {
            name: 'Mediation Specialist',
            issuingBody: 'Supreme Court of India',
            year: 2015,
          },
        ],
        barCouncilNumber: 'DL/2008/12345',
        barCouncilState: 'Delhi',
        yearOfEnrollment: 2008,
        rating: 4.8,
        totalReviews: 127,
        hourlyRate: 2500,
        consultationFee: 1000,
        availability: {
          monday: [{ start: '09:00', end: '17:00', available: true }],
          tuesday: [{ start: '09:00', end: '17:00', available: true }],
          wednesday: [{ start: '09:00', end: '17:00', available: true }],
          thursday: [{ start: '09:00', end: '17:00', available: true }],
          friday: [{ start: '09:00', end: '17:00', available: true }],
          saturday: [{ start: '10:00', end: '14:00', available: true }],
          sunday: [],
        },
        bio:
          language === 'hi'
            ? 'डॉ. राजेश कुमार शर्मा 15 वर्षों के अनुभव के साथ एक प्रतिष्ठित वकील हैं। वे आपराधिक कानून, पारिवारिक कानून और संपत्ति कानून में विशेषज्ञता रखते हैं। उन्होंने 500+ मामलों में सफलतापूर्वक प्रतिनिधित्व किया है।'
            : 'Dr. Rajesh Kumar Sharma is a distinguished lawyer with 15 years of experience. He specializes in Criminal Law, Family Law, and Property Law. He has successfully represented clients in 500+ cases.',
        verified: true,
        responseTime: '2 hours',
        successRate: 92,
        totalCases: 500,
      }
      setLawyer(mockLawyer)
    } catch (error) {
      console.error('Error loading lawyer profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadReviews = async () => {
    try {
      // Mock reviews data
      const mockReviews: Review[] = [
        {
          id: '1',
          clientName: 'Amit Kumar',
          rating: 5,
          comment:
            language === 'hi'
              ? 'बहुत अच्छा वकील हैं। मेरे मामले को बहुत अच्छे से हैंडल किया।'
              : 'Excellent lawyer. Handled my case very professionally.',
          date: '2024-01-15',
          caseType: language === 'hi' ? 'आपराधिक मामला' : 'Criminal Case',
          verified: true,
        },
        {
          id: '2',
          clientName: 'Priya Singh',
          rating: 5,
          comment:
            language === 'hi'
              ? 'बहुत अनुभवी और जानकार वकील। सलाह बहुत सही थी।'
              : 'Very experienced and knowledgeable lawyer. Advice was spot on.',
          date: '2024-01-10',
          caseType: language === 'hi' ? 'पारिवारिक मामला' : 'Family Case',
          verified: true,
        },
        {
          id: '3',
          clientName: 'Ravi Verma',
          rating: 4,
          comment:
            language === 'hi'
              ? 'अच्छा वकील हैं, लेकिन response time थोड़ा slow है।'
              : 'Good lawyer, but response time is a bit slow.',
          date: '2024-01-05',
          caseType: language === 'hi' ? 'संपत्ति मामला' : 'Property Case',
          verified: true,
        },
      ]
      setReviews(mockReviews)
    } catch (error) {
      console.error('Error loading reviews:', error)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'fill-current text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const getDayName = (day: string) => {
    const days = {
      monday: language === 'hi' ? 'सोमवार' : 'Monday',
      tuesday: language === 'hi' ? 'मंगलवार' : 'Tuesday',
      wednesday: language === 'hi' ? 'बुधवार' : 'Wednesday',
      thursday: language === 'hi' ? 'गुरुवार' : 'Thursday',
      friday: language === 'hi' ? 'शुक्रवार' : 'Friday',
      saturday: language === 'hi' ? 'शनिवार' : 'Saturday',
      sunday: language === 'hi' ? 'रविवार' : 'Sunday',
    }
    return days[day as keyof typeof days] || day
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="mx-4 w-full max-w-md rounded-lg bg-white p-8">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">
              {language === 'hi'
                ? 'प्रोफाइल लोड हो रहा है...'
                : 'Loading profile...'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!lawyer) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="mx-4 w-full max-w-md rounded-lg bg-white p-8">
          <div className="text-center">
            <X className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <p className="text-gray-600">
              {language === 'hi'
                ? 'वकील का प्रोफाइल नहीं मिला'
                : 'Lawyer profile not found'}
            </p>
            <Button onClick={onClose} className="mt-4">
              {language === 'hi' ? 'बंद करें' : 'Close'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white">
        {/* Header */}
        <div className="sticky top-0 rounded-t-lg border-b bg-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
                <Users className="h-10 w-10 text-indigo-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {lawyer.name}
                  </h2>
                  {lawyer.verified && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <p className="text-gray-600">
                  {lawyer.specializations.join(', ')}
                </p>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(lawyer.rating)}
                    <span className="text-sm text-gray-600">
                      {lawyer.rating} ({lawyer.totalReviews}{' '}
                      {language === 'hi' ? 'समीक्षाएं' : 'reviews'})
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{lawyer.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              {
                id: 'overview',
                label: language === 'hi' ? 'अवलोकन' : 'Overview',
              },
              {
                id: 'reviews',
                label: language === 'hi' ? 'समीक्षाएं' : 'Reviews',
              },
              {
                id: 'availability',
                label: language === 'hi' ? 'उपलब्धता' : 'Availability',
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`border-b-2 px-1 py-4 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Bio */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'hi' ? 'परिचय' : 'About'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{lawyer.bio}</p>
                </CardContent>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-indigo-600">
                      {lawyer.experience}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'hi' ? 'वर्ष अनुभव' : 'Years Experience'}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {lawyer.successRate}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'hi' ? 'सफलता दर' : 'Success Rate'}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {lawyer.totalCases}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'hi' ? 'कुल मामले' : 'Total Cases'}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {lawyer.responseTime}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'hi' ? 'प्रतिक्रिया समय' : 'Response Time'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'hi' ? 'शिक्षा' : 'Education'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lawyer.education.map((edu, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Award className="mt-1 h-5 w-5 text-indigo-600" />
                        <div>
                          <div className="font-medium">
                            {edu.degree} - {edu.field}
                          </div>
                          <div className="text-sm text-gray-600">
                            {edu.institution}
                          </div>
                          <div className="text-sm text-gray-500">
                            {edu.year}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'hi' ? 'प्रमाणपत्र' : 'Certifications'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lawyer.certifications.map((cert, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="mt-1 h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium">{cert.name}</div>
                          <div className="text-sm text-gray-600">
                            {cert.issuingBody}
                          </div>
                          <div className="text-sm text-gray-500">
                            {cert.year}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'hi'
                      ? 'संपर्क जानकारी'
                      : 'Contact Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <span>{lawyer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <span>{lawyer.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <span>
                        {lawyer.location}, {lawyer.city}, {lawyer.state} -{' '}
                        {lawyer.pincode}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center space-x-2">
                          <span className="font-medium">
                            {review.clientName}
                          </span>
                          {review.verified && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="mb-2 flex items-center space-x-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-500">
                            {review.date}
                          </span>
                        </div>
                        <p className="mb-2 text-gray-700">{review.comment}</p>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                          {review.caseType}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'availability' && (
            <div className="space-y-6">
              {/* Day Selector */}
              <div className="flex space-x-2 overflow-x-auto">
                {Object.keys(lawyer.availability).map((day) => (
                  <Button
                    key={day}
                    variant={selectedDay === day ? 'default' : 'outline'}
                    onClick={() => setSelectedDay(day)}
                    size="sm"
                  >
                    {getDayName(day)}
                  </Button>
                ))}
              </div>

              {/* Time Slots */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {getDayName(selectedDay)} -{' '}
                    {language === 'hi' ? 'उपलब्ध समय' : 'Available Times'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {lawyer.availability[selectedDay as keyof Availability]
                    .length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                      {lawyer.availability[
                        selectedDay as keyof Availability
                      ].map((slot, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className={`${
                            slot.available
                              ? 'border-green-500 text-green-700 hover:bg-green-50'
                              : 'cursor-not-allowed border-gray-300 text-gray-500'
                          }`}
                          disabled={!slot.available}
                        >
                          {slot.start} - {slot.end}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="py-4 text-center text-gray-500">
                      {language === 'hi'
                        ? 'इस दिन उपलब्ध नहीं'
                        : 'Not available on this day'}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 rounded-b-lg border-t bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">
                {language === 'hi' ? 'परामर्श शुल्क:' : 'Consultation Fee:'}
              </span>
              <span className="ml-2 text-lg font-bold text-indigo-600">
                ₹{lawyer.consultationFee}
              </span>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>{language === 'hi' ? 'संदेश' : 'Message'}</span>
              </Button>
              <Button
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => onBookAppointment?.(lawyer)}
              >
                <Calendar className="h-4 w-4" />
                <span>
                  {language === 'hi'
                    ? 'अपॉइंटमेंट बुक करें'
                    : 'Book Appointment'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
