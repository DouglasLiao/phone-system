import { useState, useEffect } from 'react'

import React from 'react'

export default function TestPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async() => {
      try {
        console.log('Testing request to subscription plans...')
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
        const response = await fetch(`${apiUrl}/api/subscription-plans`)
        const result = await response.json()
        console.log('Response:', result)
        setData(result)
      } catch (err) {
        console.error('Error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div style={{ padding: '20px' }}>
      <h1>API Test</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
