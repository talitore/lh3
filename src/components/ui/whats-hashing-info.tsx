"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Info, Users, MapPin, Clock, Shirt, Car, Heart } from "lucide-react"

interface WhatsHashingInfoProps {
  trigger?: React.ReactNode
  size?: 'sm' | 'default' | 'lg'
}

export function WhatsHashingInfo({ trigger, size = 'default' }: WhatsHashingInfoProps) {
  const defaultTrigger = (
    <Button variant="outline" size={size} className="flex items-center space-x-2">
      <Info className="h-4 w-4" />
      <span>What's Hashing?</span>
    </Button>
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span>What's Hashing?</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Welcome to Hash House Harriers!</CardTitle>
              <CardDescription>
                A drinking club with a running problem since 1938
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Hash House Harriers (HHH or H3) is an international group of non-competitive running social clubs. 
                We follow trails through urban and country terrain, marked by one or more "hares" who lay the trail 
                with flour, chalk, or paper. The "pack" follows, trying to stay together regardless of fitness level.
              </p>
            </CardContent>
          </Card>

          {/* What to Expect */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2" />
                What to Expect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <h4 className="font-medium">The Trail</h4>
                    <p className="text-sm text-muted-foreground">
                      Follow flour marks through 3-5 miles of terrain. Look for checks, false trails, 
                      and other markings that keep the pack together.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <h4 className="font-medium">Timing</h4>
                    <p className="text-sm text-muted-foreground">
                      Runs typically last 45-90 minutes, followed by the "Circle" for announcements, 
                      songs, and socializing. Total event time is usually 2-3 hours.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Heart className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <h4 className="font-medium">Community</h4>
                    <p className="text-sm text-muted-foreground">
                      Meet people from all walks of life. Hash is about inclusion, friendship, 
                      and having fun together regardless of running ability.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What to Bring */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Shirt className="h-5 w-5 mr-2" />
                What to Bring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Essential Items</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Running shoes (trail shoes recommended)</li>
                    <li>• Comfortable running clothes</li>
                    <li>• Water bottle</li>
                    <li>• $5-10 for hash cash (covers beer/snacks)</li>
                    <li>• Positive attitude!</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Optional Items</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Whistle (for safety)</li>
                    <li>• Headlamp (for evening runs)</li>
                    <li>• Change of clothes</li>
                    <li>• Towel</li>
                    <li>• Sense of humor</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hash Terminology */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hash Terminology</CardTitle>
              <CardDescription>Common terms you'll hear</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-1">Hare</Badge>
                    <p className="text-sm text-muted-foreground">The person who sets the trail</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-1">Pack</Badge>
                    <p className="text-sm text-muted-foreground">The group of runners following the trail</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-1">Check</Badge>
                    <p className="text-sm text-muted-foreground">A marking where you must search for the continuing trail</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-1">On-On</Badge>
                    <p className="text-sm text-muted-foreground">Call when you find the trail; also means "let's go!"</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-1">Circle</Badge>
                    <p className="text-sm text-muted-foreground">Post-run gathering for announcements and socializing</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-1">Hash Cash</Badge>
                    <p className="text-sm text-muted-foreground">Small fee to cover beer, snacks, and hash expenses</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* First Timer Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Car className="h-5 w-5 mr-2" />
                First Timer Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900">Arrive Early</h4>
                  <p className="text-sm text-blue-700">
                    Get there 15-20 minutes before start time to meet people and get oriented.
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900">Stay with the Pack</h4>
                  <p className="text-sm text-green-700">
                    Don't worry about being fast. The trail is designed to keep everyone together.
                  </p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-900">Ask Questions</h4>
                  <p className="text-sm text-purple-700">
                    Hashers love helping newcomers. Don't hesitate to ask about markings or traditions.
                  </p>
                </div>
                
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-medium text-orange-900">Have Fun!</h4>
                  <p className="text-sm text-orange-700">
                    Hash is about community and fun, not competition. Enjoy the experience!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Questions?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Still have questions? Feel free to reach out to any of our members or check out our social media. 
                We're always happy to help newcomers feel welcome!
              </p>
              <div className="flex space-x-2">
                <Badge variant="secondary">Beginner Friendly</Badge>
                <Badge variant="secondary">All Fitness Levels</Badge>
                <Badge variant="secondary">Social Focus</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
