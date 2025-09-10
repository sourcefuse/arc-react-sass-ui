# ARC React SaaS UI

<div align="center">
  <img src="src/Assets/logo-header.png" alt="ARC React SaaS UI" width="200" />
  
  **A comprehensive, production-ready React component library for building scalable SaaS applications**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-4.9.3-blue.svg)](https://www.typescriptlang.org/)
  [![Material-UI](https://img.shields.io/badge/Material--UI-5.10.15-blue.svg)](https://mui.com/)
  [![Vite](https://img.shields.io/badge/Vite-4.1.5-646CFF.svg)](https://vitejs.dev/)
</div>

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/sourcefuse/arc-react-sass-ui.git

# Navigate to the project directory
cd arc-react-sass-ui

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the development server
npm start
```

Visit `http://localhost:3000` to see the application in action.

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Components](#-components)
- [Theming](#-theming)
- [Authentication](#-authentication)
- [API Integration](#-api-integration)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🏗️ **Enterprise-Ready Architecture**
- **Modular Component Library** — 50+ reusable, customizable React components
- **TypeScript First** — Full type safety and excellent developer experience
- **Modern Build System** — Vite-powered for lightning-fast development and builds
- **Production Optimized** — Tree-shaking, code splitting, and performance optimizations

### 🔐 **Authentication & Security**
- **Keycloak Integration** — OAuth2/OpenID Connect authentication
- **Session Management** — Configurable session timeout and idle detection
- **Permission-Based Access** — Role-based component and route protection
- **Secure Token Handling** — Automatic token refresh and validation

### 🏢 **Multi-Tenant SaaS Features**
- **Tenant Management** — Complete tenant lifecycle management
- **Subscription Plans** — Flexible plan configuration and billing cycles
- **Feature Toggles** — Dynamic feature enablement per tenant
- **Billing & Invoicing** — Integrated payment and invoice management

### 🎨 **Customization & Theming**
- **Dynamic Theming** — Single-file color configuration for complete rebranding
- **White-Label Ready** — Easy logo, branding, and styling customization
- **Responsive Design** — Mobile-first approach with Material-UI components
- **Dark/Light Mode** — Built-in theme switching capabilities

### 📊 **Business Intelligence**
- **Dashboard Analytics** — Real-time metrics and KPI visualization
- **Data Tables** — Advanced filtering, sorting, and pagination
- **Charts & Graphs** — Interactive data visualization with Recharts
- **Audit Logging** — Comprehensive activity tracking and observability

### 🛠️ **Developer Experience**
- **Hot Reload** — Instant development feedback with Vite
- **Comprehensive Testing** — Vitest, Testing Library, and Cypress integration
- **Code Quality** — ESLint, Prettier, and Husky pre-commit hooks
- **Documentation** — Extensive component documentation and examples

---

## 🏛️ Directory Structure

```
src/
├── Components/           # Reusable UI components
│   ├── AppBar/          # Application header
│   ├── Button/          # Button variants
│   ├── Table/           # Data tables with advanced features
│   ├── Forms/           # Form components and validation
│   ├── SideNav/         # Navigation components
│   └── ...              # 40+ more components
├── Pages/               # Application pages
│   ├── Dashboard/       # Analytics dashboard
│   ├── Tenants/         # Tenant management
│   ├── Configuration/   # System configuration
│   └── ...              # Feature-specific pages
├── Providers/           # React context providers
│   ├── theme/           # Theme configuration
│   └── ...              # Global state providers
├── Hooks/               # Custom React hooks
├── redux/               # State management
├── Constants/           # Application constants
└── Helpers/             # Utility functions
```

---

## 🛠️ Installation

### Prerequisites

- **Node.js** 16.0 or higher
- **npm** 8.0 or higher
- **Keycloak** instance (for authentication)

### Environment Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sourcefuse/arc-react-sass-ui.git
   cd arc-react-sass-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Core Configuration
CLIENT_ID=your-keycloak-client-id
APP_API_BASE_URL=https://api.yourdomain.com
AUTH_API_BASE_URL=https://auth.yourdomain.com
TENANT_API_BASE_URL=https://tenant-api.yourdomain.com
AUDIT_API_BASE_URL=https://audit-api.yourdomain.com

# Session Management
ENABLE_SESSION_TIMEOUT=true
EXPIRY_TIME_IN_MINUTE=30
PROMPT_TIME_BEFORE_IDLE_IN_MINUTE=5
STORAGE_SESSION_TIME_KEY=sessionExpiry

# Observability
GRAFANA_URL=https://grafana.yourdomain.com
OBSERVABILITY_DOMAIN=your-app-domain

# UI & Branding
APP_NAME=Your SaaS Application
APP_DESCRIPTION=Your application description

# Optional Configuration
DEFAULT_TIER_ID=default-tier
HASH_SECRET_KEY=your-secret-key
ENABLE_HASH_SECRET=true
```

### Configuration Reference

| Variable | Description | Type | Required | Default |
|----------|-------------|------|----------|---------|
| `CLIENT_ID` | Keycloak client identifier | `string` | ✅ | - |
| `AUTH_API_BASE_URL` | Keycloak authentication server URL | `string` | ✅ | - |
| `APP_API_BASE_URL` | Main backend API URL | `string` | ❌ | - |
| `TENANT_API_BASE_URL` | Tenant management API URL | `string` | ❌ | - |
| `AUDIT_API_BASE_URL` | Audit logging API URL | `string` | ❌ | - |
| `ENABLE_SESSION_TIMEOUT` | Enable session timeout management | `boolean` | ❌ | `false` |
| `EXPIRY_TIME_IN_MINUTE` | Session expiry time in minutes | `number` | ❌ | `15` |
| `PROMPT_TIME_BEFORE_IDLE_IN_MINUTE` | Idle warning time in minutes | `number` | ❌ | `1` |
| `APP_NAME` | Application name for branding | `string` | ✅ | - |
| `APP_DESCRIPTION` | Application description | `string` | ✅ | - |

---

## 🎯 Usage

### Basic Application Setup

```tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import { store } from './redux/store';
import { theme } from './Providers/theme';

function AppWrapper() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default AppWrapper;
```

### Using Components

```tsx
import { Button, Table, PageHeader } from 'Components';
import { PermissionsEnum } from 'Constants/enums';
import { PermissionWrapper } from 'Components/PermissionWrapper';

function MyPage() {
  return (
    <>
      <PageHeader pageName="My Page" />
      <PermissionWrapper requiredPermissions={[PermissionsEnum.ViewTenant]}>
        <Button variant="contained" color="primary">
          Add Tenant
        </Button>
      </PermissionWrapper>
      <Table
        columns={columns}
        data={data}
        enableFiltering
        enableSorting
        enablePagination
      />
    </>
  );
}
```

---

## 🧩 Components

### Core Components

| Component | Description | Features |
|-----------|-------------|----------|
| **AppBar** | Application header with navigation | User menu, notifications, theme toggle |
| **SideNav** | Sidebar navigation | Permission-based visibility, nested menus |
| **Table** | Advanced data table | Filtering, sorting, pagination, row selection |
| **Button** | Button variants | Multiple styles, loading states, icons |
| **Forms** | Form components | Validation, error handling, field types |
| **Modal** | Modal dialogs | Customizable, accessible, responsive |

### Data Visualization

| Component | Description | Use Case |
|-----------|-------------|----------|
| **CustomPieChart** | Interactive pie charts | Dashboard metrics, status distribution |
| **StatsCard** | Metric display cards | KPI visualization, quick stats |
| **StatusChip** | Status indicators | Tenant status, plan status, payment status |

### Form Components

| Component | Description | Features |
|-----------|-------------|----------|
| **Input** | Text input fields | Validation, error states, helper text |
| **DatePicker** | Date selection | Range selection, validation, formatting |
| **AutoComplete** | Autocomplete inputs | Search, multi-select, async loading |
| **FileUpload** | File upload component | Drag & drop, validation, progress |

### Layout Components

| Component | Description | Features |
|-----------|-------------|----------|
| **PageHeader** | Page title and actions | Breadcrumbs, action buttons, search |
| **PagePaper** | Content container | Consistent spacing, elevation |
| **DetailCard** | Information display | Structured data presentation |

---

## 🎨 Theming

### Color Configuration

All theming is centralized in `src/Providers/theme/colors.ts`:

```typescript
export const colors = {
  // Primary brand colors
  primary: "#ff0000",
  primary200: "#f15e5eff",
  primary100: "#f9b9b9ff",
  primary50: "#fce2e2ff",
  
  // Secondary colors
  secondary: "#5c0000",
  
  // Status colors
  success: "#00C851",
  warning: "#FAC353",
  destructive: "#ED4337",
  
  // Surface colors
  surfaceLight: "#FFFFFF",
  surfaceDark: "#f4f2f2ff",
  
  // Background colors
  backgroundLight: "#fcfafaff",
  backgroundDark: "#E2E2E2",
  
  // ... more color definitions
} as const;
```

### Custom Theme Creation

```typescript
import { createTheme } from '@mui/material/styles';
import { colors } from './colors';

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      light: colors.primary100,
      dark: colors.secondary,
    },
    secondary: {
      main: colors.secondary,
    },
    success: {
      main: colors.success,
    },
    warning: {
      main: colors.warning,
    },
    error: {
      main: colors.destructive,
    },
  },
  // ... additional theme configuration
});
```

### Branding Customization

1. **Logo**: Replace files in `src/Assets/`
2. **Colors**: Update `colors.ts` file
3. **App Name**: Set `APP_NAME` environment variable
4. **Typography**: Customize Material-UI theme typography

---

## 🔐 Authentication

### Keycloak Integration

The application uses Keycloak for authentication with OAuth2/OpenID Connect:

```typescript
// Authentication configuration
const authConfig = {
  url: process.env.AUTH_API_BASE_URL,
  realm: 'your-realm',
  clientId: process.env.CLIENT_ID,
  onLoad: 'login-required',
  checkLoginIframe: false,
};
```

### Session Management

```typescript
// Session timeout configuration
const sessionConfig = {
  enabled: process.env.ENABLE_SESSION_TIMEOUT === 'true',
  expiryTime: parseInt(process.env.EXPIRY_TIME_IN_MINUTE || '15'),
  promptTime: parseInt(process.env.PROMPT_TIME_BEFORE_IDLE_IN_MINUTE || '1'),
  storageKey: process.env.STORAGE_SESSION_TIME_KEY || 'sessionExpiry',
};
```

### Permission-Based Access

```tsx
import { PermissionWrapper } from 'Components/PermissionWrapper';
import { PermissionsEnum } from 'Constants/enums';

// Protect components with permissions
<PermissionWrapper requiredPermissions={[PermissionsEnum.ViewTenant]}>
  <TenantManagementComponent />
</PermissionWrapper>
```

---

## 🔌 API Integration

### Redux Toolkit Query

The application uses RTK Query for API management:

```typescript
// API slice example
export const tenantApiSlice = createApi({
  reducerPath: 'tenantApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.TENANT_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = selectAuthToken(getState());
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Tenant', 'Plan', 'Subscription'],
  endpoints: (builder) => ({
    getTenants: builder.query<TenantResponse, TenantParams>({
      query: (params) => ({
        url: '/tenants',
        params,
      }),
      providesTags: ['Tenant'],
    }),
    // ... more endpoints
  }),
});
```

### Custom Hooks

```typescript
// Permission-aware query hook
export const useQueryHookWithPermission = (
  permissions: PermissionsEnum[],
  queryHook: any,
  params: any,
  options: any = {}
) => {
  const hasPermission = usePermission(permissions);
  
  return queryHook(params, {
    ...options,
    skip: !hasPermission || options.skip,
  });
};
```

---

## 🧪 Testing

### Test Setup

```bash
# Run all tests
npm test

# Run tests without watch mode
npm run test:no-watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run cypress
```

### Testing Utilities

```typescript
// Component testing example
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import Button from './Button';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

test('renders button with correct text', () => {
  renderWithProviders(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

---

## 🚀 Deployment

### Build for Production

```bash
# Generate configuration
npm run config

# Build the application
npm run build

# Preview production build
npm run preview
```

### Environment-Specific Configuration

```bash
# Development
npm run config -- --env=development

# Staging
npm run config -- --env=staging

# Production
npm run config -- --env=production
```

---

## 📚 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server with hot reload |
| `npm run build` | Build production bundle |
| `npm run config` | Generate runtime configuration from environment variables |
| `npm test` | Run tests in watch mode |
| `npm run test:no-watch` | Run tests once |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Check code for linting errors |
| `npm run lint:fix` | Fix auto-fixable linting errors |
| `npm run format` | Format code with Prettier |
| `npm run cypress` | Open Cypress E2E testing interface |
| `npm run analyze` | Analyze bundle size |

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](.github/CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run tests**: `npm test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Standards

- **TypeScript**: All new code must be written in TypeScript
- **Testing**: New components must include tests
- **Documentation**: Update documentation for new features
- **Linting**: Code must pass ESLint checks
- **Formatting**: Code must be formatted with Prettier

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/sourcefuse/arc-react-sass-ui/issues)
- **Email**: support@sourcefuse.com

---

## 🙏 Acknowledgments

- **Material-UI** for the excellent component library
- **React Boilerplate** for architectural inspiration
- **Vite** for the blazing-fast build tool
- **Redux Toolkit** for state management
- **Keycloak** for authentication

---

<div align="center">
  <p>Built with ❤️ by <a href="https://www.sourcefuse.com">SourceFuse</a></p>
  <p>
    <a href="https://github.com/sourcefuse/arc-react-sass-ui">⭐ Star us on GitHub</a> •
    <a href="https://github.com/sourcefuse/arc-react-sass-ui/issues">🐛 Report Bug</a> •
    <a href="https://github.com/sourcefuse/arc-react-sass-ui/issues">💡 Request Feature</a>
  </p>
</div>