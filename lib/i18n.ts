import { useLanguage, type AppLanguage } from './language-context'
import {
  UI_TEXT,
  getText as baseGetText,
  type SupportedLang,
} from './multilingual-api'

type Dictionary = typeof UI_TEXT

export function useTranslation() {
  const { language } = useLanguage()

  function t(key: keyof Dictionary | string): string {
    return baseGetText(key as string, language as SupportedLang)
  }

  function currentLanguage(): AppLanguage {
    return language
  }

  return { t, lang: currentLanguage() }
}
