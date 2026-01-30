
# @promactinfo/moa-plugin-hubspot

HubSpot integration plugin for the specialized MOA CLI.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@promactinfo/moa-plugin-hubspot.svg)](https://npmjs.org/package/@promactinfo/moa-plugin-hubspot)

## Usage

This plugin is designed to be used with the `moa` CLI core.

### Installation

```bash
# In your main moa-cli-core project (or user installation)
moa plugins install @promactinfo/moa-plugin-hubspot

# OR link locally for development
moa plugins link /path/to/moa-plugin-hubspot
```

### Authentication

MOA uses a unified authentication system. For HubSpot, we currently support Private App Tokens.

1. Create a Private App in your HubSpot Portal (Settings > Integrations > Private Apps).
2. Select scopes (e.g., `crm.objects.contacts.read`, `crm.objects.deals.read`).
3. Copy the Access Token.
4. Run:
   ```bash
   moa hubspot:auth
   ```
   Follow the prompts to secure your token.

### Commands

* `moa hubspot:auth` - Setup authentication for HubSpot.
* `moa hubspot:contacts` - List recent contacts from HubSpot.
* `moa hubspot:contacts --json` - Output contacts in JSON format for piping.

## Development & Publishing

### Local Development

1. **Install Dependencies:**
   ```bash
   pnpm install
   ```

2. **Build:**
   ```bash
   pnpm build
   ```

3. **Link to Core:**
   Go to your `moa-cli-core` directory and run:
   ```bash
   ./bin/dev.js plugins link ../moa-plugin-hubspot
   ```

### Publishing

To publish this plugin to npm so others can install it:

1. **Login to npm:**
   ```bash
   npm login
   ```

2. **Build and Prepare:**
   ```bash
   pnpm build
   npm version patch # or minor/major
   ```

3. **Publish:**
   ```bash
   npm publish --access public
   ```

Once published, users can install it via `moa plugins install @promactinfo/moa-plugin-hubspot`.
