### Better Auth Cli for this Project

Migrate
Generate:

```cmd
pnpm dlx @better-auth/cli@latest generate --output ./prisma/schema/auth.prisma --config ./src/app/lib/auth.ts
```

#### Run prisma local generation & migration to DB

```bash
pnpm generate && pnpm migrate
```

#### Run Stripe Webhook locally

```bash
"D:\Programming Hero WebDev L2\Milestones\Mission 6\stripe_1.35.1_windows_x86_64\stripe.exe" listen --forward-to localhost:5000/webhook
```
