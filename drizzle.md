# 💡 AI Prompt: Integrate a TypeScript/Node.js Project with Neon and Drizzle ORM

**Role:** You are an expert software agent responsible for configuring the current TypeScript/Node.js project to connect to a Neon Postgres database using Drizzle ORM.

**Purpose:** To install the necessary packages, configure Drizzle Kit for migrations, define a database schema, and provide a working script that demonstrates a full CRUD (Create, Read, Update, Delete) lifecycle.

**Scope:**
- Assumes the user is working within a Node.js project directory.
- Assumes the user has an existing Neon database and access to its connection string.

✅ Read and understand the entire instruction set before executing.

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open TypeScript/Node.js project as follows:

Detect the package manager used in this project (`npm`, `yarn`, `pnpm`, `bun`, etc.). Use it for all subsequent package management and script execution commands. The following instructions assume `npm`, but adapt commands as necessary for the detected package manager.

### 1. Initialize Project

1.  Check if a `package.json` file exists. If not, create one by running:
    ```bash
    npm init -y
    ```
2.  Ensure the `package.json` file is configured for ES Modules by adding `"type": "module"`.

### 2. Select a Driver Adapter

First, ask the user to choose their preferred driver and Drizzle adapter. Explain the use cases to help them decide:

1.  **Neon Serverless (HTTP):** Recommended for short-lived, stateless environments like Vercel Edge Functions or AWS Lambda. Each query is a separate `fetch` request, offering very low latency for individual operations.
2.  **Neon WebSocket:** Ideal for long-running applications like a standard Node.js server. It maintains a persistent WebSocket connection, which is more efficient for applications with frequent queries.
3.  **`node-postgres` (`pg`):** The classic, most widely-used driver for Node.js. A stable and mature choice that connects to Neon like any other Postgres database.

---

### 3. Install Dependencies (Based on Selection)

Based on the user's choice, run the appropriate installation command:

*   **If 'Neon Serverless (HTTP)' is chosen:**
    ```bash
    npm install drizzle-orm @neondatabase/serverless dotenv
    npm install -D drizzle-kit typescript tsx
    ```
*   **If 'Neon WebSocket' is chosen:**
    ```bash
    npm install drizzle-orm @neondatabase/serverless dotenv ws
    npm install -D drizzle-kit typescript tsx @types/ws
    ```
*   **If '`node-postgres`' is chosen:**
    ```bash
    npm install drizzle-orm pg dotenv
    npm install -D drizzle-kit typescript tsx @types/pg
    ```

### 4. Configure Environment

1.  Check for a `.env` file at the root of the project. If it does not exist, create it.
2.  Advise the user to add their Neon database connection string to the `.env` file. Provide the following format and instruct the user to replace the placeholders.
    ```env
    # Get your connection string from the Neon Console:
    # Project -> Dashboard -> Connect
    DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
    ```

### 5. Create Drizzle Configuration

Create a `drizzle.config.ts` file in the project root. This file is the same for all driver choices.

```typescript title="drizzle.config.ts"
import 'dotenv/config';
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env file');
}

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  }
});
```

### 6. Define Database Schema

Create a `src/schema.ts` file to define the database tables. This schema is the same for all driver choices.

```typescript title="src/schema.ts"
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Define the 'demo_users' table
export const demoUsers = pgTable('demo_users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Export types for type-safe queries
export type User = typeof demoUsers.$inferSelect;
export type NewUser = typeof demoUsers.$inferInsert;
```

### 7. Create the Database Client (`src/db.ts`)

Create a `src/db.ts` file with the content corresponding to the user's chosen driver.

#### Option 1: Neon Serverless (HTTP) Driver
```typescript title="src/db.ts"
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);
```

#### Option 2: Neon WebSocket Driver
```typescript title="src/db.ts"
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Required for Node.js environments older than v22
neonConfig.webSocketConstructor = ws;

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);
```

#### Option 3: `node-postgres` Driver
```typescript title="src/db.ts"
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
```

### 8. Create CRUD Example Script

Create a `src/index.ts` file. This script will work with any of the driver configurations.

