export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm bg-background rounded-xl border shadow-sm px-8 py-10">
        {children}
      </div>
    </div>
  )
}
