# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.


# Contribution Flow

User roles:
   - reader (no credentials)
   - contributor (can propose new projects and edits to existing projects)
      x owner (can edit a specific project)
   - admin (can approve changes from contributors)


## Basic edit flow:

1. Ask for contributor credentials
This is the upgrade path from reader to contributor. This step will be quite manual as we will have to add the user to Heirloom and generate an api key. 
   - VC from Heirloom
   - API key

2. Once authenticated, contributors can:
   - Propose new projects
   - Edit other projects

3. Proposed changes are queued in a special collection and approved by admins


## Project Owner Flow:

1. Ask for owner credentials
From the project page, readers can claim projects to become project owners.

2. Once authenticated, owners can:
   - propose edits to their project

3. Proposed changes are queued in a special collection and approved by admins

