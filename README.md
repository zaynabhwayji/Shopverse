# Shopverse API

A complete REST API for a small e-commerce backend built with **Node.js, Express, MongoDB, and Mongoose**.

This project is a capstone exercise covering the main concepts from Sessions 1–4 of the Node.js API course: clean project structure, CRUD operations, MongoDB relationships, population, filtering, sorting, pagination, validation, and centralized error handling.

## Features

* RESTful API built with Express
* MongoDB database with Mongoose
* Full CRUD operations
* Five resources:

  * Categories
  * Tags
  * Users
  * Products
  * Orders
* One-to-many relationships
* Many-to-many relationships
* Mongoose `populate()`
* Nested population with `items.product`
* Product filtering
* Sorting
* Pagination
* Server-side order total calculation
* Request validation
* Centralized error handling
* HTTP status codes for successful and failed requests
* Postman testing

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* dotenv
* Nodemon
* Postman

## Project Structure

```text
Shopverse/
│
├── models/
│   ├── category.js
│   ├── tag.js
│   ├── user.js
│   ├── product.js
│   └── order.js
│
├── controllers/
│   ├── categoryController.js
│   ├── tagController.js
│   ├── userController.js
│   ├── productController.js
│   └── orderController.js
│
├── routes/
│   ├── categoryRoutes.js
│   ├── tagRoutes.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   └── orderRoutes.js
│
├── middleware/
│   └── errorHandler.js
│
├── .env
├── .gitignore
├── index.js
└── package.json
```

## Data Model

The API contains five resources and several relationships.

```text
Category 1 ─────── N Product
Tag      N ─────── N Product
User     1 ─────── N Order
Order    N ─────── N Product
```

### Category

* `name`
* `description`

A category can contain many products, while each product belongs to one category.

### Tag

* `name`

A product can have multiple tags, and a tag can belong to multiple products.

### User

* `name`
* `email`

A user can place multiple orders.

### Product

* `name`
* `price`
* `inStock`
* `category`
* `tags`
* `createdAt`
* `updatedAt`

Each product references one category and can reference multiple tags.

### Order

* `user`
* `items`

  * `product`
  * `qty`
* `total`
* `status`
* `createdAt`
* `updatedAt`

Order items are embedded objects that also contain a reference to a Product.

## API Endpoints

### Categories

| Method | Endpoint                   | Description                |
| ------ | -------------------------- | -------------------------- |
| POST   | `/categories`              | Create a category          |
| GET    | `/categories`              | Get all categories         |
| GET    | `/categories/:id`          | Get one category           |
| PUT    | `/categories/:id`          | Update a category          |
| DELETE | `/categories/:id`          | Delete a category          |
| GET    | `/categories/:id/products` | Get products in a category |

### Tags

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| POST   | `/tags`              | Create a tag                |
| GET    | `/tags`              | Get all tags                |
| GET    | `/tags/:id`          | Get one tag                 |
| PUT    | `/tags/:id`          | Update a tag                |
| DELETE | `/tags/:id`          | Delete a tag                |
| GET    | `/tags/:id/products` | Get products carrying a tag |

### Users

| Method | Endpoint            | Description                    |
| ------ | ------------------- | ------------------------------ |
| POST   | `/users`            | Create a user                  |
| GET    | `/users`            | Get all users                  |
| GET    | `/users/:id`        | Get one user                   |
| PUT    | `/users/:id`        | Update a user                  |
| DELETE | `/users/:id`        | Delete a user                  |
| GET    | `/users/:id/orders` | Get orders belonging to a user |

### Products

| Method | Endpoint        | Description      |
| ------ | --------------- | ---------------- |
| POST   | `/products`     | Create a product |
| GET    | `/products`     | Get products     |
| GET    | `/products/:id` | Get one product  |
| PUT    | `/products/:id` | Update a product |
| DELETE | `/products/:id` | Delete a product |

#### Product Filters

The products endpoint supports filtering, sorting, and pagination.

```text
GET /products?category=<id>
GET /products?tag=<id>
GET /products?inStock=true
GET /products?minPrice=20
GET /products?maxPrice=100
GET /products?sort=-price
GET /products?page=2&limit=10
```

