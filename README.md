This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## MongoDB-backed accounts and orders

Registration stores users through `POST /api/auth/register`. Login uses `POST /api/auth/login` and creates an HTTP-only session cookie; `GET /api/auth/me` checks the current account and `POST /api/auth/logout` revokes the session. Authenticated checkout saves an order and its payment screenshot through `POST /api/orders`. `GET /api/orders` returns only the signed-in customer's order history. Menu availability is shared through `GET /api/availability`; changes use `PATCH /api/availability` and require the shopkeeper role. The shopkeeper dashboard reads and updates orders through `/api/shopkeeper/orders`; payment screenshots are only served to shopkeeper-role accounts.

For local MongoDB, copy `.env.example` to `.env.local`; the example URI connects to a local MongoDB server and creates/uses the `best-choice` database. For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string and make sure the database user and network access are configured. Restart the development server after setting it.

Passwords are bcrypt-hashed and never stored as plain text. The order API calculates item prices on the server from the shared product catalog, checks that products are available, associates orders with the authenticated account, and accepts JPEG/PNG/WebP payment screenshots up to 5 MB. UPI payment itself is not automatically verified.

New registrations always receive the `customer` role. To grant shopkeeper access, first create and verify the trusted account, then assign its role manually using an administrator-controlled MongoDB connection, for example:

```javascript
db.users.updateOne(
  { email: "shopkeeper@example.com" },
  { $set: { role: "shopkeeper" } }
)
```

Never grant the role through public registration or expose database credentials in client-side code. Never commit `.env.local`.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
