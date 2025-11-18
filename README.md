# Next.js 16 Starter Template

A powerful starter template for Next.js 16 projects, featuring:

- **Better Auth**: Seamless and secure authentication.
- **Drizzle ORM**: Elegant and type-safe database management.
- **NeonDB**: Serverless PostgreSQL database for your application.

## Features

- Pre-configured authentication with Better Auth.
- Integrated Drizzle ORM for easy database interactions.
- Ready-to-use NeonDB setup with Next.js API routes.
- Scalable and modern tech stack.

## Getting Started

Follow these steps to set up the project:

### 1\. Clone the Repository

```
git clone https://github.com/JabirDev/nextjs-better-auth.git
cd nextjs-better-auth
```

### 2\. Install Dependencies

Make sure you have Node.js installed, then run:

```
bun install
```

### 3\. Configure Environment Variables

Copy the env.example file to create your .env.local file:

```
cp env.example .env.local
```

Edit the `.env.local` file with your project's specific configurations:

- Add your NeonDB connection strings.
- Configure any required authentication secrets.

> **Note**: Use `.env.local` instead of `.env` to keep your sensitive credentials out of version control. Next.js automatically loads `.env.local` and it's already included in `.gitignore`.

### 4\. Setup Drizzle ORM

Generate your Drizzle schema and push into your database:

```
bun db:push
```

### 5\. Start the Development Server

Run the development server:

```
bun dev
```

Your application will be available at [http://localhost:3000](http://localhost:3000).

## Contributing

Contributions are welcome! Feel free to:

- Open issues for bugs or feature requests.
- Submit pull requests to improve the project.

### License

This project is licensed under the MIT License.
