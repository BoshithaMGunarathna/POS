"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Monitor, Clock, DollarSign, ShoppingCart, Coffee, Calendar } from "lucide-react"
import { mockDailyCashiers, mockCashierSessions, mockMachines } from "@/lib/mock-data"

export default function DailyOperationsReport() {
  const totalSales = mockDailyCashiers.reduce((sum, cashier) => sum + cashier.totalSales, 0)
  const totalTransactions = mockDailyCashiers.reduce((sum, cashier) => sum + cashier.transactionCount, 0)
  const totalHours = mockDailyCashiers.reduce((sum, cashier) => sum + cashier.hoursWorked, 0)
  const activeCashiers = mockDailyCashiers.filter((c) => c.status === "active").length

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

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

  const getMachineUsage = () => {
    return mockMachines.map((machine) => {
      const sessions = mockCashierSessions.filter((s) => s.machineId === machine.id)
      const totalSales = sessions.reduce((sum, s) => sum + s.totalSales, 0)
      const totalTransactions = sessions.reduce((sum, s) => sum + s.transactionCount, 0)
      const activeSessions = sessions.filter((s) => s.status === "active").length

      return {
        ...machine,
        totalSales,
        totalTransactions,
        activeSessions,
        sessionCount: sessions.length,
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Daily Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Across all cashiers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">Total processed today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cashiers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCashiers}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">Staff hours today</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="cashiers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cashiers">Cashier Performance</TabsTrigger>
          <TabsTrigger value="machines">Machine Usage</TabsTrigger>
          <TabsTrigger value="sessions">Detailed Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="cashiers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Cashier Performance Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cashier</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Hours Worked</TableHead>
                    <TableHead>Break Time</TableHead>
                    <TableHead>Machines Used</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDailyCashiers.map((cashier) => (
                    <TableRow key={cashier.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">{getInitials(cashier.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{cashier.name}</p>
                            <p className="text-sm text-gray-500">{cashier.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${cashier.totalSales.toFixed(2)}</TableCell>
                      <TableCell>{cashier.transactionCount}</TableCell>
                      <TableCell>{cashier.hoursWorked.toFixed(1)}h</TableCell>
                      <TableCell>{formatTime(cashier.breakTime)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {cashier.machines.map((machine, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {machine}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            cashier.status === "active"
                              ? "default"
                              : cashier.status === "not_started"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {cashier.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="machines">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Machine Usage Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getMachineUsage().map((machine) => (
                  <Card key={machine.id}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{machine.name}</h3>
                          <Badge variant={machine.activeSessions > 0 ? "default" : "secondary"}>
                            {machine.activeSessions > 0 ? "Active" : "Idle"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{machine.location}</p>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Sales:</span>
                            <span className="font-medium">${machine.totalSales.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Transactions:</span>
                            <span className="font-medium">{machine.totalTransactions}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Sessions:</span>
                            <span className="font-medium">{machine.sessionCount}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Detailed Session Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cashier</TableHead>
                    <TableHead>Machine</TableHead>
                    <TableHead>Login Time</TableHead>
                    <TableHead>Logout Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Breaks</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCashierSessions.map((session) => {
                    const duration = session.logoutTime
                      ? Math.floor((session.logoutTime.getTime() - session.loginTime.getTime()) / (1000 * 60))
                      : Math.floor((new Date().getTime() - session.loginTime.getTime()) / (1000 * 60))

                    const totalBreakTime = session.breakSessions.reduce((total: number, breakSession: any) => {
                      return total + breakSession.duration
                    }, 0)

                    return (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">{getInitials(session.cashierName)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{session.cashierName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{session.machineName}</TableCell>
                        <TableCell>{formatDateTime(session.loginTime)}</TableCell>
                        <TableCell>{session.logoutTime ? formatDateTime(session.logoutTime) : "-"}</TableCell>
                        <TableCell>{formatTime(duration)}</TableCell>
                        <TableCell>${session.totalSales.toFixed(2)}</TableCell>
                        <TableCell>{session.transactionCount}</TableCell>
                        <TableCell>
                          {totalBreakTime > 0 ? (
                            <div className="flex items-center gap-1">
                              <Coffee className="w-3 h-3 text-orange-600" />
                              <span className="text-xs">{formatTime(totalBreakTime)}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">None</span>
                          )}
                        </TableCell>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
