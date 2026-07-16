import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DndContext } from '@dnd-kit/core'
import { TableCard } from './TableCard'
import type { TableStatus } from '../types/seating'

function renderWithProviders(table: TableStatus) {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <DndContext onDragEnd={() => {}}>
        <TableCard table={table} />
      </DndContext>
    </QueryClientProvider>,
  )
}

describe('TableCard', () => {
  it('renders an empty table as available with no guest', () => {
    renderWithProviders({
      id: 1,
      code: 'A',
      capacity: 2,
      status: 'available',
      seating: null,
    })

    expect(screen.getByText('Meja A')).toBeInTheDocument()
    expect(screen.getByText('Kosong')).toBeInTheDocument()
    expect(screen.getByText('Belum ada tamu')).toBeInTheDocument()
  })

  it('renders an occupied table with the seated party and a force complete button', () => {
    const now = Date.now()
    renderWithProviders({
      id: 2,
      code: 'B',
      capacity: 4,
      status: 'occupied',
      seating: {
        party: { id: 1, name: 'Budi', size: 3 },
        seated_at: new Date(now).toISOString(),
        estimated_end_at: new Date(now + 20 * 60 * 1000).toISOString(),
        duration_minutes: 20,
      },
    })

    expect(screen.getByText('Meja B')).toBeInTheDocument()
    expect(screen.getByText(/Budi/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /force complete/i })).toBeInTheDocument()
  })
})
