import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckSquare, Plus, Calendar, AlertTriangle, User } from 'lucide-react';
import { toast } from 'sonner';
import { Priority } from '@/lib/types';

interface ActionItem {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: Priority;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  clientName?: string;
  createdAt: Date;
  completedAt?: Date;
}

export function ActionItems() {
  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: '1',
      title: 'Schedule emergency call with Acme Corp',
      description: 'Client expressing frustration with delayed feature rollout',
      dueDate: new Date(Date.now() + 86400000), // Tomorrow
      priority: 'high',
      status: 'pending',
      assignedTo: 'John Doe',
      clientName: 'Acme Corp',
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
      id: '2',
      title: 'Prepare updated timeline for Q4 launch',
      description: 'Include buffer time and key milestones',
      dueDate: new Date(Date.now() + 172800000), // 2 days
      priority: 'high',
      status: 'in-progress',
      assignedTo: 'John Doe',
      clientName: 'Acme Corp',
      createdAt: new Date(Date.now() - 7200000), // 2 hours ago
    },
    {
      id: '3',
      title: 'Follow up on onboarding feedback',
      description: 'Check if TechStart needs additional training resources',
      dueDate: new Date(Date.now() + 259200000), // 3 days
      priority: 'medium',
      status: 'pending',
      assignedTo: 'John Doe',
      clientName: 'TechStart Inc',
      createdAt: new Date(Date.now() - 10800000), // 3 hours ago
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as Priority,
    assignedTo: '',
    clientName: '',
  });

  const handleStatusChange = (id: string, newStatus: ActionItem['status']) => {
    setActionItems(prev => prev.map(item => 
      item.id === id 
        ? { 
            ...item, 
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date() : undefined
          }
        : item
    ));
    toast.success(`Action item ${newStatus === 'completed' ? 'completed' : 'updated'}`);
  };

  const handleCreateAction = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title for the action item');
      return;
    }

    const newAction: ActionItem = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description || undefined,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      priority: formData.priority,
      status: 'pending',
      assignedTo: formData.assignedTo || 'John Doe',
      clientName: formData.clientName || undefined,
      createdAt: new Date(),
    };

    setActionItems(prev => [newAction, ...prev]);
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      assignedTo: '',
      clientName: '',
    });
    setIsDialogOpen(false);
    toast.success('Action item created successfully');
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const isOverdue = (dueDate: Date) => {
    return new Date() > dueDate;
  };

  const formatDueDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays === -1) return '1 day overdue';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    return `Due in ${diffDays} days`;
  };

  const pendingCount = actionItems.filter(item => item.status === 'pending').length;
  const overdueCount = actionItems.filter(item => 
    item.dueDate && isOverdue(item.dueDate) && item.status !== 'completed'
  ).length;

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <CheckSquare className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-white">Action Items</CardTitle>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                {pendingCount} pending
              </Badge>
              {overdueCount > 0 && (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  {overdueCount} overdue
                </Badge>
              )}
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Action
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md mx-4">
              <DialogHeader>
                <DialogTitle>Create New Action Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    placeholder="What needs to be done?"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Additional details..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600 text-white resize-none"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select 
                      value={formData.priority} 
                      onValueChange={(value: Priority) => setFormData(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="low" className="text-white">Low</SelectItem>
                        <SelectItem value="medium" className="text-white">Medium</SelectItem>
                        <SelectItem value="high" className="text-white">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Assigned To</Label>
                    <Input
                      placeholder="John Doe"
                      value={formData.assignedTo}
                      onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Client</Label>
                    <Input
                      placeholder="Client name..."
                      value={formData.clientName}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleCreateAction}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    Create Action
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>
          Track and manage action items with due dates and priorities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actionItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckSquare className="h-12 w-12 text-slate-600 mb-4" />
              <div className="text-slate-400 mb-2">No action items yet</div>
              <div className="text-sm text-slate-500">
                Create action items to track your tasks and deadlines
              </div>
            </div>
          ) : (
            actionItems.map((item) => (
              <div
                key={item.id}
                className={`p-3 sm:p-4 rounded-lg border transition-colors ${
                  item.status === 'completed' 
                    ? 'bg-green-500/5 border-green-500/20' 
                    : item.dueDate && isOverdue(item.dueDate)
                    ? 'bg-red-500/5 border-red-500/20'
                    : 'bg-slate-800/20 border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Checkbox
                      checked={item.status === 'completed'}
                      onCheckedChange={(checked) => 
                        handleStatusChange(item.id, checked ? 'completed' : 'pending')
                      }
                      className="mt-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium mb-1 ${
                        item.status === 'completed' 
                          ? 'text-slate-400 line-through' 
                          : 'text-white'
                      }`}>
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-sm text-slate-400 mb-2 line-clamp-2">{item.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        {item.clientName && (
                          <div className="flex items-center gap-1 text-slate-500">
                            <User className="h-3 w-3" />
                            <span className="truncate">{item.clientName}</span>
                          </div>
                        )}
                        {item.dueDate && (
                          <div className={`flex items-center gap-1 ${
                            isOverdue(item.dueDate) && item.status !== 'completed'
                              ? 'text-red-400' 
                              : 'text-slate-500'
                          }`}>
                            {isOverdue(item.dueDate) && item.status !== 'completed' ? (
                              <AlertTriangle className="h-3 w-3" />
                            ) : (
                              <Calendar className="h-3 w-3" />
                            )}
                            <span className="whitespace-nowrap">{formatDueDate(item.dueDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                    <Badge className={getPriorityColor(item.priority)} variant="outline">
                      {item.priority}
                    </Badge>
                    <Select 
                      value={item.status} 
                      onValueChange={(value: ActionItem['status']) => handleStatusChange(item.id, value)}
                    >
                      <SelectTrigger className="w-28 sm:w-32 bg-slate-700/50 border-slate-600 text-white h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="pending" className="text-white">Pending</SelectItem>
                        <SelectItem value="in-progress" className="text-white">In Progress</SelectItem>
                        <SelectItem value="completed" className="text-white">Completed</SelectItem>
                        <SelectItem value="cancelled" className="text-white">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 