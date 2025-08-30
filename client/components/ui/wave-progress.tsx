import React, { useState, useRef } from 'react';
import { CheckCircle, Circle, BookOpen, Trophy, Clock, ChevronLeft, ChevronRight, Calendar, User } from 'lucide-react';
import { Badge } from './badge';
import { Button } from './button';

const WaveProgress = ({ courses, userProgress = {} }) => {
  const [currentView, setCurrentView] = useState(0);
  const scrollContainerRef = useRef(null);
  
  // Extended learning journey with more courses/milestones
  const extendedJourney = [
    // Past completed courses
    {
      id: 'foundation-1',
      title: 'Programming Basics',
      instructor: 'Dr. Sakthi',
      progress: 100,
      status: 'completed',
      startDate: '2023-09-15',
      endDate: '2023-11-30',
      category: 'Foundation',
      level: 'Beginner'
    },
    {
      id: 'foundation-2', 
      title: 'Web Development Intro',
      instructor: 'Prof. Raj',
      progress: 100,
      status: 'completed',
      startDate: '2023-12-01',
      endDate: '2024-01-15',
      category: 'Foundation',
      level: 'Beginner'
    },
    // Current enrolled courses
    ...courses,
    // Future planned courses
    {
      id: 'advanced-1',
      title: 'Full Stack Architecture',
      instructor: 'Dr. Sudha',
      progress: 0,
      status: 'upcoming',
      startDate: '2024-05-01',
      endDate: '2024-07-15',
      category: 'Advanced',
      level: 'Advanced'
    },
    {
      id: 'advanced-2',
      title: 'System Design Patterns',
      instructor: 'Prof. Rohan',
      progress: 0,
      status: 'upcoming',
      startDate: '2024-07-20',
      endDate: '2024-09-30',
      category: 'Advanced',
      level: 'Advanced'
    },
    {
      id: 'specialization-1',
      title: 'Machine Learning Engineering',
      instructor: 'Dr. Latha',
      progress: 0,
      status: 'planned',
      startDate: '2024-10-01',
      endDate: '2024-12-15',
      category: 'Specialization',
      level: 'Expert'
    },
    {
      id: 'capstone',
      title: 'Capstone Project',
      instructor: 'Prof. Kumar',
      progress: 0,
      status: 'planned',
      startDate: '2025-01-01',
      endDate: '2025-03-15',
      category: 'Capstone',
      level: 'Expert'
    }
  ];

  const coursesPerView = 4;
  const totalViews = Math.ceil(extendedJourney.length / coursesPerView);
  const currentCourses = extendedJourney.slice(
    currentView * coursesPerView,
    (currentView + 1) * coursesPerView
  );

  // Create wave path points for current view
  const createWavePath = (courseIndex, total, viewOffset = 0) => {
    const width = 900;
    const height = 220;
    const segmentWidth = width / Math.max(total - 1, 1);
    const amplitude = 45;
    
    const x = courseIndex * segmentWidth + 100;
    const baseY = height / 2;
    
    // Create more dynamic wave with time-based progression
    const timeProgress = (courseIndex + viewOffset) / extendedJourney.length;
    const waveY = Math.sin(timeProgress * Math.PI * 2.5) * amplitude * (0.8 + Math.sin(timeProgress * Math.PI) * 0.2);
    
    return {
      x: Math.min(x, width - 50),
      y: baseY + waveY,
      timeProgress
    };
  };

  const coursePoints = currentCourses.map((course, index) => ({
    ...course,
    position: createWavePath(index, currentCourses.length, currentView * coursesPerView),
    globalIndex: currentView * coursesPerView + index
  }));

  // Generate SVG path for the wave
  const generateWavePath = () => {
    if (coursePoints.length < 2) return '';
    
    let path = `M ${coursePoints[0].position.x} ${coursePoints[0].position.y}`;
    
    for (let i = 1; i < coursePoints.length; i++) {
      const current = coursePoints[i];
      const previous = coursePoints[i - 1];
      
      const controlX1 = previous.position.x + (current.position.x - previous.position.x) * 0.4;
      const controlY1 = previous.position.y + (current.position.y - previous.position.y) * 0.1;
      const controlX2 = current.position.x - (current.position.x - previous.position.x) * 0.4;
      const controlY2 = current.position.y - (current.position.y - previous.position.y) * 0.1;
      
      path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${current.position.x} ${current.position.y}`;
    }
    
    return path;
  };

  const handlePrevious = () => {
    if (currentView > 0) {
      setCurrentView(currentView - 1);
    }
  };

  const handleNext = () => {
    if (currentView < totalViews - 1) {
      setCurrentView(currentView + 1);
    }
  };

  const getStatusColor = (course) => {
    if (course.progress === 100 || course.status === 'completed') return 'completed';
    if (course.progress > 0) return 'current';
    if (course.status === 'upcoming') return 'upcoming';
    return 'planned';
  };

  const getStatusStyles = (status) => {
    const styles = {
      completed: {
        nodeColor: '#10b981',
        glowColor: '#34d399',
        textColor: 'text-green-700',
        bgColor: 'from-green-50 to-emerald-50',
        borderColor: 'border-green-200'
      },
      current: {
        nodeColor: '#3b82f6',
        glowColor: '#60a5fa',
        textColor: 'text-blue-700',
        bgColor: 'from-blue-50 to-indigo-50',
        borderColor: 'border-blue-200'
      },
      upcoming: {
        nodeColor: '#06b6d4',
        glowColor: '#22d3ee',
        textColor: 'text-cyan-700',
        bgColor: 'from-cyan-50 to-teal-50',
        borderColor: 'border-cyan-200'
      },
      planned: {
        nodeColor: '#9ca3af',
        glowColor: '#d1d5db',
        textColor: 'text-gray-700',
        bgColor: 'from-gray-50 to-slate-50',
        borderColor: 'border-gray-200'
      }
    };
    return styles[status] || styles.planned;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="w-full">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full mr-3"></div>
            Your Learning Journey
          </h3>
          <p className="text-gray-600">
            Navigate through your complete learning path from past to future
          </p>
        </div>
        
        {/* Timeline Navigation */}
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            View {currentView + 1} of {totalViews}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentView === 0}
              className="w-10 h-10 p-0 rounded-full hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentView === totalViews - 1}
              className="w-10 h-10 p-0 rounded-full hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Past Courses</span>
          <span>Current Progress</span>
          <span>Future Learning</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 relative">
          <div
            className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${((currentView + 1) / totalViews) * 100}%` 
            }}
          />
          {/* Timeline markers */}
          {Array.from({ length: totalViews }).map((_, index) => (
            <div
              key={index}
              className={`absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white transition-colors duration-200 ${
                index <= currentView 
                  ? 'bg-emerald-500' 
                  : 'bg-gray-300'
              }`}
              style={{ left: `${(index / (totalViews - 1)) * 100}%` }}
            />
          ))}
        </div>
      </div>
      
      {/* Wave Progress Visualization */}
      <div className="relative bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-50 rounded-2xl p-6 mb-6 overflow-hidden min-h-[350px]">
        {/* Animated background waves */}
        <div className="absolute inset-0 opacity-15">
          <svg width="100%" height="100%" viewBox="0 0 1200 300" className="w-full h-full">
            <defs>
              <pattern id="wave-bg-pattern" x="0" y="0" width="120" height="40" patternUnits="userSpaceOnUse">
                <path 
                  d="M0,20 Q30,5 60,20 T120,20" 
                  stroke="#10b981" 
                  strokeWidth="2" 
                  fill="none" 
                  opacity="0.4"
                  className="animate-pulse"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave-bg-pattern)"/>
          </svg>
        </div>
        
        <div 
          ref={scrollContainerRef}
          className="relative transition-all duration-500 ease-in-out"
        >
          <div className="w-full h-[280px] flex items-center">
            <svg
              width="1000"
              height="280"
              viewBox="0 0 1000 280"
              className="w-full h-full"
            >
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="30%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
                </linearGradient>
                
                <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>

                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Background wave path */}
              {coursePoints.length > 1 && (
                <path
                  d={generateWavePath()}
                  stroke="url(#waveGradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="12,6"
                  opacity="0.5"
                />
              )}
              
              {/* Active progress path with animation */}
              {coursePoints.length > 1 && (
                <path
                  d={generateWavePath()}
                  stroke="url(#activeGradient)"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  filter="url(#glow)"
                  className="animate-pulse"
                  style={{
                    strokeDasharray: `${coursePoints.filter(c => c.progress > 0).length * 25}% 100%`,
                    animation: 'dash 3s ease-in-out infinite'
                  }}
                />
              )}
              
              {/* Course nodes */}
              {coursePoints.map((course, index) => {
                const status = getStatusColor(course);
                const styles = getStatusStyles(status);
                const isCurrent = course.progress > 0 && course.progress < 100;
                
                return (
                  <g key={course.id}>
                    {/* Node glow effect */}
                    {(status === 'completed' || isCurrent) && (
                      <circle
                        cx={course.position.x}
                        cy={course.position.y}
                        r="35"
                        fill={styles.glowColor}
                        opacity="0.3"
                        className={isCurrent ? "animate-ping" : "animate-pulse"}
                      />
                    )}
                    
                    {/* Main course node */}
                    <circle
                      cx={course.position.x}
                      cy={course.position.y}
                      r="22"
                      fill={styles.nodeColor}
                      stroke="white"
                      strokeWidth="4"
                      className="transition-all duration-300 hover:r-26"
                      filter="drop-shadow(0 4px 8px rgba(0,0,0,0.15))"
                    />
                    
                    {/* Course title */}
                    <text
                      x={course.position.x}
                      y={course.position.y - 40}
                      textAnchor="middle"
                      className="text-sm font-bold fill-gray-800"
                      style={{ fontSize: '13px' }}
                    >
                      {course.title.length > 18 ? course.title.substring(0, 18) + '...' : course.title}
                    </text>
                    
                    {/* Instructor name */}
                    <text
                      x={course.position.x}
                      y={course.position.y - 25}
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                      style={{ fontSize: '10px' }}
                    >
                      {course.instructor}
                    </text>
                    
                    {/* Progress/Status */}
                    <text
                      x={course.position.x}
                      y={course.position.y + 45}
                      textAnchor="middle"
                      className={`text-xs font-medium ${styles.textColor.replace('text-', 'fill-')}`}
                      style={{ fontSize: '11px' }}
                    >
                      {course.progress > 0 ? `${course.progress}%` : course.status}
                    </text>
                    
                    {/* Date range */}
                    <text
                      x={course.position.x}
                      y={course.position.y + 60}
                      textAnchor="middle"
                      className="text-xs fill-gray-500"
                      style={{ fontSize: '9px' }}
                    >
                      {formatDate(course.startDate)} - {formatDate(course.endDate)}
                    </text>
                    
                    {/* Status icon in node */}
                    <g transform={`translate(${course.position.x - 10}, ${course.position.y - 10})`}>
                      {status === 'completed' && (
                        <Trophy className="w-5 h-5 text-white" />
                      )}
                      {status === 'current' && (
                        <BookOpen className="w-5 h-5 text-white" />
                      )}
                      {status === 'upcoming' && (
                        <Clock className="w-5 h-5 text-white" />
                      )}
                      {status === 'planned' && (
                        <Calendar className="w-5 h-5 text-white" />
                      )}
                    </g>
                  </g>
                );
              })}
              
              {/* Floating journey elements */}
              {Array.from({ length: 6 }).map((_, i) => (
                <circle
                  key={i}
                  cx={150 + i * 140}
                  cy={100 + Math.sin(i + currentView) * 25}
                  r="2"
                  fill="url(#waveGradient)"
                  opacity="0.6"
                  className="animate-bounce"
                  style={{
                    animationDelay: `${i * 0.5 + currentView * 0.2}s`,
                    animationDuration: '2.5s'
                  }}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
      
      {/* Course Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {currentCourses.map((course, index) => {
          const status = getStatusColor(course);
          const styles = getStatusStyles(status);
          
          return (
            <div 
              key={course.id}
              className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-r ${styles.bgColor} ${styles.borderColor}`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg text-white`} style={{ backgroundColor: styles.nodeColor }}>
                  {status === 'completed' && <Trophy className="h-4 w-4" />}
                  {status === 'current' && <BookOpen className="h-4 w-4" />}
                  {status === 'upcoming' && <Clock className="h-4 w-4" />}
                  {status === 'planned' && <Calendar className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{course.title}</h4>
                  <p className="text-xs text-gray-600">{course.instructor}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <Badge variant="outline" className={`${styles.textColor} border-current`}>
                    {course.level}
                  </Badge>
                  <span className="text-gray-500">
                    {formatDate(course.startDate)}
                  </span>
                </div>
                
                {course.progress > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          backgroundColor: styles.nodeColor,
                          width: `${course.progress}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
                
                {course.progress === 0 && (
                  <div className="text-center py-2">
                    <span className={`text-xs font-medium ${styles.textColor} capitalize`}>
                      {course.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Journey Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="text-2xl font-bold text-green-700">
            {extendedJourney.filter(c => c.progress === 100 || c.status === 'completed').length}
          </div>
          <div className="text-sm text-green-600 font-medium">Completed</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="text-2xl font-bold text-blue-700">
            {extendedJourney.filter(c => c.progress > 0 && c.progress < 100).length}
          </div>
          <div className="text-sm text-blue-600 font-medium">In Progress</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl border border-cyan-200">
          <div className="text-2xl font-bold text-cyan-700">
            {extendedJourney.filter(c => c.status === 'upcoming').length}
          </div>
          <div className="text-sm text-cyan-600 font-medium">Upcoming</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
          <div className="text-2xl font-bold text-emerald-700">
            {Math.round(extendedJourney.filter(c => c.progress > 0).reduce((acc, c) => acc + c.progress, 0) / extendedJourney.filter(c => c.progress > 0).length) || 0}%
          </div>
          <div className="text-sm text-emerald-600 font-medium">Avg Progress</div>
        </div>
      </div>

      {/* CSS for wave animation */}
      <style>{`
        @keyframes dash {
          0% { stroke-dashoffset: 0; }
          50% { stroke-dashoffset: -20; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

export default WaveProgress;