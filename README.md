# To-Let Trust - Zero Brokerage Rental Escrow DApp 🚀

## 🎯 Project Overview

**Zero-Trust Rental Escrow System** - Eliminates brokers using secure escrow for security deposits. Landlord lists property → Tenant pays to smart contract → Mutual move-out confirmation → Funds auto-released to tenant.

**Tech Stack:**

```
Frontend: React 18 + Vite + Tailwind CSS + Ethers.js
Backend: Node.js + Express + Prisma + SQLite
Blockchain: Solidity + Hardhat + Sepolia Testnet
Wallet: MetaMask + Fake Wallet (demo coins)
```

## 🔧 Quick Start

### 1. Clone & Install

```bash
git clone <repo>
cd rental-escrow-dapp
```

### 2. Backend Setup (API + Database)

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

_Backend runs on `http://localhost:4000`_

### 3. Frontend Setup (UI + Wallet)

```bash
cd ../frontend
npm install
npm run dev
```

_Frontend runs on `http://localhost:3000`_

### 4. Test Accounts

```
Landlord: landlord@test.com / test123
Tenant: tenant@test.com / test123
```

## 📋 Step-by-Step Workflow

### **1. Landlord (landlord@test.com)**

1. Login → "Landlord Dashboard"
2. "Add Property" → Title/Description/Deposit ($50)
3. Property listed → Ready for tenant

### **2. Tenant (tenant@test.com)**

1. Login → "Tenant View"
2. Select property → "Start Rental"
3. Wallet → "Lock →" 50 Coins → Escrow ACTIVE
4. End lease → "Approve Move-Out ✅"

### **3. Release Flow**

1. Landlord switches → "Confirm Move-Out"
2. Status → "READY_TO_RELEASE"
3. Landlord → "Release Deposit" → Tenant Coins restored ✓

### **4. Wallet Features**

```
Bottom-left orange wallet:
- Balance: X.XX Coins 💰
- "Lock →" → Escrow deposit (balance deducts)
- "Add Coins 💎" → Refill (1-50)
- "Approve Move-Out" → Confirm lease end
```

## 💳 Coin Flow (Demo)

```
Start: 10 Coins
→ Rent 5 → 5 Coins (escrow locked)
→ Both confirm → READY
→ Release → 10 Coins ✓
→ Add 20 → 30 Coins ✓
```

## 🔗 API Endpoints (Backend)

```
POST /api/auth/login - JWT token
GET /api/properties - List properties
POST /api/properties - Create
GET /api/escrows - User escrows
POST /api/escrows/:id/confirm - Toggle confirm
POST /api/escrows/:id/release - Final release
```

## 🚀 Production Deployment

1. **Backend:** Vercel/Render + PostgreSQL
2. **Frontend:** Vercel/Netlify
3. **Blockchain:** Deploy `RentalEscrow.sol` → Update CONTRACT_ADDRESS
4. **MetaMask:** Replace fake coins → Real ETH deposits

## 📱 Screenshots

```
Screenshot 2026-04-22 200649.png  // Full UI
Screenshot 2026-04-22 172221.png  // Workflow
```

## 🛠 File Structure

```
rental-escrow-dapp/
├── backend/          # Express + Prisma API
├── frontend/src/     # React + Tailwind UI
│   ├── components/   # Login + Dashboards + Wallet
│   └── utils/        # API + ABI
├── contracts/        # Solidity Escrow.sol
└── README.md
```

**Zero Brokerage. Tenant Safe. Smart Contract Secure.** 💯
