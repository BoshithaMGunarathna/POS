"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search } from "lucide-react"

const mockCashiers = [
  { id: "1", name: "John Smith", email: "john@example.com", phone: "+1234567890", status: "active", shift: "Morning" },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1234567891",
    status: "active",
    shift: "Evening",
  },
  { id: "3", name: "Mike Davis", email: "mike@example.com", phone: "+1234567892", status: "inactive", shift: "Night" },
]

export default function CashierManagement() {
  const [cashiers, setCashiers] = useState(mockCashiers)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredCashiers = cashiers.filter(
    (cashier) =>
      cashier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cashier.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDeleteCashier = (id: string) => {
    setCashiers((prev) => prev.filter((cashier) => cashier.id !== id))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cashier Management</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Cashier
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Cashier</DialogTitle>
                </DialogHeader>
                <CashierForm onClose={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search cashiers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCashiers.map((cashier) => (
                  <TableRow key={cashier.id}>
                    <TableCell className="font-medium">{cashier.name}</TableCell>
                    <TableCell>{cashier.email}</TableCell>
                    <TableCell>{cashier.phone}</TableCell>
                    <TableCell>{cashier.shift}</TableCell>
                    <TableCell>
                      <Badge variant={cashier.status === "active" ? "default" : "secondary"}>{cashier.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCashier(cashier.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CashierForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="Enter full name" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter email" />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" placeholder="Enter phone number" />
      </div>
      <div>
        <Label htmlFor="shift">Shift</Label>
        <Input id="shift" placeholder="Enter shift (e.g., Morning, Evening)" />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" onClick={onClose}>
          Add Cashier
        </Button>
      </div>
    </form>
  )
}
