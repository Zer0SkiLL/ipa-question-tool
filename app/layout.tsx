import { createClient } from "@/utils/supabase/server"
import "./globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"
import type React from "react"
import { UserNav } from "@/components/UserNav"
import { Toaster } from "@/components/ui/sonner"

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
      
      const isAuthenticated = !!user; // Check if user exists



      // if (!user && pathname !== "/sign-in") {
      //   redirect("/sign-in");
      // }
      
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              IT Exam Questions
            </Link>
            <div className="space-x-4">
            {isAuthenticated ? (
                <>
                  <Link href="/apprentices" className="hover:underline">
                    Apprentices
                  </Link>
                  <Link href="/questions" className="hover:underline">
                    Questions
                  </Link>
                  <Link href="/manage" className="hover:underline">
                    Manage
                  </Link>
                </>
              ) : null}
              <UserNav isAuthenticated={isAuthenticated} />
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}

