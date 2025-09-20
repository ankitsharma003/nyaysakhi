'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Star, Phone, Mail, Filter, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/lib/api'

interface Lawyer {
  id: string
  name: string
  email: string
  phone: string
  practice_areas: string[]
  districts: string[]
  languages: string[]
  experience: number
  rating: number
  verified: boolean
  bio?: string
  profile_image?: string
  created_at: string
}

interface LawyerDirectoryProps {
  language?: 'en' | 'hi'
  onSelectLawyer?: (lawyer: Lawyer) => void
}

export default function LawyerDirectory({
  language = 'en',
  onSelectLawyer,
}: LawyerDirectoryProps) {
  const [lawyers, setLawyers] = useState<Lawyer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedPracticeArea, setSelectedPracticeArea] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  })

  const practiceAreas = [
    'Criminal Law',
    'Civil Law',
    'Family Law',
    'Consumer Rights',
    'Property Law',
    'Corporate Law',
    'Tax Law',
    'Labor Law',
  ]

  const districts = [
    'New Delhi',
    'Mumbai',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Hyderabad',
    'Pune',
    'Ahmedabad',
    'Gurgaon',
    'Noida',
  ]

  // Load lawyers when filters/search/pagination.currentPage changes
  useEffect(() => {
    loadLawyers(pagination.currentPage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedDistrict,
    selectedPracticeArea,
    searchQuery,
    pagination.currentPage,
  ])

  const loadLawyers = async (page: number = 1) => {
    // protect against invalid page numbers
    const pageToLoad = Math.max(1, page)

    try {
      setLoading(true)

      // Defensive: apiClient may not be present in some environments (tests, storybook)
      if (!apiClient || typeof apiClient.getLawyers !== 'function') {
        // fallback: empty result (or you can populate mock data here)
        setLawyers([])
        setPagination((prev) => ({
          ...prev,
          totalItems: 0,
          totalPages: 1,
          currentPage: 1,
        }))
        return
      }

      const response = await apiClient.getLawyers({
        page: pageToLoad,
        limit: pagination.itemsPerPage,
        district: selectedDistrict || undefined,
        practiceArea: selectedPracticeArea || undefined,
        search: searchQuery || undefined,
        verified: true,
        minRating: 0,
      })

      // Defensive checks for response shape
      const success = (response as any)?.success ?? false
      const data = (response as any)?.data

      if (success && data) {
        const nextLawyers = Array.isArray(data.lawyers) ? data.lawyers : []
        const nextPagination = data.pagination
          ? {
              currentPage: data.pagination.currentPage ?? pageToLoad,
              totalPages: data.pagination.totalPages ?? 1,
              totalItems: data.pagination.totalItems ?? nextLawyers.length,
              itemsPerPage:
                data.pagination.itemsPerPage ?? pagination.itemsPerPage,
            }
          : {
              currentPage: pageToLoad,
              totalPages: 1,
              totalItems: nextLawyers.length,
              itemsPerPage: pagination.itemsPerPage,
            }

        setLawyers(nextLawyers)
        setPagination((prev) => ({ ...prev, ...nextPagination }))
      } else {
        // Unexpected response - clear list
        setLawyers([])
        setPagination((prev) => ({ ...prev, totalItems: 0, totalPages: 1 }))
      }
    } catch (error) {
      console.error('Error loading lawyers:', error)
      setLawyers([])
      setPagination((prev) => ({ ...prev, totalItems: 0, totalPages: 1 }))
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // reset to first page on new search
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === 'district') {
      setSelectedDistrict(value)
    } else if (filterType === 'practiceArea') {
      setSelectedPracticeArea(value)
    }
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }

  const clearFilters = () => {
    setSelectedDistrict('')
    setSelectedPracticeArea('')
    setSearchQuery('')
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        aria-hidden
      />
    ))
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => (word ? word.charAt(0) : ''))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Pagination navigation helpers (guard bounds)
  const goToPage = (page: number) => {
    const p = Math.max(1, Math.min(page, pagination.totalPages || 1))
    setPagination((prev) => ({ ...prev, currentPage: p }))
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {language === 'hi' ? 'वकील खोजें' : 'Find Lawyers'}
        </h2>
        <p className="text-lg text-gray-600">
          {language === 'hi'
            ? 'अपने क्षेत्र में सत्यापित वकीलों से जुड़ें'
            : 'Connect with verified lawyers in your area'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <input
            aria-label={language === 'hi' ? 'वकील खोजें' : 'Search lawyers'}
            type="text"
            placeholder={
              language === 'hi' ? 'वकील खोजें...' : 'Search lawyers...'
            }
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setShowFilters((s) => !s)}
            className="flex items-center space-x-2"
            type="button"
            aria-pressed={showFilters}
            aria-label={language === 'hi' ? 'फिल्टर टॉगल' : 'Toggle filters'}
          >
            <Filter className="h-4 w-4" />
            <span>{language === 'hi' ? 'फिल्टर' : 'Filters'}</span>
          </Button>

          {(selectedDistrict || selectedPracticeArea || searchQuery) && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="flex items-center space-x-2 text-gray-600"
              type="button"
              aria-label={
                language === 'hi' ? 'फिल्टर साफ़ करें' : 'Clear filters'
              }
            >
              <X className="h-4 w-4" />
              <span>{language === 'hi' ? 'साफ करें' : 'Clear'}</span>
            </Button>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-2">
            {/* District Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {language === 'hi' ? 'जिला' : 'District'}
              </label>
              <select
                aria-label={
                  language === 'hi' ? 'जिला चुनें' : 'Select district'
                }
                value={selectedDistrict}
                onChange={(e) => handleFilterChange('district', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">
                  {language === 'hi' ? 'सभी जिले' : 'All Districts'}
                </option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* Practice Area Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {language === 'hi' ? 'अभ्यास क्षेत्र' : 'Practice Area'}
              </label>
              <select
                aria-label={
                  language === 'hi'
                    ? 'अभ्यास क्षेत्र चुनें'
                    : 'Select practice area'
                }
                value={selectedPracticeArea}
                onChange={(e) =>
                  handleFilterChange('practiceArea', e.target.value)
                }
                className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">
                  {language === 'hi' ? 'सभी क्षेत्र' : 'All Areas'}
                </option>
                {practiceAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {language === 'hi'
            ? `${pagination.totalItems} वकील मिले`
            : `${pagination.totalItems} lawyers found`}
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {language === 'hi' ? 'पेज' : 'Page'} {pagination.currentPage}{' '}
            {language === 'hi' ? 'का' : 'of'} {pagination.totalPages}
          </span>
        </div>
      </div>

      {/* Lawyers Grid */}
      {loading ? (
        <div className="py-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600" />
          <p className="mt-2 text-gray-600">
            {language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
          </p>
        </div>
      ) : lawyers.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-gray-600">
              {language === 'hi' ? 'कोई वकील नहीं मिला' : 'No lawyers found'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lawyers.map((lawyer) => (
            <Card key={lawyer.id} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                    {lawyer.profile_image ? (
                      // Use next/image in a Next.js app for better performance; using <img> as fallback
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={lawyer.profile_image}
                        alt={lawyer.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="font-semibold text-indigo-600">
                        {getInitials(lawyer.name)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{lawyer.name}</CardTitle>
                    <div className="mt-1 flex items-center space-x-2">
                      <div className="flex items-center">
                        {renderStars(lawyer.rating)}
                      </div>
                      <span className="text-sm text-gray-600">
                        {lawyer.rating} ({lawyer.experience}{' '}
                        {language === 'hi' ? 'वर्ष अनुभव' : 'years exp'})
                      </span>
                    </div>
                    {lawyer.verified && (
                      <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                        {language === 'hi' ? 'सत्यापित' : 'Verified'}
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Practice Areas */}
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-700">
                    {language === 'hi' ? 'अभ्यास क्षेत्र' : 'Practice Areas'}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {lawyer.practice_areas.slice(0, 3).map((area, index) => (
                      <span
                        key={index}
                        className="rounded bg-indigo-100 px-2 py-1 text-xs text-indigo-800"
                      >
                        {area}
                      </span>
                    ))}
                    {lawyer.practice_areas.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{lawyer.practice_areas.length - 3}{' '}
                        {language === 'hi' ? 'और' : 'more'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Districts */}
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-700">
                    {language === 'hi' ? 'जिले' : 'Districts'}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {lawyer.districts.slice(0, 2).map((district, index) => (
                      <span
                        key={index}
                        className="flex items-center rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"
                      >
                        <MapPin className="mr-1 h-3 w-3" />
                        {district}
                      </span>
                    ))}
                    {lawyer.districts.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{lawyer.districts.length - 2}{' '}
                        {language === 'hi' ? 'और' : 'more'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-700">
                    {language === 'hi' ? 'भाषाएं' : 'Languages'}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {lawyer.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                {lawyer.bio && (
                  <p className="line-clamp-2 text-sm text-gray-600">
                    {lawyer.bio}
                  </p>
                )}

                {/* Contact Buttons */}
                <div className="flex space-x-2 pt-4">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => onSelectLawyer?.(lawyer)}
                    type="button"
                  >
                    {language === 'hi' ? 'संपर्क करें' : 'Contact'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`tel:${lawyer.phone}`)}
                    type="button"
                    aria-label={language === 'hi' ? 'फोन करें' : 'Call'}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`mailto:${lawyer.email}`)}
                    type="button"
                    aria-label={language === 'hi' ? 'ईमेल भेजें' : 'Email'}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => goToPage(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            type="button"
          >
            {language === 'hi' ? 'पिछला' : 'Previous'}
          </Button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (page) => (
              <Button
                key={page}
                variant={
                  page === pagination.currentPage ? 'default' : 'outline'
                }
                onClick={() => goToPage(page)}
                size="sm"
                type="button"
              >
                {page}
              </Button>
            )
          )}

          <Button
            variant="outline"
            onClick={() => goToPage(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            type="button"
          >
            {language === 'hi' ? 'अगला' : 'Next'}
          </Button>
        </div>
      )}
    </div>
  )
}
