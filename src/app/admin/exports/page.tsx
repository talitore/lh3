"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Download,
  FileText,
  Users,
  Calendar,
  DollarSign,
  Award,
  Database,
  Filter,
  Clock
} from "lucide-react"
import { toast } from "sonner"

interface ExportConfig {
  type: string
  format: 'CSV' | 'JSON' | 'PDF'
  dateRange: {
    start: string
    end: string
  }
  filters: {
    includeInactive?: boolean
    runStatus?: 'all' | 'upcoming' | 'completed'
    rsvpStatus?: 'all' | 'yes' | 'maybe' | 'no'
  }
  fields: string[]
}

const exportTypes = [
  {
    id: 'runs',
    name: 'Runs Data',
    description: 'Export run information, dates, locations, and organizers',
    icon: Calendar,
    defaultFields: ['number', 'descriptor', 'dateTime', 'address', 'organizer', 'rsvpCount'],
    availableFields: [
      { id: 'number', label: 'Run Number' },
      { id: 'descriptor', label: 'Description' },
      { id: 'dateTime', label: 'Date & Time' },
      { id: 'address', label: 'Location' },
      { id: 'organizer', label: 'Organizer' },
      { id: 'rsvpCount', label: 'RSVP Count' },
      { id: 'attendanceCount', label: 'Attendance Count' },
      { id: 'introLink', label: 'Intro Link' },
      { id: 'createdAt', label: 'Created Date' }
    ]
  },
  {
    id: 'members',
    name: 'Members Data',
    description: 'Export member profiles, contact info, and activity stats',
    icon: Users,
    defaultFields: ['name', 'email', 'hashName', 'joinDate', 'runCount'],
    availableFields: [
      { id: 'name', label: 'Full Name' },
      { id: 'email', label: 'Email' },
      { id: 'hashName', label: 'Hash Name' },
      { id: 'phone', label: 'Phone Number' },
      { id: 'joinDate', label: 'Join Date' },
      { id: 'runCount', label: 'Total Runs' },
      { id: 'lastRunDate', label: 'Last Run Date' },
      { id: 'role', label: 'Role' },
      { id: 'isActive', label: 'Active Status' }
    ]
  },
  {
    id: 'rsvps',
    name: 'RSVP Data',
    description: 'Export RSVP responses and attendance tracking',
    icon: FileText,
    defaultFields: ['runNumber', 'userName', 'status', 'responseDate'],
    availableFields: [
      { id: 'runNumber', label: 'Run Number' },
      { id: 'runDate', label: 'Run Date' },
      { id: 'userName', label: 'Member Name' },
      { id: 'userEmail', label: 'Member Email' },
      { id: 'status', label: 'RSVP Status' },
      { id: 'responseDate', label: 'Response Date' },
      { id: 'attended', label: 'Actually Attended' },
      { id: 'notes', label: 'Notes' }
    ]
  },
  {
    id: 'attendance',
    name: 'Attendance Data',
    description: 'Export attendance records and statistics',
    icon: Users,
    defaultFields: ['runNumber', 'runDate', 'userName', 'attendanceType'],
    availableFields: [
      { id: 'runNumber', label: 'Run Number' },
      { id: 'runDate', label: 'Run Date' },
      { id: 'userName', label: 'Member Name' },
      { id: 'userEmail', label: 'Member Email' },
      { id: 'attendanceType', label: 'Attendance Type' },
      { id: 'checkInTime', label: 'Check-in Time' },
      { id: 'notes', label: 'Notes' }
    ]
  },
  {
    id: 'hashcash',
    name: 'Hash Cash Data',
    description: 'Export financial transactions and balances',
    icon: DollarSign,
    defaultFields: ['date', 'type', 'amount', 'description', 'runNumber'],
    availableFields: [
      { id: 'date', label: 'Transaction Date' },
      { id: 'type', label: 'Transaction Type' },
      { id: 'amount', label: 'Amount' },
      { id: 'description', label: 'Description' },
      { id: 'runNumber', label: 'Related Run' },
      { id: 'createdBy', label: 'Created By' },
      { id: 'category', label: 'Category' }
    ]
  },
  {
    id: 'achievements',
    name: 'Achievements Data',
    description: 'Export member achievements and awards',
    icon: Award,
    defaultFields: ['userName', 'achievementName', 'awardedDate', 'category'],
    availableFields: [
      { id: 'userName', label: 'Member Name' },
      { id: 'userEmail', label: 'Member Email' },
      { id: 'achievementName', label: 'Achievement Name' },
      { id: 'achievementDescription', label: 'Description' },
      { id: 'category', label: 'Category' },
      { id: 'awardedDate', label: 'Awarded Date' },
      { id: 'awardedBy', label: 'Awarded By' }
    ]
  }
]

