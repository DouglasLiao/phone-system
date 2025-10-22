import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'pt-BR' | 'en-US'

interface LanguageContextType {
  language: Language
  setLanguage: (_lang: Language) => void
  t: (_key: string) => string
}

const translations = {
  'pt-BR': {
    // Header
    'header.title': 'Douglas',
    'header.subtitle': 'Sistema de Criação de Linhas Telefônicas',
    'header.backend_status': 'Backend',
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.new_line': 'Nova Linha',
    // Footer
    'footer.title': 'Douglas - App de Criação de Linhas Telefônicas',
    'footer.tech': 'Backend: Node.js + Arquitetura Hexagonal | Frontend: Next.js + React Query',
    // Status
    'status.checking': 'Verificando...',
    'status.online': 'Online',
    'status.offline': 'Offline',
    'status.error': 'Erro',
    'status.recovering': 'Recuperando',
    'status.unstable': 'Instável',

    // Language switcher
    'language.portuguese': 'Português',
    'language.english': 'English',
    'language.switch_to_english': 'Mudar para Inglês',
    'language.switch_to_portuguese': 'Switch to Portuguese',

    // Common
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.cancel': 'Cancelar',
    'common.save': 'Salvar',
    'common.create': 'Criar',
    'common.delete': 'Excluir',
    'common.edit': 'Editar',

    // Phone Line Form
    'form.new_phone_line': 'Nova Linha Telefônica',
    'form.area_code': 'Código de Área',
    'form.subscription_plan': 'Plano de Assinatura',
    'form.select_area_code': 'Selecione o código de área',
    'form.select_plan': 'Selecione um plano',
    'form.create_phone_line': 'Criar Linha Telefônica',
    'form.creating_line': 'Criando linha...',
    'form.area_code_required': 'Código de área é obrigatório',
    'form.subscription_plan_required': 'Plano de assinatura é obrigatório',
    'form.error_creating_line': 'Erro ao criar linha',
    'form.loading_plans': 'Carregando planos...',

    // Dashboard
    'dashboard.phone_lines': 'Linhas Telefônicas',
    'dashboard.total_lines': 'Total',
    'dashboard.line_s': 'linha(s)',
    'dashboard.cards': 'Cartões',
    'dashboard.table': 'Tabela',
    'dashboard.no_phone_lines': 'Nenhuma linha telefônica encontrada',
    'dashboard.create_first_line': 'Crie sua primeira linha telefônica usando o formulário acima.',
    'dashboard.loading_phone_lines': 'Carregando linhas telefônicas...',
    'dashboard.error_loading_lines': 'Erro ao carregar linhas',
    'dashboard.try_again': 'Tentar novamente',
    'dashboard.created_on': 'Criado em',
    'dashboard.pending': 'Pendente',

    // Table
    'table.phone_number': 'Número de Telefone',
    'table.area_code': 'Código de Área',
    'table.subscription_plan': 'Plano',
    'table.created_at': 'Criado em',
    'table.actions': 'Ações',
    'table.no_data': 'Nenhum dado disponível',
    'table.showing': 'Mostrando',
    'table.to': 'a',
    'table.of': 'de',
    'table.entries': 'entradas',
    'table.previous': 'Anterior',
    'table.next': 'Próximo',
    'table.rows_per_page': 'Linhas por página',

    // Area Codes
    'area.sao_paulo': 'São Paulo',
    'area.rio_de_janeiro': 'Rio de Janeiro',
    'area.belo_horizonte': 'Belo Horizonte',
    'area.curitiba': 'Curitiba',
    'area.porto_alegre': 'Porto Alegre',
    'area.brasilia': 'Brasília',
    'area.salvador': 'Salvador',
    'area.recife': 'Recife',
    'area.fortaleza': 'Fortaleza',
    'area.manaus': 'Manaus',

    // Page metadata
    'meta.title': 'Douglas - Criação de Linhas Telefônicas',
    'meta.description': 'Douglas - App de criação de linhas telefônicas'
  },
  'en-US': {
    // Header
    'header.title': 'Douglas',
    'header.subtitle': 'Phone Line Creation System',
    'header.backend_status': 'Backend',

    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.new_line': 'New Line',

    // Footer
    'footer.title': 'Douglas - Phone Line Creation App',
    'footer.tech': 'Backend: Node.js + Hexagonal Architecture | Frontend: Next.js + React Query',

    // Status
    'status.checking': 'Checking...',
    'status.online': 'Online',
    'status.offline': 'Offline',
    'status.error': 'Error',
    'status.recovering': 'Recovering',
    'status.unstable': 'Unstable',

    // Language switcher
    'language.portuguese': 'Português',
    'language.english': 'English',
    'language.switch_to_english': 'Switch to English',
    'language.switch_to_portuguese': 'Mudar para Português',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.create': 'Create',
    'common.delete': 'Delete',
    'common.edit': 'Edit',

    // Phone Line Form
    'form.new_phone_line': 'New Phone Line',
    'form.area_code': 'Area Code',
    'form.subscription_plan': 'Subscription Plan',
    'form.select_area_code': 'Select area code',
    'form.select_plan': 'Select a plan',
    'form.create_phone_line': 'Create Phone Line',
    'form.creating_line': 'Creating line...',
    'form.area_code_required': 'Area code is required',
    'form.subscription_plan_required': 'Subscription plan is required',
    'form.error_creating_line': 'Error creating line',
    'form.loading_plans': 'Loading plans...',

    // Dashboard
    'dashboard.phone_lines': 'Phone Lines',
    'dashboard.total_lines': 'Total',
    'dashboard.line_s': 'line(s)',
    'dashboard.cards': 'Cards',
    'dashboard.table': 'Table',
    'dashboard.no_phone_lines': 'No phone lines found',
    'dashboard.create_first_line': 'Create your first phone line using the form above.',
    'dashboard.loading_phone_lines': 'Loading phone lines...',
    'dashboard.error_loading_lines': 'Error loading lines',
    'dashboard.try_again': 'Try again',
    'dashboard.created_on': 'Created on',
    'dashboard.pending': 'Pending',

    // Table
    'table.phone_number': 'Phone Number',
    'table.area_code': 'Area Code',
    'table.subscription_plan': 'Plan',
    'table.created_at': 'Created At',
    'table.actions': 'Actions',
    'table.no_data': 'No data available',
    'table.showing': 'Showing',
    'table.to': 'to',
    'table.of': 'of',
    'table.entries': 'entries',
    'table.previous': 'Previous',
    'table.next': 'Next',
    'table.rows_per_page': 'Rows per page',

    // Area Codes
    'area.sao_paulo': 'São Paulo',
    'area.rio_de_janeiro': 'Rio de Janeiro',
    'area.belo_horizonte': 'Belo Horizonte',
    'area.curitiba': 'Curitiba',
    'area.porto_alegre': 'Porto Alegre',
    'area.brasilia': 'Brasília',
    'area.salvador': 'Salvador',
    'area.recife': 'Recife',
    'area.fortaleza': 'Fortaleza',
    'area.manaus': 'Manaus',

    // Page metadata
    'meta.title': 'Douglas - Phone Line Creation',
    'meta.description': 'Douglas - Phone line creation app'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('pt-BR')

  // Detecta o idioma do browser na primeira vez
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'pt-BR' || savedLanguage === 'en-US')) {
      setLanguageState(savedLanguage)
    } else {
      // Detecta idioma do browser
      const browserLang = navigator.language
      if (browserLang.startsWith('en')) {
        setLanguageState('en-US')
      } else {
        setLanguageState('pt-BR') // padrão para português brasileiro
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
