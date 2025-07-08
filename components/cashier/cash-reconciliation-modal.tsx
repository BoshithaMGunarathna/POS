"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, AlertTriangle, CheckCircle } from "lucide-react"

interface Shift {
  id: string
  cashierId: string
  cashierName: string
  startTime: Date
  startingCash: number
  expectedCash: number
  totalSales: number
}

interface CashReconciliationModalProps {
  isOpen: boolean
  onClose: () => void
  shift: Shift
  onReconciliationComplete: (data: any) => void
}

export default function CashReconciliationModal({
  isOpen,
  onClose,
  shift,
  onReconciliationComplete,
}: CashReconciliationModalProps) {
  const [cashCounts, setCashCounts] = useState({
    hundreds: 0,
    fifties: 0,
    twenties: 0,
    tens: 0,
    fives: 0,
    ones: 0,
    quarters: 0,
    dimes: 0,
    nickels: 0,
    pennies: 0,
  })

  const denominations = [
    { key: "hundreds", label: "$100 Bills", value: 100 },
    { key: "fifties", label: "$50 Bills", value: 50 },
    { key: "twenties", label: "$20 Bills", value: 20 },
    { key: "tens", label: "$10 Bills", value: 10 },
    { key: "fives", label: "$5 Bills", value: 5 },
    { key: "ones", label: "$1 Bills", value: 1 },
    { key: "quarters", label: "Quarters", value: 0.25 },
    { key: "dimes", label: "Dimes", value: 0.1 },
    { key: "nickels", label: "Nickels", value: 0.05 },
    { key: "pennies", label: "Pennies", value: 0.01 },
  ]

  const actualCashTotal = denominations.reduce((total, denom) => {
    return total + cashCounts[denom.key as keyof typeof cashCounts] * denom.value
  }, 0)

  const difference = actualCashTotal - shift.expectedCash
  const isBalanced = Math.abs(difference) < 0.01

  const handleCountChange = (key: string, value: string) => {
    setCashCounts((prev) => ({
      ...prev,
      [key]: Number.parseInt(value) || 0,
    }))
  }

  const handleComplete = () => {
    const reconciliationData = {
      shiftId: shift.id,
      expectedCash: shift.expectedCash,
      actualCash: actualCashTotal,
      difference,
      cashCounts,
      reconciliationTime: new Date(),
      isBalanced,
    }
    onReconciliationComplete(reconciliationData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Cash Reconciliation - End of Shift
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cash Count Input */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Count Cash Drawer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {denominations.map((denom) => (
                    <div key={denom.key} className="space-y-2">
                      <Label htmlFor={denom.key} className="text-sm font-medium">
                        {denom.label}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id={denom.key}
                          type="number"
                          min="0"
                          value={cashCounts[denom.key as keyof typeof cashCounts]}
                          onChange={(e) => handleCountChange(denom.key, e.target.value)}
                          className="text-center"
                          placeholder="0"
                        />
                        <span className="text-sm text-gray-500 min-w-[60px]">
                          = ${(cashCounts[denom.key as keyof typeof cashCounts] * denom.value).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shift Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Cashier:</span>
                  <span className="font-medium">{shift.cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Start Time:</span>
                  <span className="font-medium">{shift.startTime.toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Starting Cash:</span>
                  <span className="font-medium">${shift.startingCash.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Sales:</span>
                  <span className="font-medium">${shift.totalSales.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reconciliation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Expected Cash:</span>
                  <span className="font-medium">${shift.expectedCash.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Actual Cash:</span>
                  <span className="font-medium">${actualCashTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="font-medium">Difference:</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${difference >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {difference >= 0 ? "+" : ""}${difference.toFixed(2)}
                    </span>
                    {isBalanced ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>

                <Badge variant={isBalanced ? "default" : "destructive"} className="w-full justify-center">
                  {isBalanced ? "Balanced" : "Discrepancy Found"}
                </Badge>
              </CardContent>
            </Card>

            <Button onClick={handleComplete} className="w-full" size="lg" disabled={actualCashTotal === 0}>
              Complete Reconciliation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
