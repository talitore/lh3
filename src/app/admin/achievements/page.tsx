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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Award, 
  Plus, 
  Users,
  Trophy,
  Star,
  Target,
  Crown,
  Medal,
  Search
} from "lucide-react"
import { toast } from "sonner"

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'ATTENDANCE' | 'PARTICIPATION' | 'SPECIAL' | 'MILESTONE'
  criteria: string
  isActive: boolean
  createdAt: string
}

interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  awardedAt: string
  awardedBy: string
  user: {
    id: string
    name: string
    email: string
  }
  achievement: Achievement
}

const achievementIcons = {
  trophy: Trophy,
  star: Star,
  target: Target,
  crown: Crown,
  medal: Medal,
  award: Award
}

const achievementCategories = [
  { value: 'ATTENDANCE', label: 'Attendance', color: 'bg-blue-500' },
  { value: 'PARTICIPATION', label: 'Participation', color: 'bg-green-500' },
  { value: 'SPECIAL', label: 'Special', color: 'bg-purple-500' },
  { value: 'MILESTONE', label: 'Milestone', color: 'bg-yellow-500' }
]

export default function AchievementManagement() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'achievements' | 'awards'>('achievements')
  const [showCreateAchievement, setShowCreateAchievement] = useState(false)
  const [showAwardDialog, setShowAwardDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  
  const [newAchievement, setNewAchievement] = useState({
    name: '',
    description: '',
    icon: 'trophy',
    category: 'ATTENDANCE' as const,
    criteria: ''
  })

  const [awardForm, setAwardForm] = useState({
    achievementId: '',
    userEmail: '',
    notes: ''
  })

  useEffect(() => {
    fetchAchievements()
    fetchUserAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/achievements')
      
      if (response.ok) {
        const data = await response.json()
        setAchievements(data.achievements || [])
      } else {
        // Mock data for development
        setAchievements([
          {
            id: '1',
            name: 'First Timer',
            description: 'Completed your first hash run',
            icon: 'star',
            category: 'MILESTONE',
            criteria: 'Attend 1 run',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Regular Hasher',
            description: 'Attended 10 hash runs',
            icon: 'trophy',
            category: 'ATTENDANCE',
            criteria: 'Attend 10 runs',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Trail Master',
            description: 'Set 5 trails as hare',
            icon: 'crown',
            category: 'PARTICIPATION',
            criteria: 'Set 5 trails',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserAchievements = async () => {
    try {
      const response = await fetch('/api/admin/achievements/awards')
      
      if (response.ok) {
        const data = await response.json()
        setUserAchievements(data.awards || [])
      } else {
        // Mock data
        setUserAchievements([
          {
            id: '1',
            userId: 'user1',
            achievementId: '1',
            awardedAt: new Date().toISOString(),
            awardedBy: 'admin',
            user: {
              id: 'user1',
              name: 'John Doe',
              email: 'john@example.com'
            },
            achievement: {
              id: '1',
              name: 'First Timer',
              description: 'Completed your first hash run',
              icon: 'star',
              category: 'MILESTONE',
              criteria: 'Attend 1 run',
              isActive: true,
              createdAt: new Date().toISOString()
            }
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching user achievements:', error)
    }
  }

  const handleCreateAchievement = async () => {
    if (!newAchievement.name || !newAchievement.description) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('/api/admin/achievements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAchievement),
      })

      if (response.ok) {
        const achievement = await response.json()
        setAchievements(prev => [achievement, ...prev])
        setNewAchievement({
          name: '',
          description: '',
          icon: 'trophy',
          category: 'ATTENDANCE',
          criteria: ''
        })
        setShowCreateAchievement(false)
        toast.success('Achievement created successfully')
      } else {
        throw new Error('Failed to create achievement')
      }
    } catch (error) {
      console.error('Error creating achievement:', error)
      toast.error('Failed to create achievement')
    }
  }

  const handleAwardAchievement = async () => {
    if (!awardForm.achievementId || !awardForm.userEmail) {
      toast.error('Please select an achievement and enter a user email')
      return
    }

    try {
      const response = await fetch('/api/admin/achievements/award', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(awardForm),
      })

      if (response.ok) {
        const award = await response.json()
        setUserAchievements(prev => [award, ...prev])
        setAwardForm({
          achievementId: '',
          userEmail: '',
          notes: ''
        })
        setShowAwardDialog(false)
        toast.success('Achievement awarded successfully')
      } else {
        throw new Error('Failed to award achievement')
      }
    } catch (error) {
      console.error('Error awarding achievement:', error)
      toast.error('Failed to award achievement')
    }
  }

  const getFilteredAchievements = () => {
    let filtered = achievements

    if (searchTerm) {
      filtered = filtered.filter(achievement =>
        achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(achievement => achievement.category === selectedCategory)
    }

    return filtered
  }

  const getIconComponent = (iconName: string) => {
    const IconComponent = achievementIcons[iconName as keyof typeof achievementIcons] || Trophy
    return IconComponent
  }

  const getCategoryColor = (category: string) => {
    const categoryInfo = achievementCategories.find(cat => cat.value === category)
    return categoryInfo?.color || 'bg-gray-500'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Award className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Achievement Management</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowAwardDialog(true)}>
            <Medal className="h-4 w-4 mr-2" />
            Award Achievement
          </Button>
          <Button onClick={() => setShowCreateAchievement(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Achievement
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'achievements' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('achievements')}
        >
          Achievements ({achievements.length})
        </Button>
        <Button
          variant={activeTab === 'awards' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('awards')}
        >
          Awards ({userAchievements.length})
        </Button>
      </div>

      {activeTab === 'achievements' && (
        <>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search achievements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {achievementCategories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredAchievements().map((achievement) => {
              const IconComponent = getIconComponent(achievement.icon)
              return (
                <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${getCategoryColor(achievement.category)}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant={achievement.isActive ? "default" : "secondary"}>
                        {achievement.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Category:</span>
                        <Badge variant="outline">
                          {achievementCategories.find(cat => cat.value === achievement.category)?.label}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Criteria:</span>
                        <span className="font-medium">{achievement.criteria}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {getFilteredAchievements().length === 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm || selectedCategory !== "all" 
                      ? "No achievements match your filters" 
                      : "No achievements created yet"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {activeTab === 'awards' && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Awards</CardTitle>
            <CardDescription>Achievements awarded to members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userAchievements.map((award) => {
                const IconComponent = getIconComponent(award.achievement.icon)
                return (
                  <div key={award.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getCategoryColor(award.achievement.category)}`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{award.achievement.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Awarded to {award.user.name} • {new Date(award.awardedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {achievementCategories.find(cat => cat.value === award.achievement.category)?.label}
                    </Badge>
                  </div>
                )
              })}

              {userAchievements.length === 0 && (
                <div className="text-center py-8">
                  <Medal className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">No achievements awarded yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Achievement Dialog */}
      <Dialog open={showCreateAchievement} onOpenChange={setShowCreateAchievement}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Achievement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Achievement Name</Label>
              <Input
                id="name"
                value={newAchievement.name}
                onChange={(e) => setNewAchievement(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter achievement name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newAchievement.description}
                onChange={(e) => setNewAchievement(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the achievement"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newAchievement.category} 
                  onValueChange={(value: any) => setNewAchievement(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {achievementCategories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="icon">Icon</Label>
                <Select 
                  value={newAchievement.icon} 
                  onValueChange={(value) => setNewAchievement(prev => ({ ...prev, icon: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(achievementIcons).map(icon => (
                      <SelectItem key={icon} value={icon}>
                        {icon.charAt(0).toUpperCase() + icon.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="criteria">Criteria</Label>
              <Input
                id="criteria"
                value={newAchievement.criteria}
                onChange={(e) => setNewAchievement(prev => ({ ...prev, criteria: e.target.value }))}
                placeholder="e.g., Attend 10 runs"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateAchievement(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAchievement}>
                Create Achievement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Award Achievement Dialog */}
      <Dialog open={showAwardDialog} onOpenChange={setShowAwardDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Award Achievement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="achievement">Achievement</Label>
              <Select 
                value={awardForm.achievementId} 
                onValueChange={(value) => setAwardForm(prev => ({ ...prev, achievementId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select achievement" />
                </SelectTrigger>
                <SelectContent>
                  {achievements.filter(a => a.isActive).map(achievement => (
                    <SelectItem key={achievement.id} value={achievement.id}>
                      {achievement.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="userEmail">User Email</Label>
              <Input
                id="userEmail"
                type="email"
                value={awardForm.userEmail}
                onChange={(e) => setAwardForm(prev => ({ ...prev, userEmail: e.target.value }))}
                placeholder="user@example.com"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={awardForm.notes}
                onChange={(e) => setAwardForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about this award"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAwardDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAwardAchievement}>
                Award Achievement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
