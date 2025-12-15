## 🚀 Polspoch Website

A modern, scalable construction services e-commerce platform built using **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Shadcn UI**, **Lucide Icons**, **Zod**, **Axios**, **TanStack Query**, and **Sonner Toast**.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/)
- **Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + Shadcn/UI
- **Icons:** Lucide Icons
- **Form Validation:** Zod
- **Data Fetching:** Axios + TanStack Query
- **Notifications:** Sonner Toast
- **Linting & Commit Hooks:** ESLint, Husky, Commitlint

---

## 🏗️ Project Structure

```
polspoch-website/
│
├── .husky/                 # Git hooks
├── public/                 # Static assets
│
├── src/
│   ├── app/
│   │   ├── (website)/      # Main website routes
│   │   │   ├── (auth)/     # Authentication
│   │   │   ├── cart/       # Shopping Cart
│   │   │   ├── products/   # Product Listing
│   │   │   ├── services/   # Service Pages (Rebar, Cutting, Bending)
│   │   │   │   ├── bending/
│   │   │   │   ├── cutting/
│   │   │   │   └── rebar/
│   │   │   └── ...
│   │   ├── api/            # API Routes
│   │   ├── layout.tsx
│   │   └── ...
│   │
│   ├── components/
│   │   ├── ui/             # Shadcn UI components
│   │   ├── website/
│   │   │   ├── Common/     # Navbar, Footer, etc.
│   │   │   ├── PageSections/
│   │   │   │   ├── ServicePage/
│   │   │   │   ├── CartPage/
│   │   │   │   └── ...
│   │   └── ...
│   │
│   ├── lib/                # Utilities, Types, Hooks
│   │   ├── hooks/
│   │   ├── types/
│   │   └── ...
│   │
│   └── Providers/          # Global providers
│
├── commitlint.config.js
├── next.config.ts
├── package.json
└── README.md
```

---

## 🧩 Features

- ✨ **Services Configurator**: Interactive configurators for Rebar, Cutting, and Bending services.
- 🛒 **Cart & Checkout**: Full cart management and checkout flow.
- 🔐 **Authentication**: Secure user authentication with NextAuth.js.
- ⚡ **Performance**: Optimized with Next.js 16 and React 19 features.
- 🎨 **Modern UI**: Polished interface using Tailwind v4 and Shadcn components.

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/polspoch-website.git
```

### 2️⃣ Navigate to the project

```bash
cd polspoch-website
```

### 3️⃣ Install dependencies

```bash
npm install
```

### 4️⃣ Run development server

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

---

## � Scripts

| Command         | Description              |
| :-------------- | :----------------------- |
| `npm run dev`   | Start development server |
| `npm run build` | Create production build  |
| `npm run start` | Run production build     |
| `npm run lint`  | Run ESLint               |

---

## 🧪 Husky Setup (Pre-commit)

This project uses Husky and Commitlint to enforce clean commits.

# Add a new hook

npx husky add .husky/pre-commit "npm run lint"

## 🧑‍💻 Author

**Rashedul Haque Rasel**

📧 Email: [rashedulhaquerasel1@gmail.com](mailto:rashedulhaquerasel1@gmail.com)

🌐 Portfolio: [https://rashedul-haque-rasel.vercel.app](https://rashedul-haque-rasel.vercel.app)

💼 LinkedIn: [https://www.linkedin.com/in/rashedul-haque-rasel](https://www.linkedin.com/in/rashedul-haque-rasel)

---

Built with ❤️ using **Next.js**, **TypeScript**, and **Tailwind CSS**.
