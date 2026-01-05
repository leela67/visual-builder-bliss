import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Crop, RotateCcw, Check, X } from 'lucide-react';

interface ImageCropperProps {
  imageFile: File;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
  aspectRatio?: number; // width/height ratio, default 16:9
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  imageFile,
  onCropComplete,
  onCancel,
  aspectRatio = 16 / 9
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const blobUrlRef = useRef<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
    width: 300,
    height: 300 / aspectRatio
  });
  const [scale, setScale] = useState([1]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Create stable blob URL using useMemo to prevent recreation on re-renders
  const imageUrl = useMemo(() => {
    // Clean up previous blob URL
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    
    // Create new blob URL
    const url = URL.createObjectURL(imageFile);
    blobUrlRef.current = url;
    return url;
  }, [imageFile]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  const handleImageLoad = useCallback(() => {
    const img = imageRef.current;
    if (!img) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to fit the container
    const containerWidth = 400;
    const containerHeight = 300;
    
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    // Calculate image dimensions to fit in canvas while maintaining aspect ratio
    const imgAspectRatio = img.naturalWidth / img.naturalHeight;
    const canvasAspectRatio = containerWidth / containerHeight;

    let drawWidth, drawHeight;
    if (imgAspectRatio > canvasAspectRatio) {
      drawWidth = containerWidth;
      drawHeight = containerWidth / imgAspectRatio;
    } else {
      drawHeight = containerHeight;
      drawWidth = containerHeight * imgAspectRatio;
    }

    // Center the image
    const offsetX = (containerWidth - drawWidth) / 2;
    const offsetY = (containerHeight - drawHeight) / 2;

    // Initialize crop area in the center
    const cropWidth = Math.min(drawWidth * 0.8, 300);
    const cropHeight = cropWidth / aspectRatio;
    
    setCrop({
      x: offsetX + (drawWidth - cropWidth) / 2,
      y: offsetY + (drawHeight - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight
    });

    setImageLoaded(true);
    drawCanvas();
  }, [aspectRatio]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate image dimensions
    const containerWidth = canvas.width;
    const containerHeight = canvas.height;
    const imgAspectRatio = img.naturalWidth / img.naturalHeight;
    const canvasAspectRatio = containerWidth / containerHeight;

    let drawWidth, drawHeight, offsetX, offsetY;
    if (imgAspectRatio > canvasAspectRatio) {
      drawWidth = containerWidth * scale[0];
      drawHeight = (containerWidth / imgAspectRatio) * scale[0];
    } else {
      drawHeight = containerHeight * scale[0];
      drawWidth = (containerHeight * imgAspectRatio) * scale[0];
    }

    offsetX = (containerWidth - drawWidth) / 2;
    offsetY = (containerHeight - drawHeight) / 2;

    // Draw image
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    // Draw crop overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear crop area
    ctx.clearRect(crop.x, crop.y, crop.width, crop.height);
    
    // Redraw image in crop area
    ctx.save();
    ctx.beginPath();
    ctx.rect(crop.x, crop.y, crop.width, crop.height);
    ctx.clip();
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();

    // Draw crop border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);

    // Draw corner handles
    const handleSize = 8;
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(crop.x - handleSize/2, crop.y - handleSize/2, handleSize, handleSize);
    ctx.fillRect(crop.x + crop.width - handleSize/2, crop.y - handleSize/2, handleSize, handleSize);
    ctx.fillRect(crop.x - handleSize/2, crop.y + crop.height - handleSize/2, handleSize, handleSize);
    ctx.fillRect(crop.x + crop.width - handleSize/2, crop.y + crop.height - handleSize/2, handleSize, handleSize);
  }, [crop, scale, imageLoaded]);

  React.useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if click is inside crop area
    if (x >= crop.x && x <= crop.x + crop.width && y >= crop.y && y <= crop.y + crop.height) {
      setIsDragging(true);
      setDragStart({ x: x - crop.x, y: y - crop.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newX = Math.max(0, Math.min(canvas.width - crop.width, x - dragStart.x));
    const newY = Math.max(0, Math.min(canvas.height - crop.height, y - dragStart.y));

    setCrop(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = async () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    // Create a new canvas for the cropped image
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) return;

    // Set the desired output dimensions (consistent across all recipe images)
    const outputWidth = 800;
    const outputHeight = outputWidth / aspectRatio;
    
    cropCanvas.width = outputWidth;
    cropCanvas.height = outputHeight;

    // Calculate the source coordinates on the original image
    const containerWidth = canvas.width;
    const containerHeight = canvas.height;
    const imgAspectRatio = img.naturalWidth / img.naturalHeight;
    const canvasAspectRatio = containerWidth / containerHeight;

    let drawWidth, drawHeight, offsetX, offsetY;
    if (imgAspectRatio > canvasAspectRatio) {
      drawWidth = containerWidth * scale[0];
      drawHeight = (containerWidth / imgAspectRatio) * scale[0];
    } else {
      drawHeight = containerHeight * scale[0];
      drawWidth = (containerHeight * imgAspectRatio) * scale[0];
    }

    offsetX = (containerWidth - drawWidth) / 2;
    offsetY = (containerHeight - drawHeight) / 2;

    // Calculate crop coordinates relative to the original image
    const scaleX = img.naturalWidth / drawWidth;
    const scaleY = img.naturalHeight / drawHeight;
    
    const sourceX = (crop.x - offsetX) * scaleX;
    const sourceY = (crop.y - offsetY) * scaleY;
    const sourceWidth = crop.width * scaleX;
    const sourceHeight = crop.height * scaleY;

    // Draw the cropped portion
    cropCtx.drawImage(
      img,
      Math.max(0, sourceX),
      Math.max(0, sourceY),
      Math.min(sourceWidth, img.naturalWidth - Math.max(0, sourceX)),
      Math.min(sourceHeight, img.naturalHeight - Math.max(0, sourceY)),
      0,
      0,
      outputWidth,
      outputHeight
    );

    // Convert to blob and create file
    cropCanvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], imageFile.name, {
          type: imageFile.type,
          lastModified: Date.now()
        });
        onCropComplete(croppedFile);
      }
    }, imageFile.type, 0.9);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crop className="w-5 h-5" />
          Crop Recipe Image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="border border-border rounded-lg cursor-move"
            style={{ width: '100%', maxWidth: '400px', height: '300px' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Crop preview"
            className="hidden"
            onLoad={handleImageLoad}
          />
        </div>

        <div className="space-y-2">
          <Label>Zoom: {scale[0].toFixed(1)}x</Label>
          <Slider
            value={scale}
            onValueChange={setScale}
            min={0.5}
            max={3}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel} className="gap-2">
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button onClick={handleCrop} className="gap-2">
            <Check className="w-4 h-4" />
            Apply Crop
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageCropper;