import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Building, Mail, Phone, Calendar, FileText, Save, X } from 'lucide-react';
import { Client } from '@/lib/types';
import { useClients } from '@/lib/store';

interface ClientProfileFormProps {
  client?: Client;
  onClose?: () => void;
}

export function ClientProfileForm({ client, onClose }: ClientProfileFormProps) {
  const { addClient, updateClient } = useClients();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: client?.email || '',
    company: client?.company || '',
    phone: client?.contactInfo.phone || '',
    address: client?.contactInfo.address || '',
    website: client?.contactInfo.website || '',
    notes: client?.notes || '',
    contractValue: client?.contractInfo.value?.toString() || '',
    contractEnd: client?.contractInfo.endDate?.toISOString().split('T')[0] || '',
    contractStart: client?.contractInfo.startDate?.toISOString().split('T')[0] || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (client) {
        // Update existing client
        await updateClient(client.id, {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          contactInfo: {
            phone: formData.phone,
            address: formData.address,
            website: formData.website
          },
          contractInfo: {
            ...client.contractInfo,
            value: formData.contractValue ? parseFloat(formData.contractValue) : undefined,
            startDate: formData.contractStart ? new Date(formData.contractStart) : undefined,
            endDate: formData.contractEnd ? new Date(formData.contractEnd) : undefined
          },
          notes: formData.notes,
          updatedAt: new Date()
        });
      } else {
        // Create new client
        await addClient({
          id: `client-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          company: formData.company,
          contactInfo: {
            phone: formData.phone,
            address: formData.address,
            website: formData.website
          },
          contractInfo: {
            value: formData.contractValue ? parseFloat(formData.contractValue) : undefined,
            startDate: formData.contractStart ? new Date(formData.contractStart) : undefined,
            endDate: formData.contractEnd ? new Date(formData.contractEnd) : undefined
          },
          healthScore: {
            score: 75,
            trend: 'stable',
            status: 'good',
            lastActivity: 'Never',
            issues: 0,
            lastUpdated: new Date()
          },
          notes: formData.notes,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      if (onClose) onClose();
    } catch (error) {
      console.error('Failed to save client:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300 flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="John Smith"
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="john@company.com"
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-slate-300 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Company *
            </Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              placeholder="Acme Corporation"
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-slate-300">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              placeholder="https://company.com"
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-300 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+1 (555) 123-4567"
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-slate-300">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="123 Main St, City, State 12345"
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contractValue" className="text-slate-300">Contract Value</Label>
            <Input
              id="contractValue"
              value={formData.contractValue}
              onChange={(e) => setFormData(prev => ({ ...prev, contractValue: e.target.value }))}
              placeholder="50000"
              type="number"
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contractStart" className="text-slate-300 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Contract Start Date
            </Label>
            <Input
              id="contractStart"
              type="date"
              value={formData.contractStart}
              onChange={(e) => setFormData(prev => ({ ...prev, contractStart: e.target.value }))}
              className="bg-slate-700/50 border-slate-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contractEnd" className="text-slate-300 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Contract End Date
            </Label>
            <Input
              id="contractEnd"
              type="date"
              value={formData.contractEnd}
              onChange={(e) => setFormData(prev => ({ ...prev, contractEnd: e.target.value }))}
              className="bg-slate-700/50 border-slate-600 text-white"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-slate-300 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Notes
        </Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes about this client..."
          rows={4}
          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {onClose && (
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : client ? 'Update Client' : 'Create Client'}
        </Button>
      </div>
    </form>
  );

  if (onClose) {
    return (
      <Dialog open={true} onOpenChange={() => onClose()}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-400" />
              {client ? 'Edit Client Profile' : 'Add New Client'}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {client ? 'Update client information and contact details' : 'Enter client information and contact details'}
            </DialogDescription>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <User className="h-5 w-5 text-purple-400" />
          Client Profile
        </CardTitle>
        <CardDescription>
          Manage client information and contact details
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  );
} 