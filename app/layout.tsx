import { createClient } from "@/utils/supabase/server"
import "./globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"
import type React from "react"
import { UserNav } from "@/components/UserNav"
import { Toaster } from "@/components/ui/sonner"
import { DemoModeProvider } from "@/components/DemoModeProvider"
import { DemoModeBanner } from "@/components/DemoModeBanner"
import { isDemoUser } from "@/utils/demo"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "IT Apprentice Exam Questions",
  description: "Browse and search IT questions for apprentice final exams",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const supabase = await createClient();
    
    const {
      data: { user },
    } = await supabase.auth.getUser();
      
      const isAuthenticated = !!user;
      const demoMode = isDemoUser(user?.email);
      
  return (
    <html lang="de">
      <body className={inter.className}>
        <DemoModeProvider isDemoMode={demoMode}>
          <DemoModeBanner />
          <nav className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">
                IPA Fragen-Tool
              </Link>
              <div className="space-x-4">
              {isAuthenticated ? (
                  <>
                    <Link href="/apprentices" className="hover:underline">
                      Kandidaten
                    </Link>
                  </>
                ) : null}
                <UserNav isAuthenticated={isAuthenticated} />
              </div>
            </div>
          </nav>
          <main>{children}</main>
          <Toaster />
        </DemoModeProvider>
      </body>
    </html>
  )
}

