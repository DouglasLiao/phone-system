import React, { useState } from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const toggleLanguage = (newLang: 'pt-BR' | 'en-US') => {
    setLanguage(newLang)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-text bg-primary border border-primary-dark rounded-md hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{language === 'pt-BR' ? 'PT' : 'EN'}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          {/* Overlay para fechar o dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-background border border-primary-dark rounded-md shadow-lg z-20">
            <div className="py-1">
              <button
                onClick={() => toggleLanguage('pt-BR')}
                className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-primary-light transition-colors ${
                  language === 'pt-BR' ? 'bg-primary text-secondary' : 'text-text'
                }`}
              >
                <span className="mr-3">🇧🇷</span>
                {t('language.portuguese')}
                {language === 'pt-BR' && (
                  <span className="ml-auto text-secondary">✓</span>
                )}
              </button>

              <button
                onClick={() => toggleLanguage('en-US')}
                className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-primary-light transition-colors ${
                  language === 'en-US' ? 'bg-primary text-secondary' : 'text-text'
                }`}
              >
                <span className="mr-3">🇺🇸</span>
                {t('language.english')}
                {language === 'en-US' && (
                  <span className="ml-auto text-secondary">✓</span>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default LanguageSwitcher
