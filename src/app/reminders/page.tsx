
'use client';

import React, { useState } from 'react';
import { Bell, Clock, Save, Trash2, PlusCircle, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

interface Reminder {
  id: string;
  name: string;
  time: string;
  days: Day[];
  enabled: boolean;
  notes?: string;
}

const allDays: Day[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function RemindersPage() {
  const { toast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', name: 'Breakfast Analysis', time: '09:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], enabled: true, notes: 'Analyze my breakfast to start the day right!' },
    { id: '2', name: 'Lunchtime Check-in', time: '13:00', days: allDays, enabled: true },
    { id: '3', name: 'Post-Workout Shake', time: '18:30', days: ['Mon', 'Wed', 'Fri'], enabled: true, notes: '1 scoop of whey protein.' },
    { id: '4', name: 'Dinner Reminder', time: '20:00', days: allDays, enabled: false },
    { id: '5', name: 'Vitamin D Supplement', time: '09:05', days: allDays, enabled: true, notes: 'Take with breakfast.'},
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  const handleSaveReminder = (reminderData: Omit<Reminder, 'id' | 'enabled'> & { id?: string }) => {
    if (editingReminder) {
      // Update existing reminder
      setReminders(reminders.map(r => r.id === editingReminder.id ? { ...editingReminder, ...reminderData } : r));
      toast({ title: 'Reminder Updated!', description: `Your "${reminderData.name}" reminder has been saved.` });
    } else {
      // Add new reminder
      const newReminder: Reminder = {
        id: new Date().getTime().toString(),
        ...reminderData,
        enabled: true,
      };
      setReminders([...reminders, newReminder]);
      toast({ title: 'Reminder Created!', description: `"${reminderData.name}" has been added.` });
    }
    closeModal();
  };
  
  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
    toast({ title: 'Reminder Deleted', variant: 'destructive' });
  }

  const handleToggle = (id: Reminder['id'], enabled: boolean) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, enabled } : r));
  };

  const openModal = (reminder?: Reminder) => {
    setEditingReminder(reminder || null);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReminder(null);
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline flex items-center justify-center gap-3">
            <Bell className="h-10 w-10"/>
            Nutrition Reminders
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Stay on track by setting custom reminders for meals, supplements, and more.
        </p>
      </div>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Reminders</CardTitle>
              <CardDescription>Manage your personalized nutrition alerts.</CardDescription>
            </div>
            <DialogTrigger asChild>
                <Button onClick={() => openModal()}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Reminder
                </Button>
            </DialogTrigger>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reminders.map(reminder => (
              <Card key={reminder.id} className={`transition-all ${reminder.enabled ? 'opacity-100' : 'opacity-60 bg-muted/50'}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle>{reminder.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Clock className="h-4 w-4"/> {reminder.time}
                      </CardDescription>
                    </div>
                     <Switch
                        checked={reminder.enabled}
                        onCheckedChange={checked => handleToggle(reminder.id, checked)}
                        aria-label={`Enable ${reminder.name} reminder`}
                      />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {allDays.map(day => (
                      <Badge key={day} variant={reminder.days.includes(day) ? 'default' : 'outline'}>
                        {day}
                      </Badge>
                    ))}
                  </div>
                  {reminder.notes && <p className="text-sm text-muted-foreground p-3 bg-background rounded-md">{reminder.notes}</p>}
                   <div className="flex gap-2 pt-4">
                     <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => openModal(reminder)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                     </DialogTrigger>
                     <Button variant="destructive" size="sm" onClick={() => handleDeleteReminder(reminder.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                     </Button>
                   </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
        <ReminderForm
            onSubmit={handleSaveReminder}
            reminder={editingReminder}
            onClose={closeModal}
        />
      </Dialog>
    </div>
  );
}

// ReminderForm Component
interface ReminderFormProps {
    onSubmit: (data: Omit<Reminder, 'id' | 'enabled'>) => void;
    reminder: Reminder | null;
    onClose: () => void;
}

function ReminderForm({ onSubmit, reminder, onClose }: ReminderFormProps) {
    const [name, setName] = useState(reminder?.name || '');
    const [time, setTime] = useState(reminder?.time || '12:00');
    const [days, setDays] = useState<Day[]>(reminder?.days || []);
    const [notes, setNotes] = useState(reminder?.notes || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        onSubmit({ name, time, days, notes });
    };

    const toggleDay = (day: Day) => {
        setDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{reminder ? 'Edit Reminder' : 'Create New Reminder'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Reminder Name</Label>
                    <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Morning Supplements" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" type="time" value={time} onChange={e => setTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Repeat on</Label>
                    <div className="flex flex-wrap gap-2">
                        {allDays.map(day => (
                            <Button
                                key={day}
                                type="button"
                                variant={days.includes(day) ? 'default' : 'outline'}
                                onClick={() => toggleDay(day)}
                                className="flex-1"
                            >
                                {day}
                            </Button>
                        ))}
                    </div>
                     <div className="flex gap-2">
                        <Button type="button" variant="link" size="sm" onClick={() => setDays(allDays)}>All Days</Button>
                        <Button type="button" variant="link" size="sm" onClick={() => setDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])}>Weekdays</Button>
                        <Button type="button" variant="link" size="sm" onClick={() => setDays([])}>Clear</Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g., Take with a glass of water" />
                </div>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit"><Save className="mr-2 h-4 w-4" />{reminder ? 'Save Changes' : 'Create Reminder'}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}

    