# GovTech Take Home Assignment

## Deployments

Webapp: https://main.d2onw2mh99c9sz.amplifyapp.com/

Server: https://vz3zbcpx7i3gxn3gtw4x46ikv40gcbpu.lambda-url.ap-southeast-1.on.aws/

## Introduction

This is Tan Jing Sheng's implementation of the [SWE Take Home Assignment](https://github.com/bryanlohxz/swe-take-home-assignment).

| Event     | Date & Time               |
| --------- | ------------------------- |
| Received  | = 5th March 2025, 4:48 PM |
| Started   | ~ 5th March 2025, 5:00 PM |
| Completed | ~ 6th March 2025, 7:00 AM |

## Setup

### Prerequisites

To set up and run the project, you need the following:

- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [pnpm](https://pnpm.io/) (Package manager, install via `npm install -g pnpm`)

Ensure that these dependencies are installed before proceeding with the setup.

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/tjingsheng/swe-take-home-assignment.git
   cd swe-take-home-assignment
   ```

2. Copy .env.example to .env and edit it

   ```sh
   cp .env.example .env
   vim .env # or use any text editor to fill in the required values
   ```

   > Note: There are no required values for local development, but you should still have the .env file

3. Install dependencies using `pnpm`:

   ```sh
   pnpm install
   ```

4. Seed the database:

   ```sh
   pnpm run seed
   ```

   This will populate the database with initial test data.

   > Note: This shoud run automatically after `pnpm install`

5. Start the development server:

   ```sh
   pnpm run dev
   ```

This will run the application in development mode with live reload.

## Assumptions and Interpretations

1. Sorting Criteria

   Ambiguity: Sorting is only mentioned as NAME or SALARY, always in ascending order. There is no mention of whether sorting can be combined (e.g., sorting first by SALARY and then by NAME in case of ties).

   Assumption: If more than one sort key is provided (e.g., ["SALARY", "NAME"]), we apply sorting in the order given, prioritising the first key before moving to the next.

   e.g. /users?sort=NAME&sort=SALARY will sort by NAME then SALARY is there is a tie.

2. Salary Range Handling

   Ambiguity: The default values are 0.0 for min and 4000.0 for max. However, it's not explicitly stated what happens if min > max (e.g., /users?min=5000&max=4000).

   Assumption: If min > max, return an empty list ("results": []), not an error.

3. Offset and Limit Behaviour

   Ambiguity: There is no mentioning of behaviour when the offset exceeds the number of available records.

   Assumption: If offset is greater than the available results, return an empty list ("results": []), not an error.

4. Concurrency and Scaling

   Ambiguity: The requirement states that concurrent uploads are desirable but does not specify the expected behaviour when two uploads update the same user.

   Assumption: The last successful upload overwrites the previous one (last write wins).

5. HTTP Response Codes

   Ambiguity: Which HTTP status codes should be used for specific failures?

   Assumption:

   - `200 OK` → Successful operations.
   - `404 Not Found` → Unknown Routes.
   - `500 Internal Server Error` → Unexpected failures.

6. Unique Name Handling

   Ambiguity: The requirement does not specify whether user names should be unique or how case sensitivity is handled when determining uniqueness.

   Assumption: User names are not required to be unique. Names are treated as case-sensitive, meaning "JohnDoe" and "johndoe" are considered different users.

## API Endpoints

### Fetch Users

You can fetch user data using the following `curl` command:

```sh
curl -G "http://localhost:3000/users" \
     --data-urlencode "min=1000" \
     --data-urlencode "max=5000" \
     --data-urlencode "offset=10" \
     --data-urlencode "limit=50" \
     --data-urlencode "sort=NAME"
```

This request retrieves users whose salary falls between 1,000 and 5,000, with pagination controls (`offset=10`, `limit=50`) and sorted by name.

### Upload a CSV File

To upload a CSV file containing user data, use:

```sh
curl -X POST http://localhost:3000/upload \
     -H "Content-Type: application/x-www-form-urlencoded" \
     --data-urlencode "file=name,salary%0AAlex,3000.0%0ABryan,3500.0"
```

```sh
curl -X POST "http://localhost:3000/upload" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@./server/data/test.csv"
```

Note: modify the curl to use a file that exists on your system.

This sends a CSV file located at `./data/data.csv` to the server for processing.

### **Root-Level Scripts**

- **`pnpm run dev:server`**

  - Runs the development server (`server` package).

- **`pnpm run dev:webapp`**

  - Runs the development environment for the web application (`webapp` package).

- **`pnpm run dev`**

  - Runs all `dev` scripts in parallel using `--stream` for better output handling.

- **`pnpm run seed:server`**

  - Seeds the server database with test data.

- **`pnpm run build:server`**

  - Builds the server package.

- **`pnpm run build:webapp`**

  - Builds the web application package.

- **`pnpm run build`**

  - Runs both `build:server` and `build:webapp` in parallel using `--stream`.

- **`pnpm run format`**
  - Formats the monorepo with prettier

---

### **Web Application Scripts**

- **`pnpm run dev`**

  - Starts the web application using Vite.

- **`pnpm run build`**

  - Builds the TypeScript and Vite project.

- **`pnpm run lint`**

  - Runs ESLint to check for code issues.

- **`pnpm run preview`**
  - Previews the built web application.

---

### **Server Scripts**

- **`pnpm run start`**

  - Starts the production server with `tsx watch`, enabling live reloading for TypeScript changes.
  - Uses `cross-env` to set `NODE_ENV=production` consistently across operating systems.

- **`pnpm run dev`**

  - Starts the development server with `tsx watch`, enabling live reloading for TypeScript changes.
  - Uses `cross-env` to set `NODE_ENV=development` consistently across operating systems.

- **`pnpm run seed`**

  - Runs `seed.ts` to populate the database with fake user data for testing.
  - Uses `faker-js` to generate realistic test data.

- **`pnpm run postinstall`**

  - Automatically runs `seed` after dependencies are installed, ensuring the database is populated without manual intervention.

- **`pnpm run build`**

  - (Optional) Add a build step for the server if needed (e.g., compiling TypeScript).

- **`pnpm run postbuild`**

  - Automatically zips the build for easier deployment.

## Dependencies Overview

### **Root Dependencies Overview**

#### **Development Dependencies**

- **[`prettier`](https://prettier.io/)**: An opinionated code formatter

### **Web Application Dependencies Overview**

#### **Production Dependencies**

- **[`@mantine/*`](https://mantine.dev/)**: A fully features React components library
- **[`@tabler/icons-react`](https://tabler-icons.io/)**: React icon set for UI elements, reccomended by Mantine.
- **[`@tanstack/react-query`](https://tanstack.com/query/latest/docs/react/overview)**: Powerful asynchronous state management for TS/JS, React, and more.
- **[`axios`](https://axios-http.com/)**: Promise based HTTP client for the browser and node.js.
- **[`react`](https://react.dev/)**: The library for web and native user interfaces.
- **[`react-dom`](https://react.dev/)**: The entry point to the DOM and server renderers for React.
- **[`react-router`](https://reactrouter.com/)**: A user‑obsessed, standards‑focused, multi‑strategy router you can deploy anywhere.

#### **Development Dependencies**

- **[`@eslint/js`](https://eslint.org/)**: ESLint configuration for JavaScript.
- **[`@types/react`](https://www.npmjs.com/package/@types/react)**: TypeScript types for React.
- **[`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom)**: TypeScript types for ReactDOM.
- **[`@vitejs/plugin-react`](https://vitejs.dev/guide/#using-plugins)**: React plugin for Vite.
- **[`eslint`](https://eslint.org/)**: The pluggable linting utility for JavaScript and JSX.
- **[`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks)**: Enforces React Hooks rules.
- **[`eslint-plugin-react-refresh`](https://www.npmjs.com/package/eslint-plugin-react-refresh)**: Ensures proper use of React Refresh.
- **[`globals`](https://www.npmjs.com/package/globals)**: Provides a list of global variables for linting.
- **[`typescript`](https://www.typescriptlang.org/)**: Static typing for JavaScript.
- **[`typescript-eslint`](https://typescript-eslint.io/)**: ESLint plugin for TypeScript.
- **[`vite`](https://vitejs.dev/)**: Fast development server and build tool for modern frontends.

## **Server Dependencies Overview**

### **Production Dependencies**

- **[`express`](https://expressjs.com/)**: Fast, unopinionated, minimalist web framework for Node.js.
- **[`fast-csv`](https://c2fo.github.io/fast-csv/)**: Llibrary for parsing and formatting CSVs or any other delimited value file in node.
- **[`multer`](https://github.com/expressjs/multer)**: Multer is a node.js middleware for handling multipart/form-data.
- **[`serverless-http`](https://www.npmjs.com/package/serverless-http)**: This module allows you to 'wrap' your API for serverless use. No HTTP server, no ports or sockets. Just your code in the same execution pipeline you are already familiar with.

- **[`zod`](https://zod.dev/)**: TypeScript-first schema validation with static type inference.

### **Development Dependencies**

- **[`@dotenvx/dotenvx`](https://dotenvx.com/)**: a better dotenv–from the creator of dotenv.
- **[`@faker-js/faker`](https://fakerjs.dev/)**: Generate massive amounts of fake (but realistic) data for testing and development.
- **[`@types/express`](https://www.npmjs.com/package/@types/express)**: TypeScript types for Express.
- **[`@types/multer`](https://www.npmjs.com/package/@types/multer)**: TypeScript types for Multer.
- **[`@types/node`](https://www.npmjs.com/package/@types/node)**: TypeScript types for Node.js.
- **[`cross-env`](https://github.com/kentcdodds/cross-env)**: Run scripts that set and use environment variables across platforms.
- **[`esbuild`](https://esbuild.github.io/)**: Fast JavaScript bundler and minifier for production builds.
- **[`tsx`](https://github.com/esbuild-kit/tsx)**: Runs TypeScript files without needing compilation.

## Comments

Fun assignment!
