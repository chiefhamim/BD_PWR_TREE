'use client'

import { useState, useEffect } from 'react'
import { fetchAllNodes, fetchDashboardStats } from '@/lib/api'

export default function AdminDashboard() {
  const [nodeCount, setNodeCount] = useState(0)
  const [stats, setStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const nodes = await fetchAllNodes()
      const stats = await fetchDashboardStats()
      setNodeCount(nodes.length)
      setStats(stats)
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-2">Total Nodes</p>
          <p className="text-4xl font-bold text-white">{nodeCount}</p>
        </div>

        {stats.slice(0, 2).map((stat) => (
          <div
            key={stat.statName}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6"
          >
            <p className="text-slate-400 text-sm mb-2">{stat.statName}</p>
            <p className="text-4xl font-bold text-white">
              {stat.value}
              <span className="text-lg ml-2 text-slate-400">{stat.unit}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/nodes"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors block text-center"
          >
            Manage Nodes
          </a>
          <a
            href="/admin/styling"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors block text-center"
          >
            Styling & Colors
          </a>
          <a
            href="/admin/stats"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors block text-center"
          >
            Dashboard Stats
          </a>
          <a
            href="/"
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors block text-center"
          >
            View Main Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
