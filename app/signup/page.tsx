'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Scale,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/language-context'

export default function SignupPage() {
  const router = useRouter()
  const { register, isLoading, isAuthenticated } = useAuth()
  const { language, setLanguage } = useLanguage()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [localLang, setLocalLang] = useState<'en' | 'hi'>('en')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    district: '',
    state: '',
    role: 'user' as 'user' | 'lawyer',
    // Lawyer specific fields
    barCouncilNumber: '',
    practiceAreas: [] as string[],
    districts: [] as string[],
    languages: ['en'] as string[],
    bio: '',
    consultationFee: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    setLocalLang(language === 'hi' ? 'hi' : 'en')
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language
    }
  }, [language])

  const practiceAreaOptions = [
    'Criminal Law',
    'Civil Law',
    'Family Law',
    'Corporate Law',
    'Tax Law',
    'Property Law',
    'Constitutional Law',
    'Labor Law',
    'Intellectual Property',
    'Environmental Law',
    'Banking Law',
    'Immigration Law',
    'Personal Injury',
    'Real Estate Law',
    'Consumer Protection',
    'Cyber Law',
    'Medical Malpractice',
    'Estate Planning',
    'Bankruptcy Law',
  ]

  const districtOptions = [
    'Delhi',
    'Mumbai',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Hyderabad',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Surat',
    'Lucknow',
    'Kanpur',
    'Nagpur',
    'Indore',
    'Thane',
    'Bhopal',
    'Visakhapatnam',
    'Pimpri-Chinchwad',
    'Patna',
    'Vadodara',
  ]

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिंदी' },
    { value: 'bn', label: 'বাংলা' },
    { value: 'te', label: 'తెలుగు' },
    { value: 'mr', label: 'मराठी' },
    { value: 'ta', label: 'தமிழ்' },
    { value: 'ur', label: 'اردو' },
    { value: 'gu', label: 'ગુજરાતી' },
    { value: 'kn', label: 'ಕನ್ನಡ' },
    { value: 'ml', label: 'മലയാളം' },
    { value: 'pa', label: 'ਪੰਜਾਬੀ' },
    { value: 'or', label: 'ଓଡ଼ିଆ' },
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    if (formData.password !== formData.confirmPassword) {
      setError(
        language === 'hi' ? 'पासवर्ड मेल नहीं खाते' : 'Passwords do not match'
      )
      setIsSubmitting(false)
      return
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        district: formData.district,
        state: formData.state,
        role: formData.role,
        language: 'en', // Default to English for now
      }

      if (formData.role === 'lawyer') {
        Object.assign(userData, {
          barCouncilNumber: formData.barCouncilNumber,
          practiceAreas: formData.practiceAreas,
          districts: formData.districts,
          languages: formData.languages,
          bio: formData.bio,
        })
      }

      await register(userData)
      setSuccess(
        language === 'hi'
          ? 'खाता सफलतापूर्वक बनाया गया'
          : 'Account created successfully'
      )
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error: any) {
      setError(
        error.message ||
          (language === 'hi' ? 'रजिस्ट्रेशन में त्रुटि' : 'Registration failed')
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="hindi-text">न्याय सखी</span>
                <span className="ml-2 text-indigo-600">Nyāy Sakhi</span>
              </h1>
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
              >
                {localLang === 'en' ? 'हिंदी' : 'English'}
              </button>
              <Link
                href="/"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 transition-colors hover:text-indigo-600"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{localLang === 'hi' ? 'वापस' : 'Back'}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">
                {localLang === 'hi' ? 'खाता बनाएं' : 'Create Your Account'}
              </CardTitle>
              <p className="mt-2 text-gray-600">
                {localLang === 'hi'
                  ? 'न्याय सखी के साथ अपनी कानूनी यात्रा शुरू करें'
                  : 'Join Nyāy Sakhi and start your legal journey'}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error/Success Messages */}
              {error && (
                <div className="flex items-center space-x-2 rounded-lg border border-red-200 bg-red-100 p-3">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 rounded-lg border border-green-200 bg-green-100 p-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">{success}</span>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {localLang === 'hi' ? 'पूरा नाम' : 'Full Name'} *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange('name', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        placeholder={
                          localLang === 'hi'
                            ? 'अपना पूरा नाम दर्ज करें'
                            : 'Enter your full name'
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {localLang === 'hi' ? 'ईमेल' : 'Email Address'} *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange('email', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        placeholder={
                          localLang === 'hi'
                            ? 'अपना ईमेल दर्ज करें'
                            : 'Enter your email address'
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {localLang === 'hi' ? 'फोन नंबर' : 'Phone Number'}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange('phone', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        placeholder={
                          localLang === 'hi'
                            ? 'अपना फोन नंबर दर्ज करें'
                            : 'Enter your phone number'
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {localLang === 'hi' ? 'भूमिका' : 'Account Type'} *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        handleInputChange('role', e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                      title={
                        localLang === 'hi'
                          ? 'खाते का प्रकार चुनें'
                          : 'Select account type'
                      }
                      aria-label={
                        localLang === 'hi' ? 'भूमिका' : 'Account Type'
                      }
                    >
                      <option value="user">
                        {localLang === 'hi' ? 'उपयोगकर्ता' : 'User'}
                      </option>
                      <option value="lawyer">
                        {localLang === 'hi' ? 'वकील' : 'Lawyer'}
                      </option>
                    </select>
                  </div>
                </div>

                {/* Location Information */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {localLang === 'hi' ? 'जिला' : 'District'}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      <select
                        value={formData.district}
                        onChange={(e) =>
                          handleInputChange('district', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        title={
                          localLang === 'hi' ? 'जिला चुनें' : 'Select district'
                        }
                        aria-label={localLang === 'hi' ? 'जिला' : 'District'}
                      >
                        <option value="">
                          {localLang === 'hi'
                            ? 'जिला चुनें'
                            : 'Select District'}
                        </option>
                        {districtOptions.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {localLang === 'hi' ? 'राज्य' : 'State'}
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) =>
                        handleInputChange('state', e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                      placeholder={
                        localLang === 'hi'
                          ? 'अपना राज्य दर्ज करें'
                          : 'Enter your state'
                      }
                    />
                  </div>
                </div>

                {/* Lawyer Specific Fields */}
                {formData.role === 'lawyer' && (
                  <div className="space-y-4 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-indigo-600" />
                      <h3 className="text-lg font-semibold text-indigo-900">
                        {localLang === 'hi'
                          ? 'वकील जानकारी'
                          : 'Lawyer Information'}
                      </h3>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        {localLang === 'hi'
                          ? 'बार काउंसिल नंबर'
                          : 'Bar Council Number'}{' '}
                        *
                      </label>
                      <input
                        type="text"
                        value={formData.barCouncilNumber}
                        onChange={(e) =>
                          handleInputChange('barCouncilNumber', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        placeholder={
                          localLang === 'hi'
                            ? 'बार काउंसिल नंबर दर्ज करें'
                            : 'Enter bar council number'
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        {localLang === 'hi'
                          ? 'अभ्यास क्षेत्र'
                          : 'Practice Areas'}{' '}
                        *
                      </label>
                      <select
                        multiple
                        value={formData.practiceAreas}
                        onChange={(e) => {
                          const selected = Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          )
                          handleInputChange('practiceAreas', selected)
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        size={3}
                        required
                        title={
                          localLang === 'hi'
                            ? 'अभ्यास क्षेत्र चुनें'
                            : 'Select practice areas'
                        }
                        aria-label={
                          localLang === 'hi'
                            ? 'अभ्यास क्षेत्र'
                            : 'Practice Areas'
                        }
                      >
                        {practiceAreaOptions.map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        {localLang === 'hi'
                          ? 'Ctrl+क्लिक करके कई विकल्प चुनें'
                          : 'Hold Ctrl to select multiple options'}
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        {localLang === 'hi' ? 'भाषाएं' : 'Languages'} *
                      </label>
                      <select
                        multiple
                        value={formData.languages}
                        onChange={(e) => {
                          const selected = Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          )
                          handleInputChange('languages', selected)
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        size={3}
                        required
                        title={
                          localLang === 'hi'
                            ? 'भाषाएं चुनें'
                            : 'Select languages'
                        }
                        aria-label={localLang === 'hi' ? 'भाषाएं' : 'Languages'}
                      >
                        {languageOptions.map((lang) => (
                          <option key={lang.value} value={lang.value}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        {localLang === 'hi' ? 'जीवनी' : 'Professional Bio'}
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) =>
                          handleInputChange('bio', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        placeholder={
                          localLang === 'hi'
                            ? 'अपनी पेशेवर जीवनी दर्ज करें'
                            : 'Enter your professional bio'
                        }
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Password Fields */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {localLang === 'hi' ? 'पासवर्ड' : 'Password'} *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange('password', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        placeholder={
                          localLang === 'hi'
                            ? 'अपना पासवर्ड दर्ज करें'
                            : 'Enter your password'
                        }
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {localLang === 'hi'
                        ? 'पासवर्ड की पुष्टि करें'
                        : 'Confirm Password'}{' '}
                      *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange('confirmPassword', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        placeholder={
                          localLang === 'hi'
                            ? 'पासवर्ड की पुष्टि करें'
                            : 'Confirm your password'
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    {localLang === 'hi' ? (
                      <>
                        मैं{' '}
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-500"
                        >
                          उपयोग की शर्तें
                        </a>{' '}
                        और{' '}
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-500"
                        >
                          गोपनीयता नीति
                        </a>{' '}
                        से सहमत हूं
                      </>
                    ) : (
                      <>
                        I agree to the{' '}
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-500"
                        >
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-500"
                        >
                          Privacy Policy
                        </a>
                      </>
                    )}
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="w-full bg-indigo-600 py-3 text-base font-semibold hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading || isSubmitting ? (
                    <>
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      {localLang === 'hi'
                        ? 'खाता बन रहा है...'
                        : 'Creating account...'}
                    </>
                  ) : localLang === 'hi' ? (
                    'खाता बनाएं'
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    {localLang === 'hi' ? 'या' : 'Or'}
                  </span>
                </div>
              </div>

              {/* Social Sign Up Buttons */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-3"
                  disabled
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {localLang === 'hi'
                    ? 'Google के साथ साइन अप करें'
                    : 'Sign up with Google'}
                </Button>
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {localLang === 'hi'
                    ? 'पहले से खाता है?'
                    : 'Already have an account?'}{' '}
                  <Link
                    href="/login"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {localLang === 'hi' ? 'लॉगिन करें' : 'Sign in'}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
