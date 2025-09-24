<div align="center">

# Simple Trading Engine (Practice Project) 📈

*A small, experimental trading system built to practice core exchange logic from scratch.*

<p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest">
</p>

</div>

This is a small, experimental trading system I built to practice core exchange logic from scratch. It's an intentionally minimal setup using Express.js and Jest, designed to focus purely on the mechanics without heavy frameworks. The goal was to demystify how real exchanges handle critical operations by building them myself.

---

### 💡 Core Concepts I Explored

Instead of just reading theory, I wanted to get my hands dirty and code out the fundamentals:

-   **Order Book Management**: How to maintain sorted lists of `bids` (buys) and `asks` (sells).
-   **Price-Time Priority Matching**: The logic for matching incoming orders against the existing book.
-   **Atomic Balance Updates**: Ensuring user balances for cash and assets are correctly flipped when a trade executes.
-   **Safe Array Operations**: Modifying the order book array in real-time without causing issues.

This project is my hands-on lab for understanding these moving parts.

---

### ⚙️ Tech Stack

-   **Node.js / Express.js**: For a lightweight REST API layer.
-   **TypeScript**: To keep the logic type-safe and clear.
-   **Jest**: For writing unit tests on the critical matching functions.

Everything, especially the matching engine, is hand-written for learning. It's a true sandbox environment.

---

### 🚀 API Endpoints

| Method | Endpoint | Description | Body / Parameters |
| :--- | :--- | :--- | :--- |
| `POST` | `/order` | Places a new buy or sell order. It will first attempt to fill the order with existing orders on the opposite side of the book. | `{ "side", "price", "quantity", "userId" }` |
| `GET` | `/depth` | Retrieves the current order book depth, showing aggregated quantities at each price level for both bids and asks. | _None_ |
| `GET` | `/balance/:userId` | Fetches the balance of a specific user. | `userId` as a URL parameter. |
| `GET` | `/quote` | Calculates the total cost to purchase a given quantity based on the best available asks. | `{ "qty" }` |

---

### 📦 Setup and Installation

To get this running on your machine:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm start
    ```
    The server will fire up on `http://localhost:3000`.

4.  **Run tests:**
    ```bash
    npm test
    ```

---

### 💡 Why I Built This

I’ve always been curious about how real exchanges handle:

- Maintaining an order book (bids & asks)
- Matching orders based on price priority and quantity
- Updating balances when trades execute

Instead of just reading theory, I wanted to code it out to understand:

- How to match incoming orders against existing ones
- Safe array operations while modifying an order list in real time
- Writing clear, testable logic for critical paths

This repo is the first step towards refining my concepts in this system.
Future ideas: WebSocket streams, persistence with a database, risk checks, etc.
