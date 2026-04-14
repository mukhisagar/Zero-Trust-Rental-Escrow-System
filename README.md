# Rental Escrow DApp - Backend Migrated to Node.js/Express

## Backend (port 4000)
- `cd backend && npm run dev`
- API: /api/auth/login, /api/properties, /api/escrows
- DB: SQLite (dev.db), Prisma ORM

## Frontend
- `cd frontend && npm run dev`
- JWT auth replaces MetaMask
- Update ethersProvider.js → API calls

## Test
```
curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"admin123"}'
```

## Features
- Landlord: List properties, create escrows
- Tenant: View/join escrows, confirm payments
- RBAC: role string (LANDLORD/TENANT)

Ready for production!

