# 💰 ExpenseFlow - Personal Expense Tracker App

> A modern, responsive, and intuitive Expense Tracker web application built with vanilla HTML5, CSS3, and JavaScript. Designed and implemented for the **LTS Family Software Developer Intern** recruitment process.

[![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-blue)](#tech-stack)
[![Persistence](https://img.shields.io/badge/Storage-Browser%20Local%20Storage-emerald)](#features)
[![Design](https://img.shields.io/badge/Design-Responsive%20%26%20Themeable-purple)](#key-features)
[![License](https://img.shields.io/badge/License-MIT-gray)](#license)

---

## 📌 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
  - [Core Objectives (100% Implemented)](#core-objectives)
  - [Optional Bonus Features (100% Implemented)](#optional-bonus-features)
  - [Extra Quality-of-Life Enhancements](#extra-quality-of-life-enhancements)
- [Quick Start & How to Run](#quick-start--how-to-run)
- [Project Architecture & File Structure](#project-architecture--file-structure)
- [Design Decisions & Engineering Highlights](#design-decisions--engineering-highlights)
- [GitHub Submission Guide](#github-submission-guide)
- [Candidate Information](#candidate-information)

---

## 🚀 Overview

**ExpenseFlow** is a lightweight, zero-dependency client-side financial management tool. It empowers users to monitor their personal cash flows, track expenses by categories, evaluate savings rates, and explore historical trends through interactive visual charts and monthly summaries—all without needing a backend server or complex build tools.

---

## ✨ Key Features

### Core Objectives
- [x] **Add Transactions**: Easily record **Income** or **Expense** entries with dynamic category lists, real-time validations, and automatic default dates.
- [x] **Detailed Transaction Metadata**: Input amount, category, transaction date, and descriptive memo.
- [x] **Edit & Update**: Seamlessly edit existing transactions in-place with instant UI feedback and form pre-population.
- [x] **Delete with Confirmation**: Safeguard against accidental deletion via an accessible confirmation modal dialog.
- [x] **Financial Dashboard Summary**: Real-time calculated cards showing:
  - **Net Balance** (with status badges: Surplus vs Deficit)
  - **Total Income** & count
  - **Total Expenses** & count
  - **Current Month Spending & Income**
  - **Savings Rate Percentage**
- [x] **Comprehensive Filtering & Sorting**:
  - Filter by **Type** (All / Income Only / Expense Only)
  - Filter by **Category** (Dynamic category list)
  - Filter by **Timeframe** (All Time / This Month / Last Month / Last 30 Days / This Year)
  - Live **Search** by description or category name
  - **Sort** by Date (Newest/Oldest) or Amount (Highest/Lowest)
- [x] **Local Storage Persistence**:
  - All transactions and user preferences (Theme & Currency) are automatically persisted across browser reloads.
- [x] **Responsive Mobile & Desktop Design**:
  - Fluid grid layout adapting smoothly from 320px mobile screens to large desktop monitors.

---

### Optional Bonus Features
- [x] **Category-Wise Expense Chart**: Interactive doughnut chart using Chart.js displaying visual percentage distribution per category with custom tooltips.
- [x] **Monthly Trend Summary & Chart**: 
  - Month-over-month cash flow bar chart (Income vs Expense).
  - Monthly breakdown summary table showing total income, total expense, and net balance for each recorded month.
- [x] **Comprehensive Form Validation & Error Handling**:
  - Positive numeric amount validation with reasonable boundary checks.
  - Required fields check (Category, Date, Description).
  - Real-time inline field error indicators and character counters.
  - Non-blocking, auto-dismissing Toast notification system for user actions.

---

### Extra Quality-of-Life Enhancements
- 🌓 **Dark / Light Theme**: Full theme toggle with CSS variables and preference persistence.
- 💱 **Multi-Currency Selector**: Switch seamlessly between `₹` (INR), `$` (USD), `€` (EUR), `£` (GBP), `¥` (JPY), `C$` (CAD), and `A$` (AUD).
- 📥 **One-Click Demo Data**: Evaluators can instantly populate realistic sample data with one click to test filtering, editing, and charts immediately.
- 📤 **Export to CSV**: Download your transactions as an organized `.csv` spreadsheet anytime.
- 🗑️ **Clear All Data**: Reset storage cleanly with modal confirmation.

---

## 💻 Quick Start & How to Run

Because ExpenseFlow is built using pure web standards (HTML5, CSS3, JavaScript), **no build step, Node.js, or package installation is required**.

### Option 1: Direct File Open (Easiest)
1. Clone or download the repository to your computer.
2. Open the project folder.
3. Double-click `index.html` to open it in your favorite web browser (Chrome, Edge, Firefox, Safari, etc.).

### Option 2: Using VS Code Live Server
1. Open the project folder in **Visual Studio Code**.
2. Right-click `index.html`.
3. Select **"Open with Live Server"**.

### Option 3: Using Python Built-in HTTP Server
If you prefer running a local development server, run:
```bash
# Navigate to the project directory
cd expense-tracker-kevin

# Start a local web server (Python 3)
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

---

## 📂 Project Architecture & File Structure

```text
expense-tracker-candidate-name/
├── index.html          # Semantic HTML5 markup, accessible layouts, modals, and templates
├── css/
│   └── style.css       # Clean CSS3 design system (variables, responsive grid, light/dark themes)
├── js/
│   └── app.js          # Modular ES6+ JavaScript (State, Storage, Validation, Charts, UI)
└── README.md           # Documentation, run instructions, and assessment submission details
```

### Modular Code Overview (`js/app.js`):
- `Storage`: Encapsulates `localStorage` CRUD operations with error handling and fallback defaults.
- `Format`: Utility functions for currency localization, human-readable dates, and category icons.
- `Form`: Real-time input validation, type switching, category binding, and edit mode lifecycle.
- `AppController`: High-level business logic coordinating state mutations and view refreshes.
- `UI`: Re-renders summary cards, filtered transaction lists, and monthly summary tables.
- `Charts`: Manages Chart.js instances for category doughnut and monthly trend bar charts.
- `Toast`: Lightweight notification system providing user feedback without page interruptions.

---

## 🎨 Design Decisions & Engineering Highlights

1. **Clean Separation of Concerns**: Structure (`index.html`), presentation (`css/style.css`), and behavior (`js/app.js`) are decoupled cleanly.
2. **Accessible & Responsive**: Uses semantic HTML (`<main>`, `<section>`, `<header>`, `<nav>`, `role="radiogroup"`), high-contrast badges, and touch-friendly button targets (>= 44px).
3. **Graceful Fallbacks**: If external CDNs are unavailable or the app is loaded offline, chart fallbacks ensure that the core app and data remain fully usable.
4. **Data Sanitization**: Employs an `escapeHtml()` helper when rendering user-submitted text descriptions to defend against XSS injection.

---

## 📤 GitHub Submission Guide

Follow these steps to submit this task to LTS before the **13th October 2026, 5:00 PM** deadline:

### 1. Create a Repository on GitHub
1. Log into your GitHub account.
2. Click **New Repository** (`+` icon in top-right corner).
3. Name the repository:
   ```
   expense-tracker-kevin
   ```
   *(following the guideline: `expense-tracker-candidate-name`)*
4. Set visibility to **Public**.
5. Do **not** initialize with README (as we already have a comprehensive one prepared).
6. Click **Create repository**.

### 2. Push Your Local Code
Open your terminal (PowerShell or Git Bash) in this project folder and run:

```bash
# Initialize git repository
git init

# Stage all project files
git add .

# Create initial commit
git commit -m "feat: complete expense tracker application with all bonus features"

# Set default branch to main
git branch -M main

# Link remote repository (replace with your GitHub repository URL)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/expense-tracker-kevin.git

# Push to GitHub
git push -u origin main
```

*(Alternatively, you can upload the folder files directly via GitHub's web interface by clicking **"uploading an existing file"** on your newly created repository page).*

### 3. Share the Link
Copy the public repository link:
```
https://github.com/YOUR_GITHUB_USERNAME/expense-tracker-kevin
```
and submit it according to the LTS recruitment email instructions before **5:00 p.m. on 13th October 2026**.

---

## 👤 Candidate Information

- **Candidate Name**: Kevin
- **Repository Name**: expense-tracker-kevin
- **Role**: Software Developer Intern
- **Organization**: LTS Family Recruitment
- **Task**: Expense Tracker Web Application
- **Deadline**: 13th October 2026, 5:00 PM
- **Status**: Completed (All Core + All Bonus Objectives)
