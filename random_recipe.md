# Random Recipe API Documentation

## Overview
The Random Recipe API endpoint provides intelligent, personalized recipe suggestions with motivational messages to encourage users to cook. By default, it uses AI-powered smart selection logic that considers time of day and user preferences.

## Endpoint

### GET /api/v1/recipes/random

**Description:** Get a single random recipe with intelligent time-aware and personalized recommendations by default. Uses smart selection logic every time it's called.

**Authentication:** Optional (provides better personalization when authenticated)

**Base URL:** `https://your-api-domain.com/api/v1`

---

## Request Format

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `traditional` | boolean | No | `false` | Use traditional random selection instead of intelligent recommendations |
| `meal_type` | string | No | - | Meal type filter (only for traditional mode) |
| `max_cook_time` | integer | No | - | Maximum cook time in minutes (only for traditional mode) |
| `tags` | string | No | - | Comma-separated tags (only for traditional mode) |
| `is_popular` | boolean | No | `false` | Filter by popular recipes (only for traditional mode) |

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | No | Bearer token for authenticated requests (enables personalization) |
| `Content-Type` | No | `application/json` |

---

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Intelligent random recipe retrieved successfully",
  "data": {
    "recipe_id": 123,
    "name": "Spicy Chicken Curry",
    "image_url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "rating": 4.5,
    "cook_time": 45,
    "views": 1250,
    "is_popular": true,
    "user_id": null,
    "is_admin_recipe": true,
    "is_active": 1,
    "is_approve": 1,
    "approved_by": 1,
    "intelligent_suggestion": "Good morning! Start your day with this energizing Spicy Chicken Curry recipe. Since you love Indian cuisine, this Spicy Chicken Curry recipe is a perfect match for your taste!"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the request was successful |
| `message` | string | Human-readable success message |
| `data` | object | Recipe data object |
| `data.recipe_id` | integer | Unique recipe identifier |
| `data.name` | string | Recipe name |
| `data.image_url` | string | Base64-encoded recipe image with data URI prefix |
| `data.rating` | number | Recipe rating (1.0-5.0) |
| `data.cook_time` | integer | Cooking time in minutes |
| `data.views` | integer | Number of times recipe has been viewed |
| `data.is_popular` | boolean | Whether recipe is marked as popular |
| `data.user_id` | integer\|null | ID of user who created recipe (null for admin recipes) |
| `data.is_admin_recipe` | boolean | True if recipe was created by admin |
| `data.is_active` | integer | Recipe status (0=inactive, 1=active) |
| `data.is_approve` | integer | Approval status (-1=rejected, 0=pending, 1=approved) |
| `data.approved_by` | integer\|null | ID of admin who approved the recipe |
| `data.intelligent_suggestion` | string\|null | **NEW:** AI-generated motivational suggestion |

---

## Intelligent Suggestion Feature

### Overview
The `intelligent_suggestion` field contains personalized, motivational messages generated using AI logic that considers:

- **Time of Day:** Different messages for breakfast, lunch, dinner, and snack times
- **User Preferences:** Personalized based on user's favorite cuisines and categories
- **Recipe Characteristics:** Tailored messages based on difficulty level and cuisine type

### Example Suggestions

**Time-Based Examples:**
- Morning: `"Good morning! Start your day with this energizing Pancakes recipe"`
- Lunch: `"Midday treat! This Pasta Salad recipe will satisfy your lunch cravings"`
- Evening: `"Evening delight! Wind down with this comforting Beef Stew recipe"`

**Personalized Examples:**
- Cuisine Match: `"Since you love Italian cuisine, this Lasagna recipe is a perfect match for your taste!"`
- Category Match: `"Perfect for your dinner preferences! This Grilled Salmon recipe is right up your alley"`
- Difficulty-Based: `"Ready for a cooking adventure? This Coq au Vin recipe offers the perfect challenge!"`

---

## Request Examples

### 1. Default Intelligent Mode (Recommended)

```bash
curl -X GET "https://your-api-domain.com/api/v1/recipes/random" \
  -H "Authorization: Bearer your-jwt-token"
```

### 2. Anonymous Request (Still Intelligent)

```bash
curl -X GET "https://your-api-domain.com/api/v1/recipes/random"
```

### 3. Traditional Mode with Filters

```bash
curl -X GET "https://your-api-domain.com/api/v1/recipes/random?traditional=true&meal_type=Dinner&max_cook_time=60&is_popular=true"
```

---

## Error Responses

### 404 Not Found
```json
{
  "success": false,
  "message": "No recipes found matching the criteria",
  "error_code": "NO_RECIPES_FOUND"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to get random recipe",
  "error_code": "GET_RANDOM_RECIPE_ERROR"
}
```

---

## Implementation Notes

### Default Behavior
- **Intelligent Mode:** By default, the endpoint uses AI-powered selection logic
- **Time Awareness:** Automatically suggests appropriate meals based on current time
- **Personalization:** When authenticated, considers user's favorite recipes and preferences
- **Motivational Messages:** Always includes encouraging, contextual suggestions

### Traditional Mode
- Only activated when `traditional=true` is explicitly set
- Uses basic filtering without AI intelligence
- Does not include `intelligent_suggestion` field
- Supports legacy filtering parameters

### Authentication Benefits
- **Personalized Suggestions:** Better recommendations based on user history
- **Preference Analysis:** Analyzes favorite recipes to understand taste preferences
- **Contextual Messages:** More relevant motivational suggestions

### Image Handling
- Images are returned as base64-encoded data URIs
- Format: `data:image/jpeg;base64,{base64-data}`
- Can be directly used in HTML `<img>` tags or displayed in mobile apps

---

## Rate Limiting
- Public endpoints: 100 requests per minute
- Authenticated requests: Higher limits apply
- Rate limit headers included in response

---

## Best Practices

1. **Use Default Mode:** Let the intelligent system choose the best recipe
2. **Include Authentication:** For better personalization
3. **Handle Images Properly:** Base64 data can be large, consider caching
4. **Display Suggestions:** Show the `intelligent_suggestion` to encourage cooking
5. **Error Handling:** Always handle potential 404 responses gracefully

---

## Changelog

### Version 1.1 (Current)
- Added `intelligent_suggestion` field with AI-generated motivational messages
- Implemented time-aware recipe selection
- Added user preference analysis for personalized suggestions
- Made intelligent mode the default behavior

### Version 1.0
- Basic random recipe selection
- Traditional filtering options
- Image support via base64 encoding