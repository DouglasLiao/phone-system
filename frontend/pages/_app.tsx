import React, { useState } from 'react'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { LanguageProvider } from '../contexts/LanguageContext'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 5 * 60 * 1000, // 5 minutos
        cacheTime: 10 * 60 * 1000 // 10 minutos
      }
    }
  }))

  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        {/* Ferramenta de debug — só aparece em ambiente de desenvolvimento */}
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </LanguageProvider>
  )
}

export default MyApp
