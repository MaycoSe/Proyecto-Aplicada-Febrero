import { requireAdmin } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAuditLogs, getActionColor } from "@/lib/audit"
import { mockUsers } from "@/lib/mock-data"
import { FileText, Download, Filter, Clock, User, Database } from "lucide-react"

export default async function AuditLogsPage() {
  await requireAdmin()
  const auditLogs = await getAuditLogs()

  const stats = {
    totalLogs: auditLogs.length,
    creates: auditLogs.filter((log) => log.action === "CREATE").length,
    updates: auditLogs.filter((log) => log.action === "UPDATE").length,
    deletes: auditLogs.filter((log) => log.action === "DELETE").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Audit Logs</h1>
          <p className="mt-1 text-slate-600">Immutable record of all system actions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Logs</CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalLogs}</div>
            <p className="mt-1 text-xs text-slate-500">All recorded actions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Creates</CardTitle>
            <Database className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.creates}</div>
            <p className="mt-1 text-xs text-slate-500">New records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Updates</CardTitle>
            <Database className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.updates}</div>
            <p className="mt-1 text-xs text-slate-500">Modified records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Deletes</CardTitle>
            <Database className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.deletes}</div>
            <p className="mt-1 text-xs text-slate-500">Removed records</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <FileText className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4">No audit logs yet</p>
              </div>
            ) : (
              auditLogs.map((log) => {
                const user = mockUsers.find((u) => u.id === log.userId)
                return (
                  <div key={log.id} className="flex items-start gap-4 rounded-lg border border-slate-200 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                      <Database className="h-5 w-5 text-slate-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                        <span className="text-sm font-medium text-slate-900">{log.entityType}</span>
                        {log.entityId && <span className="text-sm text-slate-500">#{log.entityId.slice(0, 8)}</span>}
                      </div>

                      <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{user?.fullName || "System"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      {(log.oldValues || log.newValues) && (
                        <details className="mt-3">
                          <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700">
                            View Details
                          </summary>
                          <div className="mt-2 space-y-2 rounded-lg bg-slate-50 p-3 text-sm">
                            {log.oldValues && (
                              <div>
                                <p className="font-medium text-slate-700">Old Values:</p>
                                <pre className="mt-1 overflow-x-auto text-xs text-slate-600">
                                  {JSON.stringify(log.oldValues, null, 2)}
                                </pre>
                              </div>
                            )}
                            {log.newValues && (
                              <div>
                                <p className="font-medium text-slate-700">New Values:</p>
                                <pre className="mt-1 overflow-x-auto text-xs text-slate-600">
                                  {JSON.stringify(log.newValues, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
