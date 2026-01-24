import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { AuthResponse } from '../../../../core/models/auth.models';

/**
 * Login Component
 * Handles user authentication with email and password
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

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
    this.loginForm = this.fb.group({
    login: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { login, password } = this.loginForm.value;

    this.authService.login({ usernameOrEmail: login!, password: password! }).subscribe({
      next: (response: AuthResponse) => {
        this.isLoading = false;
        console.log('Login successful:', response);
        this.router.navigate(['/boards']);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        console.error('Login error:', error);
        this.errorMessage = error.message || 'Invalid email or password. Please try again.';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
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

  get login() {
    return this.loginForm.get('login');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get loginError(): string {
    const loginControl = this.loginForm.get('login');
    if (loginControl?.hasError('required') && loginControl?.touched) {
      return 'Email or username is required';
    }
    return '';
  }

  get passwordError(): string {
    if (this.password?.hasError('required') && this.password?.touched) {
      return 'Password is required';
    }
    if (this.password?.hasError('minlength') && this.password?.touched) {
      return 'Password must be at least 6 characters';
    }
    return '';
  }
}
