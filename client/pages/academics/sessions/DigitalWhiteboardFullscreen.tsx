import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Pen, 
  Eraser, 
  Trash2, 
  Download, 
  Undo, 
  Redo, 
  Palette,
  Minus,
  Plus,
  ArrowLeft,
  Home
} from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface DrawingPath {
  points: Point[];
  color: string;
  width: number;
  tool: 'pen' | 'eraser';
}

const DigitalWhiteboardFullscreen = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const whiteboardTitle = searchParams.get('title') || 'Digital Whiteboard';

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentWidth, setCurrentWidth] = useState(3);
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [undoStack, setUndoStack] = useState<DrawingPath[][]>([]);
  const [redoStack, setRedoStack] = useState<DrawingPath[][]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000',
    '#FFC0CB', '#A52A2A', '#808080', '#000080', '#800000'
  ];

  const saveState = useCallback(() => {
    setUndoStack(prev => [...prev, [...paths]]);
    setRedoStack([]);
  }, [paths]);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    saveState();

    const newPath: DrawingPath = {
      points: [{ x, y }],
      color: currentTool === 'eraser' ? '#FFFFFF' : currentColor,
      width: currentTool === 'eraser' ? currentWidth * 2 : currentWidth,
      tool: currentTool
    };

    setPaths(prev => [...prev, newPath]);
  }, [currentTool, currentColor, currentWidth, saveState]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPaths(prev => {
      const newPaths = [...prev];
      const currentPath = newPaths[newPaths.length - 1];
      if (currentPath) {
        currentPath.points.push({ x, y });
      }
      return newPaths;
    });
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with white background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all paths
    paths.forEach(path => {
      if (path.points.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.moveTo(path.points[0].x, path.points[0].y);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      ctx.stroke();
    });
  }, [paths]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;

    const previousState = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, [...paths]]);
    setPaths(previousState);
    setUndoStack(prev => prev.slice(0, -1));
  }, [undoStack, paths]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, [...paths]]);
    setPaths(nextState);
    setRedoStack(prev => prev.slice(0, -1));
  }, [redoStack, paths]);

  const clearCanvas = useCallback(() => {
    saveState();
    setPaths([]);
  }, [saveState]);

  const exportImage = useCallback((format: 'png' | 'jpeg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `whiteboard-${whiteboardTitle.toLowerCase().replace(/\s+/g, '-')}.${format}`;
    link.href = canvas.toDataURL(`image/${format}`);
    link.click();
  }, [whiteboardTitle]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Make canvas full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 120; // Account for toolbar height
    redrawCanvas();
  }, [redrawCanvas]);

  const goBack = () => {
    if (sessionId) {
      navigate(`/academics/digital-whiteboard-resources/${sessionId}`);
    } else {
      navigate('/academics/session-plans');
    }
  };

  const goHome = () => {
    navigate('/academics/session-plans');
  };

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  useEffect(() => {
    const handleResize = () => resizeCanvas();
    window.addEventListener('resize', handleResize);
    resizeCanvas();

    return () => window.removeEventListener('resize', handleResize);
  }, [resizeCanvas]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if (e.key === 'z' && e.shiftKey || e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }
      
      // ESC to go back
      if (e.key === 'Escape') {
        goBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Full-screen header toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={goHome}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Session Plans
          </Button>
          
          <div className="h-6 w-px bg-gray-300" />
          
          <h1 className="text-xl font-semibold text-gray-800">{whiteboardTitle}</h1>
        </div>

        {/* Main toolbar */}
        <div className="flex items-center gap-4">
          {/* Tool Selection */}
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setCurrentTool('pen')}
              className={`p-2 transition-colors ${
                currentTool === 'pen' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
              title="Pen Tool"
            >
              <Pen className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentTool('eraser')}
              className={`p-2 transition-colors ${
                currentTool === 'eraser' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
              title="Eraser Tool"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </div>

          {/* Color Picker */}
          {currentTool === 'pen' && (
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                title="Color Palette"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-gray-600" />
                  <div 
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: currentColor }}
                  />
                </div>
              </button>

              {showColorPicker && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
                  <div className="grid grid-cols-5 gap-1">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          setCurrentColor(color);
                          setShowColorPicker(false);
                        }}
                        className={`w-8 h-8 rounded border-2 transition-all ${
                          currentColor === color 
                            ? 'border-blue-500 scale-110' 
                            : 'border-gray-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Line Width Control */}
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
            <button
              onClick={() => setCurrentWidth(Math.max(1, currentWidth - 1))}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Decrease Width"
            >
              <Minus className="w-3 h-3 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600 min-w-[2rem] text-center">
              {currentWidth}px
            </span>
            <button
              onClick={() => setCurrentWidth(Math.min(20, currentWidth + 1))}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Increase Width"
            >
              <Plus className="w-3 h-3 text-gray-600" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={undoStack.length === 0}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={redo}
              disabled={redoStack.length === 0}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4 text-gray-600" />
            </button>

            <button
              onClick={clearCanvas}
              className="p-2 border border-gray-300 rounded-lg hover:bg-red-100 transition-colors text-red-600"
              title="Clear Canvas"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => exportImage('png')}
                className="px-3 py-2 bg-white text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                title="Export as PNG"
              >
                PNG
              </button>
              <button
                onClick={() => exportImage('jpeg')}
                className="px-3 py-2 bg-white text-gray-600 hover:bg-gray-100 transition-colors text-sm border-l border-gray-300"
                title="Export as JPEG"
              >
                JPEG
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen canvas */}
      <div className="flex-1 relative overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{ 
            cursor: currentTool === 'pen' ? 'crosshair' : 'grab'
          }}
        />
      </div>

      {/* Footer with shortcuts */}
      <div className="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
        <div className="flex justify-center gap-6">
          <span>Ctrl+Z: Undo</span>
          <span>Ctrl+Y: Redo</span>
          <span>ESC: Exit</span>
          <span>Mouse: Draw/Erase</span>
        </div>
      </div>
    </div>
  );
};

export default DigitalWhiteboardFullscreen;
