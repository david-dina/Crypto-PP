from web3 import Web3
from flask import Flask, request, jsonify
import json
import time

# Flask app for webhooks
app = Flask(__name__)

# Web3 Configuration
infura_url = "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"  # Replace with your Infura URL
web3 = Web3(Web3.HTTPProvider(infura_url))
contract_address = "YOUR_CONTRACT_ADDRESS"  # Replace with your deployed contract address
contract_abi = json.loads("""YOUR_CONTRACT_ABI""")  # Replace with your contract ABI
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

# Dictionary to store webhook logs
webhook_logs = []
processed_subscribers = set()  # Track processed subscribers

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.json
    print("Webhook received:", data)
    webhook_logs.append(data)

    # Handle failed payment
    if data['reason'] == "Payment failed":
        subscriber = data['subscriber']
        print(f"Payment failed for {subscriber}. Retrying...")
        retry_payment(subscriber)

    # Handle subscription cancellation
    if data['reason'] == "Subscription canceled":
        print(f"Subscription canceled for {data['subscriber']}")

    return jsonify({"status": "received"}), 200


# Function to retry payments
def retry_payment(subscriber):
    try:
        # Call processPayment on contract
        tx = contract.functions.processPayment(subscriber).build_transaction({
            'from': web3.eth.default_account,
            'gas': 200000,
            'gasPrice': web3.toWei('20', 'gwei')
        })
        signed_txn = web3.eth.account.sign_transaction(tx, private_key='YOUR_PRIVATE_KEY')  # Replace with private key
        tx_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)
        print(f"Payment retried for {subscriber}. TX Hash: {tx_hash.hex()}")

        # Wait for transaction receipt
        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        if receipt['status'] == 1:  # Successful transaction
            print(f"Payment successful for {subscriber}. TX Hash: {tx_hash.hex()}")

            # Remove from processed set after success
            if subscriber in processed_subscribers:
                processed_subscribers.remove(subscriber)  # Clear for next billing cycle
        else:
            print(f"Payment failed for {subscriber}. TX Hash: {tx_hash.hex()}")
    except Exception as e:
        print(f"Retry failed for {subscriber}: {str(e)}")



# Function to monitor blockchain for nextPaymentDue with low fee optimization
def monitor_subscriptions():
    while True:
        try:
            subscribers = contract.functions.subscribers().call()
            for subscriber in subscribers:
                if subscriber['active'] and time.time() >= subscriber['nextPaymentDue']:
                    if subscriber not in processed_subscribers:  # Skip already processed subscribers
                        # Wait for network conditions to be optimal (low gas fees)
                        while True:
                            gas_price = web3.eth.gas_price
                            print(f"Current gas price: {web3.fromWei(gas_price, 'gwei')} gwei")
                            if gas_price <= web3.toWei('20', 'gwei'):  # Replace '20' with your desired threshold
                                retry_payment(subscriber)
                                break
                            time.sleep(300)  # Wait 5 minutes before checking again
        except Exception as e:
            print(f"Monitoring error: {str(e)}")
        time.sleep(60)  # Check every 60 seconds


if __name__ == '__main__':
    # Start the Flask app for receiving webhooks
    app.run(port=5000)

    # Start the monitoring process in the background
    monitor_subscriptions()
