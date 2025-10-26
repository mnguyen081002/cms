/**
 * Form Validation Utilities
 * 
 * Centralized validation functions for forms across the app.
 */

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate required field (non-empty after trim)
 * 
 * @param value - Value to validate
 * @param fieldName - Name of the field for error message
 * @returns Validation result
 */
export function validateRequired(value: string, fieldName: string = 'Field'): ValidationResult {
  if (!value.trim()) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }
  return { isValid: true };
}

/**
 * Validate email format
 * 
 * @param email - Email to validate
 * @returns Validation result
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email.trim()) {
    return {
      isValid: false,
      error: 'Email is required',
    };
  }
  
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Invalid email format',
    };
  }
  
  return { isValid: true };
}

/**
 * Validate password length
 * 
 * @param password - Password to validate
 * @param minLength - Minimum length (default: 6)
 * @returns Validation result
 */
export function validatePassword(password: string, minLength: number = 6): ValidationResult {
  if (!password) {
    return {
      isValid: false,
      error: 'Password is required',
    };
  }
  
  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${minLength} characters`,
    };
  }
  
  return { isValid: true };
}

/**
 * Validate password confirmation
 * 
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 * @returns Validation result
 */
export function validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match',
    };
  }
  
  return { isValid: true };
}

/**
 * Validate post title
 * 
 * @param title - Post title to validate
 * @param minLength - Minimum length (default: 1)
 * @param maxLength - Maximum length (default: 200)
 * @returns Validation result
 */
export function validatePostTitle(
  title: string,
  minLength: number = 1,
  maxLength: number = 200,
): ValidationResult {
  const trimmed = title.trim();
  
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Title is required',
    };
  }
  
  if (trimmed.length < minLength) {
    return {
      isValid: false,
      error: `Title must be at least ${minLength} characters`,
    };
  }
  
  if (trimmed.length > maxLength) {
    return {
      isValid: false,
      error: `Title must be at most ${maxLength} characters`,
    };
  }
  
  return { isValid: true };
}

/**
 * Validate post content
 * 
 * @param content - Post content to validate
 * @param minLength - Minimum length (default: 1)
 * @returns Validation result
 */
export function validatePostContent(content: string, minLength: number = 1): ValidationResult {
  const trimmed = content.trim();
  
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Content is required',
    };
  }
  
  if (trimmed.length < minLength) {
    return {
      isValid: false,
      error: `Content must be at least ${minLength} characters`,
    };
  }
  
  return { isValid: true };
}

/**
 * Validate multiple fields at once
 * 
 * @param validations - Array of validation results
 * @returns First error found, or null if all valid
 */
export function validateAll(validations: ValidationResult[]): string | null {
  for (const validation of validations) {
    if (!validation.isValid) {
      return validation.error || 'Validation failed';
    }
  }
  return null;
}

