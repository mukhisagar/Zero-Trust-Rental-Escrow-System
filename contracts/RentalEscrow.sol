// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RentalEscrow {
    // Represents a rental property listing
    struct Property {
        address landlord;
        uint256 depositAmount; // Deposit required in wei
        address tenant;
        bool tenantPaid; // True if tenant has paid deposit
        bool landlordConfirmed; // True if landlord confirms move-out
        bool tenantConfirmed; // True if tenant confirms move-out
        bool fundsReleased; // True if funds released to tenant
    }

    // Mapping of property ID to Property struct (simple ID-based indexing)
    mapping(uint256 => Property) public properties;
    uint256 public nextPropertyId = 1;

    event PropertyListed(uint256 propertyId, address landlord, uint256 depositAmount);
    event DepositPaid(uint256 propertyId, address tenant);
    event MoveOutConfirmed(uint256 propertyId, address confirmer);
    event FundsReleased(uint256 propertyId, address tenant, uint256 amount);

    // Landlord lists a property with deposit amount (Zero Brokerage: Direct on-chain listing)
    function listProperty(uint256 _depositAmount) external returns (uint256) {
        uint256 propertyId = nextPropertyId++;
        properties[propertyId] = Property({
            landlord: msg.sender,
            depositAmount: _depositAmount,
            tenant: address(0),
            tenantPaid: false,
            landlordConfirmed: false,
            tenantConfirmed: false,
            fundsReleased: false
        });
        emit PropertyListed(propertyId, msg.sender, _depositAmount);
        return propertyId;
    }

    // Tenant books/pays deposit to escrow (Tenant Safety: Funds locked, not sent to landlord directly)
    function payDeposit(uint256 _propertyId) external payable {
        Property storage prop = properties[_propertyId];
        require(prop.tenant == address(0), "Property already booked");
        require(msg.value == prop.depositAmount, "Incorrect deposit amount");
        require(!prop.tenantPaid, "Deposit already paid");

        prop.tenant = msg.sender;
        prop.tenantPaid = true;
        emit DepositPaid(_propertyId, msg.sender);
    }

    // Either party confirms move-out (Mutual agreement for release)
    function confirmMoveOut(uint256 _propertyId) external {
        Property storage prop = properties[_propertyId];
        require(prop.tenantPaid, "No deposit paid yet");
        require(!prop.fundsReleased, "Funds already released");

        if (msg.sender == prop.landlord) {
            prop.landlordConfirmed = true;
        } else if (msg.sender == prop.tenant) {
            prop.tenantConfirmed = true;
        } else {
            revert("Not landlord or tenant");
        }

        emit MoveOutConfirmed(_propertyId, msg.sender);

        // If both confirm, release funds to tenant (Tenant Safety: Gets deposit back on agreement)
        if (prop.landlordConfirmed && prop.tenantConfirmed) {
            prop.fundsReleased = true;
            (bool success, ) = payable(prop.tenant).call{value: prop.depositAmount}("");
            require(success, "Transfer failed");
            emit FundsReleased(_propertyId, prop.tenant, prop.depositAmount);
        }
    }

    // View function to get property details
    function getProperty(uint256 _propertyId) external view returns (Property memory) {
        return properties[_propertyId];
    }

    // Emergency: Owner can list more properties or manage (in production, use multisig)
    // Note: For simplicity, no owner; extend as needed.
}

