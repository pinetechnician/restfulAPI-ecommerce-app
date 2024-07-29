# E-commerce API

This is an e-commerce REST API built with Node.js, Express, and PostgreSQL.

## Getting Started

### Prerequisites

- Node.js (version X.X.X)
- PostgreSQL (version X.X.X)
- Git

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/your-repo-name.git
    cd your-repo-name
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the root of the project and add your environment variables. You can use the `.env.example` file as a template:

    ```sh
    cp .env.example .env
    ```

    Edit the `.env` file to include your actual database credentials and session secret.

4. Set up your PostgreSQL database. Create the necessary tables by running the SQL scripts provided (if any) or by using the ORM migrations (if using one).

5. Start the server:

    ```sh
    npm start
    ```

### Usage

- The API documentation is available at `/api-docs` (if using Swagger).

### API Endpoints

#### Users

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Log in a user

#### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a product by ID
- `POST /api/products` - Add a new product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

#### Orders

- `GET /api/orders` - Get all orders for the authenticated user
- `POST /api/orders` - Create a new order

### Contributing

If you have any feedback or suggestions, please open an issue or create a pull request.

### License

This project is licensed under the MIT License.
