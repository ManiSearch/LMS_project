import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Shield, Plus, Trash2, Upload, Download, FileText, Award } from 'lucide-react';

interface DigitalBadge {
  id: string;
  name: string;
  description: string;
  category: 'Achievement' | 'Skill' | 'Completion' | 'Progress' | 'Participation';
  criteria: string;
  backgroundColor: string;
  borderColor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  points: number;
}

interface IssueBadgeDialogProps {
  badge: DigitalBadge;
  onIssue: (data: any) => void;
}

export function IssueBadgeDialog({ badge, onIssue }: IssueBadgeDialogProps) {
  const [issueType, setIssueType] = useState<'individual' | 'bulk'>('individual');
  const [recipients, setRecipients] = useState([{
    name: '',
    email: '',
    studentId: ''
  }]);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [scheduleIssue, setScheduleIssue] = useState(false);
  const [issueDate, setIssueDate] = useState('');

  const addRecipient = () => {
    setRecipients([...recipients, { name: '', email: '', studentId: '' }]);
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const updateRecipient = (index: number, field: string, value: string) => {
    const updated = recipients.map((recipient, i) => 
      i === index ? { ...recipient, [field]: value } : recipient
    );
    setRecipients(updated);
  };

  const handleIssue = () => {
    const issueData = {
      badgeId: badge.id,
      issueType,
      recipients: issueType === 'individual' ? recipients : undefined,
      bulkFile: issueType === 'bulk' ? bulkFile : undefined,
      customMessage,
      scheduleIssue,
      issueDate: scheduleIssue ? issueDate : new Date().toISOString(),
      criteria: badge.criteria
    };
    onIssue(issueData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: badge.backgroundColor, borderColor: badge.borderColor, borderWidth: '3px' }}
        >
          <Shield className="h-8 w-8" style={{ color: badge.borderColor }} />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{badge.name}</h3>
          <p className="text-sm text-muted-foreground">{badge.description}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{badge.category}</Badge>
            <Badge variant="secondary">{badge.level}</Badge>
            <Badge variant="outline">{badge.points} points</Badge>
          </div>
        </div>
      </div>

      <Tabs value={issueType} onValueChange={(value) => setIssueType(value as 'individual' | 'bulk')} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual">Individual Issue</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Issue</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Recipients</Label>
              <Button type="button" variant="outline" size="sm" onClick={addRecipient}>
                <Plus className="h-4 w-4 mr-1" />
                Add Recipient
              </Button>
            </div>
            
            <div className="space-y-3">
              {recipients.map((recipient, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 p-3 border rounded-lg">
                  <Input
                    placeholder="Student Name"
                    value={recipient.name}
                    onChange={(e) => updateRecipient(index, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={recipient.email}
                    onChange={(e) => updateRecipient(index, 'email', e.target.value)}
                  />
                  <Input
                    placeholder="Student ID"
                    value={recipient.studentId}
                    onChange={(e) => updateRecipient(index, 'studentId', e.target.value)}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => removeRecipient(index)}
                    disabled={recipients.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center space-y-4">
              <Upload className="h-12 w-12 mx-auto text-gray-400" />
              <div>
                <h3 className="text-lg font-medium">Upload Recipients List</h3>
                <p className="text-sm text-muted-foreground">
                  Upload CSV or Excel file with student information
                </p>
              </div>
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setBulkFile(e.target.files?.[0] || null)}
                className="max-w-xs mx-auto"
              />
              {bulkFile && (
                <div className="flex items-center justify-center gap-2 p-2 bg-blue-50 rounded-md">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600">{bulkFile.name}</span>
                </div>
              )}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Required Columns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>• Student Name</div>
                <div>• Email Address</div>
                <div>• Student ID</div>
                <div>• Program (optional)</div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Custom Message (Optional)</Label>
          <Textarea
            placeholder="Add a personal message to recipients about earning this badge..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="schedule-issue"
            checked={scheduleIssue}
            onChange={(e) => setScheduleIssue(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="schedule-issue">Schedule for later</Label>
        </div>

        {scheduleIssue && (
          <div className="space-y-2">
            <Label>Issue Date</Label>
            <Input
              type="datetime-local"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Badge Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{badge.criteria}</p>
          <div className="mt-3 text-xs text-amber-600 bg-amber-50 p-2 rounded">
            ⚠️ Ensure recipients meet the badge criteria before issuing
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleIssue}>
          <Award className="h-4 w-4 mr-2" />
          Issue Badge{issueType === 'bulk' ? 's' : ''}
        </Button>
      </div>
    </div>
  );
}
