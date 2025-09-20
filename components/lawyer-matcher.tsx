'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  MapPin,
  Star,
  Award,
  Filter,
  X,
  CheckCircle,
  Users,
  Gavel,
  Scale,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface LawyerMatch {
  id: string
  name: string
  specializations: string[]
  location: string
  city: string
  state: string
  experience: number
  rating: number
  totalReviews: number
  hourlyRate: number
  consultationFee: number
  availability: string
  responseTime: string
  successRate: number
  totalCases: number
  verified: boolean
  matchScore: number
  matchReasons: string[]
  profileImage?: string
}

interface CaseDetails {
  caseType: string
  location: string
  urgency: 'low' | 'medium' | 'high'
  budget: number
  preferredLanguage: string
  courtLevel: 'district' | 'high' | 'supreme'
  complexity: 'simple' | 'moderate' | 'complex'
}

interface LawyerMatcherProps {
  language?: 'en' | 'hi'
  onLawyerSelect?: (lawyer: LawyerMatch) => void
  initialCaseDetails?: CaseDetails
}

export default function LawyerMatcher({
  language = 'en',
  onLawyerSelect,
  initialCaseDetails,
}: LawyerMatcherProps) {
  const [caseDetails, setCaseDetails] = useState<CaseDetails>({
    caseType: '',
    location: '',
    urgency: 'medium',
    budget: 0,
    preferredLanguage: 'Hindi',
    courtLevel: 'district',
    complexity: 'moderate',
    ...initialCaseDetails,
  })
  const [matches, setMatches] = useState<LawyerMatch[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    minRating: 0,
    maxRate: 10000,
    experience: 0,
    verified: false,
  })

  const caseTypes = [
    {
      id: 'criminal',
      name: language === 'hi' ? 'आपराधिक कानून' : 'Criminal Law',
    },
    {
      id: 'family',
      name: language === 'hi' ? 'पारिवारिक कानून' : 'Family Law',
    },
    {
      id: 'property',
      name: language === 'hi' ? 'संपत्ति कानून' : 'Property Law',
    },
    { id: 'civil', name: language === 'hi' ? 'दीवानी कानून' : 'Civil Law' },
    {
      id: 'consumer',
      name: language === 'hi' ? 'उपभोक्ता कानून' : 'Consumer Law',
    },
    { id: 'labor', name: language === 'hi' ? 'श्रम कानून' : 'Labor Law' },
    { id: 'tax', name: language === 'hi' ? 'कर कानून' : 'Tax Law' },
    {
      id: 'corporate',
      name: language === 'hi' ? 'कॉर्पोरेट कानून' : 'Corporate Law',
    },
  ]

  const locations = [
    'Delhi',
    'Mumbai',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Hyderabad',
    'Pune',
    'Ahmedabad',
  ]

  const courtLevels = [
    {
      id: 'district',
      name: language === 'hi' ? 'जिला अदालत' : 'District Court',
    },
    { id: 'high', name: language === 'hi' ? 'उच्च न्यायालय' : 'High Court' },
    {
      id: 'supreme',
      name: language === 'hi' ? 'सुप्रीम कोर्ट' : 'Supreme Court',
    },
  ]

  const complexityLevels = [
    { id: 'simple', name: language === 'hi' ? 'सरल' : 'Simple' },
    { id: 'moderate', name: language === 'hi' ? 'मध्यम' : 'Moderate' },
    { id: 'complex', name: language === 'hi' ? 'जटिल' : 'Complex' },
  ]

  const urgencyLevels = [
    { id: 'low', name: language === 'hi' ? 'कम' : 'Low' },
    { id: 'medium', name: language === 'hi' ? 'मध्यम' : 'Medium' },
    { id: 'high', name: language === 'hi' ? 'उच्च' : 'High' },
  ]

  const findMatches = async () => {
    if (!caseDetails.caseType || !caseDetails.location) return

    setLoading(true)
    try {
      // Mock data - replace with real API call
      const mockMatches: LawyerMatch[] = [
        {
          id: '1',
          name: 'Dr. Rajesh Kumar Sharma',
          specializations: [
            language === 'hi' ? 'आपराधिक कानून' : 'Criminal Law',
          ],
          location: 'Sector 15, Noida',
          city: 'Noida',
          state: 'Uttar Pradesh',
          experience: 15,
          rating: 4.8,
          totalReviews: 127,
          hourlyRate: 2500,
          consultationFee: 1000,
          availability:
            language === 'hi' ? 'सोम-शनि 9AM-5PM' : 'Mon-Sat 9AM-5PM',
          responseTime: '2 hours',
          successRate: 92,
          totalCases: 500,
          verified: true,
          matchScore: 95,
          matchReasons: [
            language === 'hi'
              ? 'आपराधिक कानून में विशेषज्ञता'
              : 'Expertise in Criminal Law',
            language === 'hi' ? '15 वर्ष का अनुभव' : '15 years experience',
            language === 'hi' ? '92% सफलता दर' : '92% success rate',
          ],
        },
        {
          id: '2',
          name: 'Adv. Priya Singh',
          specializations: [
            language === 'hi' ? 'पारिवारिक कानून' : 'Family Law',
          ],
          location: 'Connaught Place, Delhi',
          city: 'Delhi',
          state: 'Delhi',
          experience: 12,
          rating: 4.6,
          totalReviews: 89,
          hourlyRate: 2000,
          consultationFee: 800,
          availability:
            language === 'hi' ? 'सोम-शुक्र 10AM-6PM' : 'Mon-Fri 10AM-6PM',
          responseTime: '1 hour',
          successRate: 88,
          totalCases: 350,
          verified: true,
          matchScore: 88,
          matchReasons: [
            language === 'hi'
              ? 'पारिवारिक कानून में विशेषज्ञता'
              : 'Expertise in Family Law',
            language === 'hi' ? '12 वर्ष का अनुभव' : '12 years experience',
            language === 'hi' ? 'तुरंत प्रतिक्रिया' : 'Quick response time',
          ],
        },
      ]

      // Apply filters
      const filteredMatches = mockMatches.filter((lawyer) => {
        if (filters.minRating > 0 && lawyer.rating < filters.minRating)
          return false
        if (lawyer.hourlyRate > filters.maxRate) return false
        if (lawyer.experience < filters.experience) return false
        if (filters.verified && !lawyer.verified) return false
        return true
      })

      // Sort by match score
      filteredMatches.sort((a, b) => b.matchScore - a.matchScore)

      setMatches(filteredMatches)
    } catch (error) {
      console.error('Error finding matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 75) return 'text-yellow-600 bg-yellow-100'
    return 'text-orange-600 bg-orange-100'
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  useEffect(() => {
    if (caseDetails.caseType && caseDetails.location) findMatches()
  }, [caseDetails, filters])

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {language === 'hi' ? 'सही वकील खोजें' : 'Find the Right Lawyer'}
        </h2>
        <p className="text-lg text-gray-600">
          {language === 'hi'
            ? 'अपने मामले के लिए सबसे उपयुक्त वकील खोजें'
            : 'Find the most suitable lawyer for your case'}
        </p>
      </div>

      {/* Case Details Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gavel className="h-5 w-5" />
            <span>
              {language === 'hi' ? 'मामले की जानकारी' : 'Case Details'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Case Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {language === 'hi' ? 'मामले का प्रकार' : 'Case Type'}
              </label>
              <select
                id="caseType"
                aria-label={language === 'hi' ? 'मामले का प्रकार' : 'Case Type'}
                value={caseDetails.caseType}
                onChange={(e) =>
                  setCaseDetails((prev) => ({
                    ...prev,
                    caseType: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">
                  {language === 'hi' ? 'चुनें...' : 'Select...'}
                </option>
                {caseTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {language === 'hi' ? 'स्थान' : 'Location'}
              </label>
              <select
                id="location"
                aria-label={language === 'hi' ? 'स्थान' : 'Location'}
                value={caseDetails.location}
                onChange={(e) =>
                  setCaseDetails((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">
                  {language === 'hi' ? 'चुनें...' : 'Select...'}
                </option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Court Level */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {language === 'hi' ? 'अदालत स्तर' : 'Court Level'}
              </label>
              <select
                id="courtLevel"
                aria-label={language === 'hi' ? 'अदालत स्तर' : 'Court Level'}
                value={caseDetails.courtLevel}
                onChange={(e) =>
                  setCaseDetails((prev) => ({
                    ...prev,
                    courtLevel: e.target.value as CaseDetails['courtLevel'],
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              >
                {courtLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Complexity */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {language === 'hi' ? 'जटिलता' : 'Complexity'}
              </label>
              <select
                id="complexity"
                aria-label={language === 'hi' ? 'जटिलता' : 'Complexity'}
                value={caseDetails.complexity}
                onChange={(e) =>
                  setCaseDetails((prev) => ({
                    ...prev,
                    complexity: e.target.value as CaseDetails['complexity'],
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              >
                {complexityLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Urgency */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {language === 'hi' ? 'तात्कालिकता' : 'Urgency'}
              </label>
              <select
                id="urgency"
                aria-label={language === 'hi' ? 'तात्कालिकता' : 'Urgency'}
                value={caseDetails.urgency}
                onChange={(e) =>
                  setCaseDetails((prev) => ({
                    ...prev,
                    urgency: e.target.value as CaseDetails['urgency'],
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              >
                {urgencyLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {language === 'hi' ? 'बजट (₹)' : 'Budget (₹)'}
              </label>
              <input
                type="number"
                value={caseDetails.budget}
                onChange={(e) =>
                  setCaseDetails((prev) => ({
                    ...prev,
                    budget: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder={language === 'hi' ? 'अधिकतम शुल्क' : 'Maximum fee'}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>{language === 'hi' ? 'फिल्टर' : 'Filters'}</span>
            </Button>

            <Button
              onClick={findMatches}
              disabled={
                !caseDetails.caseType || !caseDetails.location || loading
              }
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              {language === 'hi' ? 'वकील खोजें' : 'Find Lawyers'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{language === 'hi' ? 'फिल्टर' : 'Filters'}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {language === 'hi' ? 'न्यूनतम रेटिंग' : 'Minimum Rating'}
                </label>
                <input
                  id="minRating"
                  aria-label={
                    language === 'hi' ? 'न्यूनतम रेटिंग' : 'Minimum Rating'
                  }
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={filters.minRating}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minRating: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {language === 'hi' ? 'अधिकतम दर (₹)' : 'Maximum Rate (₹)'}
                </label>
                <input
                  id="maxRate"
                  aria-label={
                    language === 'hi' ? 'अधिकतम दर (₹)' : 'Maximum Rate (₹)'
                  }
                  type="number"
                  value={filters.maxRate}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxRate: parseInt(e.target.value) || 10000,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {language === 'hi'
                    ? 'न्यूनतम अनुभव (वर्ष)'
                    : 'Minimum Experience (Years)'}
                </label>
                <input
                  id="experience"
                  aria-label={
                    language === 'hi'
                      ? 'न्यूनतम अनुभव (वर्ष)'
                      : 'Minimum Experience (Years)'
                  }
                  type="number"
                  min="0"
                  value={filters.experience}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      experience: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="verified"
                  checked={filters.verified}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      verified: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="verified"
                  className="ml-2 text-sm text-gray-700"
                >
                  {language === 'hi'
                    ? 'केवल सत्यापित वकील'
                    : 'Verified Lawyers Only'}
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {matches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'hi' ? 'मिले वकील' : 'Found Lawyers'}
            </h3>
            <span className="text-sm text-gray-500">
              {matches.length} {language === 'hi' ? 'परिणाम' : 'results'}
            </span>
          </div>

          <div className="space-y-4">
            {matches.map((lawyer) => (
              <Card
                key={lawyer.id}
                className="transition-shadow hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                        <Users className="h-8 w-8 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 flex items-center space-x-2">
                          <h4 className="text-xl font-semibold text-gray-900">
                            {lawyer.name}
                          </h4>
                          {lawyer.verified && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${getMatchScoreColor(lawyer.matchScore)}`}
                          >
                            {lawyer.matchScore}%{' '}
                            {language === 'hi' ? 'मैच' : 'Match'}
                          </span>
                        </div>

                        <div className="mb-3 flex items-center space-x-4">
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
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Award className="h-4 w-4" />
                            <span>
                              {lawyer.experience}{' '}
                              {language === 'hi' ? 'वर्ष' : 'years'}
                            </span>
                          </div>
                        </div>

                        <div className="mb-3 flex items-center space-x-6">
                          <div className="text-sm">
                            <span className="text-gray-500">
                              {language === 'hi'
                                ? 'परामर्श शुल्क:'
                                : 'Consultation Fee:'}
                            </span>
                            <span className="ml-1 font-semibold">
                              ₹{lawyer.consultationFee}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">
                              {language === 'hi' ? 'प्रति घंटा:' : 'Per Hour:'}
                            </span>
                            <span className="ml-1 font-semibold">
                              ₹{lawyer.hourlyRate}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">
                              {language === 'hi'
                                ? 'सफलता दर:'
                                : 'Success Rate:'}
                            </span>
                            <span className="ml-1 font-semibold">
                              {lawyer.successRate}%
                            </span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {lawyer.specializations.map((spec, index) => (
                              <span
                                key={index}
                                className="rounded bg-indigo-100 px-2 py-1 text-xs text-indigo-800"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h5 className="mb-2 text-sm font-medium text-gray-700">
                            {language === 'hi'
                              ? 'मैच के कारण:'
                              : 'Why this match:'}
                          </h5>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {lawyer.matchReasons.map((reason, index) => (
                              <li
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={() => onLawyerSelect?.(lawyer)}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        {language === 'hi' ? 'देखें' : 'View Profile'}
                      </Button>
                      <Button variant="outline" size="sm">
                        {language === 'hi' ? 'संदेश' : 'Message'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {caseDetails.caseType &&
        caseDetails.location &&
        matches.length === 0 &&
        !loading && (
          <Card>
            <CardContent className="py-8 text-center">
              <Scale className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600">
                {language === 'hi' ? 'कोई वकील नहीं मिला' : 'No lawyers found'}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {language === 'hi'
                  ? 'कृपया अपने फिल्टर बदलकर पुनः प्रयास करें'
                  : 'Please try adjusting your filters'}
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  )
}
