"use client"

import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function CareersPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the join-us page
    router.replace('/join-us')
  }, [router])

  return null
} 