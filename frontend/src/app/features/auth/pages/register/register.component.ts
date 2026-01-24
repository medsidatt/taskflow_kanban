import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { AuthResponse } from '../../../../core/models/auth.models';
import { CustomValidators } from '../../../../core/validators/custom-validators';

/**
 * Register Component
 * Handles new user registration
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/boards']);
    }

    this.initializeForm();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), CustomValidators.strongPassword()]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: CustomValidators.passwordMatch('password', 'confirmPassword')
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { username, email, password } = this.registerForm.value;

    this.authService.register({ username, email, password }).subscribe({
      next: (response: AuthResponse) => {
        this.isLoading = false;
        console.log('Registration successful:', response);
        this.router.navigate(['/boards']);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        console.error('Registration error:', error);
        this.errorMessage = error.message || 'Registration failed. Please try again.';
      }
    });
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get acceptTerms() {
    return this.registerForm.get('acceptTerms');
  }

  get usernameError(): string {
    if (this.username?.hasError('required') && this.username?.touched) {
      return 'Username is required';
    }
    if (this.username?.hasError('minlength') && this.username?.touched) {
      return 'Username must be at least 3 characters';
    }
    return '';
  }

  get emailError(): string {
    if (this.email?.hasError('required') && this.email?.touched) {
      return 'Email is required';
    }
    if (this.email?.hasError('email') && this.email?.touched) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  get passwordError(): string {
    if (this.password?.hasError('required') && this.password?.touched) {
      return 'Password is required';
    }
    if (this.password?.hasError('minlength') && this.password?.touched) {
      return 'Password must be at least 8 characters';
    }
    if (this.password?.hasError('strongPassword') && this.password?.touched) {
      return 'Password must contain uppercase, lowercase, number, and special character';
    }
    return '';
  }

  get confirmPasswordError(): string {
    if (this.confirmPassword?.hasError('required') && this.confirmPassword?.touched) {
      return 'Please confirm your password';
    }
    if (this.registerForm.hasError('passwordMismatch') && this.confirmPassword?.touched) {
      return 'Passwords do not match';
    }
    return '';
  }

  get acceptTermsError(): string {
    if (this.acceptTerms?.hasError('required') && this.acceptTerms?.touched) {
      return 'You must accept the terms and conditions';
    }
    return '';
  }
}
