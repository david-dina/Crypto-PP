// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Non-Custodial Escrow Contract for Subscriptions with Optimizations

contract SubscriptionEscrow {
    address public owner; // Merchant/Service Provider

    struct Subscriber {
        uint256 nextPaymentDue;
        uint256 billingCycle; // Custom billing cycle for each subscriber
        uint8 retryCount; // Number of retries attempted
        bool active;
        address paymentToken; // Token used for payment
        uint256 lastFailedPayment; // Track last failed attempt
    }

    mapping(address => Subscriber) public subscribers;
    mapping(address => bool) public allowedTokens; // List of allowed payment tokens

    event PaymentProcessed(address indexed subscriber, uint256 amount);
    event PaymentFailed(address indexed subscriber, uint8 retryCount, string reason);
    event Unsubscribed(address indexed subscriber);

    uint256 public maxAllowedGas; // Maximum allowed gas price for transactions

    constructor(address[] memory _allowedTokens, uint256 _maxAllowedGas) {
        owner = msg.sender;
        maxAllowedGas = _maxAllowedGas;

        // Initialize allowed tokens
        for (uint i = 0; i < _allowedTokens.length; i++) {
            allowedTokens[_allowedTokens[i]] = true;
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    modifier validToken(address token) {
        require(allowedTokens[token], "Token not allowed");
        _;
    }

    function subscribe(uint256 _billingCycle, address _paymentToken) external validToken(_paymentToken) {
        require(!subscribers[msg.sender].active, "Already subscribed");
        require(_billingCycle > 0, "Billing cycle must be greater than 0");
        IERC20 token = IERC20(_paymentToken);

        subscribers[msg.sender] = Subscriber(
            block.timestamp + _billingCycle,
            _billingCycle,
            0, // Initial retry count is 0
            true,
            _paymentToken,
            0 // No failed payments initially
        );
    }

    function processPayment(address subscriber, uint256 amount) external {
        Subscriber storage sub = subscribers[subscriber];
        require(sub.active, "Not subscribed");
        require(block.timestamp >= sub.nextPaymentDue, "Payment not due yet");

        // Check gas price before proceeding
        require(tx.gasprice <= maxAllowedGas, "Gas price too high, try later.");

        IERC20 token = IERC20(sub.paymentToken);
        bool success = token.transferFrom(subscriber, owner, amount);

        if (success) {
            sub.nextPaymentDue = block.timestamp + sub.billingCycle;
            sub.retryCount = 0; // Reset retry count on success
            emit PaymentProcessed(subscriber, amount);
        } else {
            sub.retryCount++;
            sub.lastFailedPayment = block.timestamp; // Track last failure time
            emit PaymentFailed(subscriber, sub.retryCount, "Payment failed or allowance revoked");

            if (sub.retryCount >= 3) {
                // Cancel subscription after 3 failed retries
                sub.active = false;
                emit Unsubscribed(subscriber);
            }
        }
    }

    function unsubscribe() external {
        Subscriber storage sub = subscribers[msg.sender];
        require(sub.active, "Not subscribed");

        sub.active = false;
        emit Unsubscribed(msg.sender);
    }

    function updateMaxAllowedGas(uint256 _newMaxGas) external onlyOwner {
        maxAllowedGas = _newMaxGas;
    }

    function addAllowedToken(address token) external onlyOwner {
        allowedTokens[token] = true;
    }

    function removeAllowedToken(address token) external onlyOwner {
        allowedTokens[token] = false;
    }
}

// IERC20 Interface for ERC20 Tokens
interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}
