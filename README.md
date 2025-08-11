# 1fe Starter App 🚀

A production-ready template for creating your own 1fe instance. This application serves as both the reference implementation powering [demo.1fe.com](https://demo.1fe.com) and as the git template used by `create-1fe-app`.

## 🎯 What is this?

This starter app demonstrates how to build a complete 1fe instance using `@1fe/server` and `@1fe/shell`. It includes:

- **Examples for live configurations** for live configurations, CSP settings, and environment management
- **Two environments**: Integration and Production setups
- **Example widgets** and plugin integrations

## 📋 Prerequisites

- **Node.js** `>= 22`
- **Yarn** (package manager)

## 🚀 Quick Start

### 1. Using create-1fe-app (Recommended)

```bash
npx @1fe/create-1fe-app my-1fe-app
cd my-1fe-app
yarn install
yarn dev
```

### 2. Access Your Application by going to <http://localhost:3000>

## 📦 Project Structure

```
src/
├── configs/
│   ├── ecosystem-configs.ts    # Live configurations
│   ├── critical-libs.ts        # Critical library URLs
│   └── env.ts                  # Environment configuration
├── csp-configs.ts              # Content Security Policy settings
├── server.ts                   # Express server setup
├── shell/                      # Shell components and utilities
└── public/                     # Static assets
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

| Variable              | Description      | Default       |
| --------------------- | ---------------- | ------------- |
| `PORT`                | Server port      | `3001`        |
| `NODE_ENV`            | Environment mode | `development` |
| `SERVER_BUILD_NUMBER` | Build identifier | `local`       |

### Live Configurations

Update `src/configs/ecosystem-configs.ts` to point to your CDN:

```typescript
export const configManagement: OneFEConfigManagement = {
  widgetVersions: {
    url: 'https://your-cdn.com/configs/widget-versions.json',
  },
  libraryVersions: {
    url: 'https://your-cdn.com/configs/lib-versions.json',
  },
  dynamicConfigs: {
    url: 'https://your-cdn.com/configs/live.json',
  },
  refreshMs: 30 * 1000,
};
```

### CSP Configuration

Modify `src/csp-configs.ts` to allow your CDN domains:

```typescript
export const cspConfigs = {
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    'https://your-cdn.com',
    // ... other sources
  ],
  // ... other CSP directives
};
```

## 🛠️ Development Commands

```bash
# Start development server (client + server)
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Run tests
yarn test

# Type checking
yarn typecheck

# Linting
yarn lint
```

## 🌍 Deployment

This starter app can be deployed to any platform that supports Node.js applications:

### Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/docusign/1fe/1fe-starter-app)

### Deploy to Heroku

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/docusign/1fe/1fe-starter-app)

### Deploy to Vercel

```bash
yarn global add vercel
vercel --prod
```

### Deploy to Railway

```bash
yarn global add @railway/cli
railway deploy
```

### Deploy to AWS/Azure/GCP

Follow the respective platform documentation for Node.js applications. The built application is a standard Express.js server.

## 🔗 Widget Integration

### Adding New Widgets

1. **Build your widget** using [1fe-widget-starter-kit](https://github.com/docusign/1fe-widget-starter-kit)
2. **Deploy widget assets** to your CDN
3. **Update widget-versions.json** with your widget's information
4. **Configure the widget** in your live.json file
5. **Update CSP settings** if needed for new domains

### Example Widget Configuration

```json
// In your live.json
{
  "widgets": {
    "basePrefix": "https://your-cdn.com/widgets/",
    "configs": [
      {
        "widgetId": "@your-org/your-widget",
        "plugin": {
          "enabled": true,
          "route": "/your-widget"
        }
      }
    ]
  }
}
```

## 🔧 Customization

### Branding & Styling

- Update `src/shell/components/` for custom layout components
- Modify CSS variables in your shell styles
- Replace favicon and other assets in `src/public/`

### Adding Custom Utilities

- Extend the shell utilities in `src/shell/utils/`
- Update the platform props interface
- Ensure new utilities are available to widgets via the sandbox

### Environment-Specific Configuration

- Create environment-specific config files
- Use environment variables for sensitive data
- Set up different CDN endpoints per environment

## 🤝 Related Projects

- **[1fe](https://github.com/docusign/1fe)** - Core 1fe packages and CLI tools
- **[1fe-widget-starter-kit](https://github.com/docusign/1fe-widget-starter-kit)** - Template for building widgets
- **[1fe-playground](https://github.com/docusign/1fe-playground)** - Development sandbox
- **[1fe-ci-cd](https://github.com/docusign/1fe-ci-cd)** - CI/CD pipeline templates

## 📖 Documentation

- **[1fe Documentation](https://1fe.com/)** - Complete platform documentation
- **[Getting Started Guide](https://1fe.com/start-here)** - Step-by-step setup
- **[Architecture Overview](https://1fe.com/main-concepts/what-is-1fe)** - How 1fe works
- **[Deployment Guide](https://1fe.com/getting-started/deploy-poc)** - Production deployment

## 🐛 Troubleshooting

### Common Issues

**CSP Errors**: Make sure your CDN domains are added to `csp-configs.ts`
**Widget Loading Failures**: Verify your live configurations are accessible and valid
**Build Errors**: Ensure all dependencies are installed and Node.js version is >= 22

### Getting Help

- Check the [documentation](https://1fe.com/start-here/)
- Search [existing issues](https://github.com/docusign/1fe/issues)
- Ask questions in [GitHub Discussions](https://github.com/docusign/1fe/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Ready to build your 1fe instance?** Check out our [comprehensive documentation](https://1fe.com/start-here/) or explore the [live demo](https://demo.1fe.com)!
