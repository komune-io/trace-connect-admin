import { useCallback, useEffect, useMemo } from 'react'
import { LanguageSelector } from "./LanguageSelector"
import { useTranslation } from 'react-i18next';

interface KeycloakLanguageSelectorProps {
    enabledLanguages: {
        languageTag: string;
        label: string;
        href: string;
    }[]
    currentLanguage: {
        languageTag: string;
        label: string;
    }
}

export const KeycloakLanguageSelector = (props: KeycloakLanguageSelectorProps) => {
    const { currentLanguage, enabledLanguages } = props

    const { i18n } = useTranslation()

    useEffect(() => {
      if (currentLanguage.languageTag !== i18n.language) {
        i18n.changeLanguage(currentLanguage.languageTag)
      }
    }, [i18n.language, currentLanguage.languageTag])
    

    const languages = useMemo(() => {
        const languages: Record<string, string> = {}
        enabledLanguages.forEach((lng) => {
            languages[lng.languageTag] = lng.label
        })
        return languages
    }, [enabledLanguages])

    const onChange = useCallback(
      (languageTag: string) => {
        const languageUrl = enabledLanguages.find((lng) => lng.languageTag === languageTag)?.href
        if (languageUrl) {
            window.open(languageUrl, "_self")
        }
      },
      [enabledLanguages],
    )
    

    return (
        <LanguageSelector
        sx={{
            alignSelf: "flex-end"
        }}
            languages={languages}
            currentLanguage={currentLanguage.languageTag}
            onChange={onChange}
        />
    )
}
