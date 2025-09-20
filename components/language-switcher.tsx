'use client'
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
import { useLanguage } from '@/lib/language-context'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as any)}
      className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      aria-label="Select language"
      title="Select language"
    >
      {/* {supportedLanguages.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))} */}
    </select>
  )
}
