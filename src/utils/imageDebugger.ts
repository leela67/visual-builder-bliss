/**
 * Image Debugger Utility
 * Helps diagnose issues with base64-encoded images from the API
 */

export interface ImageAnalysis {
  isValid: boolean;
  format: 'data-uri' | 'http-url' | 'relative-path' | 'unknown' | 'empty';
  imageType?: string; // jpeg, png, svg, etc.
  isBase64: boolean;
  length: number;
  preview: string;
  errors: string[];
  warnings: string[];
}

/**
 * Analyzes an image URL to determine its format and validity
 */
export function analyzeImageUrl(imageUrl: string | undefined | null): ImageAnalysis {
  const analysis: ImageAnalysis = {
    isValid: false,
    format: 'unknown',
    isBase64: false,
    length: 0,
    preview: '',
    errors: [],
    warnings: []
  };

  // Check if image URL exists
  if (!imageUrl) {
    analysis.format = 'empty';
    analysis.errors.push('Image URL is null, undefined, or empty');
    return analysis;
  }

  analysis.length = imageUrl.length;
  analysis.preview = imageUrl.substring(0, 150);

  // Check for data URI format
  if (imageUrl.startsWith('data:')) {
    analysis.format = 'data-uri';
    analysis.isBase64 = imageUrl.includes('base64');

    // Extract image type from data URI
    const match = imageUrl.match(/^data:image\/([^;]+);base64,/);
    if (match) {
      analysis.imageType = match[1];
      analysis.isValid = true;

      // Validate base64 content exists after the prefix
      const base64Content = imageUrl.split(',')[1];
      if (!base64Content || base64Content.length === 0) {
        analysis.isValid = false;
        analysis.errors.push('Data URI has no base64 content after the prefix');
      } else if (base64Content.length < 100) {
        analysis.warnings.push('Base64 content seems very short, image might be corrupted');
      } else {
        // Check for MIME type mismatch
        const actualType = detectActualImageType(base64Content);
        if (actualType && actualType !== analysis.imageType) {
          analysis.warnings.push(`MIME type mismatch: declared as ${analysis.imageType} but content is ${actualType}`);
        }
      }
    } else {
      analysis.errors.push('Data URI format is invalid (expected: data:image/TYPE;base64,...)');
    }
  }
  // Check for HTTP/HTTPS URLs
  else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    analysis.format = 'http-url';
    analysis.isValid = true;
    
    // Check if it's a valid URL
    try {
      new URL(imageUrl);
    } catch (e) {
      analysis.isValid = false;
      analysis.errors.push('Invalid HTTP URL format');
    }
  }
  // Check for relative paths
  else if (imageUrl.startsWith('/')) {
    analysis.format = 'relative-path';
    analysis.isValid = true;
  }
  // Unknown format
  else {
    analysis.errors.push('Unknown image URL format');
  }

  return analysis;
}

/**
 * Logs detailed image analysis to console
 */
export function logImageAnalysis(imageUrl: string | undefined | null, context: string = 'Image') {
  const analysis = analyzeImageUrl(imageUrl);
  
  const emoji = analysis.isValid ? '✅' : '❌';
  console.group(`${emoji} ${context} Analysis`);
  console.log('Format:', analysis.format);
  console.log('Valid:', analysis.isValid);
  console.log('Is Base64:', analysis.isBase64);
  console.log('Image Type:', analysis.imageType || 'N/A');
  console.log('Length:', analysis.length);
  console.log('Preview:', analysis.preview);
  
  if (analysis.errors.length > 0) {
    console.error('Errors:', analysis.errors);
  }
  
  if (analysis.warnings.length > 0) {
    console.warn('Warnings:', analysis.warnings);
  }
  
  console.groupEnd();
  
  return analysis;
}

/**
 * Detects the actual image type from base64 content
 */
