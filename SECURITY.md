# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: security@taskflow-kanban.com

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information in your report:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability and how an attacker might exploit it

## Security Best Practices

### For Users

1. **Environment Variables**: Never commit `.env` files to version control
2. **JWT Secrets**: Use strong, random secrets for JWT tokens (minimum 256 bits)
3. **Passwords**: Use strong passwords with minimum 8 characters, including uppercase, lowercase, numbers, and special characters
4. **HTTPS**: Always use HTTPS in production
5. **Updates**: Keep dependencies up to date
6. **Database**: Use strong database passwords and restrict network access

### For Developers

1. **Dependencies**: Regularly update dependencies and scan for vulnerabilities
2. **SQL Injection**: Always use parameterized queries (JPA handles this)
3. **XSS Protection**: Sanitize user input in frontend
4. **CSRF Protection**: CSRF tokens for state-changing operations
5. **Authentication**: Use JWT with appropriate expiration times
6. **Authorization**: Implement proper role-based access control
7. **Logging**: Never log sensitive information (passwords, tokens, etc.)
8. **Error Messages**: Don't expose sensitive information in error messages

## Security Features

### Backend

- **JWT Authentication**: Stateless, secure token-based authentication
- **BCrypt Password Hashing**: Industry-standard password encryption
- **CORS Configuration**: Whitelisted origins only
- **SQL Injection Protection**: JPA parameterized queries
- **Method-Level Security**: `@PreAuthorize` annotations
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Input Validation**: Bean Validation API

### Frontend

- **HTTP-Only Cookies**: For sensitive tokens (if implemented)
- **XSS Protection**: Content Security Policy
- **Route Guards**: Protected routes
- **Secure Storage**: Encrypted local storage (if needed)
- **HTTPS Only**: Production configuration

## Security Checklist for Production

- [ ] Change all default passwords
- [ ] Generate strong JWT secret (use `openssl rand -base64 64`)
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Enable audit logging
- [ ] Configure rate limiting
- [ ] Set up monitoring and alerts
- [ ] Review CORS configuration
- [ ] Disable debug/development features
- [ ] Set up security headers
- [ ] Configure Content Security Policy
- [ ] Review file upload restrictions
- [ ] Set up intrusion detection
- [ ] Configure DDoS protection

## Known Security Considerations

### JWT Token Storage

Currently, JWT tokens are stored in localStorage. For enhanced security in production:

1. Consider using HTTP-only cookies
2. Implement token rotation
3. Use short-lived access tokens with refresh tokens
4. Implement token blacklisting for logout

### File Uploads

If implementing file uploads:

1. Validate file types and sizes
2. Scan files for malware
3. Store files outside web root
4. Use random file names
5. Implement rate limiting

### API Rate Limiting

Consider implementing rate limiting for:

1. Login attempts (prevent brute force)
2. Registration (prevent spam)
3. API endpoints (prevent DoS)

## Security Updates

We will disclose security vulnerabilities in the following manner:

1. Security patch released
2. Security advisory published
3. CVE assigned (if applicable)
4. Update announcement in release notes

## Contact

For security concerns, contact: security@taskflow-kanban.com

For general questions, open a GitHub issue with the `security` label.

---

Thank you for helping keep TaskFlow Kanban secure!
