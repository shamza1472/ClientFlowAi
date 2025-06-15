import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Calendar, Phone, FileText, Activity, Clock, ExternalLink } from 'lucide-react';
import { Client, Conversation } from '@/lib/types';
import { getPriorityColor, getSentimentColor } from '@/lib/data-utils';

interface ClientInteractionTimelineProps {
  client: Client;
  conversations: Conversation[];
}

export function ClientInteractionTimeline({ client, conversations }: ClientInteractionTimelineProps) {
  // Sort conversations by date (newest first)
  const sortedConversations = [...conversations].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Generate mock activities for demonstration
  const mockActivities = [
    {
      id: 1,
      type: 'call',
      title: 'Follow-up Call',
      description: 'Discussed Q4 feature roadmap and pricing',
      date: '2024-01-15',
      icon: Phone,
      color: 'text-blue-400'
    },
    {
      id: 2,
      type: 'meeting',
      title: 'Product Demo',
      description: 'Showcased new analytics dashboard features',
      date: '2024-01-10',
      icon: Activity,
      color: 'text-green-400'
    },
    {
      id: 3,
      type: 'note',
      title: 'Internal Note',
      description: 'Client expressed interest in enterprise features',
      date: '2024-01-05',
      icon: FileText,
      color: 'text-yellow-400'
    }
  ];

  // Combine conversations and activities into a single timeline
  const timelineItems = [
    ...sortedConversations.map(conv => ({
      id: `conv-${conv.id}`,
      type: 'conversation',
      title: conv.subject,
      description: conv.preview,
      date: conv.timestamp,
      data: conv,
      icon: MessageSquare,
      color: 'text-purple-400'
    })),
    ...mockActivities.map(activity => ({
      id: `activity-${activity.id}`,
      type: 'activity',
      title: activity.title,
      description: activity.description,
      date: activity.date,
      data: activity,
      icon: activity.icon,
      color: activity.color
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-400" />
            Interaction Timeline
          </CardTitle>
          <CardDescription>
            Complete history of interactions with {client.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span className="text-slate-300">Conversations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-slate-300">Calls</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-slate-300">Meetings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-slate-300">Notes</span>
              </div>
            </div>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Follow-up
            </Button>
          </div>

          {timelineItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Activity className="h-16 w-16 text-slate-600 mb-4" />
              <div className="text-slate-400 mb-2">No interactions yet</div>
              <div className="text-sm text-slate-500">
                Start a conversation or schedule a meeting to track interactions
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-700"></div>
              
              <div className="space-y-6">
                {timelineItems.map((item, index) => {
                  const Icon = item.icon;
                  const isConversation = item.type === 'conversation';
                  const conversation = isConversation ? item.data as Conversation : null;
                  
                  return (
                    <div key={item.id} className="relative flex items-start gap-4">
                      {/* Timeline dot */}
                      <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-600`}>
                        <Icon className={`h-4 w-4 ${item.color}`} />
                      </div>
                      
                      {/* Timeline content */}
                      <div className="flex-1 min-w-0 pb-6">
                        <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-medium truncate">{item.title}</h3>
                              <p className="text-sm text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-4 shrink-0">
                              {isConversation && conversation && (
                                <>
                                  <Badge className={getPriorityColor(conversation.priority)} variant="outline">
                                    {conversation.priority}
                                  </Badge>
                                  <Badge className={`${getSentimentColor(conversation.sentiment)} border-current`} variant="outline">
                                    {conversation.sentiment}
                                  </Badge>
                                  {conversation.unread && (
                                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-slate-500">
                              <span>{formatDate(item.date)}</span>
                              <span>•</span>
                              <span>{getTimeAgo(item.date)}</span>
                            </div>
                            
                            {isConversation && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-slate-400 hover:text-white p-1"
                                title="Open conversation"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <MessageSquare className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white">{conversations.length}</div>
                <div className="text-xs text-slate-400">Total Conversations</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Phone className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white">3</div>
                <div className="text-xs text-slate-400">Calls This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Activity className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white">2</div>
                <div className="text-xs text-slate-400">Meetings Scheduled</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-400" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white">{client.healthScore.lastActivity}</div>
                <div className="text-xs text-slate-400">Last Contact</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 