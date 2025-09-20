// components/client-lang-manager.tsx
'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'

/**
 * ClientLangManager
 * - Ensures document.documentElement.lang is set to current language
 * - Dynamically injects the Noto Sans Devanagari font link when 'hi' is active
 * - Cleans up the injected link when language switches away (optional)
 */
export default function ClientLangManager() {
  const { language } = useLanguage() // assumes useLanguage() returns a client-side language string like 'en' | 'hi' | etc.

  useEffect(() => {
    if (!language) return

    // update <html lang="...">
    try {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = language
      }
    } catch (e) {
      // ignore in weird environments
    }

    // If Hindi is active, inject Noto Devanagari if not already present.
    const notoHref =
      'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@100;200;300;400;500;600;700;800;900&display=swap'
    const existing = document.querySelector<HTMLLinkElement>(
      `link[href="${notoHref}"]`
    )

    if (language.startsWith('hi')) {
      if (!existing) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = notoHref
        link.setAttribute('data-dynamic-font', 'noto-devanagari')
        document.head.appendChild(link)
      }
    } else {
      // optional: remove injected font when not needed to save bytes
      if (
        existing &&
        existing.getAttribute('data-dynamic-font') === 'noto-devanagari'
      ) {
        existing.remove()
      }
    }
  }, [language])

  return null
}
