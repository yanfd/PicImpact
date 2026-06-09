'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h2>Something went wrong!</h2>
        <pre style={{ whiteSpace: 'pre-wrap', color: 'red' }}>
          {error.message}
        </pre>
        {error.digest && <p>Digest: {error.digest}</p>}
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
