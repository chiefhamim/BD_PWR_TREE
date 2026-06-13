export interface NodeData {
  id: string
  label: string
  designation: string
  category: string
  status: string
  nodeColor?: string
  websiteUrl?: string
  capacityData?: string
  x?: number
  y?: number
  manualX?: number
  manualY?: number
  useManualOverride?: boolean
  kpiValue?: string | number
  kpiUnit?: string
  icon?: string
  description?: string
  parentId?: string
  lastUpdated?: string
  officeAddress?: string
  operatingArea?: string
  auditedHighlight?: string
  auditedHighlightBN?: string
}

export interface Node extends NodeData {}

export interface Edge {
  id: string
  sourceId: string
  targetId: string
  edgeColor?: string
  label?: string
  animated?: boolean
}

export interface DashboardStat {
  statName: string
  value: number
  unit?: string
  isManualOverride?: boolean
}

// API Client Functions
export async function fetchAllNodes(): Promise<Node[]> {
  try {
    const response = await fetch('/api/nodes')
    if (!response.ok) throw new Error('Failed to fetch nodes')
    return response.json()
  } catch (error) {
    console.error('Error fetching nodes:', error)
    return []
  }
}

export async function fetchNodeDetails(id: string): Promise<Node | null> {
  try {
    const response = await fetch(`/api/nodes/${id}`)
    if (!response.ok) throw new Error('Failed to fetch node')
    return response.json()
  } catch (error) {
    console.error('Error fetching node:', error)
    return null
  }
}

export async function createNode(data: Partial<Node>): Promise<Node | null> {
  try {
    const response = await fetch('/api/nodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create node')
    return response.json()
  } catch (error) {
    console.error('Error creating node:', error)
    return null
  }
}

export async function updateNode(
  id: string,
  data: Partial<Node>
): Promise<Node | null> {
  try {
    const response = await fetch(`/api/nodes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update node')
    return response.json()
  } catch (error) {
    console.error('Error updating node:', error)
    return null
  }
}

export async function deleteNode(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/nodes/${id}`, {
      method: 'DELETE',
    })
    return response.ok
  } catch (error) {
    console.error('Error deleting node:', error)
    return false
  }
}

export async function updateNodeColor(
  id: string,
  nodeColor: string
): Promise<Node | null> {
  return updateNode(id, { nodeColor })
}

export async function overrideNodeCoordinates(
  id: string,
  x: number,
  y: number,
  useManualOverride: boolean = true
): Promise<Node | null> {
  return updateNode(id, { manualX: x, manualY: y, useManualOverride })
}

export async function fetchDashboardStats(): Promise<DashboardStat[]> {
  try {
    const response = await fetch('/api/stats')
    if (!response.ok) throw new Error('Failed to fetch stats')
    return response.json()
  } catch (error) {
    console.error('Error fetching stats:', error)
    return []
  }
}

export async function updateStat(
  statName: string,
  value: number,
  isManualOverride: boolean
): Promise<DashboardStat | null> {
  try {
    const response = await fetch(`/api/stats/${statName}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value, isManualOverride }),
    })
    if (!response.ok) throw new Error('Failed to update stat')
    return response.json()
  } catch (error) {
    console.error('Error updating stat:', error)
    return null
  }
}
