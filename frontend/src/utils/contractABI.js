// Full ABI for RentalEscrow.sol - Fixed format for ethers v6
export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "_depositAmount", type: "uint256" },
    ],
    name: "listProperty",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_propertyId", type: "uint256" }],
    name: "payDeposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_propertyId", type: "uint256" }],
    name: "confirmMoveOut",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_propertyId", type: "uint256" }],
    name: "getProperty",
    outputs: [
      {
        components: [
          { internalType: "address", name: "landlord", type: "address" },
          { internalType: "uint256", name: "depositAmount", type: "uint256" },
          { internalType: "address", name: "tenant", type: "address" },
          { internalType: "bool", name: "tenantPaid", type: "bool" },
          { internalType: "bool", name: "landlordConfirmed", type: "bool" },
          { internalType: "bool", name: "tenantConfirmed", type: "bool" },
          { internalType: "bool", name: "fundsReleased", type: "bool" },
        ],
        internalType: "struct RentalEscrow.Property",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextPropertyId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

// PASTE DEPLOYED ADDRESS HERE (Remix Sepolia)
export const CONTRACT_ADDRESS = "0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47";
