import React, { useState } from 'react'
import Head from 'next/head'
import PhoneLineForm from '../components/PhoneLineForm'
import PhoneLineDashboard from '../components/PhoneLineDashboard'
import HealthStatus from '../components/HealthStatus'
import LanguageSwitcher from '../components/LanguageSwitcher'
import SkeletonLoader from '../components/SkeletonLoader'
import { useLanguage } from '../contexts/LanguageContext'
import { Plus, List, Phone } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const { t } = useLanguage()

  const handleTabChange = (newTab: string) => {
    if (newTab !== activeTab) {
      setIsTransitioning(true)

      // Simula um pequeno delay para mostrar o skeleton
      setTimeout(() => {
        setActiveTab(newTab)
        setIsTransitioning(false)
      }, 300)
    }
  }

  const handleFormSuccess = () => {
    handleTabChange('dashboard')
  }

  return (
    <>
      <Head>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="bg-primary shadow-sm border-b border-primary-dark flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-3xl font-bold text-secondary">{t('header.title')}</h1>
                <p className="text-sm text-text-muted">{t('header.subtitle')}</p>
              </div>
              <div className="flex items-center space-x-4">
                <HealthStatus />
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex-shrink-0">
          <div className="border-b border-primary-dark">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleTabChange('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'dashboard'
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-text-muted hover:text-text hover:border-primary-dark'
                }`}
              >
                <List className="w-4 h-4 inline mr-2" />
                {t('nav.dashboard')}
              </button>
              <button
                onClick={() => handleTabChange('create')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'create'
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-text-muted hover:text-text hover:border-primary-dark'
                }`}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                {t('nav.new_line')}
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {isTransitioning ? (
            <SkeletonLoader variant={activeTab === 'dashboard' ? 'form' : 'dashboard'} />
          ) : (
            <>
              {activeTab === 'dashboard' && <PhoneLineDashboard />}
              {activeTab === 'create' && <PhoneLineForm onSuccess={handleFormSuccess} />}
            </>
          )}
        </main>

        {/* Footer - Fixed at bottom */}
        <footer className="bg-secondary border-t border-secondary-light flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Phone className="w-6 h-6 text-primary mr-2" />
                <h2 className="text-xl font-bold text-primary">
                  {t('footer.title')}
                </h2>
              </div>
              <p className="text-primary-dark text-xs">
                {t('footer.tech')}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
