'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserRole } from '@/types/user'
import { Container, Body } from '@/components/ui'

export default function DashboardRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // -----------------------------------------------------------------
    // AUTHENTICATION COMPLETELY REMOVED FOR DEVELOPMENT
    // Forcing Personal Dashboard state
    // -----------------------------------------------------------------
    router.replace('/dashboard/personal')
  }, [router])

  return (
    <Container className="h-full flex items-center justify-center">
      <Body muted>Redirecting to your workspace...</Body>
    </Container>
  )
}
