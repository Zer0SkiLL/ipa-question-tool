// components/ProtectedLayout.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

import { ReactNode } from 'react';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const supabase = await createClient();
  
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      return redirect("/sign-in");
    }

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/signin')
      } else {
        setLoading(false)
      }
    }

    checkUser()
  }, [router, supabase])

  if (loading) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}