export default function DataExports() {
  const [selectedType, setSelectedType] = useState<string>('')
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    type: '',
    format: 'CSV',
    dateRange: {
      start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year ago
      end: new Date().toISOString().split('T')[0] // today
    },
    filters: {
      includeInactive: false,
      runStatus: 'all',
      rsvpStatus: 'all'
    },
    fields: []
  })
  const [exporting, setExporting] = useState(false)

  const handleTypeSelect = (typeId: string) => {
    const type = exportTypes.find(t => t.id === typeId)
    if (type) {
      setSelectedType(typeId)
      setExportConfig(prev => ({
        ...prev,
        type: typeId,
        fields: type.defaultFields
      }))
    }
  }

  const handleFieldToggle = (fieldId: string, checked: boolean) => {
    setExportConfig(prev => ({
      ...prev,
      fields: checked
        ? [...prev.fields, fieldId]
        : prev.fields.filter(f => f !== fieldId)
    }))
  }

  const handleExport = async () => {
    if (!selectedType || exportConfig.fields.length === 0) {
      toast.error('Please select export type and at least one field')
      return
    }

    try {
      setExporting(true)

      const response = await fetch('/api/admin/exports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportConfig),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url

        const timestamp = new Date().toISOString().split('T')[0]
        const filename = `${selectedType}_export_${timestamp}.${exportConfig.format.toLowerCase()}`
        a.download = filename

        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast.success('Export completed successfully')
      } else {
        throw new Error('Export failed')
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export data')
    } finally {
      setExporting(false)
    }
  }

  const selectedTypeData = exportTypes.find(t => t.id === selectedType)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Database className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Data Exports</h1>
        </div>
        <Badge variant="outline" className="text-sm">
          <Clock className="h-3 w-3 mr-1" />
          Last export: Never
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Type Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Data Type</CardTitle>
              <CardDescription>Choose what data you want to export</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {exportTypes.map((type) => {
                const IconComponent = type.icon
                return (
                  <div
                    key={type.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedType === type.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleTypeSelect(type.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">{type.name}</h4>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Export Configuration */}
        <div className="lg:col-span-2">
          {selectedType ? (
            <div className="space-y-6">
              {/* Export Format and Date Range */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Export Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="format">Format</Label>
                      <Select
                        value={exportConfig.format}
                        onValueChange={(value: 'CSV' | 'JSON' | 'PDF') =>
                          setExportConfig(prev => ({ ...prev, format: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CSV">CSV</SelectItem>
                          <SelectItem value="JSON">JSON</SelectItem>
                          <SelectItem value="PDF">PDF</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={exportConfig.dateRange.start}
                        onChange={(e) => setExportConfig(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, start: e.target.value }
                        }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={exportConfig.dateRange.end}
                        onChange={(e) => setExportConfig(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, end: e.target.value }
                        }))}
                      />
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedType === 'runs' && (
                        <div>
                          <Label>Run Status</Label>
                          <Select
                            value={exportConfig.filters.runStatus}
                            onValueChange={(value: string) =>
                              setExportConfig(prev => ({
                                ...prev,
                                filters: { ...prev.filters, runStatus: value as ExportConfig['filters']['runStatus'] }
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Runs</SelectItem>
                              <SelectItem value="upcoming">Upcoming Only</SelectItem>
                              <SelectItem value="completed">Completed Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {selectedType === 'rsvps' && (
                        <div>
                          <Label>RSVP Status</Label>
                          <Select
                            value={exportConfig.filters.rsvpStatus}
                            onValueChange={(value: string) =>
                              setExportConfig(prev => ({
                                ...prev,
                                filters: { ...prev.filters, rsvpStatus: value as ExportConfig['filters']['rsvpStatus'] }
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All RSVPs</SelectItem>
                              <SelectItem value="yes">Yes Only</SelectItem>
                              <SelectItem value="maybe">Maybe Only</SelectItem>
                              <SelectItem value="no">No Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeInactive"
                          checked={exportConfig.filters.includeInactive}
                          onCheckedChange={(checked) =>
                            setExportConfig(prev => ({
                              ...prev,
                              filters: { ...prev.filters, includeInactive: checked as boolean }
                            }))
                          }
                        />
                        <Label htmlFor="includeInactive" className="text-sm">
                          Include inactive records
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Field Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Fields</CardTitle>
                  <CardDescription>Choose which data fields to include in the export</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedTypeData?.availableFields.map((field) => (
                      <div key={field.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={field.id}
                          checked={exportConfig.fields.includes(field.id)}
                          onCheckedChange={(checked) => handleFieldToggle(field.id, checked as boolean)}
                        />
                        <Label htmlFor={field.id} className="text-sm font-normal">
                          {field.label}
                        </Label>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between mt-4 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      {exportConfig.fields.length} of {selectedTypeData?.availableFields.length} fields selected
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExportConfig(prev => ({ ...prev, fields: [] }))}
                      >
                        Clear All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExportConfig(prev => ({
                          ...prev,
                          fields: selectedTypeData?.availableFields.map(f => f.id) || []
                        }))}
                      >
                        Select All
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Export Button */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Ready to Export</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedTypeData?.name} • {exportConfig.format} format • {exportConfig.fields.length} fields
                      </p>
                    </div>
                    <Button
                      onClick={handleExport}
                      disabled={exporting || exportConfig.fields.length === 0}
                      className="min-w-32"
                    >
                      {exporting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Export Data
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12">
                <div className="text-center">
                  <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select Data Type</h3>
                  <p className="text-muted-foreground">
                    Choose a data type from the left panel to configure your export
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
