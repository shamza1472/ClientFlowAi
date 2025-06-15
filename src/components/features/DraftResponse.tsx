import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PenTool, Copy, Send, Plus, Edit, Bookmark, Search } from 'lucide-react';
import { toast } from 'sonner';

// Template interfaces
interface ResponseTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
}

interface TemplateCategory {
  name: string;
  color: string;
  templates: ResponseTemplate[];
}

// Response Template Categories and Templates
const RESPONSE_TEMPLATES: Record<string, TemplateCategory> = {
  onboarding: {
    name: 'Onboarding',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    templates: [
      {
        id: 'welcome-new-client',
        name: 'Welcome New Client',
        subject: 'Welcome to {{companyName}} - Let\'s Get Started!',
        content: `Hi {{clientName}},

Welcome to {{companyName}}! I'm {{userName}}, your dedicated Customer Success Manager, and I'm excited to help you get the most out of our platform.

Over the next few days, I'll be guiding you through:
- Initial setup and configuration
- Key feature walkthrough
- Best practices for your use case
- Success metrics and goals

I've scheduled our kickoff call for {{date}}. Please let me know if this time works for you, or if you'd prefer to reschedule.

Looking forward to working together!

Best regards,
{{userName}}`,
        variables: ['clientName', 'companyName', 'userName', 'date']
      },
      {
        id: 'setup-complete',
        name: 'Setup Complete',
        subject: 'Your {{companyName}} Setup is Complete!',
        content: `Hi {{clientName}},

Great news! Your {{companyName}} setup is now complete and ready to use.

Here's what we've configured:
- {{feature1}}
- {{feature2}}
- {{feature3}}

Next steps:
1. Review the setup in your dashboard
2. Invite your team members
3. Start with your first {{primaryUseCase}}

I'll check in with you next week to see how things are going. Don't hesitate to reach out if you have any questions!

Best,
{{userName}}`,
        variables: ['clientName', 'companyName', 'feature1', 'feature2', 'feature3', 'primaryUseCase', 'userName']
      }
    ]
  },
  support: {
    name: 'Support',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    templates: [
      {
        id: 'issue-acknowledgment',
        name: 'Issue Acknowledgment',
        subject: 'Re: {{issueSubject}} - We\'re On It',
        content: `Hi {{clientName}},

Thank you for reporting this issue. I understand how {{issueType}} can impact your workflow, and I want to assure you we're treating this with high priority.

What I'm doing right now:
- Escalated to our technical team
- Created ticket #{{ticketNumber}}
- Assigned our best engineer to investigate

I'll update you within {{timeframe}} with either a resolution or a detailed status report.

In the meantime, here's a potential workaround: {{workaround}}

Thank you for your patience.

Best regards,
{{userName}}`,
        variables: ['clientName', 'issueSubject', 'issueType', 'ticketNumber', 'timeframe', 'workaround', 'userName']
      },
      {
        id: 'issue-resolved',
        name: 'Issue Resolved',
        subject: 'Resolved: {{issueSubject}}',
        content: `Hi {{clientName}},

Good news! The issue you reported has been resolved.

What we fixed:
{{resolution}}

The fix is now live and you should see the improvement immediately. Please test it out and let me know if everything looks good.

We've also implemented additional monitoring to prevent similar issues in the future.

Thank you for your patience and for helping us improve our service.

Best,
{{userName}}`,
        variables: ['clientName', 'issueSubject', 'resolution', 'userName']
      }
    ]
  },
  escalation: {
    name: 'Escalation',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    templates: [
      {
        id: 'urgent-response',
        name: 'Urgent Response',
        subject: 'URGENT: Addressing Your Concerns - {{issueSubject}}',
        content: `Hi {{clientName}},

I understand your frustration with {{issueDescription}}, and I want to personally apologize for the inconvenience this has caused.

This is unacceptable, and I'm taking immediate action:

1. I've escalated this to our leadership team
2. Our VP of Engineering is personally reviewing the situation
3. I'm scheduling an emergency call for {{callTime}}
4. We'll provide compensation for the disruption

I'm personally committed to resolving this quickly and ensuring it doesn't happen again.

My direct phone: {{phoneNumber}}
My direct email: {{emailAddress}}

I'll be in touch within the next hour with an update.

Sincerely,
{{userName}}`,
        variables: ['clientName', 'issueSubject', 'issueDescription', 'callTime', 'phoneNumber', 'emailAddress', 'userName']
      }
    ]
  },
  followup: {
    name: 'Follow-up',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    templates: [
      {
        id: 'check-in',
        name: 'Regular Check-in',
        subject: 'How are things going with {{companyName}}?',
        content: `Hi {{clientName}},

I wanted to check in and see how things are going with {{companyName}}.

Quick questions:
- How has your experience been so far?
- Are you achieving the goals we set during onboarding?
- Any challenges or questions I can help with?
- What features would you like to explore next?

I'm here to ensure you're getting maximum value from our platform. Would you like to schedule a quick 15-minute call this week?

Best,
{{userName}}`,
        variables: ['clientName', 'companyName', 'userName']
      },
      {
        id: 'renewal-reminder',
        name: 'Renewal Reminder',
        subject: 'Your {{companyName}} Contract Renewal',
        content: `Hi {{clientName}},

I hope you're having a great experience with {{companyName}}! Your contract is coming up for renewal on {{renewalDate}}.

Over the past year, you've achieved:
- {{achievement1}}
- {{achievement2}}
- {{achievement3}}

I'd love to discuss your renewal and explore how we can continue supporting your growth in the coming year.

Are you available for a brief call next week?

Best regards,
{{userName}}`,
        variables: ['clientName', 'companyName', 'renewalDate', 'achievement1', 'achievement2', 'achievement3', 'userName']
      }
    ]
  }
};

