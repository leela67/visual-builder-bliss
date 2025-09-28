# What To Cook API Documentation

A comprehensive REST API for a food recipe application with user management, recipe creation, and favorites functionality.

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... } // Only for paginated endpoints
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error_code": "ERROR_CODE",
  "details": { ... } // Optional additional error details
}
```

### Pagination Format
```json
{
  "page": 1,
  "limit": 20,
  "total": 100,
  "total_pages": 5
}
```

## API Endpoints

### Authentication

#### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "phone_number": "+1234567890",
  "password": "securepassword123",
  "name": "John Doe",
  "interests": ["Italian", "Vegetarian", "Quick Meals"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "phone_number": "+1234567890",
      "name": "John Doe",
      "interests": ["Italian", "Vegetarian", "Quick Meals"],
      "created_at": "2025-09-27T10:00:00Z",
      "updated_at": "2025-09-27T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid request data
- `409 Conflict` - Phone number already exists

#### Login User
**POST** `/auth/login`

Authenticate user and get access token.

**Request Body:**
```json
{
  "phone_number": "+1234567890",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "phone_number": "+1234567890",
      "name": "John Doe",
      "interests": ["Italian", "Vegetarian", "Quick Meals"],
      "created_at": "2025-09-27T10:00:00Z",
      "updated_at": "2025-09-27T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Invalid credentials

### User Management

#### Get User Profile
**GET** `/users/profile`

Get the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "phone_number": "+1234567890",
    "name": "John Doe",
    "interests": ["Italian", "Vegetarian", "Quick Meals"],
    "created_at": "2025-09-27T10:00:00Z",
    "updated_at": "2025-09-27T10:00:00Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - User not found

#### Update User Profile
**PUT** `/users/profile`

Update the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "interests": ["Italian", "Mexican", "Desserts"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "phone_number": "+1234567890",
    "name": "John Smith",
    "interests": ["Italian", "Mexican", "Desserts"],
    "created_at": "2025-09-27T10:00:00Z",
    "updated_at": "2025-09-27T10:05:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Invalid or missing token

#### Get User's Recipes
**GET** `/users/{id}/recipes`

Get recipes created by a specific user.

**Parameters:**
- `id` (path) - User ID
- `page` (query, optional) - Page number (default: 1)
- `limit` (query, optional) - Items per page (default: 20, max: 100)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User recipes retrieved successfully",
  "data": [
    {
      "recipe_id": 1,
      "image_url": "https://example.com/image.jpg",
      "name": "Spaghetti Carbonara",
      "rating": 4.5,
      "cook_time": 30,
      "views": 150,
      "is_popular": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "total_pages": 1
  }
}
```

### Recipe Management

#### Get Recipes List
**GET** `/recipes`

Get a paginated list of all recipes.

**Parameters:**
- `page` (query, optional) - Page number (default: 1)
- `limit` (query, optional) - Items per page (default: 20, max: 100)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Recipes retrieved successfully",
  "data": [
    {
      "recipe_id": 1,
      "image_url": "https://example.com/image.jpg",
      "name": "Spaghetti Carbonara",
      "rating": 4.5,
      "cook_time": 30,
      "views": 150,
      "is_popular": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

#### Search Recipes
**GET** `/recipes/search`

Search recipes with various filters.

**Parameters:**
- `search` (query, optional) - Search term for recipe name or cuisine
- `meal_type` (query, optional) - Meal category: `Breakfast`, `Lunch`, `Dinner`, `Snack`, `Dessert`, `Beverage`
- `veg` (query, optional) - Vegetarian filter: `true` or `false`
- `page` (query, optional) - Page number (default: 1)
- `limit` (query, optional) - Items per page (default: 20, max: 100)

**Example Request:**
```
GET /recipes/search?search=pasta&meal_type=Dinner&veg=false&page=1&limit=10
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Recipes found successfully",
  "data": [
    {
      "recipe_id": 1,
      "image_url": "https://example.com/image.jpg",
      "name": "Spaghetti Carbonara",
      "rating": 4.5,
      "cook_time": 30,
      "views": 150,
      "is_popular": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "total_pages": 3
  }
}
```

#### Get Popular Recipes
**GET** `/recipes/popular`

Get a list of popular recipes.

**Parameters:**
- `page` (query, optional) - Page number (default: 1)
- `limit` (query, optional) - Items per page (default: 20, max: 100)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Popular recipes retrieved successfully",
  "data": [
    {
      "recipe_id": 1,
      "image_url": "https://example.com/image.jpg",
      "name": "Spaghetti Carbonara",
      "rating": 4.8,
      "cook_time": 30,
      "views": 1500,
      "is_popular": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "total_pages": 3
  }
}
```

#### Get Random Recipes
**GET** `/recipes/random`

Get random recipes with optional filters.

**Parameters:**
- `meal_type` (query, optional) - Meal category filter
- `max_cook_time` (query, optional) - Maximum cooking time in minutes
- `tags` (query, optional) - Comma-separated list of tags
- `is_popular` (query, optional) - Filter for popular recipes: `true` or `false`
- `limit` (query, optional) - Number of recipes to return (default: 10, max: 50)

**Example Request:**
```
GET /recipes/random?meal_type=Dinner&max_cook_time=45&tags=quick,easy&limit=5
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Random recipes retrieved successfully",
  "data": [
    {
      "recipe_id": 15,
      "image_url": "https://example.com/image15.jpg",
      "name": "Quick Chicken Stir Fry",
      "rating": 4.3,
      "cook_time": 25,
      "views": 89,
      "is_popular": false
    }
  ]
}
```

#### Get Recipe by ID
**GET** `/recipes/{id}`

Get detailed information about a specific recipe.

**Parameters:**
- `id` (path) - Recipe ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Recipe retrieved successfully",
  "data": {
    "recipe_id": 1,
    "name": "Spaghetti Carbonara",
    "category": "Dinner",
    "image_url": "https://example.com/image.jpg",
    "youtube_url": "https://youtube.com/watch?v=example",
    "cook_time": 30,
    "servings": 4,
    "difficulty": "Medium",
    "cuisine": "Italian",
    "calories": 650,
    "tags": ["pasta", "italian", "quick"],
    "ingredients": [
      {
        "name": "Spaghetti",
        "quantity": "400",
        "unit": "g"
      },
      {
        "name": "Eggs",
        "quantity": "3",
        "unit": "pieces"
      },
      {
        "name": "Parmesan cheese",
        "quantity": "100",
        "unit": "g"
      }
    ],
    "instructions": [
      {
        "step": 1,
        "description": "Boil water in a large pot and cook spaghetti according to package instructions."
      },
      {
        "step": 2,
        "description": "In a bowl, whisk together eggs and grated Parmesan cheese."
      },
      {
        "step": 3,
        "description": "Drain pasta and immediately mix with egg mixture while hot."
      }
    ],
    "rating": 4.5,
    "views": 150,
    "is_popular": true,
    "user_id": 1,
    "created_at": "2025-09-27T10:00:00Z",
    "updated_at": "2025-09-27T10:00:00Z"
  }
}
```

**Error Responses:**
- `404 Not Found` - Recipe not found

#### Create Recipe
**POST** `/recipes`

Create a new recipe (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Chicken Tikka Masala",
  "category": "Dinner",
  "image_url": "https://example.com/chicken-tikka.jpg",
  "youtube_url": "https://youtube.com/watch?v=example",
  "cook_time": 45,
  "servings": 4,
  "difficulty": "Medium",
  "cuisine": "Indian",
  "calories": 520,
  "tags": ["chicken", "indian", "spicy", "curry"],
  "ingredients": [
    {
      "name": "Chicken breast",
      "quantity": "500",
      "unit": "g"
    },
    {
      "name": "Yogurt",
      "quantity": "200",
      "unit": "ml"
    },
    {
      "name": "Tomato sauce",
      "quantity": "400",
      "unit": "ml"
    }
  ],
  "instructions": [
    {
      "step": 1,
      "description": "Marinate chicken in yogurt and spices for 30 minutes."
    },
    {
      "step": 2,
      "description": "Cook marinated chicken in a pan until golden brown."
    },
    {
      "step": 3,
      "description": "Add tomato sauce and simmer for 15 minutes."
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Recipe created successfully",
  "data": {
    "recipe_id": 25,
    "name": "Chicken Tikka Masala",
    "category": "Dinner",
    "image_url": "https://example.com/chicken-tikka.jpg",
    "youtube_url": "https://youtube.com/watch?v=example",
    "cook_time": 45,
    "servings": 4,
    "difficulty": "Medium",
    "cuisine": "Indian",
    "calories": 520,
    "tags": ["chicken", "indian", "spicy", "curry"],
    "ingredients": [...],
    "instructions": [...],
    "rating": 4.0,
    "views": 0,
    "is_popular": false,
    "user_id": 1,
    "created_at": "2025-09-27T15:00:00Z",
    "updated_at": "2025-09-27T15:00:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Invalid or missing token

### Favorites Management

#### Get User's Favorites
**GET** `/favorites`

Get the authenticated user's favorite recipes.

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `page` (query, optional) - Page number (default: 1)
- `limit` (query, optional) - Items per page (default: 20, max: 100)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Favorites retrieved successfully",
  "data": [
    {
      "user_id": 1,
      "recipe_id": 5,
      "recipe": {
        "recipe_id": 5,
        "image_url": "https://example.com/image5.jpg",
        "name": "Chocolate Chip Cookies",
        "rating": 4.7,
        "cook_time": 25,
        "views": 320,
        "is_popular": true
      },
      "created_at": "2025-09-27T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "total_pages": 1
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token

#### Add Recipe to Favorites
**POST** `/favorites/{recipe_id}`

Add a recipe to the authenticated user's favorites.

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `recipe_id` (path) - Recipe ID to add to favorites

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Recipe added to favorites successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid recipe ID
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Recipe not found
- `409 Conflict` - Recipe already in favorites

#### Remove Recipe from Favorites
**DELETE** `/favorites/{recipe_id}`

Remove a recipe from the authenticated user's favorites.

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `recipe_id` (path) - Recipe ID to remove from favorites

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Recipe removed from favorites successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid recipe ID
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Recipe not found in favorites

#### Check if Recipe is Favorited
**GET** `/favorites/{recipe_id}/check`

Check if a recipe is in the authenticated user's favorites.

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `recipe_id` (path) - Recipe ID to check

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Favorite status retrieved successfully",
  "data": {
    "is_favorite": true
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid recipe ID
- `401 Unauthorized` - Invalid or missing token

## Data Models

### User Model
```json
{
  "id": 1,
  "phone_number": "+1234567890",
  "name": "John Doe",
  "interests": ["Italian", "Vegetarian", "Quick Meals"],
  "created_at": "2025-09-27T10:00:00Z",
  "updated_at": "2025-09-27T10:00:00Z"
}
```

### Recipe Model
```json
{
  "recipe_id": 1,
  "name": "Spaghetti Carbonara",
  "category": "Dinner",
  "image_url": "https://example.com/image.jpg",
  "youtube_url": "https://youtube.com/watch?v=example",
  "cook_time": 30,
  "servings": 4,
  "difficulty": "Medium",
  "cuisine": "Italian",
  "calories": 650,
  "tags": ["pasta", "italian", "quick"],
  "ingredients": [
    {
      "name": "Spaghetti",
      "quantity": "400",
      "unit": "g"
    }
  ],
  "instructions": [
    {
      "step": 1,
      "description": "Boil water in a large pot..."
    }
  ],
  "rating": 4.5,
  "views": 150,
  "is_popular": true,
  "user_id": 1,
  "created_at": "2025-09-27T10:00:00Z",
  "updated_at": "2025-09-27T10:00:00Z"
}
```

### Recipe List Item Model
```json
{
  "recipe_id": 1,
  "image_url": "https://example.com/image.jpg",
  "name": "Spaghetti Carbonara",
  "rating": 4.5,
  "cook_time": 30,
  "views": 150,
  "is_popular": true
}
```

## Validation Rules

### Recipe Categories
- `Breakfast`
- `Lunch`
- `Dinner`
- `Snack`
- `Dessert`
- `Beverage`

### Difficulty Levels
- `Easy`
- `Medium`
- `Hard`

### Field Constraints
- **Phone Number**: Must be unique, international format recommended
- **Password**: Minimum 6 characters
- **Recipe Name**: Required, max 255 characters
- **Cook Time**: Minimum 1 minute
- **Servings**: Minimum 1 serving
- **Search Query**: Maximum 100 characters
- **Pagination Limit**: Maximum 100 items per page

## Error Codes

| Error Code | Description |
|------------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `UNAUTHORIZED` | Authentication required or invalid token |
| `USER_NOT_FOUND` | User does not exist |
| `RECIPE_NOT_FOUND` | Recipe does not exist |
| `PHONE_EXISTS` | Phone number already registered |
| `INVALID_CREDENTIALS` | Invalid login credentials |
| `FAVORITE_EXISTS` | Recipe already in favorites |
| `FAVORITE_NOT_FOUND` | Recipe not in favorites |
| `SEARCH_RECIPES_ERROR` | Recipe search failed |
| `GET_RECIPES_ERROR` | Failed to retrieve recipes |
| `CREATE_RECIPE_ERROR` | Failed to create recipe |
| `GET_FAVORITES_ERROR` | Failed to retrieve favorites |
| `ADD_FAVORITE_ERROR` | Failed to add favorite |
| `REMOVE_FAVORITE_ERROR` | Failed to remove favorite |

## Rate Limiting

- **General endpoints**: 100 requests per minute, burst of 200
- **Authentication endpoints**: 10 requests per minute, burst of 20

## Health Check

**GET** `/health`

Check API health status.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "what-to-cook-api",
  "version": "1.0.0"
}
```

## Swagger Documentation

Interactive API documentation is available at:
```
http://localhost:8080/swagger/index.html
```

## Example Frontend Integration

### JavaScript/Fetch Example

```javascript
// Login user
const loginUser = async (phoneNumber, password) => {
  try {
    const response = await fetch('http://localhost:8080/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: phoneNumber,
        password: password
      })
    });

    const data = await response.json();

    if (data.success) {
      // Store token for future requests
      localStorage.setItem('authToken', data.data.token);
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Get recipes with authentication
const getRecipes = async (page = 1, limit = 20) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:8080/api/v1/recipes?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (data.success) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
    throw error;
  }
};

// Search recipes
const searchRecipes = async (searchTerm, mealType = '', isVeg = false) => {
  try {
    const params = new URLSearchParams({
      search: searchTerm,
      meal_type: mealType,
      veg: isVeg.toString()
    });

    const response = await fetch(`http://localhost:8080/api/v1/recipes/search?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (data.success) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
};

// Add recipe to favorites
const addToFavorites = async (recipeId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:8080/api/v1/favorites/${recipeId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (data.success) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Failed to add to favorites:', error);
    throw error;
  }
};
```

### React Hook Example

```javascript
import { useState, useEffect } from 'react';

// Custom hook for recipes
const useRecipes = (page = 1, limit = 20) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/v1/recipes?page=${page}&limit=${limit}`);
        const data = await response.json();

        if (data.success) {
          setRecipes(data.data);
          setPagination(data.pagination);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [page, limit]);

  return { recipes, loading, error, pagination };
};

// Usage in component
const RecipeList = () => {
  const { recipes, loading, error, pagination } = useRecipes(1, 10);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {recipes.map(recipe => (
        <div key={recipe.recipe_id}>
          <h3>{recipe.name}</h3>
          <p>Cook Time: {recipe.cook_time} minutes</p>
          <p>Rating: {recipe.rating}/5</p>
        </div>
      ))}
    </div>
  );
};
```

This documentation provides comprehensive information for frontend developers to integrate with your What To Cook API, including all endpoints, request/response formats, authentication, error handling, and practical examples.
