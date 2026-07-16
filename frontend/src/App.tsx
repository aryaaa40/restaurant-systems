import { useState } from 'react'
import { TableGrid } from './components/TableGrid'
import { Status } from './components/Status'
import type { TableColor } from './lib/tableStatus'

function App() {
  const [statusFilter, setStatusFilter] = useState<TableColor | null>(null)

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Restaurant Queue Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Pantau status meja, antrean, dan riwayat secara real-time.
          </p>
        </header>
        <Status activeFilter={statusFilter} onFilterChange={setStatusFilter} />
        <TableGrid statusFilter={statusFilter} />
      </div>
    </main>
  )
}

export default App
