import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, ZoomIn, ZoomOut, RotateCw, Crop } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  currentImage?: string | null;
  onRemoveImage: () => void;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

const EnhancedImageUpload: React.FC<EnhancedImageUploadProps> = ({
  onImageSelect,
  currentImage,
  onRemoveImage,
  maxSizeMB = 5,
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(currentImage || null);
  const [showViewer, setShowViewer] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const blobUrlRef = useRef<string | null>(null);

  // Cleanup blob URL on unmount or when image changes
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  // Update preview when currentImage prop changes
  useEffect(() => {
    if (currentImage !== imagePreview) {
      setImagePreview(currentImage);
    }
  }, [currentImage]);

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      toast.error(`Invalid file type. Supported formats: ${acceptedFormats.join(', ')}`);
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Clean up previous blob URL
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }

    // Create stable blob URL
    const blobUrl = URL.createObjectURL(file);
    blobUrlRef.current = blobUrl;

    setSelectedFile(file);
    setImagePreview(blobUrl);
    
    // Create data URL for parent component
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onImageSelect(file, dataUrl);
    };
    reader.readAsDataURL(file);

    toast.success('Image uploaded successfully!');
  }, [acceptedFormats, maxSizeMB, onImageSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeImage = () => {
    // Clean up blob URL
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    setSelectedFile(null);
    setImagePreview(null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
    onRemoveImage();
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openViewer = () => {
    setShowViewer(true);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const closeViewer = () => {
    setShowViewer(false);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(5, prev * delta)));
  };

  // Grid layout for multiple images (placeholder for future enhancement)
  const GridPreview = () => (
    <div className="grid grid-cols-3 gap-2 p-4">
      {/* Main image */}
      <div className="col-span-2 row-span-2">
        <div 
          className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          onClick={openViewer}
        >
          <img
            src={imagePreview!}
            alt="Recipe preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
            <ZoomIn className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
      
      {/* Placeholder for additional images */}
      <div className="space-y-2">
        <div className="w-full h-[5.5rem] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
          <Upload className="w-4 h-4 text-gray-400" />
        </div>
        <div className="w-full h-[5.5rem] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
          <Upload className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="space-y-3">
        {imagePreview ? (
          <Card className="overflow-hidden">
            <GridPreview />
            <div className="p-4 border-t flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(1)}MB` : 'Image loaded'}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openViewer}
                  className="gap-2"
                >
                  <ZoomIn className="w-4 h-4" />
                  View
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeImage}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Remove
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card 
            className="border-2 border-dashed border-input hover:border-primary/50 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="p-8 text-center">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Recipe Image</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop an image here, or click to browse
              </p>
              <Button type="button" variant="outline">
                Choose File
              </Button>
            </div>
          </Card>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <p className="text-xs text-muted-foreground">
          Supported formats: JPEG, PNG, WebP, SVG. Maximum size: {maxSizeMB}MB
        </p>
      </div>

      {/* Enhanced Image Viewer Modal */}
      {showViewer && imagePreview && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-black/50">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  className="text-white hover:bg-white/20"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-white text-sm min-w-[4rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 5}
                  className="text-white hover:bg-white/20"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRotate}
                  className="text-white hover:bg-white/20"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeViewer}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Image Container */}
            <div 
              ref={containerRef}
              className="flex-1 overflow-hidden flex items-center justify-center cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              <img
                ref={imageRef}
                src={imagePreview}
                alt="Recipe preview"
                className="max-w-none transition-transform duration-200"
                style={{
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px) rotate(${rotation}deg)`,
                  cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                }}
                draggable={false}
              />
            </div>

            {/* Footer */}
            <div className="p-4 bg-black/50 text-center">
              <p className="text-white/70 text-sm">
                Use mouse wheel to zoom • Click and drag to pan • Click rotate to rotate
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedImageUpload;