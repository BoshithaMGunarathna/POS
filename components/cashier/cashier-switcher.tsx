"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Clock, LogIn, Coffee, Users } from "lucide-react"
import { mockDailyCashiers, mockMachines } from "@/lib/mock-data"

interface CashierSwitcherProps {
  currentCashier: any
  currentMachine: any
  onCashierChange: (cashier: any, machine: any) => void
  onBreakStart: (type: string) => void
  onBreakEnd: () => void
  isOnBreak: boolean
}

export default function CashierSwitcher({
  currentCashier,
  currentMachine,
  onCashierChange,
  onBreakStart,
  onBreakEnd,
  isOnBreak,
}: CashierSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCashier, setSelectedCashier] = useState("")
  const [selectedMachine, setSelectedMachine] = useState("")
  const [pin, setPin] = useState("")

  const handleLogin = () => {
    const cashier = mockDailyCashiers.find((c) => c.id === selectedCashier)
    const machine = mockMachines.find((m) => m.id === selectedMachine)

    if (cashier && machine && pin === "1234") {
      // Simple PIN validation
      onCashierChange(cashier, machine)
      setIsOpen(false)
      setPin("")
    }
  }

  const handleBreak = (type: string) => {
    if (isOnBreak) {
      onBreakEnd()
    } else {
      onBreakStart(type)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="flex items-center gap-3">
      {/* Current Cashier Info */}
      <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">{getInitials(currentCashier.name)}</AvatarFallback>
        </Avatar>
        <div className="text-sm">
          <p className="font-medium">{currentCashier.name}</p>
          <p className="text-gray-500 text-xs">{currentMachine.name}</p>
        </div>
        {isOnBreak && (
          <Badge variant="secondary" className="text-xs">
            <Coffee className="w-3 h-3 mr-1" />
            On Break
          </Badge>
        )}
      </div>

      {/* Break Controls */}
      <div className="flex gap-2">
        <Button
          variant={isOnBreak ? "default" : "outline"}
          size="sm"
          onClick={() => handleBreak("lunch")}
          className="text-xs"
        >
          <Coffee className="w-3 h-3 mr-1" />
          {isOnBreak ? "End Break" : "Lunch"}
        </Button>

        <Button
          variant={isOnBreak ? "default" : "outline"}
          size="sm"
          onClick={() => handleBreak("break")}
          className="text-xs"
        >
          <Clock className="w-3 h-3 mr-1" />
          {isOnBreak ? "End Break" : "Break"}
        </Button>
      </div>

      {/* Switch Cashier */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Users className="w-4 h-4 mr-2" />
            Switch
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Switch Cashier
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Current Session Info */}
            <Card className="bg-blue-50">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Current Session</p>
                    <p className="text-xs text-gray-600">
                      {currentCashier.name} on {currentMachine.name}
                    </p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Cashier Selection */}
            <div>
              <Label htmlFor="cashier">Select Cashier</Label>
              <Select value={selectedCashier} onValueChange={setSelectedCashier}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose cashier" />
                </SelectTrigger>
                <SelectContent>
                  {mockDailyCashiers.map((cashier) => (
                    <SelectItem key={cashier.id} value={cashier.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{getInitials(cashier.name)}</AvatarFallback>
                        </Avatar>
                        <span>{cashier.name}</span>
                        <Badge variant="outline" className="text-xs ml-auto">
                          {cashier.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Machine Selection */}
            <div>
              <Label htmlFor="machine">Select Machine</Label>
              <Select value={selectedMachine} onValueChange={setSelectedMachine}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose machine" />
                </SelectTrigger>
                <SelectContent>
                  {mockMachines.map((machine) => (
                    <SelectItem key={machine.id} value={machine.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{machine.name}</span>
                        <span className="text-xs text-gray-500">{machine.location}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* PIN Entry */}
            <div>
              <Label htmlFor="pin">Enter PIN</Label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter 4-digit PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={4}
              />
              <p className="text-xs text-gray-500 mt-1">Use PIN: 1234 for demo</p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleLogin}
                disabled={!selectedCashier || !selectedMachine || pin !== "1234"}
                className="flex-1"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Switch
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
