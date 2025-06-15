import type { Conversation, Client, ActionItem, ResponseTemplate } from './types';

// ID generation
export const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Date helpers
export const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) return 'Less than an hour ago';
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
};

// Mock data generators for testing
export const generateMockConversations = (): Conversation[] => {
  const now = new Date();
  
  return [
    {
      id: generateId(),
      clientId: 'client-1',
      client: 'Acme Corp',
      subject: 'Q4 Feature Rollout Concerns',
      preview: 'Hi team, I wanted to follow up on our discussion about the feature delays affecting our Q4 launch timeline...',
      fullContent: `Hi ClientFlow Team,

I wanted to follow up on our discussion about the feature delays affecting our Q4 launch timeline. Our engineering team is concerned about the impact on our customer commitments.

Could we schedule a call to discuss:
1. Updated timeline with realistic milestones
2. Compensation for the delays
3. Priority adjustments to ensure Q4 success

We're evaluating alternatives but prefer to work with you on a solution.

Best regards,
John Smith, CTO
Acme Corp`,
      timestamp: '2 hours ago',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      priority: 'high',
      sentiment: 'negative',
      unread: true,
      tags: ['urgent', 'timeline', 'compensation'],
    },
    {
      id: generateId(),
      clientId: 'client-2',
      client: 'TechStart Inc',
      subject: 'Integration Support Request',
      preview: 'We are experiencing some issues with the API integration and need assistance with debugging...',
      fullContent: `Hello Support Team,

We are experiencing some issues with the API integration and need assistance with debugging the authentication flow.

Issue details:
- API calls returning 401 errors
- Token refresh seems to be failing
- Documentation suggests different approach

Can someone help us troubleshoot this week?

Thanks,
Sarah Johnson
Lead Developer, TechStart Inc`,
      timestamp: '5 hours ago',
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      priority: 'medium',
      sentiment: 'neutral',
      unread: true,
      tags: ['support', 'api', 'integration'],
    },
    {
      id: generateId(),
      clientId: 'client-3',
      client: 'Global Systems',
      subject: 'Monthly Check-in',
      preview: 'Hope you are doing well! I wanted to schedule our monthly review to discuss progress and upcoming initiatives...',
      fullContent: `Hi there,

Hope you are doing well! I wanted to schedule our monthly review to discuss progress and upcoming initiatives.

Our team has been very happy with the recent improvements and would like to explore expanding our usage.

Let me know your availability for next week.

Best,
Michael Chen
VP Operations, Global Systems`,
      timestamp: '1 day ago',
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      priority: 'low',
      sentiment: 'positive',
      unread: false,
      tags: ['check-in', 'expansion'],
    },
  ];
};

export const generateMockClients = (): Client[] => {
  const now = new Date();
  
  return [
    {
      id: 'client-1',
      name: 'John Smith',
      email: 'john.smith@acmecorp.com',
      company: 'Acme Corp',
      contactInfo: {
        phone: '+1 (555) 123-4567',
        website: 'https://acmecorp.com',
      },
      healthScore: {
        score: 45,
        trend: 'down',
        status: 'at-risk',
        lastActivity: '2 hours ago',
        issues: 3,
        lastUpdated: now,
      },
      contractInfo: {
        startDate: new Date('2023-01-15'),
        endDate: new Date('2024-01-15'),
        value: 120000,
        renewalDate: new Date('2024-01-15'),
      },
      notes: 'Large enterprise client with complex requirements. Recently expressed concerns about timeline delays.',
      createdAt: new Date('2023-01-15'),
      updatedAt: now,
    },
    {
      id: 'client-2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@techstart.io',
      company: 'TechStart Inc',
      contactInfo: {
        phone: '+1 (555) 987-6543',
        website: 'https://techstart.io',
      },
      healthScore: {
        score: 78,
        trend: 'stable',
        status: 'good',
        lastActivity: '5 hours ago',
        issues: 1,
        lastUpdated: now,
      },
      contractInfo: {
        startDate: new Date('2023-06-01'),
        endDate: new Date('2024-06-01'),
        value: 50000,
      },
      notes: 'Growing startup with strong technical team. Occasional support requests but generally self-sufficient.',
      createdAt: new Date('2023-06-01'),
      updatedAt: now,
    },
    {
      id: 'client-3',
      name: 'Michael Chen',
      email: 'michael.chen@globalsys.com',
      company: 'Global Systems',
      contactInfo: {
        phone: '+1 (555) 456-7890',
        website: 'https://globalsys.com',
      },
      healthScore: {
        score: 92,
        trend: 'up',
        status: 'excellent',
        lastActivity: '1 day ago',
        issues: 0,
        lastUpdated: now,
      },
      contractInfo: {
        startDate: new Date('2022-03-01'),
        endDate: new Date('2025-03-01'),
        value: 300000,
        renewalDate: new Date('2024-12-01'),
      },
      notes: 'Long-term strategic client with excellent relationship. Considering expansion of services.',
      createdAt: new Date('2022-03-01'),
      updatedAt: now,
    },
  ];
};

