'use client'

import { useState, useEffect } from 'react'
import { fetchDashboardStats, updateStat, DashboardStat } from '@/lib/api'
import { Save } from 'lucide-react'

export default function StatsPage() {
  const [stats, setStats] = useState<DashboardStat[]>([])
  const [loading, setLoading] = useState(true)
  const [editingStats, setEditingStats] = useState<{
    [key: string]: { value: number; isManualOverride: boolean }
  }>({})

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    const data = await fetchDashboardStats()
    setStats(data || [])
    const editing: { [key: string]: any } = {}
    data?.forEach((stat) => {
      editing[stat.statName] = {
        value: stat.value,
        isManualOverride: stat.isManualOverride || false,
      }
    })
    setEditingStats(editing)
    setLoading(false)
  }

  const handleSave = async (statName: string) => {
    const stat = editingStats[statName]
    await updateStat(statName, stat.value, stat.isManualOverride)
    await loadStats()
    alert('Stat updated successfully')
  }

  if (loading) {
    return <p className="text-white">Loading stats...</p>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard Stats Management</h1>

      <div className="space-y-4">
        {stats.length === 0 ? (
          <p className="text-slate-400">No stats available.</p>
        ) : (
          stats.map((stat) => (
            <div
              key={stat.statName}
              className="bg-slate-800 border border-slate-700 rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-semibold text-lg">{stat.statName}</h3>
                  <p className="text-slate-400 text-sm mt-1">Unit: {stat.unit || 'N/A'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingStats[stat.statName]?.isManualOverride || false}
                      onChange={(e) =>
                        setEditingStats({
                          ...editingStats,
                          [stat.statName]: {
                            ...editingStats[stat.statName],
                            isManualOverride: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-slate-300">Manual Override</span>
                  </label>
                  <span className="text-slate-500 text-sm">
                    {editingStats[stat.statName]?.isManualOverride
                      ? 'Manual value will be displayed'
                      : 'Auto-calculated value'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Value</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingStats[stat.statName]?.value || stat.value}
                    onChange={(e) =>
                      setEditingStats({
                        ...editingStats,
                        [stat.statName]: {
                          ...editingStats[stat.statName],
                          value: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                  />
                </div>

                <button
                  onClick={() => handleSave(stat.statName)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
