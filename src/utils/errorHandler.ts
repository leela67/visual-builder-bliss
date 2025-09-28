import { toast } from "sonner";
import { API_ERROR_CODES } from "@/api/config";

export interface ApiError {
  success: false;
  message: string;
  error_code?: string;
  details?: any;
}

export class ErrorHandler {
  static handleApiError(error: ApiError | Error): void {
    if (error instanceof Error) {
      // Network or other JavaScript errors
      console.error('Network error:', error);
      toast.error("Network error. Please check your connection and try again.");
      return;
    }

    // API errors
    const { message, error_code } = error;
    
    switch (error_code) {
      case API_ERROR_CODES.UNAUTHORIZED:
        toast.error("Please login to continue");
        // Could redirect to login page here
        break;
        
      case API_ERROR_CODES.USER_NOT_FOUND:
        toast.error("User not found");
        break;
        
      case API_ERROR_CODES.RECIPE_NOT_FOUND:
        toast.error("Recipe not found");
        break;
        
      case API_ERROR_CODES.PHONE_EXISTS:
        toast.error("Phone number already registered");
        break;
        
      case API_ERROR_CODES.INVALID_CREDENTIALS:
        toast.error("Invalid phone number or password");
        break;
        
      case API_ERROR_CODES.FAVORITE_EXISTS:
        toast.error("Recipe already in favorites");
        break;
        
      case API_ERROR_CODES.FAVORITE_NOT_FOUND:
        toast.error("Recipe not in favorites");
        break;
        
      case API_ERROR_CODES.VALIDATION_ERROR:
        toast.error(message || "Please check your input and try again");
        break;
        
      case API_ERROR_CODES.SEARCH_RECIPES_ERROR:
        toast.error("Failed to search recipes. Please try again.");
        break;
        
      case API_ERROR_CODES.GET_RECIPES_ERROR:
        toast.error("Failed to load recipes. Please try again.");
        break;
        
      case API_ERROR_CODES.CREATE_RECIPE_ERROR:
        toast.error("Failed to create recipe. Please try again.");
        break;
        
      case API_ERROR_CODES.GET_FAVORITES_ERROR:
        toast.error("Failed to load favorites. Please try again.");
        break;
        
      case API_ERROR_CODES.ADD_FAVORITE_ERROR:
        toast.error("Failed to add to favorites. Please try again.");
        break;
        
      case API_ERROR_CODES.REMOVE_FAVORITE_ERROR:
        toast.error("Failed to remove from favorites. Please try again.");
        break;
        
      default:
        toast.error(message || "An unexpected error occurred. Please try again.");
        break;
    }
  }

  static handleSuccess(message: string): void {
    toast.success(message);
  }

  static handleInfo(message: string): void {
    toast.info(message);
  }

  static handleWarning(message: string): void {
    toast.warning(message);
  }
}

// Utility function for handling async operations with error handling
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  successMessage?: string
): Promise<T | null> {
  try {
    const result = await operation();
    if (successMessage) {
      ErrorHandler.handleSuccess(successMessage);
    }
    return result;
  } catch (error) {
    ErrorHandler.handleApiError(error as ApiError | Error);
    return null;
  }
}