```typescript title="src/index.ts"
import { eq } from 'drizzle-orm';
// The 'pool' export will only exist for WebSocket and node-postgres drivers
import { db, pool } from './db';
import { demoUsers } from './schema';

async function main() {
  try {
    console.log('Performing CRUD operations...');

    // CREATE: Insert a new user
    const [newUser] = await db
      .insert(demoUsers)
      .values({ name: 'Admin User', email: 'admin@example.com' })
      .returning();

    if (!newUser) {
      throw new Error('Failed to create user');
    }
    
    console.log('✅ CREATE: New user created:', newUser);

    // READ: Select the user
    const foundUser = await db.select().from(demoUsers).where(eq(demoUsers.id, newUser.id));
    console.log('✅ READ: Found user:', foundUser[0]);

    // UPDATE: Change the user's name
    const [updatedUser] = await db
      .update(demoUsers)
      .set({ name: 'Super Admin' })
      .where(eq(demoUsers.id, newUser.id))
      .returning();
    
    if (!updatedUser) {
      throw new Error('Failed to update user');
    }
    
    console.log('✅ UPDATE: User updated:', updatedUser);

    // DELETE: Remove the user
    await db.delete(demoUsers).where(eq(demoUsers.id, newUser.id));
    console.log('✅ DELETE: User deleted.');

    console.log('\nCRUD operations completed successfully.');
  } catch (error) {
    console.error('❌ Error performing CRUD operations:', error);
    process.exit(1);
  } finally {
    // If the pool exists, end it to close the connection
    if (pool) {
      await pool.end();
      console.log('Database pool closed.');
    }
  }
}

main();
```

### 9. Add Migration Scripts to `package.json`

Modify the `scripts` section of `package.json` to add commands for migrations.

```json title="package.json"
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate"
  }
}
```

---

## 🚀 Next Steps

Once the setup is complete:

1.  Verify the user has correctly set their connection string in `.env`. Do not proceed if placeholder value are still present.
2.  Generate the initial migration file:
    ```bash
    npm run db:generate
    ```
3.  Next, apply the migration to their Neon database:
    ```bash
    npm run db:migrate
    ```
4.  Finally, run the example CRUD script:
    ```bash
    npx tsx src/index.ts
    ```
5.  If successful, the output should show log messages for each C-R-U-D step.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The user's choice of driver adapter is respected throughout the setup.
- The project's detected package manager is used for all commands.
- The `drizzle.config.ts` file is correctly configured.
- The `src/db.ts` file uses the correct Drizzle adapter (`neon-http`, `neon-serverless`, or `node-postgres`) and underlying driver (`@neondatabase/serverless` or `pg`) based on the selection.
- **If the Neon WebSocket driver is chosen,** ensure `ws` is a dependency and `neonConfig.webSocketConstructor = ws;` is present.
- **If a connection pool is created (`node-postgres` or WebSocket),** ensure it is exported from `src/db.ts` and the `finally` block in `src/index.ts` correctly closes it.

---

## ❌ Do Not

- Do not hardcode credentials in any `.ts` or `.json` file.
- Do not output the contents of the `.env` file or the user's connection string in any response.


-------------------------------------------- -------------------------------------------------------- -------------

# 💡 AI Prompt: Connect React Router to Neon Postgres

**Role:** You are an expert software agent specializing in TypeScript and the React Router framework. Your task is to configure the current React Router project to connect to a Neon Postgres database using server-side data loaders.

**Purpose:** To connect the current React Router project to Neon Postgres by installing a database driver, configuring environment variables, and creating a new "Route Module" that fetches data on the server and renders it on the client.

**Scope:**
- Must be run inside an existing React Router project directory (created via `create-react-router`).
- Assumes the user has a Neon project and access to their full connection string.
- All modifications will follow the "Route Module" convention, separating server-side `loader` logic from the client-side `Component`.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

- This prompt must be run inside an existing React Router project directory. Do not proceed if no such project is detected. You can identify a React Router project by the presence of `@react-router/dev` in the `devDependencies` section of `package.json`.
- **Setup for New Projects:** If the user does not have a project yet, run the following command:

  ```bash
  npx create-react-router@latest my-app --yes
  ```

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open React Router project as follows:

### 1. Install Dependencies

1.  **Prompt the user to select a PostgreSQL driver.** Present the following options:

    *   **`@neondatabase/serverless` (Recommended):** Optimized for serverless and edge functions with HTTP connections. The ideal choice for applications deployed on Vercel or Netlify.
    *   **`postgres` (postgres.js):** A fast, full-featured client, excellent for long-running Node.js server environments.
    *   **`pg` (node-postgres):** The classic, widely-used driver for Node.js.

    Make sure to ask the user to choose one of the above options and do not proceed until they provide their choice. Clearly explain the pros of each option to help them decide.

