import { SessionProvider } from 'next-auth/react'
import { auth } from '~/server/auth'

export async function SessionProviders({children}: { children: React.ReactNode }) {
  let session = null

  try {
    session = await auth()

    if (session?.user) {
      // TODO: Look into https://react.dev/reference/react/experimental_taintObjectReference
      session.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }
    }
  } catch (e) {
    console.error('[SessionProviders] auth() failed:', e)
  }

  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}