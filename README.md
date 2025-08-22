# React SaaS Boilerplate

A **generalized, customizable SaaS frontend** built with React, designed to handle multi-tenant subscription management, authentication (via Keycloak), and full white-label capabilities. This boilerplate is made to serve as a **reusable foundation** for future SaaS projects—just plug in the backend and update environment/config values, branding assets, and colors.

---

## Key Features

- **Generalized Frontend Architecture** — Easily reuse for multiple client SaaS apps.
- **Keycloak Integration** — Secure authentication via OAuth2/OpenID Connect.
- **Multi-Tenant Support** — Built-in tenant management and plan subscription flows.
- **Dynamic Theming** — Modify one file to update the entire UI color scheme.
- **Custom Branding** — Update headers, descriptions, logos, and name via env/assets.
- **Session Timeout Management** — Configurable session expiry and idle prompts.
- **API Driven** — Connects to backend services using environment-based API endpoints.
- **Observability & Audit** — Integrated endpoints for logging, audit, and Grafana.

---

## Environment Variables

Create a `.env` file in the root of your project and define the following variables:

```env
# Core Configuration
CLIENT_ID=
APP_API_BASE_URL=
AUTH_API_BASE_URL=
TENANT_API_BASE_URL=
AUDIT_API_BASE_URL=

# Session Management
ENABLE_SESSION_TIMEOUT=
STORAGE_SESSION_TIME_KEY=
EXPIRY_TIME_IN_MINUTE=
PROMPT_TIME_BEFORE_IDLE_IN_MINUTE=

# Observability
GRAFANA_URL=
OBSERVABILITY_DOMAIN=

# Default Values
DEFAULT_TIER_ID=
HASH_SECRET_KEY=
ENABLE_HASH_SECRET=

# UI & Branding
APP_NAME=           # Application name shown in the header
APP_DESCRIPTION=    # Application description shown in the header
```

---

## Inputs

These environment variables control the behavior, configuration, and branding of the SaaS UI. Define them in a `.env` file or Docker environment.

| Name                                | Description                                                                | Type      | Default | Required |
| ----------------------------------- | -------------------------------------------------------------------------- | --------- | ------- | :------: |
| `CLIENT_ID`                         | Unique public identifier for the application used by Keycloak.             | `string`  |         |   yes    |
| `AUTH_API_BASE_URL`                 | Base URL of the Keycloak authentication service.                           | `string`  |         |   yes    |
| `APP_API_BASE_URL`                  | Base URL of the main backend API.                                          | `string`  |         |    no    |
| `TENANT_API_BASE_URL`               | Base URL for tenant-related services.                                      | `string`  |         |    no    |
| `AUDIT_API_BASE_URL`                | Base URL for audit logging APIs.                                           | `string`  |         |    no    |
| `ENABLE_SESSION_TIMEOUT`            | Enables/disables idle session timeout behavior.                            | `boolean` | `false` |    no    |
| `EXPIRY_TIME_IN_MINUTE`             | Duration (in minutes) after which the session expires.                     | `number`  | `15`    |    no    |
| `PROMPT_TIME_BEFORE_IDLE_IN_MINUTE` | Minutes before session expiry to show the idle timeout prompt.             | `number`  | `1`     |    no    |
| `STORAGE_SESSION_TIME_KEY`          | Key name used for storing session expiry timestamp in storage.             | `string`  |         |    no    |
| `GRAFANA_URL`                       | Grafana instance URL for observability dashboards.                         | `string`  |         |    no    |
| `OBSERVABILITY_DOMAIN`              | Domain or tag used for identifying logs/metrics in observability systems.  | `string`  |         |    no    |
| `DEFAULT_TIER_ID`                   | Default tier ID to fall back to in subscription flows.                     | `string`  |         |    no    |
| `HASH_SECRET_KEY`                   | Secret key used for internal hashing (e.g., identifiers or config values). | `string`  |         |    no    |
| `ENABLE_HASH_SECRET`                | Enable or disable use of secret-based hashing.                             | `boolean` | `false` |    no    |
| `APP_NAME`                          | Application name to be shown in the header and browser title.              | `string`  |         |   yes    |
| `APP_DESCRIPTION`                   | Application description to be shown in the UI header.                      | `string`  |         |   yes    |

> All of these values can be injected at runtime via `.env` files or Docker environment configuration.

> _You can dynamically switch behavior and branding by simply modifying these values._

---

## Theme Customization

All UI theming is handled in a single config file: [`colors.ts`](./src/Providers/theme/colors.ts)

Update primary/secondary colors, background, surfaces, borders, and even component states (like success, warning, error). This allows for **full rebranding** without touching component code.

```ts
export const colors = {
  primary: "#ff0000",
  secondary: "#5c0000",
  backgroundLight: "#fcfafaff",
  success: "#00C851",
  destructive: "#ED4337",
  // ...many more customizable color keys
};
```

Want to create a new theme? Just change the values here.

---

## Branding Customization

Update the following for client-specific branding:

- **App Name / Description**: via `.env`
- **Logo**: replace assets in `/src/assets/`
- **Color Theme**: edit `colors.ts`

> Everything else stays the same — perfect for rapid prototyping and scaling!

---

## Authentication

It uses **Keycloak** as the authentication provider, implementing secure OAuth2/OpenID Connect flows.

To enable authentication, the **host must configure the Keycloak authentication API URL** and related environment variables.

#### Required Environment Variables

```env
AUTH_API_BASE_URL=      # URL to your Keycloak authentication server
CLIENT_ID=              # The client ID configured in Keycloak for this app
```

#### How It Works

- When a user accesses the app, they are redirected to Keycloak for login.
- Upon successful authentication, Keycloak issues tokens (access, refresh, ID).
- These tokens are stored securely on the client side and used for API authorization.
- Token refresh and session timeout behaviors are managed based on the following env variables:

```env
ENABLE_SESSION_TIMEOUT=true
EXPIRY_TIME_IN_MINUTE=30
PROMPT_TIME_BEFORE_IDLE_IN_MINUTE=5
STORAGE_SESSION_TIME_KEY=sessionExpiry
```

> **Note**: The frontend only handles token management and user session behavior. You must ensure that your backend APIs validate these tokens accordingly.

---

### Backend Requirements

- Ensure that your Keycloak instance is publicly accessible from the frontend.
- The `CLIENT_ID` must match the client app configured in Keycloak.
- CORS and redirect URIs should be properly set in Keycloak for local and production environments.
- Your backend services must protect routes using Keycloak-provided tokens and validate them server-side.

---

## Development Setup

```bash
# Install dependencies
npm install

# Run locally
npm start

# Build for production
npm run build
```

---

## <a id="scripts"></a> Scripts

| Script           | Description                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------ |
| npm start        | Runs the app in the development mode                                                       |
| npm run config   | Generates config file from .env , this file is used for runtime configuration for env vars |
| npm run build    | Builds the app for production to the `build` folder.                                       |
| npm run lint     | Checks linting error in code                                                               |
| npm run lint:fix | Fix all auto-fixable lint errors                                                           |
| npm run format   | Format all files using prettier                                                            |

## Use Case

This project serves as a **base SaaS frontend template**.

- Tenant subscription handling
- OAuth2-based authentication
- A dashboard or portal experience
- Fully rebrandable UI

…you can simply clone this repo, update the `.env` values, swap logos and color themes, and you're ready to go.

---