2.  Based on the user's selection, run the corresponding installation command.

    ```bash
    # For @neondatabase/serverless
    npm install @neondatabase/serverless

    # For postgres (postgres.js)
    npm install postgres

    # For pg (node-postgres)
    npm install pg
    ```

---

### 2. Configure Environment Variables

1.  Check for the presence of a `.env` file at the root of the project. If it doesn't exist, create one.
2.  Add the following `DATABASE_URL` parameter to the `.env` file and **prompt the user to replace the placeholder value** with their complete connection string from Neon.

    ```dotenv title=".env"
    DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require&channel_binding=require"
    ```

3.  Direct the user to find this value in the **Neon Console → Project → Connect**.

---

### 3. Create the Database Connection Route

This involves two steps: defining the new route and creating the file that handles its logic.

#### 3.A: Define the Route

1.  **Locate the main route configuration file** at `app/routes.ts`.
2.  **Add a new route definition** to the exported array that points to a new file, `app/routes/version.tsx`.

    ```typescript title="app/routes.ts"
    import { type RouteConfig, route, index } from '@react-router/dev/routes';

    export default [
      index('./home.tsx'),
      route('version', './routes/version.tsx'), // <-- Add this line
    ] satisfies RouteConfig;
    ```

#### 3.B: Create the Route Module

1.  **Create a new file** at `app/routes/version.tsx`.
2.  Populate it with the code block that corresponds to the driver selected in Step 1. This file contains both the server-side `loader` function and the client-side React `Component`.

    ##### Option A: Using `@neondatabase/serverless`

    ```tsx title="app/routes/version.tsx"
    import { neon } from '@neondatabase/serverless';
    import type { Route } from './+types/version';

    export async function loader() {
      const sql = neon(process.env.DATABASE_URL!);
      const response = await sql`SELECT version()`;
      return { version: response[0].version as string };
    }

    export default function Version({ loaderData }: Route.ComponentProps) {
      return (
        <div>
          <h1>Database Version</h1>
          <p>{loaderData.version}</p>
        </div>
      );
    }
    ```

    ##### Option B: Using `postgres` (postgres.js)

    ```tsx title="app/routes/version.tsx"
    import postgres from 'postgres';
    import type { Route } from './+types/version';

    export async function loader() {
      const sql = postgres(process.env.DATABASE_URL!);
      const response = await sql`SELECT version()`;
      return { version: response[0].version };
    }

    export default function Version({ loaderData }: Route.ComponentProps) {
      return (
        <div>
          <h1>Database Version</h1>
          <p>{loaderData.version}</p>
        </div>
      );
    }
    ```

    ##### Option C: Using `pg` (node-postgres)

    ```tsx title="app/routes/version.tsx"
    import { Pool } from 'pg';
    import type { Route } from './+types/version';

    export async function loader() {
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      const client = await pool.connect();
      try {
        const { rows } = await client.query('SELECT version()');
        return { version: rows[0].version };
      } finally {
        client.release();
        await pool.end();
      }
    }

    export default function Version({ loaderData }: Route.ComponentProps) {
      return (
        <div>
          <h1>Database Version</h1>
          <p>{loaderData.version}</p>
        </div>
      );
    }
    ```

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Verify the user has correctly set their `DATABASE_URL` in the `.env` file. Do not proceed if placeholder values are still present.
2.  **Generate route types.** This is a required step. Run the following command to fix typescript errors:
    ```bash
    npm run typecheck
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
4.  Inform the user that the setup is complete. To test the connection, they can visit `http://localhost:5173/version` in their browser. They should see a page displaying the PostgreSQL version from their Neon database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The project has `@react-router/dev` and a supported PostgreSQL driver installed.
- A `.env` file is present or has been created with a `DATABASE_URL` key.
- The `app/routes.ts` file includes a route definition for `'version'` pointing to `./routes/version.tsx`.
- The `app/routes/version.tsx` file exists and exports both an `async function loader()` and a default `Component`.
- The `loader` function correctly uses `process.env.DATABASE_URL` for the connection.

---

## ❌ Do Not

- **Do not hardcode credentials** or sensitive information in any `.ts` or `.tsx` source code file. Always use `process.env`.
- **Do not output the user's connection string** in any response or log.
- Do not delete or modify other user-defined routes or components. Only modify `app/routes.ts` and create `app/routes/version.tsx` as specified.