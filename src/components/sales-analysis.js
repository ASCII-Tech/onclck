"use client"

import { useState, useEffect } from 'react'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-2 rounded-md shadow-md">
        <p className="font-semibold">{`Month: ${label}`}</p>
        <p className="text-primary">{`Sales: ${payload[0].value}`}</p>
        <p className="text-secondary">{`Revenue: $${payload[1].value}`}</p>
      </div>
    );
  }
  return null;
}

export default function SalesAnalysisComponent() {
  const [timeRange, setTimeRange] = useState("6m")
  const [data, setData] = useState({
    monthlyData: [],
    topItems: [],
    summary: {
      total_sales: 0,
      total_revenue: 0,
      active_customers: 0,
      avg_order_value: 0
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics')
        const result = await response.json()
        setData({
          monthlyData: result.monthlyData || [],
          topItems: result.topItems || [],
          summary: {
            total_sales: result.summary?.total_sales || 0,
            total_revenue: result.summary?.total_revenue || 0,
            active_customers: result.summary?.active_customers || 0,
            avg_order_value: result.summary?.avg_order_value || 0
          }
        })
      } catch (error) {
        console.error('Error fetching data:', error)
        // Set default values in case of error
        setData({
          monthlyData: [],
          topItems: [],
          summary: {
            total_sales: 0,
            total_revenue: 0,
            active_customers: 0,
            avg_order_value: 0
          }
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-20">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <h1 className="text-lg font-semibold">Sales Analysis Dashboard</h1>
      </header>
      <main className="flex-1 p-4 lg:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(data.summary?.total_revenue || 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.summary?.total_sales || 0}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.summary?.active_customers || 0}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(data.summary?.avg_order_value || 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Monthly Sales and Revenue</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.monthlyData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line yAxisId="left" type="monotone" dataKey="sales" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(var(--secondary))" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Top Selling Items</CardTitle>
              <CardDescription>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="1m">Last month</SelectItem>
                    <SelectItem value="3m">Last 3 months</SelectItem>
                    <SelectItem value="6m">Last 6 months</SelectItem>
                  </SelectContent>
                </Select>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data.topItems || []).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.sales}</TableCell>
                      <TableCell>${(item.revenue || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}