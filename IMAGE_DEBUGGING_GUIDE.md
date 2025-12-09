# Recipe Image Debugging Guide

## Overview
This guide helps you diagnose and fix issues with recipe images not displaying properly after the API change to base64-encoded format.

## Quick Diagnosis Steps

### 1. Check if the Backend API is Running
```bash
# Test if the API is accessible
curl http://localhost:8080/api/v1/recipes?page=1&limit=1

# If you get a connection error, start your backend server
```

### 2. Open the Application with Browser DevTools
1. Open the app: http://localhost:3001
2. Open Browser DevTools (F12 or Cmd+Option+I on Mac)
3. Go to the **Console** tab
4. Navigate to any page with recipes (Home, Recipes, or Recipe Detail)

### 3. Look for Debug Messages
The application now logs detailed image analysis for every recipe image:

```
✅ RecipeCard #123 - Chicken Curry Analysis
  Format: data-uri
  Valid: true
  Is Base64: true
  Image Type: jpeg
  Length: 45678
  Preview: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...
```

or

```
❌ RecipeCard #123 - Chicken Curry Analysis
  Format: empty
  Valid: false
  Errors: ["Image URL is null, undefined, or empty"]
```

## Common Issues and Solutions

### Issue 1: API Returns Empty or Null image_url
**Symptoms:**
- Console shows: `Format: empty`
- Images show placeholder

**Solution:**
- Check your backend API response
- Ensure the API is actually returning `image_url` field
- Verify database has image data

### Issue 2: API Returns HTTP URLs Instead of Base64
**Symptoms:**
- Console shows: `Format: http-url`
- Images might work or might fail depending on CORS

**Solution:**
- This is actually fine! The app handles both formats
- If images don't load, check CORS settings on the image server

### Issue 3: Base64 Data URI is Malformed
**Symptoms:**
- Console shows: `Format: data-uri` but `Valid: false`
- Errors like: "Data URI format is invalid"

**Solution:**
- Check the API response format
- Should be: `data:image/jpeg;base64,<base64-string>`
- The app will attempt to auto-fix common issues

### Issue 4: Base64 String is Truncated
**Symptoms:**
- Console shows warning: "Base64 content seems very short"
- Images fail to load

**Solution:**
- Check if your API is truncating the response
- Increase response size limits in your backend
- Check database field size (should be TEXT or LONGTEXT, not VARCHAR)

### Issue 5: CSP (Content Security Policy) Blocks Data URIs
**Symptoms:**
- Console shows CSP errors
- Images don't display even though data URI is valid

**Solution:**
Add to your `index.html` or server headers:
```html
<meta http-equiv="Content-Security-Policy" content="img-src 'self' data: https:;">
```

## Testing Tools

### 1. Standalone API Tester
Open `test-api-images.html` in your browser:
```bash
open test-api-images.html
```

This tool:
- Tests API endpoints directly
- Shows raw API responses
- Analyzes image format
- Attempts to render images

### 2. Browser Console Testing
```javascript
// Test a specific image URL
import { analyzeImageUrl, testImageLoad } from './src/utils/imageDebugger';

// Analyze format
const analysis = analyzeImageUrl('data:image/jpeg;base64,...');
console.log(analysis);

// Test if it loads
testImageLoad('data:image/jpeg;base64,...').then(success => {
  console.log('Image loads:', success);
});
```

## Debugging Checklist

- [ ] Backend API is running and accessible
- [ ] API returns `image_url` field in responses
- [ ] `image_url` format is correct (check console logs)
- [ ] No CSP errors in browser console
- [ ] No CORS errors in browser console
- [ ] Database field can store large base64 strings
- [ ] Network tab shows images being loaded (or attempted)

## Expected API Response Format

### For Recipe List (GET /recipes)
```json
{
  "success": true,
  "data": [
    {
      "recipe_id": 1,
      "name": "Chicken Curry",
      "image_url": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "rating": 4.5,
      "cook_time": 30,
      "views": 100,
      "is_popular": true
    }
  ],
  "pagination": { ... }
}
```

### For Recipe Detail (GET /recipes/:id)
```json
{
  "success": true,
  "data": {
    "recipe_id": 1,
    "name": "Chicken Curry",
    "image_url": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "category": "Dinner",
    "ingredients": [...],
    "instructions": [...]
  }
}
```

## Files Modified for Debugging

1. **src/utils/imageDebugger.ts** - Image analysis utilities
2. **src/components/RecipeCard.tsx** - Added image debugging
3. **src/pages/RecipeDetailPage.tsx** - Added image debugging
4. **src/api/recipeService.ts** - Added API response logging
5. **test-api-images.html** - Standalone testing tool

## Next Steps

1. Start your backend API server
2. Open the app in browser with DevTools
3. Check console for image analysis logs
4. Identify the specific issue from the logs
5. Apply the appropriate solution from this guide

## Need More Help?

If images still don't display:
1. Copy the console logs
2. Copy a sample API response (from Network tab)
3. Check if there are any error messages
4. Review the image analysis output

