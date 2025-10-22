import { useState } from "react";
import { ZodError, ZodType } from "zod";

/**
 * Custom hook for client-side form validation using Zod schemas.
 *
 * Provides real-time validation for form fields with detailed error messages.
 * Validates entire form or individual fields on demand.
 *
 * @param schema - Zod schema for validation
 * @returns Validation utilities with errors, validate, validateField, clearErrors, and hasErrors
 *
 */

export function useFormValidation<T extends Record<string, unknown>>(
  schema: ZodType<T>
) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: unknown): data is T => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            formattedErrors[issue.path[0].toString()] = issue.message;
          }
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const validateField = (fieldName: string, value: unknown) => {
    try {
      const testData = { [fieldName]: value };
      schema.parse(testData);

      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldError = error.issues.find(
          (issue) => issue.path[0] === fieldName
        );
        if (fieldError) {
          setErrors((prev) => ({
            ...prev,
            [fieldName]: fieldError.message,
          }));
        }
      }
    }
  };

  const clearErrors = () => setErrors({});

  return {
    errors,
    validate,
    validateField,
    clearErrors,
    hasErrors: Object.keys(errors).length > 0,
  };
}
