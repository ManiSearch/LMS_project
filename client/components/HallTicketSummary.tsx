import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, FileText, Download, Users, AlertTriangle } from 'lucide-react';

interface HallTicketSummaryProps {
  totalTickets: number;
  generatedTickets: number;
  downloadedTickets: number;
  eligibleStudents: number;
  totalStudents: number;
}

export const HallTicketSummary: React.FC<HallTicketSummaryProps> = ({
  totalTickets,
  generatedTickets,
  downloadedTickets,
  eligibleStudents,
  totalStudents
}) => {
  const downloadPercentage = generatedTickets > 0 ? Math.round((downloadedTickets / generatedTickets) * 100) : 0;
  const eligibilityPercentage = totalStudents > 0 ? Math.round((eligibleStudents / totalStudents) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Hall Tickets</p>
              <p className="text-3xl font-bold text-blue-900">{totalTickets}</p>
              <p className="text-xs text-gray-500 mt-1">All generated tickets</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Downloads</p>
              <p className="text-3xl font-bold text-green-900">{downloadedTickets}</p>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="text-xs">
                  {downloadPercentage}% of generated
                </Badge>
              </div>
            </div>
            <Download className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Eligible Students</p>
              <p className="text-3xl font-bold text-purple-900">{eligibleStudents}</p>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="text-xs">
                  {eligibilityPercentage}% eligible
                </Badge>
              </div>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Total Students</p>
              <p className="text-3xl font-bold text-orange-900">{totalStudents}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500">
                  {totalStudents - eligibleStudents} not eligible
                </span>
              </div>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HallTicketSummary;
