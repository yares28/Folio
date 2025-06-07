"use client"

import React, { useState } from "react"
import { useData } from "@/contexts/data-context"
import { useTheme } from "@/contexts/theme-context"
import { BarChart3, LineChart, PieChart } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line, Bar, Pie } from "react-chartjs-2"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

export default function Charts() {
  const { balanceHistory, assetAllocation, expensesByCategory, incomeVsExpenses, isLoading } = useData()
  const { isDarkMode } = useTheme()
  const [refreshKey, setRefreshKey] = useState(0)

  // Force chart refresh when theme changes
  React.useEffect(() => {
    setRefreshKey((prev) => prev + 1)
  }, [isDarkMode])

  // Theme colors
  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
  const textColor = isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"

  // Chart options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: isDarkMode ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.8)",
        titleColor: isDarkMode ? "#fff" : "#000",
        bodyColor: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
        borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
      y: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          callback: (value: number) => {
            return new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value)
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 2,
        hoverRadius: 4,
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: textColor,
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.8)",
        titleColor: isDarkMode ? "#fff" : "#000",
        bodyColor: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
        borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
      y: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          callback: (value: number) => {
            return new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value)
          },
        },
      },
    },
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: textColor,
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.8)",
        titleColor: isDarkMode ? "#fff" : "#000",
        bodyColor: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
        borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
      },
    },
  }

  // Prepare chart data
  const balanceData = {
    labels: balanceHistory.map((item) => item.date),
    datasets: [
      {
        label: "Balance",
        data: balanceHistory.map((item) => item.balance),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
      },
    ],
  }

  const assetAllocationData = {
    labels: assetAllocation.map((item) => item.type),
    datasets: [
      {
        data: assetAllocation.map((item) => item.value),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(139, 92, 246, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const expensesData = {
    labels: expensesByCategory.map((item) => item.category),
    datasets: [
      {
        label: "Expenses",
        data: expensesByCategory.map((item) => item.amount),
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
    ],
  }

  const incomeExpensesData = {
    labels: incomeVsExpenses.map((item) => item.month),
    datasets: [
      {
        label: "Income",
        data: incomeVsExpenses.map((item) => item.income),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
      {
        label: "Expenses",
        data: incomeVsExpenses.map((item) => item.expenses),
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
    ],
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="chart-card animate-pulse">
            <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-md w-1/3 mb-4"></div>
            <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-md"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">Balance History</h3>
          <LineChart size={20} className="text-neutral-500 dark:text-neutral-400" />
        </div>
        <div className="chart-container">
          <Line key={`line-${refreshKey}`} options={lineOptions} data={balanceData} />
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">Asset Allocation</h3>
          <PieChart size={20} className="text-neutral-500 dark:text-neutral-400" />
        </div>
        <div className="chart-container">
          <Pie key={`pie-${refreshKey}`} options={pieOptions} data={assetAllocationData} />
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">Expenses by Category</h3>
          <BarChart3 size={20} className="text-neutral-500 dark:text-neutral-400" />
        </div>
        <div className="chart-container">
          <Bar key={`bar1-${refreshKey}`} options={barOptions} data={expensesData} />
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">Income vs Expenses</h3>
          <BarChart3 size={20} className="text-neutral-500 dark:text-neutral-400" />
        </div>
        <div className="chart-container">
          <Bar key={`bar2-${refreshKey}`} options={barOptions} data={incomeExpensesData} />
        </div>
      </div>
    </div>
  )
}
