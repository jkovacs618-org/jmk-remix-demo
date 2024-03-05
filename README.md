# Demo app for React, Remix JS Framework, Node.js, and Prisma

This web application demonstrates a fully-working app with React, Remix (JS Framework), Node.js, and Prisma ORM. The app allows for organizing personal data such as Events, Accounts for services, and Family members, supporting Lists and CRUD operations with nested relational data.

Technologies used:

* Front-end: React, Remix, TypeScript, JavaScript
* Back-end: Remix, Node.js, Prisma (ORM), SQLite (file DB)
* UI/Styles: Tailwind CSS, Flowbite, FontAwesome

## Prerequisites:

Globally installed:
* nvm
* npm (10.2+)
* npx (10.2+)
* node (v18.19.0)

```bash
nvm install v18.19.0
```

## App Setup:

From your terminal:

```bash
cd path/to/repo/
cp .env.example .env
nvm use
npm install
```

Generate the Prisma Client from DB schema:

```bash
npx prisma generate
```

<details>
  <summary>Details</summary>
  This generates the Prisma Client to node_modules/@prisma/client from schema for use by the backend.<br/>
  The prisma/migrations folder and prisma/dev.db (SQLite DB) are committed to the repo for Demo purposes.
</details>


## Start the React app (Port 3000)

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Login with Demo User:

> Visit: http://localhost:3000/ (or dynamic Port shown from npm run dev)

The Demo User credentials will be filled in to the Login form by default:

* Email: user@example.org<br/>
* Password: password<br/>

Explore the Family, Events, and Accounts sections, with add, edit, and delete actions for each.

# Optional Actions:

## Reset DB and Seed Data:

To clear all SQLite database tables of data, and run the Seed script again:

```bash
cd path/to/repo/
npx prisma migrate reset
```

## Recreate SQLite DB from schema and Regenerate Prisma Client:

After any DB schema changes, recreate the migration, DB file, Seed data, and prisma client:

```bash
cd path/to/repo/
rm -rf prisma/migrations/ prisma/dev.db
npx prisma migrate dev --name "init"
npx prisma generate
```

## To pull Repo with local DB changes:

Since the SQLite DB is stored in a committed file of prisma/dev.db, any data changes requires reverting the file before git pull.

```bash
cd path/to/repo/
git checkout -- .
git pull
```
