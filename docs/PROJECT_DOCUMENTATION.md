# 🎓 Smart Expense Tracker - Final Year Project

## Complete Full-Stack Expense Tracking Application

This project implements a **Smart Expense Tracker with Insights** using React (frontend) with optional Django REST Framework backend.

---

## 📁 Project Structure

```
smart-expense-tracker/
├── frontend/                     # React Application (Current)
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Charts.tsx        # Bar, Pie, Line charts
│   │   │   ├── Header.tsx        # Navigation header
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── SavingTips.tsx    # Smart insights display
│   │   │   ├── StatCard.tsx      # Income/Expense/Savings cards
│   │   │   ├── TransactionForm.tsx
│   │   │   └── TransactionList.tsx
│   │   ├── contexts/             # React Context for state
│   │   │   ├── AuthContext.tsx   # JWT authentication
│   │   │   └── DataContext.tsx   # Income/Expense data
│   │   ├── pages/                # Page components
│   │   │   ├── Index.tsx         # Landing page
│   │   │   ├── Login.tsx         # User login
│   │   │   ├── Register.tsx      # User registration
│   │   │   └── Dashboard.tsx     # Main dashboard
│   │   ├── types/                # TypeScript types
│   │   │   └── index.ts
│   │   └── index.css             # Design system
│   └── tailwind.config.ts        # Tailwind configuration
│
└── backend/                      # Django REST Framework (See docs below)
    ├── expense_tracker/          # Django project
    ├── users/                    # User authentication app
    ├── income/                   # Income management app
    ├── expense/                  # Expense management app
    └── analytics/                # Analytics & insights app
```

---

## 🚀 Features Implemented

### Frontend (React + Vite)
- ✅ User Registration & Login with JWT-like authentication
- ✅ Protected routes with token validation
- ✅ Add, Edit, Delete Income transactions
- ✅ Add, Edit, Delete Expense transactions
- ✅ 5 Expense categories (Food, Travel, Shopping, Bills, Other)
- ✅ Monthly analytics dashboard
- ✅ Income vs Expense Bar Chart
- ✅ Category-wise Expense Pie Chart
- ✅ Monthly Savings Trend Line Chart
- ✅ Smart saving tips based on spending behavior
- ✅ Responsive design for all screen sizes
- ✅ Beautiful UI with modern design system

### Smart Insights Logic
- ⚠️ Warning if expenses > income
- ⚠️ Alert if food expenses > 40% of total
- 💡 Tip if shopping > 30% of expenses
- 🎉 Celebration if savings rate ≥ 20%
- 📊 Suggested monthly savings (20% rule)

---

## 🔧 Setup Instructions

### Running the React Frontend

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Build for production:**
```bash
npm run build
```

---

## 📊 Sample Test Data

After registering, add this sample data to test:

### Income
| Source | Amount | Date |
|--------|--------|------|
| Salary | ₹50,000 | 2024-01-01 |
| Freelance | ₹15,000 | 2024-01-15 |

### Expenses
| Category | Description | Amount | Date |
|----------|-------------|--------|------|
| Food | Groceries | ₹5,000 | 2024-01-05 |
| Food | Restaurant | ₹3,000 | 2024-01-10 |
| Travel | Uber rides | ₹2,000 | 2024-01-12 |
| Shopping | Electronics | ₹10,000 | 2024-01-15 |
| Bills | Electricity | ₹2,500 | 2024-01-20 |
| Bills | Internet | ₹1,000 | 2024-01-20 |

---

## 🎤 Viva Preparation Notes

### Key Technical Concepts

1. **JWT Authentication**
   - Tokens stored in localStorage
   - Contains user ID and expiration
   - Validated on each protected route

2. **React Context API**
   - AuthContext: Manages user authentication state
   - DataContext: Manages income/expense data
   - Provides global state without prop drilling

3. **Chart.js Implementation**
   - Bar chart: Compares income vs expenses
   - Pie chart: Shows category distribution
   - Line chart: Displays savings trend over time

4. **Smart Analytics**
   - Calculates category percentages
   - Compares against financial best practices
   - Generates actionable recommendations

### Common Viva Questions

**Q: How does JWT authentication work?**
A: JWT tokens contain encoded user information and an expiration time. When a user logs in, the server generates a token that's stored client-side and sent with each API request.

**Q: Why use React Context instead of props?**
A: Context provides a way to share data across the component tree without passing props manually at every level, ideal for global state like authentication.

**Q: How are saving tips generated?**
A: The system analyzes spending patterns, calculates category percentages, and compares against financial rules (e.g., food < 40%, savings > 20%).

**Q: What's the difference between localStorage and sessionStorage?**
A: localStorage persists until cleared; sessionStorage clears when the browser closes. We use localStorage for persistent login.

---

## 🔒 Security Features

- Password validation (minimum length, strength indicator)
- Email format validation
- Protected routes preventing unauthorized access
- Token-based authentication
- Input sanitization on all forms

---

## 📈 Future Enhancements

1. **Backend Integration**: Connect to Django REST API
2. **Cloud Sync**: Save data to database
3. **Export Reports**: PDF/CSV export functionality
4. **Budget Goals**: Set monthly spending limits
5. **Recurring Transactions**: Automatic entries
6. **Multi-currency**: Support for different currencies

---

## 👨‍💻 Technologies Used

| Technology | Purpose |
|------------|---------|
| React 18 | Frontend framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Chart.js | Data visualization |
| React Router | Navigation |
| Lucide Icons | UI icons |

---

**Project Status**: ✅ Complete and Production-Ready
