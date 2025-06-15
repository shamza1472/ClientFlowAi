import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Save, Copy, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Priority, Sentiment } from '@/lib/types';

// Note Templates
const NOTE_TEMPLATES = {
  'client-call': {
    name: 'Client Call Notes',
    fields: {
      callType: 'Select call type...',
      keyPoints: 'Key discussion points:',
      decisions: 'Decisions made:',
      actionItems: 'Action items:',
      followUp: 'Follow-up required:'
    }
  },
  'issue-report': {
    name: 'Issue Report',
    fields: {
      issueType: 'Select issue type...',
      description: 'Issue description:',
      impact: 'Business impact:',
      actionItems: 'Immediate actions:',
      timeline: 'Expected resolution:'
    }
  },
  'meeting-notes': {
    name: 'Meeting Notes',
    fields: {
      attendees: 'Meeting attendees:',
      agenda: 'Agenda items covered:',
      decisions: 'Key decisions:',
      actionItems: 'Action items assigned:',
      nextSteps: 'Next meeting/steps:'
    }
  },
  'email-followup': {
    name: 'Email Follow-up',
    fields: {
      emailSubject: 'Email subject:',
      summary: 'Email summary:',
      clientConcerns: 'Client concerns:',
      actionItems: 'Required actions:',
      responseBy: 'Response needed by:'
    }
  }
};

export function EmailSummary() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [priority, setPriority] = useState<Priority>('medium');
  const [sentiment, setSentiment] = useState<Sentiment>('neutral');
  const [clientName, setClientName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    // Initialize notes with template fields
    const template = NOTE_TEMPLATES[templateKey as keyof typeof NOTE_TEMPLATES];
    const initialNotes: Record<string, string> = {};
    Object.keys(template.fields).forEach(field => {
      initialNotes[field] = '';
    });
    setNotes(initialNotes);
  };

  const handleNoteChange = (field: string, value: string) => {
    setNotes(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!selectedTemplate || !clientName.trim()) {
      toast.error('Please select a template and enter client name');
      return;
    }

    setIsSaving(true);
    
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Notes saved successfully');
      
      // Reset form
      setSelectedTemplate('');
      setNotes({});
      setClientName('');
      setPriority('medium');
      setSentiment('neutral');
    }, 1000);
  };

  const handleCopyNotes = () => {
    const template = NOTE_TEMPLATES[selectedTemplate as keyof typeof NOTE_TEMPLATES];
    let formattedNotes = `${template.name} - ${clientName}\n`;
    formattedNotes += `Priority: ${priority.toUpperCase()} | Sentiment: ${sentiment.toUpperCase()}\n`;
    formattedNotes += `Date: ${new Date().toLocaleDateString()}\n\n`;
    
    Object.entries(template.fields).forEach(([field, label]) => {
      const value = notes[field] || 'Not specified';
      formattedNotes += `${label}\n${value}\n\n`;
    });

    navigator.clipboard.writeText(formattedNotes);
    toast.success('Notes copied to clipboard');
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'negative': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const currentTemplate = selectedTemplate ? NOTE_TEMPLATES[selectedTemplate as keyof typeof NOTE_TEMPLATES] : null;

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-white">Client Notes</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {selectedTemplate && (
              <>
                <Badge className={getPriorityColor(priority)}>
                  {priority} priority
                </Badge>
                <Badge className={getSentimentColor(sentiment)}>
                  {sentiment}
                </Badge>
              </>
            )}
          </div>
        </div>
        <CardDescription>
          Create structured notes using predefined templates for consistent documentation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Template Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Note Template</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder="Choose a template..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {Object.entries(NOTE_TEMPLATES).map(([key, template]) => (
                  <SelectItem key={key} value={key} className="text-white">
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Client Name</Label>
            <Input
              placeholder="Enter client name..."
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Priority and Sentiment */}
        {selectedTemplate && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Priority Level</Label>
              <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="low" className="text-white">Low Priority</SelectItem>
                  <SelectItem value="medium" className="text-white">Medium Priority</SelectItem>
                  <SelectItem value="high" className="text-white">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Interaction Tone</Label>
              <Select value={sentiment} onValueChange={(value: Sentiment) => setSentiment(value)}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="positive" className="text-white">Positive</SelectItem>
                  <SelectItem value="neutral" className="text-white">Neutral</SelectItem>
                  <SelectItem value="negative" className="text-white">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Dynamic Template Fields */}
        {currentTemplate && (
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-slate-300">{currentTemplate.name}</h4>
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Clock className="h-3 w-3" />
                {new Date().toLocaleDateString()}
              </div>
            </div>
            
            <div className="space-y-4">
              {Object.entries(currentTemplate.fields).map(([field, label]) => {
                const isSelect = field.includes('Type') || field.includes('type');
                
                if (isSelect) {
                  return (
                    <div key={field} className="space-y-2">
                      <Label className="text-slate-300">{label}</Label>
                      <Select value={notes[field] || ''} onValueChange={(value) => handleNoteChange(field, value)}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder={label} />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {field === 'callType' && (
                            <>
                              <SelectItem value="check-in" className="text-white">Regular Check-in</SelectItem>
                              <SelectItem value="support" className="text-white">Support Call</SelectItem>
                              <SelectItem value="escalation" className="text-white">Escalation</SelectItem>
                              <SelectItem value="onboarding" className="text-white">Onboarding</SelectItem>
                            </>
                          )}
                          {field === 'issueType' && (
                            <>
                              <SelectItem value="technical" className="text-white">Technical Issue</SelectItem>
                              <SelectItem value="billing" className="text-white">Billing Issue</SelectItem>
                              <SelectItem value="feature-request" className="text-white">Feature Request</SelectItem>
                              <SelectItem value="performance" className="text-white">Performance Issue</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                }
                
                return (
                  <div key={field} className="space-y-2">
                    <Label className="text-slate-300">{label}</Label>
                    <Textarea
                      placeholder={`Enter ${label.toLowerCase().replace(':', '')}...`}
                      value={notes[field] || ''}
                      onChange={(e) => handleNoteChange(field, e.target.value)}
                      className="min-h-20 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 resize-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {selectedTemplate && (
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSaving ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Notes
                </>
              )}
            </Button>
            <Button 
              variant="outline"
              onClick={handleCopyNotes}
              className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!selectedTemplate && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Plus className="h-12 w-12 text-slate-600 mb-4" />
            <div className="text-slate-400 mb-2">Ready to create structured notes</div>
            <div className="text-sm text-slate-500">
              Select a template above to get started with organized client documentation
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}