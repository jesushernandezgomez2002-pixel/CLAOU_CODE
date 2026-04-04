'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, CheckSquare, Repeat2, Settings, LogOut, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUIStore } from '@/lib/stores/uiStore'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const NAV = [
  { href: '/dashboard', label: 'Hoy', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tareas', icon: CheckSquare },
  { href: '/habits', label: 'Hábitos', icon: Repeat2 },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebarOpen, toggleSidebar } = useUIStore()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Sesión cerrada')
    router.push('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 md:hidden"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full z-30 flex flex-col transition-all duration-300',
          'md:relative md:translate-x-0',
          sidebarOpen ? 'translate-x-0 w-56' : '-translate-x-full md:w-16'
        )}
        style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-4 h-16 border-b"
          style={{ borderColor: 'var(--border)' }}>
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--primary)' }}>
                <CheckSquare size={14} color="white" />
              </div>
              <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                Focus
              </span>
            </div>
          )}
          <button onClick={toggleSidebar} className="p-1 rounded-md transition-colors hover:opacity-70"
            style={{ color: 'var(--text-secondary)', marginLeft: sidebarOpen ? 0 : 'auto', marginRight: sidebarOpen ? 0 : 'auto' }}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link key={href} href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  active ? 'text-white' : 'hover:opacity-80',
                  !sidebarOpen && 'justify-center px-2'
                )}
                style={{
                  background: active ? 'var(--primary)' : 'transparent',
                  color: active ? 'white' : 'var(--text-secondary)',
                }}
                title={!sidebarOpen ? label : undefined}>
                <Icon size={18} />
                {sidebarOpen && <span>{label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t space-y-1" style={{ borderColor: 'var(--border)' }}>
          <Link href="/settings"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all hover:opacity-80',
              !sidebarOpen && 'justify-center px-2'
            )}
            style={{ color: 'var(--text-secondary)' }}
            title={!sidebarOpen ? 'Ajustes' : undefined}>
            <Settings size={18} />
            {sidebarOpen && <span>Ajustes</span>}
          </Link>
          <button onClick={handleSignOut}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all hover:opacity-80',
              !sidebarOpen && 'justify-center px-2'
            )}
            style={{ color: 'var(--danger)' }}
            title={!sidebarOpen ? 'Cerrar sesión' : undefined}>
            <LogOut size={18} />
            {sidebarOpen && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
