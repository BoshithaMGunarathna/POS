"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, ShoppingCart, Clock, Coffee, TrendingUp } from "lucide-react"

interface CashierSalesSummaryProps {
  cashier: any
  sessions: any[]
}

export default function CashierSalesSummary({ cashier, sessions }: CashierSalesSummaryProps) {
  const totalBreakTime = sessions.reduce((total, session) => {
    return (
      total +
      session.breakSessions.reduce((breakTotal: number, breakSession: any) => {
        return breakTotal + breakSession.duration
      }, 0)
    )
  }, 0)

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <TrendingUp className="w-4 h-4 mr-2" />
          My Sales
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Sales Summary - {cashier.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">${cashier.totalSales.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Total Sales</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{cashier.transactionCount}</p>
                    <p className="text-xs text-gray-500">Transactions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{formatTime(cashier.hoursWorked * 60)}</p>
                    <p className="text-xs text-gray-500">Hours Worked</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{formatTime(totalBreakTime)}</p>
                    <p className="text-xs text-gray-500">Break Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Machine Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Machine Sessions Today</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Machine</TableHead>
                    <TableHead>Login Time</TableHead>
                    <TableHead>Logout Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => {
                    const duration = session.logoutTime
                      ? Math.floor((session.logoutTime.getTime() - session.loginTime.getTime()) / (1000 * 60))
                      : Math.floor((new Date().getTime() - session.loginTime.getTime()) / (1000 * 60))

                    return (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">{session.machineName}</TableCell>
                        <TableCell>{formatDateTime(session.loginTime)}</TableCell>
                        <TableCell>{session.logoutTime ? formatDateTime(session.logoutTime) : "-"}</TableCell>
                        <TableCell>{formatTime(duration)}</TableCell>
                        <TableCell>${session.totalSales.toFixed(2)}</TableCell>
                        <TableCell>{session.transactionCount}</TableCell>
                        <TableCell>
                          <Badge variant={session.status === "active" ? "default" : "secondary"}>
                            {session.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Break Sessions */}
          {sessions.some((s) => s.breakSessions.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Break Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sessions.map((session) =>
                    session.breakSessions.map((breakSession: any) => (
                      <div
                        key={breakSession.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Coffee className="w-4 h-4 text-orange-600" />
                          <div>
                            <p className="font-medium capitalize">{breakSession.type}</p>
                            <p className="text-sm text-gray-600">
                              {formatDateTime(breakSession.startTime)} - {formatDateTime(breakSession.endTime)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">{formatTime(breakSession.duration)}</Badge>
                      </div>
                    )),
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
