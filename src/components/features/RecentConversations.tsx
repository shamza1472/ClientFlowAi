import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Search, ExternalLink, Calendar, Eye, EyeOff, Plus } from 'lucide-react';
import { useConversations } from '@/lib/store';
import { getPriorityColor, getSentimentColor } from '@/lib/data-utils';
import { ConversationForm } from './ConversationForm';

export function RecentConversations() {
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    conversations, 
    loading, 
    unreadCount, 
    markRead, 
    markUnread,
    deleteConversation 
  } = useConversations();

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv =>
    conv.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleToggleRead = (conversation: any) => {
    if (conversation.unread) {
      markRead(conversation.id);
    } else {
      markUnread(conversation.id);
    }
  };

  const handleDeleteConversation = (id: string) => {
    if (confirm('Are you sure you want to delete this conversation?')) {
      deleteConversation(id);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <MessageSquare className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-white">Recent Conversations</CardTitle>
            {unreadCount > 0 && (
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <ConversationForm />
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50 text-xs sm:text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Schedule Follow-up</span>
              <span className="sm:hidden">Follow-up</span>
            </Button>
          </div>
        </div>
        <CardDescription>
          Track and manage all client communications in one place
          {loading && <span className="text-purple-400"> • Loading...</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-slate-400">Loading conversations...</div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MessageSquare className="h-12 w-12 text-slate-600 mb-4" />
                <div className="text-slate-400 mb-2">No conversations found</div>
                <div className="text-sm text-slate-500">
                  {searchTerm ? 'Try adjusting your search terms' : 'Start a new conversation to get started'}
                </div>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                              <div
                  key={conversation.id}
                  className={`p-3 sm:p-4 rounded-lg border transition-colors hover:bg-slate-700/30 cursor-pointer ${
                    conversation.unread 
                      ? 'bg-slate-700/20 border-slate-600' 
                      : 'bg-slate-800/20 border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className={`text-sm font-medium truncate ${conversation.unread ? 'text-white' : 'text-slate-300'}`}>
                        {conversation.client}
                      </span>
                      {conversation.unread && (
                        <div className="w-2 h-2 bg-purple-400 rounded-full shrink-0"></div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Badge className={`${getPriorityColor(conversation.priority)} text-xs`} variant="outline">
                        {conversation.priority}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-slate-400 hover:text-white p-1"
                        onClick={() => handleToggleRead(conversation)}
                        title={conversation.unread ? 'Mark as read' : 'Mark as unread'}
                      >
                        {conversation.unread ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-slate-400 hover:text-red-400 p-1"
                        onClick={() => handleDeleteConversation(conversation.id)}
                        title="Delete conversation"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <h4 className={`text-sm font-medium mb-1 ${conversation.unread ? 'text-white' : 'text-slate-300'} line-clamp-1`}>
                    {conversation.subject}
                  </h4>
                  
                  <p className="text-sm text-slate-400 mb-2 line-clamp-2">
                    {conversation.preview}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 truncate">{conversation.timestamp}</span>
                    <div className={`${getSentimentColor(conversation.sentiment)} shrink-0 ml-2`}>
                      <span className="hidden sm:inline">{conversation.sentiment} sentiment</span>
                      <span className="sm:hidden">{conversation.sentiment}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}