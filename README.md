🍴 Restaurant Platform Frontend

The Restaurant Platform Frontend is the user-facing interface for the restaurant management system.
It provides a smooth and responsive experience for customers, restaurant staff, and admins, consuming the backend’s API to deliver ordering, reservations, payments, and management features.

✨ Features

Customer Experience

Browse menus by category with photos and pricing

Place dine-in, pickup, or delivery orders

Real-time order tracking and status updates

Table reservations and waitlist management

Secure checkout with integrated payment options

Restaurant Staff Dashboard

Live order management with preparation timers and notifications

Reservation and table management

Order ready alerts (push, SMS, or in-app)

Admin Panel

Manage menus, categories, and restaurant details

Sales analytics and performance insights

Staff roles and permissions management

🚀 Tech Stack

Frontend Framework: React / Next.js / Angular (replace with your actual choice)

State Management: Zustand / Redux / Context API

API Client: Axios / Fetch API

Styling: Tailwind CSS / Material UI / Chakra UI

Real-time Updates: WebSockets (for orders and notifications)

Build & Deployment: Vite / Next.js build / Docker

📂 Project Structure
/src
  /components     # Reusable UI components
  /pages          # Page views (Home, Menu, Orders, Reservations, Admin, etc.)
  /store          # Global state (Zustand/Redux)
  /services       # API calls and helpers
  /hooks          # Custom React hooks
  /assets         # Images, icons, styles
.env.example      # Environment variables

📦 Installation

Clone the repo:

git clone https://github.com/am4rknvl/restaurant-frontend.git
cd restaurant-frontend


Install dependencies:

npm install


Run the dev server:

npm run dev


Build for production:

npm run build

🛠 Configuration

Copy .env.example → .env and configure:

NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
NEXT_PUBLIC_PAYMENT_KEY=your_payment_key

🔗 Integration with Backend

Connects to the Go (Gin) backend API for authentication, orders, reservations, and admin features

Consumes real-time updates from the backend via WebSockets

Uses backend Swagger/OpenAPI docs for consistent API calls

📊 Roadmap

 Offline-first ordering (QR scan without internet)

 Loyalty and rewards integration

 Multilingual support (i18n)

 PWA support for mobile-first usage

 Accessibility improvements

🤝 Contributing

Fork the repo

Create a new branch (git checkout -b feature/awesome-thing)

Commit your changes (git commit -m "Add awesome thing")

Push to the branch (git push origin feature/awesome-thing)

Open a Pull Request

📜 License

MIT License
