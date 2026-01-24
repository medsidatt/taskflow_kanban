import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom form validators
 */
export class CustomValidators {
  /**
   * Validates that password matches confirm password
   */
  static passwordMatch(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordField);
      const confirmPassword = control.get(confirmPasswordField);

      if (!password || !confirmPassword) {
        return null;
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        const errors = confirmPassword.errors;
        if (errors) {
          delete errors['passwordMismatch'];
          if (Object.keys(errors).length === 0) {
            confirmPassword.setErrors(null);
          }
        }
        return null;
      }
    };
  }

  /**
   * Validates strong password
   * Must contain at least: 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
   */
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(control.value);
      const hasLowerCase = /[a-z]/.test(control.value);
      const hasNumber = /[0-9]/.test(control.value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);
      const isLengthValid = control.value.length >= 8;

      const passwordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLengthValid;

      if (!passwordValid) {
        return {
          strongPassword: {
            hasUpperCase,
            hasLowerCase,
            hasNumber,
            hasSpecialChar,
            isLengthValid
          }
        };
      }

      return null;
    };
  }

  /**
   * Validates no whitespace
   */
  static noWhitespace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const hasWhitespace = (control.value as string).trim().length !== control.value.length;
      return hasWhitespace ? { whitespace: true } : null;
    };
  }

  /**
   * Validates URL format
   */
  static url(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      try {
        new URL(control.value);
        return null;
      } catch {
        return { invalidUrl: true };
      }
    };
  }

  /**
   * Validates file size
   */
  static fileSize(maxSizeInMB: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const file = control.value as File;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      if (file.size > maxSizeInBytes) {
        return {
          fileSize: {
            actualSize: file.size,
            maxSize: maxSizeInBytes,
            actualSizeMB: (file.size / (1024 * 1024)).toFixed(2),
            maxSizeMB: maxSizeInMB
          }
        };
      }

      return null;
    };
  }

  /**
   * Validates file type
   */
  static fileType(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const file = control.value as File;
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (!fileExtension || !allowedTypes.includes(fileExtension)) {
        return {
          fileType: {
            actualType: fileExtension,
            allowedTypes
          }
        };
      }

      return null;
    };
  }
}
