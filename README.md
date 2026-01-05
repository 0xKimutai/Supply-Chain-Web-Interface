# Supply Chain Tracking System - Web Interface

This repository contains the web-based user interface for the Supply Chain Tracking System. It serves as the primary interaction layer for manufacturers, distributors, retailers, and customers to engage with a blockchain-backed ledger of product lifecycles.

## Project Overview

The Supply Chain Tracking System is designed to solve the problem of transparency and trust in global logistics. By combining the immutability of blockchain with the scalability of a modern Java backend, this system ensures that every product journey—from raw material to the final consumer—is verifiable and tamper-proof.

## The Role of the Web Interface

This frontend interface acts as the window into the complex "engine" running behind the scenes. It provides specialized dashboards for different industry roles:

*   **Manufacturers**: Can register new products on the blockchain, creating a unique digital twin (NFT-like identity) that stores metadata such as origin and production date.
*   **Distributors & Logistics Partners**: Can update the status of goods in transit (e.g., "Dispatched", "Received at Warehouse"), which triggers immutable state changes on the Ethereum network.
*   **Retailers**: Can scan and verify inventory authenticity before final sale, ensuring that counterfeit goods do not enter the storefront.
*   **Customers**: Can access a public-facing portal to view the complete history of their purchased product, providing confidence in its quality and source.

## The Backend Engine (Java & Blockchain)

While this repository hosts the interface, its functionality is powered by a robust backend architecture. For visitors to understand the full scope of the project, here is an overview of the core engine:

### 1. Blockchain Layer (Solidity)
The "Truth Layer" of the project. It consists of smart contracts deployed on an Ethereum-compatible network.
*   **Immutable Ledger**: Once a transfer or status update is recorded, it cannot be altered by any party.
*   **Smart Contracts**: Handle the logic of ownership transfers and ensure that only authorized stakeholders can update specific product states.

### 2. Enterprise Logic Layer (Spring Boot 3.x)
The bridge between the user interface and the blockchain.
*   **Web3j Integration**: The backend uses Web3j to communicate with smart contracts, abstracting the complexity of blockchain transactions for the frontend.
*   **RESTful APIs**: Provides high-performance endpoints for the frontend to query product status, user profiles, and analytics.
*   **Security & Identity**: Implements enterprise-grade authentication (JWT) and integrates with blockchain wallet signatures for secure login.
*   **Metadata Management**: While the blockchain stores the history, a PostgreSQL database is used to store high-bandwidth metadata like product images and detailed descriptions that would be too expensive to store on-chain.

### 3. Event-Driven Architecture
The system utilizes a listener pattern where the Java backend monitors the blockchain for events. When a transaction is confirmed on-chain, the backend automatically updates the off-chain database and can trigger notifications (email/SMS) to relevant stakeholders.

## Technical Configuration

*   **Frontend**: React 19, TypeScript, Tailwind CSS 4.
*   **Wallet Integration**: Uses Ethers.js v6 to interact with MetaMask and other Ethereum providers.
*   **Vite Proxy**: Configured to route API requests seamlessly to the backend service at `http://localhost:8080`.

## Installation and Development

To run this interface locally:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/0xKimutai/Supply-Chain-Web-Interface.git
    cd Supply-Chain-Web-Interface
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Start Development Server**:
    ```bash
    npm run dev
    ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