function detectActualImageType(base64Content: string): string | null {
  try {
    // Decode the first few bytes to check the content
    const decoded = atob(base64Content.substring(0, 200));

    // Check for SVG (XML content)
    if (decoded.includes('<?xml') || decoded.includes('<svg')) {
      return 'svg+xml';
    }

    // Check for PNG signature (89 50 4E 47)
    if (decoded.charCodeAt(0) === 0x89 && decoded.charCodeAt(1) === 0x50) {
      return 'png';
    }

    // Check for JPEG signature (FF D8 FF)
    if (decoded.charCodeAt(0) === 0xFF && decoded.charCodeAt(1) === 0xD8) {
      return 'jpeg';
    }

    // Check for GIF signature (47 49 46)
    if (decoded.charCodeAt(0) === 0x47 && decoded.charCodeAt(1) === 0x49) {
      return 'gif';
    }

    // Check for WebP signature
    if (decoded.includes('WEBP')) {
      return 'webp';
    }
  } catch (e) {
    console.warn('Could not detect image type:', e);
  }

  return null;
}

/**
 * Validates if a base64 string is properly formatted
 */
export function validateBase64Image(base64String: string): boolean {
  if (!base64String) return false;

  // Check if it's a data URI
  if (!base64String.startsWith('data:image/')) return false;

  // Check if it has base64 encoding
  if (!base64String.includes('base64,')) return false;

  // Extract the base64 content
  const base64Content = base64String.split(',')[1];
  if (!base64Content) return false;

  // Check if base64 content is valid (basic check)
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return base64Regex.test(base64Content);
}

/**
 * Converts a potentially malformed image URL to a valid format
 */
export function normalizeImageUrl(imageUrl: string | undefined | null, fallback: string = 'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image'): string {
  if (!imageUrl) {
    console.warn('⚠️ Image URL is empty, using fallback');
    return fallback;
  }

  const analysis = analyzeImageUrl(imageUrl);

  // Check for MIME type mismatch in data URIs
  if (imageUrl.startsWith('data:image/') && imageUrl.includes('base64,')) {
    const base64Content = imageUrl.split(',')[1];
    const declaredType = imageUrl.match(/data:image\/([^;]+)/)?.[1];
    const actualType = detectActualImageType(base64Content);

    if (actualType && declaredType !== actualType) {
      console.warn(`⚠️ MIME type mismatch detected! Declared: ${declaredType}, Actual: ${actualType}`);
      console.log('🔧 Fixing MIME type...');
      const fixed = `data:image/${actualType};base64,${base64Content}`;
      return fixed;
    }
  }

  // If it's already valid, return as-is
  if (analysis.isValid) {
    console.log('✅ Image URL is valid:', analysis.format);
    return imageUrl;
  }

  // If it's a data URI but missing the prefix, try to fix it
  if (imageUrl.includes('base64') && !imageUrl.startsWith('data:')) {
    console.warn('⚠️ Image URL contains base64 but missing data URI prefix, attempting to fix...');
    // Try to detect image type from the content or default to jpeg
    const base64Content = imageUrl.replace(/^base64,/, '');
    const actualType = detectActualImageType(base64Content) || 'jpeg';
    const fixed = `data:image/${actualType};base64,${base64Content}`;
    console.log('🔧 Fixed image URL with detected type:', actualType);
    return fixed;
  }

  // Otherwise, return fallback
  console.error('❌ Could not normalize image URL, using fallback', {
    original: imageUrl.substring(0, 100),
    errors: analysis.errors
  });
  return fallback;
}

/**
 * Creates a test image element to verify if an image URL can be loaded
 */
export function testImageLoad(imageUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      console.log('✅ Image loaded successfully');
      resolve(true);
    };
    
    img.onerror = (error) => {
      console.error('❌ Image failed to load:', error);
      resolve(false);
    };
    
    img.src = imageUrl;
    
    // Timeout after 5 seconds
    setTimeout(() => {
      console.warn('⏱️ Image load timeout');
      resolve(false);
    }, 5000);
  });
}

