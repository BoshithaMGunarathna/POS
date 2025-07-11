"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, User, DollarSign, Play, Square } from "lucide-react"

interface Shift {
  id: string
  cashierId: string
  cashierName: string
  startTime: Date
  endTime?: Date | null
  startingCash: number
  expectedCash: number
  totalSales: number
  status: "active" | "ended"
}

interface ShiftManagementProps {
  currentShift: Shift
  onShiftUpdate: (shift: Shift) => void
  onCashReconciliation: () => void
}

export default function ShiftManagement({ currentShift, onShiftUpdate, onCashReconciliation }: ShiftManagementProps) {
  const [isStartShiftOpen, setIsStartShiftOpen] = useState(false)
  const [startingCash, setStartingCash] = useState("200.00")

  const formatShiftDuration = (startTime: Date, endTime?: Date | null) => {
    const end = endTime || new Date()
    const duration = Math.floor((end.getTime() - startTime.getTime()) / (1000 * 60))
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60
    return `${hours}h ${minutes}m`
  }

  const handleStartShift = () => {
    const newShift: Shift = {
      id: `shift-${Date.now()}`,
      cashierId: "cashier-1",
      cashierName: "John Smith",
      startTime: new Date(),
      startingCash: Number.parseFloat(startingCash),
      expectedCash: Number.parseFloat(startingCash),
      totalSales: 0,
      status: "active",
    }
    onShiftUpdate(newShift)
    setIsStartShiftOpen(false)
  }

  const handleEndShift = () => {
    onCashReconciliation()
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <div className="flex items-center gap-2">
          <Badge variant={currentShift.status === "active" ? "default" : "secondary"}>
            {currentShift.status === "active" ? (
              <>
                <Play className="w-3 h-3 mr-1" />
                Active Shift
              </>
            ) : (
              <>
                <Square className="w-3 h-3 mr-1" />
                Shift Ended
              </>
            )}
          </Badge>
        </div>
        <p className="text-xs text-gray-500">{formatShiftDuration(currentShift.startTime, currentShift.endTime)}</p>
      </div>

      {currentShift.status === "active" ? (
        <Button variant="outline" size="sm" onClick={handleEndShift}>
          End Shift
        </Button>
      ) : (
        <Dialog open={isStartShiftOpen} onOpenChange={setIsStartShiftOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Start Shift</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Start New Shift
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-medium">John Smith</p>
                  <p className="text-sm text-gray-600">Cashier ID: cashier-1</p>
                </div>
              </div>

              <div>
                <Label htmlFor="starting-cash">Starting Cash Amount</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="starting-cash"
                    type="number"
                    step="0.01"
                    value={startingCash}
                    onChange={(e) => setStartingCash(e.target.value)}
                    className="pl-10"
                    placeholder="200.00"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter the amount of cash in the drawer at shift start</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsStartShiftOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleStartShift} className="flex-1">
                  Start Shift
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