Filters can also be combined:

```text
GET /products?inStock=true&sort=-price&page=1&limit=2
```

### Orders

| Method | Endpoint      | Description                   |
| ------ | ------------- | ----------------------------- |
| POST   | `/orders`     | Create an order               |
| GET    | `/orders`     | Get all orders                |
| GET    | `/orders/:id` | Get one fully populated order |
| PATCH  | `/orders/:id` | Update order status           |
| DELETE | `/orders/:id` | Delete an order               |

Order statuses follow this sequence:

```text
pending → paid → shipped
```

## Populate

Relationships are populated so useful responses return actual documents instead of only MongoDB IDs.

### Products

Products populate:

```js
.populate("category")
.populate("tags")
```

### Orders

Orders populate:

```js
.populate("user")
.populate("items.product")
```

### Nested Populate

An order contains embedded `items`, and each item contains a reference to a Product.

The product itself contains references to its category and tags.

Therefore, nested population can be used:

```js
.populate({
    path: "items.product",
    populate: [
        { path: "category" },
        { path: "tags" }
    ]
})
```

This allows an order response to contain the user, product, category, and tags as complete objects.

## Server-Side Order Total

When creating an order, the client does **not** provide the final total.

The server loads each referenced product, gets its price, multiplies it by the requested quantity, and calculates the total.

For example:

```text
Wireless Headphones: $65 × 2 = $130
Laptop Stand:        $25 × 1 = $25

Total = $155
```

This prevents the client from directly controlling the order total.

## Validation & Error Handling

The API uses centralized error handling for common errors.

### 400 Bad Request

Used for invalid input such as:

* Invalid MongoDB ObjectId format
* Missing required fields
* Invalid order status transition
* Duplicate unique values
* Invalid enum values

Example:

```json
{
    "message": "Invalid order ID format"
}
```

### 404 Not Found

Returned when a valid ID is provided but the requested document does not exist.

Example:

```json
{
    "message": "Order not found"
}
```

### 500 Internal Server Error

Used for unexpected server-side errors.

Controllers pass errors to the central error handler using:

```js
next(err);
```

## HTTP Status Codes

| Status | Meaning                        |
| ------ | ------------------------------ |
| 200    | Successful request             |
| 201    | Resource successfully created  |
| 400    | Bad request / validation error |
| 404    | Resource not found             |
| 500    | Internal server error          |

## Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
```

Do not commit `.env` to GitHub.

Make sure `.gitignore` contains:

```text
node_modules/
.env
```

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Or start the production server:

```bash
npm start
```

The API runs on:

```text
http://localhost:3000
```

## Testing with Postman

The API was tested end-to-end using Postman.

The main test flow includes:

1. Create categories.
2. Create tags.
3. Create a user.
4. Create products with category and tag references.
5. Test product filtering, sorting, pagination, and population.
6. Get products by category.
7. Get products by tag.
8. Create an order with two products and quantities.
9. Verify that the server calculates the total.
10. Get a fully populated order.
11. Get the user's orders.
12. Update order status from `pending` → `paid` → `shipped`.
13. Delete a product and verify a `404` response.
14. Test invalid IDs and missing fields and verify `400` responses.

## Example Order Request

```http
POST /orders
```

```json
{
    "user": "USER_ID",
    "items": [
        {
            "product": "PRODUCT_ID_1",
            "qty": 2
        },
        {
            "product": "PRODUCT_ID_2",
            "qty": 1
        }
    ]
}
```

The `total` is calculated by the server.

## What This Project Demonstrates

This project demonstrates practical experience with:

* Express REST APIs
* MVC-style project structure
* Mongoose schemas and models
* CRUD operations
* MongoDB ObjectId references
* One-to-many relationships
* Many-to-many relationships
* Embedded subdocuments
* `populate()`
* Nested population
* Query parameters
* Filtering and sorting
* Pagination using `skip()` and `limit()`
* Server-side calculations
* Validation
* Error handling middleware
* Postman API testing
* MongoDB data modeling

## Author

**Zaynab Hwayji**
