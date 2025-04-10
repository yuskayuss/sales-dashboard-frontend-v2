'use client'
import { useEffect, useState } from 'react'

type Deal = {
  clientName: string
  status: string
}

type SalesRep = {
  id: number
  name: string
  skills: string[]
  deals: Deal[]
}

export default function Home() {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([])

  useEffect(() => {
    fetch('http://localhost:8000/api/sales-reps')
      .then(res => res.json())
      .then(data => setSalesReps(data.salesReps))
      .catch(err => console.error('Failed to fetch:', err))
  }, [])

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sales Reps</h1>
      {salesReps.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-4">
          {salesReps.map(rep => (
            <li key={rep.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{rep.name}</h2>
              <p><strong>Skills:</strong> {rep.skills.join(', ')}</p>
              <ul className="mt-2">
                {rep.deals.map((deal, i) => (
                  <li key={i}>💼 {deal.clientName} — <em>{deal.status}</em></li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
