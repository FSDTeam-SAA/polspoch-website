## 🚀 Template Overview Website

A modern, scalable website built using **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Shadcn UI**, **Lucide Icons**, **Zod**, **Axios**, **TanStack Query**, and **Sonner Toast** — with a clean architecture and modular folder structure.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/UI
- **Icons:** Lucide Icons
- **Form Validation:** Zod
- **Data Fetching:** Axios + TanStack Query
- **Notifications:** Sonner Toast
- **Linting & Commit Hooks:** ESLint, Husky, Commitlint, Lint-staged

---

## 🏗️ Project Structure

Tamplate-Overview/
│
├── .husky/ # Git hooks for pre-commit checks
├── .next/ # Next.js build output
├── node_modules/ # Project dependencies
├── public/ # Static assets
│
├── src/
│ ├── app/
│ │ ├── (website)/ # Main website routes
│ │ │ ├── (auth)/ # Authentication routes
│ │ │ │ ├── create-new-password/
│ │ │ │ ├── create-your-account/
│ │ │ │ ├── login/
│ │ │ │ ├── reset-your-password/
│ │ │ │ ├── verify-otp/
│ │ │ │ └── layout.tsx
│ │ │ ├── contact-us/
│ │ │ ├── privacy-policy/
│ │ │ ├── products/
│ │ │ ├── terms-conditions/
│ │ │ ├── layout.tsx
│ │ │ └── page.tsx
│ │ ├── api/
│ │ │ └── auth/[...nextauth]/route.ts
│ │ ├── globals.css
│ │ ├── layout.tsx
│ │ └── not-found.tsx
│ │
│ ├── components/
│ │ ├── ReusableSection/
│ │ │ ├── ContactInformation.tsx
│ │ │ ├── GetInTouch.tsx
│ │ │ └── Review.tsx
│ │ ├── ui/ # Reusable UI components (shadcn)
│ │ └── website/
│ │ ├── Auth/
│ │ │ ├── CreateNewPassword.tsx
│ │ │ ├── CreateYourAccount.tsx
│ │ │ ├── Login.tsx
│ │ │ ├── ResetYourPassword.tsx
│ │ │ └── VerifyOTP.tsx
│ │ ├── Common/
│ │ │ ├── Footer.tsx
│ │ │ └── Navbar.tsx
│ │ └── PageSections/
│ │ ├── HomePage/
│ │ ├── PrivacyPolicy/
│ │ ├── ProductsPage/
│ │ └── TermsConditions/
│ │
│ ├── hooks/ # Custom React hooks
│ ├── lib/ # API and utility functions
│ │ ├── api.ts
│ │ └── utils.ts
│ └── Providers/ # Global providers
│ ├── MainProviders.tsx
│ └── Provider.tsx
│
├── .gitignore
├── .lintstagedrc.json
├── commitlint.config.js
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
└── tailwind.config.ts

---

## ⚙️ Setup & Installation

# 1️⃣ Clone the repository

git clone https://github.com/yourusername/POLSPOCH-WEBSITE.git

# 2️⃣ Navigate to the project

cd POLSPOCH-WEBSITE

# 3️⃣ Install dependencies

npm install

# 4️⃣ Run development server

npm run dev
Then open http://localhost:3000 in your browser.

🧩 Features
✨ Modern UI built with Tailwind + Shadcn

🔐 Authentication with NextAuth.js

⚡ API integration with Axios

🔍 Data fetching & caching using TanStack Query

🧠 Strong validation using Zod

💬 Beautiful toasts with Sonner

🧰 Modular, scalable folder structure

🔒 Husky pre-commit hook + Commitlint setup

📦 Scripts
Command Description
npm run dev Start development server
npm run build Create production build
npm run start Run production build
npm run lint Run ESLint
npm run format Prettify code (if configured)

🧪 Husky Setup (Pre-commit)
This project uses Husky and Lint-staged to enforce clean commits.

# Add a new hook

npx husky add .husky/pre-commit "npm run lint"
git add .husky/pre-commit

🧑‍💻 Author
Rashedul Haque Rasel
Built with ❤️ using Next.js, TypeScript, and Tailwind CSS.
