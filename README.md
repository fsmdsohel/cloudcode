# CloudCode Monorepo

A modern cloud-based development platform built with Turborepo.

## What's Inside?

This Turborepo includes the following apps and packages:

### Apps

- frontend: Next.js application for the main user interface
- admin-hub: Next.js application for admin dashboard
- backend: Express.js API server with authentication and core services
- workspace-manager: Kubernetes workspace orchestration service
- container-gateway: Container management and file system service

### Packages

- @repo/ui: Shared React component library
- @repo/eslint-config: ESLint configurations
- @repo/typescript-config: Shared TypeScript configurations

## Getting Started

### Prerequisites

- Node.js >= 18
- Yarn 1.22.x
- Docker (for local development)
- Kubernetes cluster (for workspace deployment)

### Installation

1. Clone the repository:
   git clone https://github.com/your-org/cloudcode.git
   cd cloudcode

2. Install dependencies:
   yarn install

### Development

To develop all apps and packages:
yarn dev

### Build

To build all apps and packages:
yarn build

### Type Checking

Run type checks across the entire monorepo:
yarn check-types

## Architecture

CloudCode is built as a microservices architecture:

- Frontend apps are built with Next.js
- Backend services use Express.js
- Workspaces are orchestrated using Kubernetes
- Real-time collaboration is enabled through WebSocket connections
- Authentication uses JWT with session management

## Documentation

- Frontend Documentation (/apps/frontend/README.md)
- Backend API Documentation (/apps/backend/README.md)
- Workspace Manager (/apps/workspace-manager/README.md)
- Admin Hub (/apps/admin-hub/README.md)

## Environment Setup

Each application may require specific environment variables. Check the README in each app directory for detailed setup instructions.

## Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Useful Links

Learn more about the technologies used:

- Turborepo: https://turbo.build/repo/docs
- Next.js: https://nextjs.org/docs
- Express.js: https://expressjs.com/
- Kubernetes: https://kubernetes.io/docs/
- TypeScript: https://www.typescriptlang.org/
