import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, RefreshCw } from 'lucide-react';

interface FileReplacementInstructionsProps {
  fileName: string;
  show: boolean;
}

export function FileReplacementInstructions({ fileName, show }: FileReplacementInstructionsProps) {
  if (!show) return null;

  return (
    <Alert className="border-blue-200 bg-blue-50">
      <Download className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <div className="space-y-2">
          <div className="font-medium">File Download Instructions:</div>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Check your Downloads folder for <code className="bg-blue-100 px-1 rounded">{fileName}</code></li>
            <li>Replace <code className="bg-blue-100 px-1 rounded">public/{fileName}</code> with the downloaded file</li>
            <li>Refresh this page to see your changes</li>
          </ol>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <RefreshCw className="h-3 w-3" />
            <span>This follows the same pattern as Entity Setup for consistency</span>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
