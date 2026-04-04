'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { Profile } from '@/types'

interface Props {
  profile: Profile | null
  email: string
}

export function SettingsClient({ profile, email }: Props) {
  const [name, setName] = useState(profile?.full_name ?? '')
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: name })
      .eq('id', profile?.id ?? '')
    setSaving(false)
    if (error) toast.error(error.message)
    else toast.success('Perfil actualizado')
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const inputStyle = {
    background: 'var(--surface-elevated)',
    borderColor: 'var(--border)',
    color: 'var(--text-primary)',
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        Ajustes
      </h1>

      <div className="rounded-2xl border p-5 mb-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>
          Perfil
        </h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--text-secondary)' }}>
              Email
            </label>
            <input value={email} disabled
              className="w-full px-3 py-2.5 rounded-lg text-sm border opacity-50 cursor-not-allowed"
              style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--text-secondary)' }}>
              Nombre
            </label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none border"
              style={inputStyle} />
          </div>
          <button type="submit" disabled={saving}
            className="w-full py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: 'var(--primary)', color: 'white' }}>
            {saving && <Loader2 size={14} className="animate-spin" />}
            Guardar cambios
          </button>
        </form>
      </div>

      <div className="rounded-2xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className="font-semibold mb-3 text-sm" style={{ color: 'var(--danger)' }}>
          Sesión
        </h2>
        <button onClick={handleSignOut}
          className="w-full py-2.5 rounded-lg text-sm font-medium border hover:opacity-80"
          style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
