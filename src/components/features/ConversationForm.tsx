import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { generateId } from '@/lib/data-utils';
import type { Conversation, Priority, Sentiment } from '@/lib/types';
import { toast } from 'sonner';

interface ConversationFormProps {
  trigger?: React.ReactNode;
}

export function ConversationForm({ trigger }: ConversationFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    subject: '',
    content: '',
    priority: 'medium' as Priority,
    sentiment: 'neutral' as Sentiment,
  });

  const addConversation = useAppStore(state => state.addConversation);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client || !formData.subject || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const now = new Date();
      const conversation: Conversation = {
        id: generateId(),
        clientId: generateId(),
        client: formData.client,
        subject: formData.subject,
        preview: formData.content.substring(0, 100) + (formData.content.length > 100 ? '...' : ''),
        fullContent: formData.content,
        timestamp: 'Just now',
        createdAt: now,
        updatedAt: now,
        priority: formData.priority,
        sentiment: formData.sentiment,
        unread: true,
        tags: [],
      };

      addConversation(conversation);
      
      setFormData({
        client: '',
        subject: '',
        content: '',
        priority: 'medium',
        sentiment: 'neutral',
      });
      
      setOpen(false);
      toast.success('Conversation added successfully!');
    } catch (error) {
      toast.error('Failed to add conversation');
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50">
      <Plus className="h-4 w-4 mr-2" />
      New Conversation
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Conversation</DialogTitle>
          <DialogDescription className="text-slate-400">
            Import an email or create a new conversation entry
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client/Company *</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                placeholder="Acme Corp"
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value: Priority) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Q4 Feature Request"
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sentiment">Sentiment</Label>
              <Select value={formData.sentiment} onValueChange={(value: Sentiment) => setFormData(prev => ({ ...prev, sentiment: value }))}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select sentiment" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Email Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Paste the full email content here..."
              className="min-h-32 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? 'Adding...' : 'Add Conversation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 