/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import {
  Calendar,
  Phone,
  Video,
  MapPin,
  CheckCircle,
  X,
  ChevronLeft,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { apiClient } from '@/lib/api'

interface TimeSlot {
  id: string
  start: string
  end: string
  available: boolean
  type: 'in_person' | 'video_call' | 'phone_call'
  price: number
}

interface AppointmentDetails {
  lawyerId: string
  lawyerName: string
  date: string
  timeSlot: TimeSlot
  type: 'in_person' | 'video_call' | 'phone_call'
  duration: number
  price: number
  clientName: string
  clientEmail: string
  clientPhone: string
  caseDescription: string
  urgency: 'low' | 'medium' | 'high'
  preferredLanguage: string
}

interface AppointmentBookingProps {
  lawyerId: string
  lawyerName: string
  language?: 'en' | 'hi'
  onBookingComplete?: (appointment: AppointmentDetails) => void
  onClose?: () => void
}

export default function AppointmentBooking({
  lawyerId,
  lawyerName,
  language = 'en',
  onBookingComplete = () => {},
  onClose = () => {},
}: AppointmentBookingProps) {
  const [currentStep, setCurrentStep] = useState<
    'date' | 'time' | 'details' | 'confirmation'
  >('date')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  )
  const [appointmentDetails, setAppointmentDetails] =
    useState<AppointmentDetails>({
      lawyerId,
      lawyerName,
      date: '',
      timeSlot: {} as TimeSlot,
      type: 'video_call',
      duration: 60,
      price: 0,
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      caseDescription: '',
      urgency: 'medium',
      preferredLanguage: language === 'hi' ? 'Hindi' : 'English',
    })
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)

  const appointmentTypes = [
    {
      id: 'video_call',
      name: language === 'hi' ? 'वीडियो कॉल' : 'Video Call',
      icon: Video,
      description:
        language === 'hi' ? 'ऑनलाइन वीडियो कॉल' : 'Online video consultation',
    },
    {
      id: 'phone_call',
      name: language === 'hi' ? 'फोन कॉल' : 'Phone Call',
      icon: Phone,
      description:
        language === 'hi' ? 'टेलीफोन पर बातचीत' : 'Telephone consultation',
    },
    {
      id: 'in_person',
      name: language === 'hi' ? 'व्यक्तिगत मिलना' : 'In-Person',
      icon: MapPin,
      description: language === 'hi' ? 'कार्यालय में मिलना' : 'Office visit',
    },
  ]

  const urgencyLevels = [
    {
      id: 'low',
      name: language === 'hi' ? 'कम' : 'Low',
      color: 'text-green-600',
    },
    {
      id: 'medium',
      name: language === 'hi' ? 'मध्यम' : 'Medium',
      color: 'text-yellow-600',
    },
    {
      id: 'high',
      name: language === 'hi' ? 'उच्च' : 'High',
      color: 'text-red-600',
    },
  ]

  const languages = [
    { id: 'Hindi', name: 'हिंदी' },
    { id: 'English', name: 'English' },
    { id: 'Punjabi', name: 'ਪੰਜਾਬੀ' },
    { id: 'Bengali', name: 'বাংলা' },
    { id: 'Tamil', name: 'தமிழ்' },
  ]

  const getAvailableSlots = async (date: string) => {
    try {
      setLoading(true)
      // Mock available slots - in real app, this would be an API call
      const mockSlots: TimeSlot[] = [
        {
          id: '1',
          start: '09:00',
          end: '10:00',
          available: true,
          type: 'video_call',
          price: 1000,
        },
        {
          id: '2',
          start: '10:00',
          end: '11:00',
          available: true,
          type: 'video_call',
          price: 1000,
        },
        {
          id: '3',
          start: '11:00',
          end: '12:00',
          available: false,
          type: 'video_call',
          price: 1000,
        },
        {
          id: '4',
          start: '14:00',
          end: '15:00',
          available: true,
          type: 'video_call',
          price: 1000,
        },
        {
          id: '5',
          start: '15:00',
          end: '16:00',
          available: true,
          type: 'video_call',
          price: 1000,
        },
        {
          id: '6',
          start: '16:00',
          end: '17:00',
          available: true,
          type: 'video_call',
          price: 1000,
        },
      ]
      setAvailableSlots(mockSlots)
    } catch (error) {
      console.error('Error loading available slots:', error)
    } finally {
      setLoading(false)
    }
  }

  // renamed param to avoid linter/TS shadow warnings
  const handleDateSelect = (selectedDateParam: string) => {
    setSelectedDate(selectedDateParam)
    setAppointmentDetails((prev) => ({ ...prev, date: selectedDateParam }))
    getAvailableSlots(selectedDateParam)
    setCurrentStep('time')
  }

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot)
    setAppointmentDetails((prev) => ({
      ...prev,
      timeSlot: slot,
      type: slot.type,
      price: slot.price,
    }))
    setCurrentStep('details')
  }

  const handleDetailsSubmit = () => {
    setCurrentStep('confirmation')
  }

  const handleBookingConfirm = async () => {
    try {
      setLoading(true)
      // Mock booking API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      onBookingComplete(appointmentDetails)
    } catch (error) {
      console.error('Error booking appointment:', error)
    } finally {
      setLoading(false)
    }
  }

  // changed inner date var name to 'd' to avoid shadowing warnings
  const getDateOptions = () => {
    const options: { value: string; label: string }[] = []
    const today = new Date()

    for (let i = 1; i <= 14; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      options.push({
        value: d.toISOString().split('T')[0],
        label: d.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      })
    }
    return options
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getUrgencyColor = (urgency: string) => {
    const level = urgencyLevels.find((l) => l.id === urgency)
    return level?.color || 'text-gray-600'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
        {/* Header */}
        <div className="sticky top-0 rounded-t-lg border-b bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {language === 'hi' ? 'अपॉइंटमेंट बुक करें' : 'Book Appointment'}
              </h2>
              <p className="text-gray-600">{lawyerName}</p>
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

        {/* Progress Steps */}
        <div className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            {[
              { id: 'date', label: language === 'hi' ? 'तारीख' : 'Date' },
              { id: 'time', label: language === 'hi' ? 'समय' : 'Time' },
              { id: 'details', label: language === 'hi' ? 'विवरण' : 'Details' },
              {
                id: 'confirmation',
                label: language === 'hi' ? 'पुष्टि' : 'Confirm',
              },
            ].map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    currentStep === step.id
                      ? 'bg-indigo-600 text-white'
                      : index <
                          ['date', 'time', 'details', 'confirmation'].indexOf(
                            currentStep
                          )
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index <
                  ['date', 'time', 'details', 'confirmation'].indexOf(
                    currentStep
                  ) ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`ml-2 text-sm ${
                    currentStep === step.id
                      ? 'font-medium text-indigo-600'
                      : 'text-gray-600'
                  }`}
                >
                  {step.label}
                </span>
                {index < 3 && <div className="mx-4 h-0.5 w-8 bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 'date' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">
                {language === 'hi' ? 'तारीख चुनें' : 'Select Date'}
              </h3>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {getDateOptions().map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      selectedDate === option.value ? 'default' : 'outline'
                    }
                    onClick={() => handleDateSelect(option.value)}
                    className="h-auto justify-start p-4"
                    type="button"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'time' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {language === 'hi' ? 'समय चुनें' : 'Select Time'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep('date')}
                  className="flex items-center space-x-1"
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
                </Button>
              </div>

              {loading ? (
                <div className="py-8 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-b-2 border-indigo-600"></div>
                  <p className="mt-2 text-gray-600">
                    {language === 'hi'
                      ? 'समय स्लॉट लोड हो रहे हैं...'
                      : 'Loading time slots...'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={slot.available ? 'outline' : 'ghost'}
                      disabled={!slot.available}
                      onClick={() =>
                        slot.available && handleTimeSlotSelect(slot)
                      }
                      className={`h-auto p-4 ${
                        slot.available
                          ? 'hover:border-indigo-300 hover:bg-indigo-50'
                          : 'cursor-not-allowed opacity-50'
                      }`}
                      type="button"
                    >
                      <div className="text-center">
                        <div className="font-medium">
                          {formatTime(slot.start)} - {formatTime(slot.end)}
                        </div>
                        <div className="text-sm text-gray-600">
                          ₹{slot.price}
                        </div>
                        {!slot.available && (
                          <div className="mt-1 text-xs text-red-600">
                            {language === 'hi'
                              ? 'उपलब्ध नहीं'
                              : 'Not Available'}
                          </div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 'details' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {language === 'hi'
                    ? 'अपॉइंटमेंट विवरण'
                    : 'Appointment Details'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep('time')}
                  className="flex items-center space-x-1"
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
                </Button>
              </div>

              <div className="space-y-4">
                {/* Appointment Type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {language === 'hi'
                      ? 'अपॉइंटमेंट प्रकार'
                      : 'Appointment Type'}
                  </label>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {appointmentTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <Button
                          key={type.id}
                          variant={
                            appointmentDetails.type ===
                            (type.id as AppointmentDetails['type'])
                              ? 'default'
                              : 'outline'
                          }
                          onClick={() =>
                            setAppointmentDetails((prev) => ({
                              ...prev,
                              type: type.id as AppointmentDetails['type'],
                            }))
                          }
                          className="flex h-auto flex-col items-center space-y-2 p-4"
                          type="button"
                        >
                          <Icon className="h-6 w-6" />
                          <div className="text-center">
                            <div className="font-medium">{type.name}</div>
                            <div className="text-xs text-gray-600">
                              {type.description}
                            </div>
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </div>

                {/* Client Information */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {language === 'hi' ? 'नाम' : 'Name'} *
                    </label>
                    <input
                      type="text"
                      value={appointmentDetails.clientName}
                      onChange={(e) =>
                        setAppointmentDetails((prev) => ({
                          ...prev,
                          clientName: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                      placeholder={
                        language === 'hi'
                          ? 'अपना नाम दर्ज करें'
                          : 'Enter your name'
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {language === 'hi' ? 'ईमेल' : 'Email'} *
                    </label>
                    <input
                      type="email"
                      value={appointmentDetails.clientEmail}
                      onChange={(e) =>
                        setAppointmentDetails((prev) => ({
                          ...prev,
                          clientEmail: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                      placeholder={
                        language === 'hi'
                          ? 'अपना ईमेल दर्ज करें'
                          : 'Enter your email'
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {language === 'hi' ? 'फोन नंबर' : 'Phone Number'} *
                  </label>
                  <input
                    type="tel"
                    value={appointmentDetails.clientPhone}
                    onChange={(e) =>
                      setAppointmentDetails((prev) => ({
                        ...prev,
                        clientPhone: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                    placeholder={
                      language === 'hi'
                        ? 'अपना फोन नंबर दर्ज करें'
                        : 'Enter your phone number'
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {language === 'hi' ? 'मामले का विवरण' : 'Case Description'}
                  </label>
                  <textarea
                    value={appointmentDetails.caseDescription}
                    onChange={(e) =>
                      setAppointmentDetails((prev) => ({
                        ...prev,
                        caseDescription: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                    placeholder={
                      language === 'hi'
                        ? 'अपने मामले के बारे में संक्षिप्त विवरण दें'
                        : 'Brief description of your case'
                    }
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {language === 'hi' ? 'तात्कालिकता' : 'Urgency'}
                    </label>
                    <select
                      value={appointmentDetails.urgency}
                      onChange={(e) =>
                        setAppointmentDetails((prev) => ({
                          ...prev,
                          urgency: e.target
                            .value as AppointmentDetails['urgency'],
                        }))
                      }
                      // accessible name
                      aria-label={language === 'hi' ? 'तात्कालिकता' : 'Urgency'}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                    >
                      {urgencyLevels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {language === 'hi'
                        ? 'पसंदीदा भाषा'
                        : 'Preferred Language'}
                    </label>
                    <select
                      value={appointmentDetails.preferredLanguage}
                      onChange={(e) =>
                        setAppointmentDetails((prev) => ({
                          ...prev,
                          preferredLanguage: e.target.value,
                        }))
                      }
                      // accessible name
                      aria-label={
                        language === 'hi'
                          ? 'पसंदीदा भाषा'
                          : 'Preferred Language'
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                    >
                      {languages.map((lang) => (
                        <option key={lang.id} value={lang.id}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleDetailsSubmit}
                disabled={
                  !appointmentDetails.clientName ||
                  !appointmentDetails.clientEmail ||
                  !appointmentDetails.clientPhone
                }
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                type="button"
              >
                {language === 'hi' ? 'आगे बढ़ें' : 'Continue'}
              </Button>
            </div>
          )}

          {currentStep === 'confirmation' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {language === 'hi'
                    ? 'अपॉइंटमेंट पुष्टि'
                    : 'Appointment Confirmation'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep('details')}
                  className="flex items-center space-x-1"
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
                </Button>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        {language === 'hi' ? 'वकील:' : 'Lawyer:'}
                      </span>
                      <span className="font-medium">
                        {appointmentDetails.lawyerName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        {language === 'hi' ? 'तारीख:' : 'Date:'}
                      </span>
                      <span className="font-medium">
                        {appointmentDetails.date
                          ? new Date(
                              appointmentDetails.date
                            ).toLocaleDateString(
                              language === 'hi' ? 'hi-IN' : 'en-US',
                              {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            )
                          : '-'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        {language === 'hi' ? 'समय:' : 'Time:'}
                      </span>
                      <span className="font-medium">
                        {appointmentDetails.timeSlot?.start
                          ? `${formatTime(appointmentDetails.timeSlot.start)} - ${formatTime(appointmentDetails.timeSlot.end)}`
                          : '-'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        {language === 'hi' ? 'प्रकार:' : 'Type:'}
                      </span>
                      <span className="font-medium">
                        {
                          appointmentTypes.find(
                            (t) => t.id === appointmentDetails.type
                          )?.name
                        }
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        {language === 'hi' ? 'अवधि:' : 'Duration:'}
                      </span>
                      <span className="font-medium">
                        {appointmentDetails.duration}{' '}
                        {language === 'hi' ? 'मिनट' : 'minutes'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        {language === 'hi' ? 'तात्कालिकता:' : 'Urgency:'}
                      </span>
                      <span
                        className={`font-medium ${getUrgencyColor(
                          appointmentDetails.urgency
                        )}`}
                      >
                        {
                          urgencyLevels.find(
                            (u) => u.id === appointmentDetails.urgency
                          )?.name
                        }
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        {language === 'hi' ? 'भाषा:' : 'Language:'}
                      </span>
                      <span className="font-medium">
                        {appointmentDetails.preferredLanguage}
                      </span>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between text-lg font-semibold">
                        <span>
                          {language === 'hi' ? 'कुल शुल्क:' : 'Total Fee:'}
                        </span>
                        <span className="text-indigo-600">
                          ₹{appointmentDetails.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  type="button"
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </Button>
                <Button
                  onClick={handleBookingConfirm}
                  disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  type="button"
                >
                  {loading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  {language === 'hi' ? 'बुक करें' : 'Book Appointment'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
