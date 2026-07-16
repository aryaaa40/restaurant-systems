import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { useArrive } from '../hooks/useArrive'
import { useStatus } from '../hooks/useStatus'

export function ArrivalForm() {
  const [name, setName] = useState('')
  const [size, setSize] = useState('')
  const arriveMutation = useArrive()
  const { data } = useStatus()

  const maxCapacity = data?.tables.length
    ? Math.max(...data.tables.map((table) => table.capacity))
    : 8

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const trimmedName = name.trim()
    const parsedSize = Number(size)

    if (!trimmedName) {
      toast.error('Nama tamu wajib diisi.')
      return
    }

    if (!parsedSize || parsedSize < 1) {
      toast.error('Jumlah orang harus diisi, minimal 1.')
      return
    }

    if (parsedSize > maxCapacity) {
      toast.error(`Jumlah orang maksimal ${maxCapacity} (kapasitas meja terbesar).`)
      return
    }

    arriveMutation.mutate(
      { name: trimmedName, size: parsedSize },
      {
        onSuccess: () => {
          setName('')
          setSize('')
          toast.success(`${trimmedName} berhasil ditambahkan.`)
        },
        onError: (error) => {
          const message =
            isAxiosError(error) && error.response?.data?.message
              ? error.response.data.message
              : 'Gagal menambahkan tamu, coba lagi.'
          toast.error(message)
        },
      },
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-bold text-slate-900 mb-1">Tamu Datang</h2>
      <p className="text-xs text-slate-500 mb-4">Tambahkan rombongan baru ke sistem</p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="party-name" className="text-xs font-medium text-slate-500">
            Nama Tamu
          </label>
          <input
            id="party-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Cth: Budi"
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="party-size" className="text-xs font-medium text-slate-500">
            Jumlah Orang
          </label>
          <input
            id="party-size"
            type="number"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="Cth: 3"
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <button
          type="submit"
          disabled={arriveMutation.isPending}
          className="rounded-lg bg-slate-900 text-white text-sm font-medium px-4 py-2.5 hover:bg-slate-800 disabled:opacity-50"
        >
          {arriveMutation.isPending ? 'Mengirim…' : 'Tamu Datang'}
        </button>
      </form>
    </div>
  )
}
