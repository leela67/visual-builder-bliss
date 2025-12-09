import { useState, useEffect } from 'react';
import { analyzeImageUrl, type ImageAnalysis } from '@/utils/imageDebugger';

interface ImageDebugOverlayProps {
  imageUrl: string | undefined | null;
  recipeName?: string;
  show?: boolean;
}

/**
 * Debug overlay component that shows image analysis information
 * Only visible in development mode
 */
const ImageDebugOverlay = ({ imageUrl, recipeName, show = true }: ImageDebugOverlayProps) => {
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      const result = analyzeImageUrl(imageUrl);
      setAnalysis(result);
    }
  }, [imageUrl]);

  // Only show in development
  if (import.meta.env.PROD || !show || !analysis) {
    return null;
  }

  const getStatusColor = () => {
    if (analysis.isValid) return 'bg-green-500';
    if (analysis.errors.length > 0) return 'bg-red-500';
    if (analysis.warnings.length > 0) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getStatusEmoji = () => {
    if (analysis.isValid) return '✅';
    if (analysis.errors.length > 0) return '❌';
    if (analysis.warnings.length > 0) return '⚠️';
    return '❓';
  };

  return (
    <div className="absolute top-2 right-2 z-50">
      {/* Compact indicator */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`${getStatusColor()} text-white px-2 py-1 rounded text-xs font-mono shadow-lg hover:opacity-90 transition-opacity`}
        title="Click to see image debug info"
      >
        {getStatusEmoji()} IMG
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="absolute top-8 right-0 bg-black bg-opacity-90 text-white p-3 rounded shadow-xl text-xs font-mono w-80 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-sm">Image Debug Info</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          {recipeName && (
            <div className="mb-2 pb-2 border-b border-gray-600">
              <strong>Recipe:</strong> {recipeName}
            </div>
          )}

          <div className="space-y-1">
            <div>
              <strong>Status:</strong>{' '}
              <span className={analysis.isValid ? 'text-green-400' : 'text-red-400'}>
                {analysis.isValid ? 'Valid' : 'Invalid'}
              </span>
            </div>

            <div>
              <strong>Format:</strong> {analysis.format}
            </div>

            {analysis.imageType && (
              <div>
                <strong>Type:</strong> {analysis.imageType}
              </div>
            )}

            <div>
              <strong>Base64:</strong> {analysis.isBase64 ? 'Yes' : 'No'}
            </div>

            <div>
              <strong>Length:</strong> {analysis.length.toLocaleString()} chars
            </div>

            {analysis.preview && (
              <div>
                <strong>Preview:</strong>
                <div className="mt-1 p-2 bg-gray-800 rounded text-xs break-all max-h-20 overflow-y-auto">
                  {analysis.preview}
                </div>
              </div>
            )}

            {analysis.errors.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-600">
                <strong className="text-red-400">Errors:</strong>
                <ul className="list-disc list-inside mt-1 text-red-300">
                  {analysis.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.warnings.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-600">
                <strong className="text-yellow-400">Warnings:</strong>
                <ul className="list-disc list-inside mt-1 text-yellow-300">
                  {analysis.warnings.map((warning, i) => (
                    <li key={i}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-gray-600 text-xs text-gray-400">
            💡 Check browser console for detailed logs
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDebugOverlay;

