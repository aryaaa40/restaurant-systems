import { useState } from 'react'
import { TableGrid } from './components/TableGrid'
import { Status } from './components/Status'
import { ArrivalForm } from './components/ArrivalForm'
import { QueueList } from './components/QueueList'
import type { TableColor } from './lib/tableStatus'
import { Toaster } from 'sonner'

function App() {
  const [statusFilter, setStatusFilter] = useState<TableColor | null>(null)

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <Toaster richColors position='top-right' />
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Restaurant Queue Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Pantau status meja, antrean, dan riwayat secara real-time.
          </p>
        </header>

        <ArrivalForm />
        <Status activeFilter={statusFilter} onFilterChange={setStatusFilter} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
          <TableGrid statusFilter={statusFilter} />
          <QueueList />
        </div>
      </div>
    </main>
  )
}

export default App
