# To-Let Trust - Zero-Trust Rental Escrow System

## Overview

Zero-brokerage platform using Ethereum smart contract for secure deposit escrow. Landlord lists, tenant pays to contract, mutual confirm releases funds.

## Quick Start

**DEPLOY FIRST (CRITICAL):**

1. Remix.ethereum.org → RentalEscrow.sol → Deploy Sepolia → Copy **contract address**
2. Paste in `frontend/src/utils/contractABI.js` → CONTRACT_ADDRESS = '0xYourAddress'
3. `cd frontend && npm run dev`
4. MetaMask → Sepolia → Test ETH from faucet
5. Connect → Landlord → List → Tenant → Pay → Confirm

6. **Run Frontend**:

   ```
   cd rental-escrow-dapp/frontend
   npm install
   npm run dev
   ```

   - Open http://localhost:3000
   - Connect MetaMask (Sepolia, test ETH from faucet).

7. **Test Flow**:
   - Connect wallet.
   - Landlord: List property (e.g., 0.01 ETH).
   - Switch to tenant view (same/diff account), select & pay.
   - Both confirm move-out to release.

## Files

- `contracts/RentalEscrow.sol`: Core escrow logic.
- `frontend/`: React + Vite + Tailwind + ethers.js.

## Notes

- Poll for properties (simple; use events/subscribe in prod).
- Test ETH: https://sepoliafaucet.com
- Production: Verify contract, add dispute arbiter.