export function DraftResponse() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<ResponseTemplate | null>(null);
  const [customizedResponse, setCustomizedResponse] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);

  const handleTemplateSelect = (template: ResponseTemplate) => {
    setSelectedTemplate(template);
    setCustomizedResponse(template.content);
    
    // Initialize variables
    const initialVariables: Record<string, string> = {};
    template.variables.forEach((variable: string) => {
      initialVariables[variable] = '';
    });
    setVariables(initialVariables);
  };

  const handleVariableChange = (variable: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [variable]: value
    }));
    
    // Update the response with variables
    if (selectedTemplate) {
      let updatedResponse = selectedTemplate.content;
      Object.entries({ ...variables, [variable]: value }).forEach(([key, val]) => {
        const placeholder = `{{${key}}}`;
        updatedResponse = updatedResponse.replace(new RegExp(placeholder, 'g'), val || placeholder);
      });
      setCustomizedResponse(updatedResponse);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customizedResponse);
    toast.success('Response copied to clipboard');
  };

  const handleCopySubject = () => {
    if (selectedTemplate?.subject) {
      let updatedSubject = selectedTemplate.subject;
      Object.entries(variables).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        updatedSubject = updatedSubject.replace(new RegExp(placeholder, 'g'), value || placeholder);
      });
      navigator.clipboard.writeText(updatedSubject);
      toast.success('Subject line copied to clipboard');
    }
  };

  // Filter templates based on search
  const filteredCategories = Object.entries(RESPONSE_TEMPLATES).filter(([_, category]) =>
    category.templates.some(template => 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-white">Response Templates</CardTitle>
          </div>
          <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl mx-4">
              <DialogHeader>
                <DialogTitle>Create Custom Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="text-sm text-slate-400">
                  Custom template creation coming soon! For now, you can modify existing templates.
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>
          Choose from professional response templates and customize with your client details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Templates */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
          />
        </div>

        {/* Template Categories */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {filteredCategories.map(([categoryKey, category]) => (
              <Button
                key={categoryKey}
                variant={selectedCategory === categoryKey ? "default" : "outline"}
                onClick={() => setSelectedCategory(selectedCategory === categoryKey ? '' : categoryKey)}
                className={`${selectedCategory === categoryKey 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Bookmark className="h-4 w-4 mr-2" />
                {category.name}
              </Button>
            ))}
          </div>

          {/* Template List */}
          {selectedCategory && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-300">
                {RESPONSE_TEMPLATES[selectedCategory as keyof typeof RESPONSE_TEMPLATES].name} Templates
              </h4>
              <div className="grid gap-2">
                {RESPONSE_TEMPLATES[selectedCategory as keyof typeof RESPONSE_TEMPLATES].templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'bg-purple-500/10 border-purple-500/30'
                        : 'bg-slate-800/20 border-slate-700 hover:bg-slate-700/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-white">{template.name}</h5>
                      <Badge className={RESPONSE_TEMPLATES[selectedCategory as keyof typeof RESPONSE_TEMPLATES].color} variant="outline">
                        {template.variables.length} variables
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2">
                      {template.content.substring(0, 150)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Template Customization */}
        {selectedTemplate && (
          <div className="space-y-4 mt-6 pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-slate-300">Customize Template: {selectedTemplate.name}</h4>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleCopySubject}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Subject
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleCopy}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Response
                </Button>
              </div>
            </div>

            {/* Subject Line Preview */}
            <div className="space-y-2">
              <Label className="text-slate-300">Subject Line</Label>
              <div className="p-3 bg-slate-700/30 border border-slate-600 rounded-lg">
                <p className="text-white text-sm">
                  {selectedTemplate.subject.replace(/\{\{(\w+)\}\}/g, (_match: string, variable: string) => 
                    variables[variable] || `{{${variable}}}`
                  )}
                </p>
              </div>
            </div>

            {/* Variables */}
            {selectedTemplate.variables.length > 0 && (
              <div className="space-y-3">
                <Label className="text-slate-300">Template Variables</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedTemplate.variables.map((variable: string) => (
                    <div key={variable} className="space-y-1">
                      <Label className="text-xs text-slate-400 capitalize">
                        {variable.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <Input
                        placeholder={`Enter ${variable}...`}
                        value={variables[variable] || ''}
                        onChange={(e) => handleVariableChange(variable, e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 h-8 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Response Preview */}
            <div className="space-y-2">
              <Label className="text-slate-300">Response Preview</Label>
              <Textarea
                value={customizedResponse}
                onChange={(e) => setCustomizedResponse(e.target.value)}
                className="min-h-48 bg-slate-700/30 border-slate-600 text-white resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button 
                onClick={handleCopy}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Response
              </Button>
              <Button 
                variant="outline"
                className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
              >
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedCategory && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <PenTool className="h-12 w-12 text-slate-600 mb-4" />
            <div className="text-slate-400 mb-2">Choose a template category to get started</div>
            <div className="text-sm text-slate-500">
              Professional response templates for every customer success scenario
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}