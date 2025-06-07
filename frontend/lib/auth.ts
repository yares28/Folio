import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function getSession() {
  const supabase = createServerClient()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return session
}
