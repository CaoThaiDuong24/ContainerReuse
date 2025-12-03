"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function DebugDataPage() {
  const [depots, setDepots] = useState<any[]>([])
  const [containers, setContainers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch depots
      const depotRes = await fetch(`${API_BASE_URL}/api/iContainerHub_Depot`)
      const depotData = await depotRes.json()
      setDepots(depotData.data || [])

      // Fetch containers
      const containerRes = await fetch(`${API_BASE_URL}/api/containers/reuse-now`)
      const containerData = await containerRes.json()
      setContainers(containerData.data || [])

      // Analyze matching
      analyzeData(depotData.data || [], containerData.data || [])
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const analyzeData = (depotList: any[], containerList: any[]) => {
    const result: any = {
      totalDepots: depotList.length,
      totalContainers: containerList.length,
      depotIds: depotList.map(d => ({ id: d.id, name: d.name, type: typeof d.id })),
      containerDepotIds: [...new Set(containerList.map(c => c.depotId))],
      matching: {}
    }

    // Check matching for each depot
    depotList.forEach(depot => {
      const matches = containerList.filter(c => String(c.depotId) === String(depot.id))
      result.matching[depot.id] = {
        depotName: depot.name,
        expected: depot.containerCount,
        actual: matches.length,
        sampleContainers: matches.slice(0, 3).map(c => ({
          id: c.containerId,
          depotId: c.depotId,
          depotIdType: typeof c.depotId
        }))
      }
    })

    setAnalysis(result)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🔍 Data Debug Page</h1>
        <Button onClick={fetchData} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh Data'}
        </Button>
      </div>

      {analysis && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>📊 Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Total Depots:</strong> {analysis.totalDepots}</p>
                <p><strong>Total Containers:</strong> {analysis.totalContainers}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🏢 Depot IDs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysis.depotIds.map((d: any) => (
                  <div key={d.id} className="flex gap-2 items-center">
                    <code className="bg-gray-100 px-2 py-1 rounded">{d.id}</code>
                    <span className="text-sm text-gray-600">({d.type})</span>
                    <span>{d.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📦 Container Depot IDs (Unique)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {analysis.containerDepotIds.map((id: any) => (
                  <code key={id} className="bg-blue-100 px-2 py-1 rounded">
                    {id} ({typeof id})
                  </code>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔍 Matching Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analysis.matching).map(([depotId, info]: [string, any]) => (
                  <div key={depotId} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="bg-gray-100 px-2 py-1 rounded font-bold">{depotId}</code>
                      <span className="font-semibold">{info.depotName}</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>Expected: <strong>{info.expected}</strong> containers</p>
                      <p className={info.actual === info.expected ? 'text-green-600' : 'text-red-600'}>
                        Actual: <strong>{info.actual}</strong> containers
                        {info.actual !== info.expected && ' ⚠️ MISMATCH'}
                      </p>
                      {info.sampleContainers.length > 0 && (
                        <div className="mt-2">
                          <p className="text-gray-600">Sample containers:</p>
                          {info.sampleContainers.map((c: any) => (
                            <div key={c.id} className="ml-4 text-xs">
                              • {c.id} (depotId: {c.depotId} - {c.depotIdType})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📄 Raw Data (First 3 items)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Depots:</h3>
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-60">
                    {JSON.stringify(depots.slice(0, 3), null, 2)}
                  </pre>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Containers:</h3>
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-60">
                    {JSON.stringify(containers.slice(0, 3), null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
