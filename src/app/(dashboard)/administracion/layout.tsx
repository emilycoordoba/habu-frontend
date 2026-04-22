import { AdminNav } from "@/components/administracion/admin-nav"

export default function AdministracionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b px-6 pt-4 pb-0 shrink-0">
        <h1 className="text-lg font-semibold mb-3">Administración</h1>
        <AdminNav />
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
