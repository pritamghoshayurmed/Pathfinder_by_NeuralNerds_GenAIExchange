import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';

interface LearningSession {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'study' | 'practice' | 'project' | 'review';
  priority: 'high' | 'medium' | 'low';
}

interface LearningSchedulerProps {
  onClose: () => void;
}

const LearningScheduler: React.FC<LearningSchedulerProps> = ({ onClose }) => {
  const [sessions, setSessions] = useState<LearningSession[]>([
    {
      id: '1',
      title: 'Python Fundamentals Review',
      description: 'Review basic Python concepts and data structures',
      date: new Date(),
      startTime: '10:00',
      endTime: '11:30',
      type: 'review',
      priority: 'medium'
    },
    {
      id: '2',
      title: 'Machine Learning Practice',
      description: 'Work on ML algorithms and model building',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      startTime: '14:00',
      endTime: '16:00',
      type: 'practice',
      priority: 'high'
    }
  ]);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    type: 'study' as const,
    priority: 'medium' as const
  });

  const addSession = () => {
    if (!newSession.title.trim()) return;

    const session: LearningSession = {
      id: Date.now().toString(),
      ...newSession
    };

    setSessions(prev => [...prev, session]);
    setNewSession({
      title: '',
      description: '',
      date: new Date(),
      startTime: '09:00',
      endTime: '10:00',
      type: 'study',
      priority: 'medium'
    });
    setIsAddingSession(false);
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'study': return 'bg-blue-100 text-blue-800';
      case 'practice': return 'bg-green-100 text-green-800';
      case 'project': return 'bg-purple-100 text-purple-800';
      case 'review': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
    }
  };

  const getSessionsForDate = (date: Date) => {
    return sessions.filter(session =>
      format(session.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const selectedDateSessions = getSessionsForDate(selectedDate);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Learning Scheduler
              </CardTitle>
              <CardDescription>
                Schedule your learning sessions and track your study time
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isAddingSession} onOpenChange={setIsAddingSession}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Session
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule Learning Session</DialogTitle>
                    <DialogDescription>
                      Create a new learning session in your schedule
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Session Title</label>
                      <Input
                        value={newSession.title}
                        onChange={(e) => setNewSession(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Python Data Structures"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={newSession.description}
                        onChange={(e) => setNewSession(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="What will you work on?"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Type</label>
                        <Select
                          value={newSession.type}
                          onValueChange={(value: any) => setNewSession(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="study">Study</SelectItem>
                            <SelectItem value="practice">Practice</SelectItem>
                            <SelectItem value="project">Project</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Priority</label>
                        <Select
                          value={newSession.priority}
                          onValueChange={(value: any) => setNewSession(prev => ({ ...prev, priority: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Date</label>
                        <Input
                          type="date"
                          value={format(newSession.date, 'yyyy-MM-dd')}
                          onChange={(e) => setNewSession(prev => ({ ...prev, date: new Date(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Start Time</label>
                        <Input
                          type="time"
                          value={newSession.startTime}
                          onChange={(e) => setNewSession(prev => ({ ...prev, startTime: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">End Time</label>
                        <Input
                          type="time"
                          value={newSession.endTime}
                          onChange={(e) => setNewSession(prev => ({ ...prev, endTime: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={addSession} className="flex-1">
                        Schedule Session
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingSession(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Calendar */}
            <div>
              <h3 className="font-medium mb-4">Select Date</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </div>

            {/* Sessions for selected date */}
            <div>
              <h3 className="font-medium mb-4">
                Sessions for {format(selectedDate, 'MMMM dd, yyyy')}
              </h3>
              <div className="space-y-3">
                {selectedDateSessions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No sessions scheduled for this date</p>
                  </div>
                ) : (
                  selectedDateSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{session.title}</h4>
                          <Badge className={getTypeColor(session.type)}>
                            {session.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{session.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {session.startTime} - {session.endTime}
                          </span>
                          <span className={getPriorityColor(session.priority)}>
                            {session.priority} priority
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteSession(session.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningScheduler;