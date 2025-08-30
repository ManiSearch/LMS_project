import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, PenTool, Monitor, Image, Download, FileText, Play, Users, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const DigitalWhiteboardResources = () => {
  const { user } = useAuth();
  const { sessionId } = useParams();
  const navigate = useNavigate();

  // Mock session data for demonstration
  const sessionData = {
    session_plan_id: sessionId || "1",
    session_number: 1,
    topic: "Digital Systems and Their Importance",
    teaching_aids: "PPT, Blackboard, Digital Whiteboard",
    course_title: "Digital Logic Design",
    course_code: "1052233110",
    faculty_name: "Dr. XYZ",
    duration: 2,
  };

  const openWhiteboard = () => {
    // Navigate to full-screen whiteboard page
    navigate(`/academics/digital-whiteboard-fullscreen/${sessionId}?title=${encodeURIComponent("Interactive Drawing Board")}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link to="/academics/session-plans">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Session Plans
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Digital Whiteboard Resources</h1>
                <p className="text-gray-600 mt-1">
                  Session {sessionData.session_number}: {sessionData.topic} • {sessionData.course_title} ({sessionData.course_code})
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Session Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="w-5 h-5 mr-2 text-indigo-600" />
              Session Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Course</p>
                <p className="text-gray-900">{sessionData.course_title}</p>
                <p className="text-sm text-gray-500">{sessionData.course_code}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Faculty</p>
                <p className="text-gray-900">{sessionData.faculty_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Duration</p>
                <p className="text-gray-900">{sessionData.duration} hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Digital Whiteboard Launch */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PenTool className="w-5 h-5 mr-2 text-indigo-600" />
              Digital Whiteboard
            </CardTitle>
            <p className="text-gray-600 text-sm mt-1">
              Interactive drawing board for live explanation and collaboration
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-indigo-50 rounded-full">
                  <PenTool className="w-16 h-16 text-indigo-600" />
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Interactive Drawing Board</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Open the full-screen digital whiteboard for drawing, writing, and visual explanations during your session.
              </p>

              <Button
                onClick={openWhiteboard}
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3"
              >
                <PenTool className="w-5 h-5 mr-2" />
                Launch Whiteboard
              </Button>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <span>✏️ Draw & Write</span>
                </div>
                <div className="flex items-center justify-center">
                  <span>🎨 Multiple Colors</span>
                </div>
                <div className="flex items-center justify-center">
                  <span>💾 Save & Export</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DigitalWhiteboardResources;
