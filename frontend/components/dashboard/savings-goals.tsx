"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Banknote, Car, Home, Plane } from "lucide-react"

export function SavingsGoals() {
  // Sample data - in a real app, this would come from your data source
  const goals = [
    {
      id: 1,
      name: "Emergency Fund",
      current: 8500,
      target: 10000,
      icon: Banknote,
      color: "#0ea5e9",
    },
    {
      id: 2,
      name: "Vacation",
      current: 2200,
      target: 3000,
      icon: Plane,
      color: "#8b5cf6",
    },
    {
      id: 3,
      name: "New Car",
      current: 5000,
      target: 20000,
      icon: Car,
      color: "#f97316",
    },
    {
      id: 4,
      name: "Down Payment",
      current: 15000,
      target: 60000,
      icon: Home,
      color: "#10b981",
    },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => {
        const progress = Math.round((goal.current / goal.target) * 100)
        return (
          <Card key={goal.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${goal.color}20` }}
                  >
                    <goal.icon className="h-4 w-4" style={{ color: goal.color }} />
                  </div>
                  <span className="font-medium">{goal.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-2 text-sm">
                <span>{formatCurrency(goal.current)}</span>
                <span className="text-muted-foreground">of {formatCurrency(goal.target)}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
