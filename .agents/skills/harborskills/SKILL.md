---
name: harbor-erp-platform
description: Build and maintain Harbor ERP applications by designing Angular v21 frontends, Go REST APIs, cloud integrations, GitHub integrations, team and project management, authentication, DevOps workflows, and enterprise-scale microservices.
---

# Harbor ERP Platform Development

## Purpose

This skill provides guidelines for developing and maintaining the Harbor ERP platform, an enterprise application that integrates project management, cloud services, GitHub repositories, teams, and business modules through Go REST APIs and Angular v21.

Use this skill whenever working on any Harbor ERP feature, including frontend development, backend APIs, cloud integrations, authentication, project management, or DevOps automation.

---

# Technology Stack

## Frontend

- Angular v21
- Standalone Components
- Angular Signals
- RxJS
- TypeScript
- Tailwind CSS
- Angular Router
- Angular Reactive Forms

## Backend

- Go (Golang)
- REST API
- JWT Authentication
- PostgreSQL
- GORM (preferred ORM)
- Swagger / OpenAPI
- Structured Logging

## Infrastructure

- Docker
- Kubernetes (where applicable)
- Nginx
- GitHub
- GitHub Apps
- GitHub Webhooks
- GitHub Actions
- Cloud Provider APIs (AWS, Azure, GCP, DigitalOcean, etc.)

---

# Harbor ERP Modules

Typical modules include:

- Authentication
- User Management
- Organization Management
- Team Management
- Project Management
- Cloud Services
- GitHub Integration
- Repository Management
- Deployment Management
- API Keys & Secrets
- Notifications
- Audit Logs
- Dashboard
- Administration

Modules should remain independent and communicate through well-defined REST APIs.

---

# System Architecture

Follow a layered architecture.

```
Angular UI

        │

Go REST API

        │

Business Services

        │

Repository Layer

        │

PostgreSQL
```

Business logic belongs in the service layer.

Never place business rules inside controllers or Angular components.

---

# Angular Guidelines

Always use:

- Standalone Components
- Signals for component state
- Reactive Forms
- Lazy Loading
- Route Guards
- Functional Providers
- Feature-based folder structure

Avoid large components.

Split pages into:

- Toolbar
- Filters
- Table
- Dialog
- Forms
- Cards

---

# Tailwind CSS Standards

Prefer utility classes.

Example:

```
flex
grid
gap-4
rounded-xl
shadow
border
bg-white
dark:bg-slate-900
```

Avoid inline CSS whenever possible.

Create reusable UI components for consistent design.

---

# Go REST API Standards

Each module exposes RESTful endpoints.

Example:

```
GET
POST
PUT
PATCH
DELETE
```

Responses should follow a consistent structure:

```json
{
  "success": true,
  "message": "",
  "data": {},
  "errors": []
}
```

---

# API Design

Each resource should include:

- Create
- Update
- Delete
- Get by ID
- List
- Search
- Pagination
- Sorting
- Filtering

Support query parameters for list endpoints.

Example:

```
GET /projects?page=1&pageSize=20&search=erp&sort=name
```

---

# GitHub Integration

Support integration with:

- Organizations
- Repositories
- Teams
- Branches
- Pull Requests
- Issues
- Releases
- Workflows
- GitHub Actions
- Webhooks
- Deploy Keys
- Personal Access Tokens
- GitHub Apps

Typical capabilities:

- Connect repositories
- Sync repository metadata
- Trigger deployments
- Monitor workflow status
- Manage repository permissions
- Associate repositories with Harbor ERP projects

---

# Cloud Integration

Support multiple cloud providers.

Examples:

- AWS
- Azure
- Google Cloud
- DigitalOcean
- Oracle Cloud

Capabilities include:

- Register cloud accounts
- Store credentials securely
- Manage compute resources
- Configure storage
- Deploy applications
- Monitor resource usage

Cloud providers should be implemented through provider-specific adapters to allow future expansion.

---

# Project Management

A project may contain:

- Teams
- Members
- GitHub Repository
- Cloud Environment
- Deployment Configuration
- API Keys
- Secrets
- CI/CD Pipeline
- Environment Variables

Projects should support multiple environments:

- Development
- Testing
- Staging
- Production

---

# Team Management

Support:

- Team Creation
- Team Membership
- Project Assignment
- Role Management
- Repository Access
- Cloud Access

Typical roles:

- Owner
- Administrator
- Manager
- Developer
- QA
- DevOps
- Viewer

Implement role-based access control (RBAC) across all modules.

---

# Authentication & Authorization

Use JWT authentication.

Support:

- Login
- Logout
- Refresh Token
- Password Reset
- Email Verification
- Multi-factor Authentication (future)
- Role-based Authorization

Store only secure authentication data.

---

# Security

Always:

- Validate all inputs
- Sanitize user data
- Protect secrets
- Encrypt sensitive credentials
- Use HTTPS
- Implement CORS correctly
- Apply rate limiting where appropriate
- Log security events

Never expose access tokens, secrets, or cloud credentials.

---

# Database Design

Use PostgreSQL.

Follow conventions:

- UUID primary keys (preferred)
- CreatedAt
- UpdatedAt
- DeletedAt (soft delete where appropriate)
- Audit fields
- Foreign key constraints

Keep entities normalized and avoid duplicated data.

---

# Logging

Log:

- Authentication events
- API requests
- Errors
- Cloud operations
- GitHub synchronization
- Deployment activities

Use structured logging with request correlation IDs.

---

# Error Handling

Return consistent error responses.

Example:

```json
{
  "success": false,
  "message": "Project not found",
  "errors": [
    {
      "field": "projectId",
      "message": "Invalid project identifier"
    }
  ]
}
```

Do not expose internal stack traces or database errors.

---

# Performance

Optimize by:

- Lazy loading frontend modules
- Caching frequently accessed data
- Efficient database queries
- Pagination
- Background jobs for long-running tasks
- Connection pooling

Avoid unnecessary API calls.

---

# Testing

Frontend:

- Component Tests
- Service Tests
- Route Tests

Backend:

- Unit Tests
- Integration Tests
- API Tests
- Repository Tests

Mock external GitHub and cloud provider APIs during testing.

---

# Documentation

Maintain:

- Swagger/OpenAPI documentation
- API examples
- Architecture diagrams
- Deployment guides
- Integration guides
- Module documentation

Keep documentation aligned with implementation.

---

# Development Principles

- Build reusable components and services.
- Keep modules loosely coupled.
- Follow SOLID principles.
- Prefer composition over inheritance.
- Use dependency injection throughout the application.
- Design APIs to be versionable.
- Keep business logic independent of UI.
- Make integrations extensible through interfaces and adapters.
- Ensure all features are secure, testable, and maintainable.

---

# Typical Harbor ERP Features

- Organization Management
- Team Management
- Project Management
- GitHub Repository Integration
- Cloud Provider Integration
- CI/CD Pipeline Management
- Deployment Automation
- User & Role Management
- Audit Logs
- Notifications
- Dashboard & Analytics
- API Key Management
- Environment Configuration
- Secrets Management
- Infrastructure Monitoring
