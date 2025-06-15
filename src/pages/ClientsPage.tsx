import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, Search, Plus, Edit, Activity, Calendar, MessageSquare, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useClients, useConversations } from '@/lib/store';
import { Client } from '@/lib/types';
import { ClientProfileForm } from '@/components/features/ClientProfileForm';
import { ClientInteractionTimeline } from '@/components/features/ClientInteractionTimeline';

interface ClientsPageProps {
  onBack: () => void;
}

export function ClientsPage({ onBack }: ClientsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { clients, loading } = useClients();
  const { conversations } = useConversations();

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHealthScoreIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="h-4 w-4" />;
    if (score >= 60) return <Minus className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  const getClientConversations = (clientName: string) => {
    return conversations.filter(conv => conv.client === clientName);
  };

  if (selectedClient) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="w-full h-full">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedClient(null)}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Clients
            </Button>
            <h1 className="text-2xl font-bold text-white">{selectedClient.name}</h1>
            <Badge className={`${getHealthScoreColor(selectedClient.healthScore.score)} border-current`} variant="outline">
              {getHealthScoreIcon(selectedClient.healthScore.score)}
              <span className="ml-1">{selectedClient.healthScore.score}% Health</span>
            </Badge>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-slate-800/50 border-slate-700">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="interactions">Interactions</TabsTrigger>
              <TabsTrigger value="health">Health Score</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ClientProfileForm client={selectedClient} />
            </TabsContent>

            <TabsContent value="interactions">
              <ClientInteractionTimeline client={selectedClient} conversations={getClientConversations(selectedClient.name)} />
            </TabsContent>

            <TabsContent value="health">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-400" />
                    Health Score Management
                  </CardTitle>
                  <CardDescription>
                    Manually track and update client health metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-slate-300">Health Score</div>
                      <div className={`text-2xl font-bold ${getHealthScoreColor(selectedClient.healthScore.score)}`}>
                        {selectedClient.healthScore.score}%
                      </div>
                      <div className="text-xs text-slate-400">Status: {selectedClient.healthScore.status}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-slate-300">Trend</div>
                      <div className="flex items-center gap-2">
                        {selectedClient.healthScore.trend === 'up' ? (
                          <TrendingUp className="h-5 w-5 text-green-400" />
                        ) : selectedClient.healthScore.trend === 'down' ? (
                          <TrendingDown className="h-5 w-5 text-red-400" />
                        ) : (
                          <Minus className="h-5 w-5 text-yellow-400" />
                        )}
                        <span className="text-lg font-semibold text-white capitalize">{selectedClient.healthScore.trend}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-slate-300">Issues</div>
                      <div className="text-xl font-semibold text-white">
                        {selectedClient.healthScore.issues}
                      </div>
                      <div className="text-xs text-slate-400">Open issues</div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div>
                      <div className="text-sm font-medium text-slate-300 mb-2">Last Activity</div>
                      <div className="text-slate-400">{selectedClient.healthScore.lastActivity}</div>
                    </div>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Edit className="h-4 w-4 mr-2" />
                      Update Health Score
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="w-full h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="h-6 w-6 text-purple-400" />
                Client Management
              </h1>
              <p className="text-slate-400">Manage client profiles and track relationships</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search clients by name, company, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-400">Loading clients...</div>
          </div>
        ) : filteredClients.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-16 w-16 text-slate-600 mb-4" />
              <div className="text-slate-400 mb-2">No clients found</div>
              <div className="text-sm text-slate-500">
                {searchTerm ? 'Try adjusting your search terms' : 'Add your first client to get started'}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClients.map((client) => {
              const clientConversations = getClientConversations(client.name);
              const unreadCount = clientConversations.filter(conv => conv.unread).length;
              
              return (
                <Card
                  key={client.id}
                  className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedClient(client)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-white text-lg truncate">{client.name}</CardTitle>
                        <CardDescription className="truncate">{client.company}</CardDescription>
                      </div>
                      <Badge 
                        className={`${getHealthScoreColor(client.healthScore.score)} border-current shrink-0 ml-2`} 
                        variant="outline"
                      >
                        {getHealthScoreIcon(client.healthScore.score)}
                        <span className="ml-1">{client.healthScore.score}%</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Email:</span>
                        <span className="text-slate-300 truncate ml-2">{client.email}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Status:</span>
                        <span className="text-slate-300 capitalize">{client.healthScore.status}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Last Activity:</span>
                        <span className="text-slate-300">{client.healthScore.lastActivity}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-400">Conversations:</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300">{clientConversations.length}</span>
                          {unreadCount > 0 && (
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                              {unreadCount} new
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="pt-2">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="h-3 w-3" />
                          <span>Member since {new Date(client.createdAt).getFullYear()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {showForm && (
          <ClientProfileForm onClose={() => setShowForm(false)} />
        )}
      </div>
    </div>
  );
} 