export const generateMockActionItems = (): ActionItem[] => {
  const now = new Date();
  
  return [
    {
      id: generateId(),
      title: 'Schedule emergency call with Acme Corp',
      description: 'Discuss timeline delays and compensation options',
      dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
      priority: 'high',
      status: 'pending',
      assignedTo: 'CSM Team',
      conversationId: 'conv-1',
      clientId: 'client-1',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      title: 'Provide API integration support to TechStart',
      description: 'Help debug authentication flow issues',
      dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
      priority: 'medium',
      status: 'in-progress',
      assignedTo: 'Support Team',
      conversationId: 'conv-2',
      clientId: 'client-2',
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      title: 'Prepare monthly review for Global Systems',
      description: 'Compile performance metrics and expansion proposals',
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Next week
      priority: 'low',
      status: 'pending',
      assignedTo: 'Account Manager',
      conversationId: 'conv-3',
      clientId: 'client-3',
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    },
  ];
};

export const generateMockResponseTemplates = (): ResponseTemplate[] => {
  const now = new Date();
  
  return [
    {
      id: generateId(),
      name: 'Timeline Delay Acknowledgment',
      category: 'Issue Resolution',
      subject: 'Re: Timeline Concerns - Let\'s Schedule a Call',
      content: `Hi {{clientName}},

Thank you for reaching out about the timeline concerns. I completely understand your frustration, and I want to address this immediately.

I'd like to schedule a call to discuss:
- Revised timeline with realistic milestones
- Compensation options for the delays
- Steps we're taking to prevent future delays

Are you available for a 30-minute call {{timeframe}}?

Best regards,
{{yourName}}`,
      variables: ['clientName', 'timeframe', 'yourName'],
      tags: ['delay', 'timeline', 'urgent'],
      usageCount: 5,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Technical Support Response',
      category: 'Support',
      subject: 'Re: {{originalSubject}} - Support Team Response',
      content: `Hi {{clientName}},

Thanks for reaching out about the technical issue. Our support team is here to help!

I've reviewed your case and {{initialAssessment}}. 

Next steps:
1. {{nextStep1}}
2. {{nextStep2}}
3. I'll follow up with you by {{followUpDate}}

If you need immediate assistance, please don't hesitate to call our support line.

Best,
{{supportAgent}}`,
      variables: ['clientName', 'originalSubject', 'initialAssessment', 'nextStep1', 'nextStep2', 'followUpDate', 'supportAgent'],
      tags: ['support', 'technical', 'troubleshooting'],
      usageCount: 12,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Monthly Check-in Response',
      category: 'Relationship Management',
      subject: 'Re: Monthly Check-in - Looking Forward to Our Discussion',
      content: `Hi {{clientName}},

Great to hear from you! I'm excited to schedule our monthly review.

I have {{availability}} available next week. Please let me know what works best for you.

I'll prepare an update on:
- Recent performance metrics
- Upcoming feature releases
- Expansion opportunities we discussed

Looking forward to our conversation!

Best,
{{accountManager}}`,
      variables: ['clientName', 'availability', 'accountManager'],
      tags: ['check-in', 'relationship', 'monthly'],
      usageCount: 8,
      createdAt: now,
      updatedAt: now,
    },
  ];
};

// Data seeding function
export const seedMockData = () => {
  const conversations = generateMockConversations();
  const clients = generateMockClients();
  const actionItems = generateMockActionItems();
  const templates = generateMockResponseTemplates();
  
  return {
    conversations,
    clients,
    actionItems,
    templates,
  };
};

// Utility functions for data manipulation
export const getHealthStatusColor = (status: string) => {
  switch (status) {
    case 'excellent': return 'text-green-400';
    case 'good': return 'text-blue-400';
    case 'at-risk': return 'text-yellow-400';
    case 'critical': return 'text-red-400';
    default: return 'text-slate-400';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    default: return 'bg-green-500/20 text-green-400 border-green-500/30';
  }
};

export const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive': return 'text-green-400';
    case 'negative': return 'text-red-400';
    default: return 'text-slate-400';
  }
};

// Search and filter utilities
export const searchConversations = (conversations: Conversation[], query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return conversations.filter(conv =>
    conv.client.toLowerCase().includes(lowercaseQuery) ||
    conv.subject.toLowerCase().includes(lowercaseQuery) ||
    conv.preview.toLowerCase().includes(lowercaseQuery) ||
    conv.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const searchClients = (clients: Client[], query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return clients.filter(client =>
    client.name.toLowerCase().includes(lowercaseQuery) ||
    client.company.toLowerCase().includes(lowercaseQuery) ||
    client.email.toLowerCase().includes(lowercaseQuery)
  );
}; 