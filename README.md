# Crypto Wallet Risk Analyzer

A Node.js project that analyzes Ethereum wallet activity using blockchain data.

## Features

- Fetches the latest Ethereum block number using Ethereum JSON-RPC.
- Retrieves wallet transaction history using the Etherscan API.
- Checks ETH balance and transaction nonce.
- Calculates failed transaction percentage.
- Detects repeated sender addresses.
- Flags large transactions.
- Calculates a rule-based wallet risk score.

## Technologies Used

- JavaScript
- Node.js
- Ethereum JSON-RPC
- Etherscan API
- Environment variables

## Risk Scoring

The analyzer uses configured rules to calculate a risk score:

- Suspicious-address fixture match: +40 points
- Large transaction detected: +20 points
- Repeated sender detected: +20 points per qualifying sender
- Failed transaction rate of 20% or more: +30 points

Risk levels:
- Low: 0-20
- Medium: 21-50
- High: 51+

Disclaimer: This is an educational project. The score is based on simple heuristics and does not prove that a wallet is safe or malicious. The configured suspicious address is a test fixture, not a verified scam designation.

## Setup

1. Install Node.js.
2. Clone this repository.
3. Install dependencies:

   npm install

4. Create a `.env` file in the project directory and add your Etherscan API key:

   ETHERSCAN_API_KEY=your_api_key_here

5. Run the analyzer:

   node index.js

Never commit your `.env` file or expose your API key.

## Future Improvements

- Add automated tests.
- Improve risk detection.
- Improve error handling.
- Integrate verified threat-intelligence sources.
