
'use client';

import React, { useState } from 'react';
import { Bell, Clock, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface Reminder {
  id: 'breakfast' | 'lunch' | 'dinner';
  label: string;
  time: string;
  enabled: boolean;
}

export default function RemindersPage() {
  const { toast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: 'breakfast', label: 'Breakfast', time: '09:00', enabled: true },
    { id: 'lunch', label: 'Lunch', time: '13:00', enabled: true },
    { id: 'dinner', label: 'Dinner', time: '20:00', enabled: false },
  ]);

  const handleTimeChange = (id: Reminder['id'], time: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, time } : r));
  };

  const handleToggle = (id: Reminder['id'], enabled: boolean) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, enabled } : r));
  };

  const handleSaveChanges = () => {
    // In a real app, you would save these settings to a user's profile
    console.log('Saving reminders:', reminders);
    toast({
      title: 'Settings Saved!',
      description: 'Your reminder preferences have been updated.',
    });
  };

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline flex items-center justify-center gap-3">
            <Bell className="h-10 w-10"/>
            Meal Reminders
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Stay on track by setting reminders to analyze your meals.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Reminder Settings</CardTitle>
            <CardDescription>
                Set the time you'd like to be reminded for each meal.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {reminders.map(reminder => (
            <div key={reminder.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-4">
                <Clock className="h-6 w-6 text-primary" />
                <div>
                    <Label htmlFor={`${reminder.id}-time`} className="text-lg font-semibold">{reminder.label}</Label>
                    <p className="text-sm text-muted-foreground">
                        {reminder.enabled ? `Reminds at ${reminder.time}` : 'Disabled'}
                    </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Input
                  id={`${reminder.id}-time`}
                  type="time"
                  value={reminder.time}
                  onChange={e => handleTimeChange(reminder.id, e.target.value)}
                  className="w-32"
                  disabled={!reminder.enabled}
                />
                <Switch
                  checked={reminder.enabled}
                  onCheckedChange={checked => handleToggle(reminder.id, checked)}
                  aria-label={`Enable ${reminder.label} reminder`}
                />
              </div>
            </div>
          ))}
           <div className="text-center pt-4">
             <Button size="lg" onClick={handleSaveChanges}>
                <Save className="mr-2 h-5 w-5" />
                Save Changes
             </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
