"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
  DollarSign,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Receipt,
  Download
} from "lucide-react"
import { toast } from "sonner"

interface HashCashTransaction {
  id: string
  type: 'COLLECTION' | 'EXPENSE' | 'ADJUSTMENT'
  amount: number
  description: string
  runId?: string
  runNumber?: number
  userId?: string
  userName?: string
  createdAt: string
  createdBy: {
    id: string
    name: string
  }
}

interface HashCashSummary {
  totalBalance: number
  totalCollected: number
  totalExpenses: number
  thisMonthCollected: number
  thisMonthExpenses: number
  averagePerRun: number
}

export default function HashCashManagement() {
  const [transactions, setTransactions] = useState<HashCashTransaction[]>([])
  const [summary, setSummary] = useState<HashCashSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [newTransaction, setNewTransaction] = useState<{
    type: 'COLLECTION' | 'EXPENSE' | 'ADJUSTMENT';
    amount: string;
    description: string;
    runId: string;
  }>({
    type: 'COLLECTION',
    amount: '',
    description: '',
    runId: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchHashCashData()
  }, [])

  const fetchHashCashData = async () => {
    try {
      setLoading(true)

      // Fetch transactions
      const transactionsResponse = await fetch('/api/admin/hash-cash/transactions')
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json()
        setTransactions(transactionsData.transactions || [])
      } else {
        // Mock data for development
        setTransactions([
          {
            id: '1',
            type: 'COLLECTION',
            amount: 150,
            description: 'Hash Cash collected from Run #1234',
            runId: 'run1',
            runNumber: 1234,
            createdAt: new Date().toISOString(),
            createdBy: { id: '1', name: 'Admin User' }
          },
          {
            id: '2',
            type: 'EXPENSE',
            amount: 75,
            description: 'Beer and snacks for post-run circle',
            runId: 'run1',
            runNumber: 1234,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            createdBy: { id: '1', name: 'Admin User' }
          }
        ])
      }

      // Fetch summary
      const summaryResponse = await fetch('/api/admin/hash-cash/summary')
      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json()
        setSummary(summaryData)
      } else {
        // Mock summary data
        setSummary({
          totalBalance: 1250,
          totalCollected: 2500,
          totalExpenses: 1250,
          thisMonthCollected: 450,
          thisMonthExpenses: 200,
          averagePerRun: 15
        })
      }

    } catch (error) {
      console.error('Error fetching hash cash data:', error)
      toast.error('Failed to load hash cash data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTransaction = async () => {
    if (!newTransaction.amount || !newTransaction.description) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch('/api/admin/hash-cash/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: newTransaction.type,
          amount: parseFloat(newTransaction.amount),
          description: newTransaction.description,
          runId: newTransaction.runId || null
        }),
      })

      if (response.ok) {
        const newTransactionData = await response.json()
        setTransactions(prev => [newTransactionData, ...prev])
        setNewTransaction({
          type: 'COLLECTION',
          amount: '',
          description: '',
          runId: ''
        })
        setShowAddTransaction(false)
        toast.success('Transaction added successfully')

        // Refresh summary
        fetchHashCashData()
      } else {
        throw new Error('Failed to add transaction')
      }
    } catch (error) {
      console.error('Error adding transaction:', error)
      toast.error('Failed to add transaction')
    } finally {
      setSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'COLLECTION':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'EXPENSE':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <DollarSign className="h-4 w-4 text-blue-600" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'COLLECTION':
        return 'text-green-600'
      case 'EXPENSE':
        return 'text-red-600'
      default:
        return 'text-blue-600'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <DollarSign className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Hash Cash Management</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddTransaction(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(summary.totalBalance)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-lg font-semibold">
                    <span className="text-green-600">+{formatCurrency(summary.thisMonthCollected)}</span>
                    <span className="text-muted-foreground"> / </span>
                    <span className="text-red-600">-{formatCurrency(summary.thisMonthExpenses)}</span>
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average per Run</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(summary.averagePerRun)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Transaction Form */}
      {showAddTransaction && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Transaction</CardTitle>
            <CardDescription>Record a new hash cash collection or expense</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Transaction Type</Label>
                <Select
                  value={newTransaction.type}
                  onValueChange={(value: 'COLLECTION' | 'EXPENSE' | 'ADJUSTMENT') =>
                    setNewTransaction(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COLLECTION">Collection (+)</SelectItem>
                    <SelectItem value="EXPENSE">Expense (-)</SelectItem>
                    <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the transaction..."
                value={newTransaction.description}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddTransaction(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button onClick={handleAddTransaction} disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Transaction'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>All hash cash collections and expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{formatDate(transaction.createdAt)}</span>
                      {transaction.runNumber && (
                        <>
                          <span>•</span>
                          <span>Run #{transaction.runNumber}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>by {transaction.createdBy.name}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === 'EXPENSE' ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {transaction.type}
                  </Badge>
                </div>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">No transactions recorded yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
