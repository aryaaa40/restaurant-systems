import { useState } from 'react'
import { DndContext, type DragEndEvent } from '@dnd-kit/core'
import { isAxiosError } from 'axios'
import { toast, Toaster } from 'sonner'
import { TableGrid } from './components/TableGrid'
import { Status } from './components/Status'
import { ArrivalForm } from './components/ArrivalForm'
import { QueueList } from './components/QueueList'
import { useAssign } from './hooks/useAssign'
import type { TableColor } from './lib/tableStatus'
import { HistoryTable } from './components/HistoryTable'
import { SearchFilterBar } from './components/SearchFilterBar'
import { validateDrop } from './lib/dragValidation'

function App() {
  const [statusFilter, setStatusFilter] = useState<TableColor | null>(null)
  const [search, setSearch] = useState('')
  const [sizeFilter, setSizeFilter] = useState<number | null>(null)

  const assignMutation = useAssign()

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const partyId = active.data.current?.partyId as number | undefined
    const partyName = active.data.current?.name as string | undefined
    const partySize = active.data.current?.size as number | undefined
    const tableId = over.data.current?.tableId as number | undefined
    const tableCode = over.data.current?.code as string | undefined
    const capacity = over.data.current?.capacity as number | undefined
    const isOccupied = over.data.current?.isOccupied as boolean | undefined


    if (!partyId || !tableId) return

    const validation = validateDrop(partySize, capacity, isOccupied)

    if (!validation.valid) {
      toast.error(validation.reason ?? 'Gagal menempatkan tamu.')
      return
    }


    assignMutation.mutate(
      { party_id: partyId, table_id: tableId },
      {
        onSuccess: () => {
          toast.success(`${partyName ?? 'Tamu'} berhasil ditempatkan di Meja ${tableCode ?? ''}.`)
        },
        onError: (error) => {
          const message =
            isAxiosError(error) && error.response?.data?.message
              ? error.response.data.message
              : 'Gagal menempatkan tamu ke meja.'
          toast.error(message)
        },
      },
    )
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <main className="min-h-screen bg-slate-50 p-6 md:p-10">
        <Toaster richColors position="top-right" />
        <div className="max-w-6xl mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Restaurant Queue Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Pantau status meja, antrean, dan riwayat secara real-time.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                <h2 className="text-lg font-bold text-slate-900">Aktifitas Meja</h2>
                <p className="text-xs text-slate-500 mb-4">
                  Berikut adalah aktifitas meja yang sedang berlangsung.
                </p>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <Status activeFilter={statusFilter} onFilterChange={setStatusFilter} />
                  <SearchFilterBar
                    search={search}
                    onSearchChange={setSearch}
                    sizeFilter={sizeFilter}
                    onSizeFilterChange={setSizeFilter}
                  />
                </div>
                <TableGrid statusFilter={statusFilter} search={search} sizeFilter={sizeFilter} />
              </div>
              <HistoryTable />
            </div>
            <div className="flex flex-col gap-6">
              <ArrivalForm />
              <QueueList search={search} sizeFilter={sizeFilter} />
            </div>
          </div>
        </div>
      </main>
    </DndContext>
  )
}

export default App
