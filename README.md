# 🍽️ Addis Eats — Ethiopian Food Delivery System

Addis Eats is a full-stack food delivery web application built with Next.js and React. It provides a platform for customers to explore meals, manage their shopping carts, place orders, and track deliveries. It also includes kitchen and dashboard pages for managing food orders.

## ✨ Features

### 🥘 Menu and Food Details

* Browse available dishes and their prices.
* View individual dishes through dynamic routes.
* Retrieve dish data through an API endpoint.
* Organize food items by category.

### 🛒 Cart and Checkout

* Add dishes to the shopping cart.
* Manage cart items before ordering.
* Submit orders with customer and delivery information.
* Validate order data before processing.

### 🔐 Authentication

* User registration and sign-in.
* Sign-out functionality.
* Session verification through an authentication API.
* Protected customer pages and access-controlled functionality.

### 📦 Order Management

* Place and view customer orders.
* Access individual order details.
* Update and retrieve order status.
* Support order processing through the kitchen interface.

### 🗺️ Live Delivery Tracking

* Dedicated tracking page.
* Tracking API endpoints for delivery updates.
* Streaming endpoint for tracking events.
* Map integration to help visualize delivery progress.

### 👨‍🍳 Kitchen and Dashboard

* Kitchen interface for order processing.
* Dashboard for operational information.
* Order status management.

### 📱 Modern User Interface

* Responsive layouts.
* Reusable React components.
* Loading states and user feedback.
* Page metadata and social-sharing support.

## 🛠️ Technologies

| Technology     | Purpose                          |
| -------------- | -------------------------------- |
| Next.js        | Full-stack framework and routing |
| React          | Component-based user interface   |
| JavaScript     | Application logic                |
| Tailwind CSS   | Styling and responsive design    |
| SWR            | Data fetching and revalidation   |
| Zod            | Data validation                  |
| bcryptjs       | Password hashing                 |
| jose           | Token and session utilities      |
| Leaflet        | Interactive map integration      |
| Git and GitHub | Version control                  |

*The technology list should reflect the packages actually installed in your project.*

## 📁 Project Structure

```text
addis-eats/
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── auth/
    │   │   │   ├── me/
    │   │   │   ├── signin/
    │   │   │   ├── signout/
    │   │   │   └── signup/
    │   │   ├── dishes/
    │   │   ├── orders/
    │   │   │   ├── status/
    │   │   │   └── [id]/
    │   │   └── tracking/
    │   │       └── stream/
    │   ├── cart/
    │   ├── checkout/
    │   ├── dashboard/
    │   ├── kitchen/
    │   ├── menu/
    │   │   └── [slug]/
    │   ├── orders/
    │   │   └── [id]/
    │   ├── signin/
    │   ├── signup/
    │   └── tracking/
    ├── components/
    └── lib/
```

## ⚙️ Getting Started

### Prerequisites

* Node.js compatible with your installed Next.js version
* npm
* Git

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
```

### 2. Open the project directory

```bash
cd <YOUR_PROJECT_DIRECTORY>
```

Run the following commands from the directory containing `package.json`.

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the project root and configure the required environment variables.

For example:

```env
AUTH_SECRET=your_secure_random_secret
```

Generate a secure secret with Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use the generated value for `AUTH_SECRET`. Add any other variables required by your application.

**Important:** Never commit `.env.local`, passwords, or authentication secrets to GitHub.

### 5. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 6. Build for production

```bash
npm run build
```

To start the production server after a successful build:

```bash
npm start
```

## 🔄 Application Workflow

1. Customers browse the food menu.
2. Customers select dishes and add them to the cart.
3. Customers sign in or create an account.
4. Customers submit delivery details at checkout.
5. The system creates an order.
6. Kitchen staff process the order and update its status.
7. Customers view their orders and follow delivery progress through the tracking interface.

## 🔒 Security Considerations

* Hash passwords instead of storing them in plaintext.
* Validate incoming requests on the server.
* Protect private pages and API endpoints with authentication and authorization checks.
* Ensure customers can access only their own orders.
* Use secure cookie settings in production.
* Keep secrets in environment variables.
* Use persistent storage for production users, orders, and tracking data.

## 🚀 Future Enhancements

* Integrate a persistent database.
* Add online payment integration.
* Improve real-time delivery location updates.
* Add restaurant management and delivery-personnel accounts.
* Send order confirmation notifications.
* Add customer reviews and ratings.
* Deploy the application to a production hosting platform.

## 🎯 Project Objective

The goal of Addis Eats is to simplify food ordering and delivery while demonstrating practical full-stack development skills, including API development, authentication, data validation, dynamic routing, order management, and map-based delivery tracking.

## 👨‍💻 Author

**Amanual Ewunetu**

Full Stack Software Development Student

## 📄 License

Developed for educational and portfolio purposes. Add a license file if you plan to distribute the project under a specific open-source license.
