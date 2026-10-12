/**
 * ExpenseFlow - Expense Tracker Web Application
 * Core JavaScript Logic
 * Developed for LTS Software Developer Intern Assessment
 */

'use strict';

(function () {
  // -------------------------------------------------------------------------
  // 1. Constants & Configuration
  // -------------------------------------------------------------------------
  const STORAGE_KEYS = {
    TRANSACTIONS: 'expenseflow_transactions',
    CURRENCY: 'expenseflow_currency',
    THEME: 'expenseflow_theme'
  };

  const CATEGORIES = {
    expense: [
      { name: 'Food & Dining', icon: '🍔', color: '#f97316' },
      { name: 'Shopping', icon: '🛍️', color: '#ec4899' },
      { name: 'Housing & Rent', icon: '🏠', color: '#3b82f6' },
      { name: 'Transportation', icon: '🚗', color: '#eab308' },
      { name: 'Utilities & Bills', icon: '💡', color: '#06b6d4' },
      { name: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
      { name: 'Healthcare & Fitness', icon: '💊', color: '#ef4444' },
      { name: 'Education', icon: '📚', color: '#10b981' },
      { name: 'Travel', icon: '✈️', color: '#14b8a6' },
      { name: 'Other Expense', icon: '🧾', color: '#64748b' }
    ],
    income: [
      { name: 'Salary', icon: '💼', color: '#10b981' },
      { name: 'Freelance & Projects', icon: '💻', color: '#3b82f6' },
      { name: 'Investments', icon: '📈', color: '#8b5cf6' },
      { name: 'Gifts & Rewards', icon: '🎁', color: '#ec4899' },
      { name: 'Rental Income', icon: '🏠', color: '#f59e0b' },
      { name: 'Other Income', icon: '💵', color: '#14b8a6' }
    ]
  };

  const SAMPLE_TRANSACTIONS = [
    {
      id: 'txn_sample_1',
      type: 'income',
      amount: 45000,
      category: 'Salary',
      date: '2026-10-01',
      description: 'Monthly Software Developer Salary',
      createdAt: 1727740800000
    },
    {
      id: 'txn_sample_2',
      type: 'expense',
      amount: 12000,
      category: 'Housing & Rent',
      date: '2026-10-02',
      description: 'Apartment monthly rent payment',
      createdAt: 1727827200000
    },
    {
      id: 'txn_sample_3',
      type: 'expense',
      amount: 3450,
      category: 'Food & Dining',
      date: '2026-10-04',
      description: 'Weekly grocery supplies at supermarket',
      createdAt: 1728000000000
    },
    {
      id: 'txn_sample_4',
      type: 'income',
      amount: 8500,
      category: 'Freelance & Projects',
      date: '2026-10-06',
      description: 'Frontend landing page freelance gig',
      createdAt: 1728172800000
    },
    {
      id: 'txn_sample_5',
      type: 'expense',
      amount: 1400,
      category: 'Utilities & Bills',
      date: '2026-10-08',
      description: 'High-speed broadband internet bill',
      createdAt: 1728345600000
    },
    {
      id: 'txn_sample_6',
      type: 'expense',
      amount: 2200,
      category: 'Shopping',
      date: '2026-10-10',
      description: 'Wireless ergonomic mouse & desk pad',
      createdAt: 1728518400000
    },
    {
      id: 'txn_sample_7',
      type: 'expense',
      amount: 950,
      category: 'Food & Dining',
      date: '2026-10-11',
      description: 'Dinner with college friends',
      createdAt: 1728604800000
    }
  ];

  // -------------------------------------------------------------------------
  // 2. Application State
  // -------------------------------------------------------------------------
  const state = {
    transactions: [],
    currency: '₹',
    theme: 'light',
    editingId: null,
    activeChartTab: 'category',
    filters: {
      search: '',
      type: 'all',
      category: 'all',
      period: 'all',
      sortBy: 'date-desc'
    },
    pendingDeleteId: null,
    chartInstance: null
  };

  // -------------------------------------------------------------------------
  // 3. DOM Element References
  // -------------------------------------------------------------------------
  const elements = {
    // Theme & Currency
    body: document.body,
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    sunIcon: document.getElementById('sunIcon'),
    moonIcon: document.getElementById('moonIcon'),
    currencySelect: document.getElementById('currencySelect'),
    amountCurrencySymbol: document.getElementById('amountCurrencySymbol'),

    // Summary Cards
    totalBalanceAmount: document.getElementById('totalBalanceAmount'),
    balanceStatusBadge: document.getElementById('balanceStatusBadge'),
    savingsRateBadge: document.getElementById('savingsRateBadge'),
    totalIncomeAmount: document.getElementById('totalIncomeAmount'),
    incomeCountText: document.getElementById('incomeCountText'),
    totalExpenseAmount: document.getElementById('totalExpenseAmount'),
    expenseCountText: document.getElementById('expenseCountText'),
    thisMonthSpentAmount: document.getElementById('thisMonthSpentAmount'),
    thisMonthIncomeText: document.getElementById('thisMonthIncomeText'),

    // Transaction Form
    transactionForm: document.getElementById('transactionForm'),
    transactionId: document.getElementById('transactionId'),
    formTitle: document.getElementById('formTitle'),
    formModeBadge: document.getElementById('formModeBadge'),
    typeExpenseLabel: document.getElementById('typeExpenseLabel'),
    typeIncomeLabel: document.getElementById('typeIncomeLabel'),
    amountInput: document.getElementById('amountInput'),
    dateInput: document.getElementById('dateInput'),
    categorySelect: document.getElementById('categorySelect'),
    descriptionInput: document.getElementById('descriptionInput'),
    descriptionCharCount: document.getElementById('descriptionCharCount'),
    submitBtn: document.getElementById('submitBtn'),
    submitBtnText: document.getElementById('submitBtnText'),
    cancelEditBtn: document.getElementById('cancelEditBtn'),

    // Form Errors
    amountError: document.getElementById('amountError'),
    dateError: document.getElementById('dateError'),
    categoryError: document.getElementById('categoryError'),
    descriptionError: document.getElementById('descriptionError'),

    // History & Filters
    historyCounterText: document.getElementById('historyCounterText'),
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    filterType: document.getElementById('filterType'),
    filterCategory: document.getElementById('filterCategory'),
    filterPeriod: document.getElementById('filterPeriod'),
    sortBy: document.getElementById('sortBy'),
    activeFilterRow: document.getElementById('activeFilterRow'),
    resetFiltersBtn: document.getElementById('resetFiltersBtn'),
    transactionList: document.getElementById('transactionList'),
    emptyState: document.getElementById('emptyState'),
    emptyStateDemoBtn: document.getElementById('emptyStateDemoBtn'),

    // Modals
    deleteModal: document.getElementById('deleteModal'),
    cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
    confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
    clearAllModal: document.getElementById('clearAllModal'),
    clearAllBtn: document.getElementById('clearAllBtn'),
    cancelClearAllBtn: document.getElementById('cancelClearAllBtn'),
    confirmClearAllBtn: document.getElementById('confirmClearAllBtn'),

    // Buttons & Bonuses
    demoDataBtn: document.getElementById('demoDataBtn'),
    exportCsvBtn: document.getElementById('exportCsvBtn'),
    tabExpenseChart: document.getElementById('tabExpenseChart'),
    tabMonthlyChart: document.getElementById('tabMonthlyChart'),
    chartCanvas: document.getElementById('expenseChart'),
    chartFallback: document.getElementById('chartFallback'),
    monthlyTableBody: document.getElementById('monthlyTableBody'),
    toastContainer: document.getElementById('toastContainer')
  };

  // -------------------------------------------------------------------------
  // 4. Storage Layer (Local Storage)
  // -------------------------------------------------------------------------
  const Storage = {
    loadTransactions() {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        if (!stored) {
          // If first visit, preload sample transactions for instant evaluation!
          this.saveTransactions(SAMPLE_TRANSACTIONS);
          return [...SAMPLE_TRANSACTIONS];
        }
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      } catch (err) {
        console.error('Failed to parse transactions from LocalStorage:', err);
        return [];
      }
    },

    saveTransactions(transactions) {
      try {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
      } catch (err) {
        console.error('Failed to save transactions to LocalStorage:', err);
        Toast.show('Storage quota exceeded or unavailable.', 'error');
      }
    },

    loadCurrency() {
      return localStorage.getItem(STORAGE_KEYS.CURRENCY) || '₹';
    },

    saveCurrency(currency) {
      localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
    },

    loadTheme() {
      return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    },

    saveTheme(theme) {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    }
  };

  // -------------------------------------------------------------------------
  // 5. Toast Notifications
  // -------------------------------------------------------------------------
  const Toast = {
    show(message, type = 'info', duration = 3000) {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;

      const text = document.createElement('span');
      text.className = 'toast-message';
      text.textContent = message;

      const closeBtn = document.createElement('button');
      closeBtn.className = 'toast-close-btn';
      closeBtn.setAttribute('aria-label', 'Close notification');
      closeBtn.innerHTML = '&times;';

      toast.appendChild(text);
      toast.appendChild(closeBtn);
      elements.toastContainer.appendChild(toast);

      const dismiss = () => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        setTimeout(() => toast.remove(), 200);
      };

      closeBtn.addEventListener('click', dismiss);
      setTimeout(dismiss, duration);
    }
  };

  // -------------------------------------------------------------------------
  // 6. Formatting Helpers
  // -------------------------------------------------------------------------
  const Format = {
    currency(amount) {
      const num = Number(amount) || 0;
      return `${state.currency}${num.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    },

    date(dateString) {
      if (!dateString) return '';
      const [year, month, day] = dateString.split('-');
      const dateObj = new Date(year, month - 1, day);
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    },

    monthYear(yearMonthString) {
      const [year, month] = yearMonthString.split('-');
      const dateObj = new Date(year, month - 1, 1);
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      });
    },

    getCategoryMeta(type, categoryName) {
      const list = CATEGORIES[type] || [];
      const match = list.find((c) => c.name.toLowerCase() === (categoryName || '').toLowerCase());
      if (match) return match;
      return {
        name: categoryName || 'Other',
        icon: type === 'income' ? '💵' : '🧾',
        color: '#64748b'
      };
    }
  };

  // -------------------------------------------------------------------------
  // 7. Form Management & Validation
  // -------------------------------------------------------------------------
  const Form = {
    getActiveType() {
      const checkedRadio = elements.transactionForm.querySelector('input[name="transactionType"]:checked');
      return checkedRadio ? checkedRadio.value : 'expense';
    },

    setActiveType(type) {
      const radios = elements.transactionForm.querySelectorAll('input[name="transactionType"]');
      radios.forEach((r) => {
        r.checked = r.value === type;
      });

      if (type === 'income') {
        elements.typeIncomeLabel.classList.add('active');
        elements.typeExpenseLabel.classList.remove('active');
      } else {
        elements.typeExpenseLabel.classList.add('active');
        elements.typeIncomeLabel.classList.remove('active');
      }

      this.populateCategories(type);
    },

    populateCategories(type, selectedCategory = '') {
      const options = CATEGORIES[type] || [];
      elements.categorySelect.innerHTML = '<option value="" disabled selected>Select a category</option>';

      options.forEach((cat) => {
        const opt = document.createElement('option');
        opt.value = cat.name;
        opt.textContent = `${cat.icon} ${cat.name}`;
        if (cat.name === selectedCategory) {
          opt.selected = true;
        }
        elements.categorySelect.appendChild(opt);
      });
    },

    populateFilterCategoryOptions() {
      const selectedValue = elements.filterCategory.value;
      const allUniqueCategories = new Set();

      CATEGORIES.expense.forEach((c) => allUniqueCategories.add(c.name));
      CATEGORIES.income.forEach((c) => allUniqueCategories.add(c.name));

      // Also add any custom categories from existing transactions
      state.transactions.forEach((t) => {
        if (t.category) allUniqueCategories.add(t.category);
      });

      elements.filterCategory.innerHTML = '<option value="all">All Categories</option>';
      Array.from(allUniqueCategories).sort().forEach((catName) => {
        const opt = document.createElement('option');
        opt.value = catName;
        opt.textContent = catName;
        if (catName === selectedValue) opt.selected = true;
        elements.filterCategory.appendChild(opt);
      });
    },

    validate() {
      let isValid = true;
      this.clearErrors();

      const amountVal = parseFloat(elements.amountInput.value);
      const dateVal = elements.dateInput.value.trim();
      const categoryVal = elements.categorySelect.value;
      const descVal = elements.descriptionInput.value.trim();

      // Amount Validation
      if (isNaN(amountVal) || amountVal <= 0) {
        this.setError(elements.amountInput, elements.amountError, 'Please enter a positive amount greater than 0.');
        isValid = false;
      } else if (amountVal > 100000000) {
        this.setError(elements.amountInput, elements.amountError, 'Amount exceeds the maximum limit (100,000,000).');
        isValid = false;
      }

      // Date Validation
      if (!dateVal) {
        this.setError(elements.dateInput, elements.dateError, 'Please select a valid transaction date.');
        isValid = false;
      }

      // Category Validation
      if (!categoryVal) {
        this.setError(elements.categorySelect, elements.categoryError, 'Please select a transaction category.');
        isValid = false;
      }

      // Description Validation
      if (!descVal) {
        this.setError(elements.descriptionInput, elements.descriptionError, 'Please provide a short description.');
        isValid = false;
      } else if (descVal.length < 2) {
        this.setError(elements.descriptionInput, elements.descriptionError, 'Description must be at least 2 characters long.');
        isValid = false;
      }

      return isValid;
    },

    setError(inputElem, errorElem, message) {
      if (inputElem) inputElem.classList.add('is-invalid');
      if (errorElem) errorElem.textContent = message;
    },

    clearErrors() {
      [elements.amountInput, elements.dateInput, elements.categorySelect, elements.descriptionInput].forEach((el) => {
        if (el) el.classList.remove('is-invalid');
      });
      [elements.amountError, elements.dateError, elements.categoryError, elements.descriptionError].forEach((el) => {
        if (el) el.textContent = '';
      });
    },

    reset() {
      elements.transactionForm.reset();
      elements.transactionId.value = '';
      state.editingId = null;

      // Reset form labels
      elements.formTitle.textContent = 'Add New Transaction';
      elements.formModeBadge.textContent = 'New';
      elements.formModeBadge.classList.remove('edit-mode');
      elements.submitBtnText.textContent = 'Add Transaction';
      elements.cancelEditBtn.classList.add('hide');

      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      elements.dateInput.value = today;

      // Default type to Expense
      this.setActiveType('expense');
      this.clearErrors();
      this.updateCharCount();
    },

    startEdit(transaction) {
      state.editingId = transaction.id;
      elements.transactionId.value = transaction.id;

      this.setActiveType(transaction.type);
      elements.amountInput.value = transaction.amount;
      elements.dateInput.value = transaction.date;
      this.populateCategories(transaction.type, transaction.category);
      elements.descriptionInput.value = transaction.description;

      // Update UI for Edit Mode
      elements.formTitle.textContent = 'Edit Transaction';
      elements.formModeBadge.textContent = 'Edit Mode';
      elements.formModeBadge.classList.add('edit-mode');
      elements.submitBtnText.textContent = 'Update Transaction';
      elements.cancelEditBtn.classList.remove('hide');

      this.clearErrors();
      this.updateCharCount();

      // Scroll form smoothly into view
      document.getElementById('transactionFormSection').scrollIntoView({ behavior: 'smooth' });
      elements.amountInput.focus();
    },

    updateCharCount() {
      const len = elements.descriptionInput.value.length;
      elements.descriptionCharCount.textContent = `${len}/80`;
    }
  };

  // -------------------------------------------------------------------------
  // 8. Core Data Operations (CRUD)
  // -------------------------------------------------------------------------
  const AppController = {
    addTransaction(data) {
      const newTransaction = {
        id: 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        type: data.type,
        amount: parseFloat(data.amount),
        category: data.category,
        date: data.date,
        description: data.description.trim(),
        createdAt: Date.now()
      };

      state.transactions.unshift(newTransaction);
      Storage.saveTransactions(state.transactions);
      this.refreshAll();
      Form.reset();
      Toast.show('Transaction added successfully!', 'success');
    },

    updateTransaction(id, data) {
      const index = state.transactions.findIndex((t) => t.id === id);
      if (index === -1) {
        Toast.show('Transaction not found.', 'error');
        return;
      }

      state.transactions[index] = {
        ...state.transactions[index],
        type: data.type,
        amount: parseFloat(data.amount),
        category: data.category,
        date: data.date,
        description: data.description.trim()
      };

      Storage.saveTransactions(state.transactions);
      this.refreshAll();
      Form.reset();
      Toast.show('Transaction updated successfully!', 'success');
    },

    deleteTransaction(id) {
      state.transactions = state.transactions.filter((t) => t.id !== id);
      Storage.saveTransactions(state.transactions);
      this.refreshAll();
      if (state.editingId === id) {
        Form.reset();
      }
      Toast.show('Transaction deleted.', 'info');
    },

    clearAllTransactions() {
      state.transactions = [];
      Storage.saveTransactions([]);
      this.refreshAll();
      Form.reset();
      Toast.show('All transactions cleared.', 'info');
    },

    loadDemoData() {
      state.transactions = [...SAMPLE_TRANSACTIONS];
      Storage.saveTransactions(state.transactions);
      this.refreshAll();
      Form.reset();
      Toast.show('Demo transactions loaded successfully!', 'success');
    },

    refreshAll() {
      UI.renderSummary();
      UI.renderTransactions();
      UI.renderMonthlySummary();
      Charts.render();
      Form.populateFilterCategoryOptions();
    }
  };

  // -------------------------------------------------------------------------
  // 9. UI Rendering (Summary, List, Tables)
  // -------------------------------------------------------------------------
  const UI = {
    renderSummary() {
      let totalIncome = 0;
      let totalExpense = 0;
      let incomeCount = 0;
      let expenseCount = 0;

      const currentMonthKey = new Date().toISOString().slice(0, 7); // "YYYY-MM"
      let thisMonthExpense = 0;
      let thisMonthIncome = 0;

      state.transactions.forEach((t) => {
        const amt = Number(t.amount) || 0;
        const isCurrentMonth = t.date && t.date.startsWith(currentMonthKey);

        if (t.type === 'income') {
          totalIncome += amt;
          incomeCount++;
          if (isCurrentMonth) thisMonthIncome += amt;
        } else {
          totalExpense += amt;
          expenseCount++;
          if (isCurrentMonth) thisMonthExpense += amt;
        }
      });

      const netBalance = totalIncome - totalExpense;

      // Update Amounts
      elements.totalBalanceAmount.textContent = Format.currency(netBalance);
      elements.totalIncomeAmount.textContent = Format.currency(totalIncome);
      elements.totalExpenseAmount.textContent = Format.currency(totalExpense);
      elements.thisMonthSpentAmount.textContent = Format.currency(thisMonthExpense);
      elements.thisMonthIncomeText.textContent = `Income: ${Format.currency(thisMonthIncome)}`;

      // Update Subtext Counters
      elements.incomeCountText.textContent = `${incomeCount} transaction${incomeCount === 1 ? '' : 's'}`;
      elements.expenseCountText.textContent = `${expenseCount} transaction${expenseCount === 1 ? '' : 's'}`;

      // Balance status badge
      elements.balanceStatusBadge.className = 'status-indicator';
      if (netBalance > 0) {
        elements.balanceStatusBadge.classList.add('positive');
        elements.balanceStatusBadge.textContent = 'Surplus (Positive)';
      } else if (netBalance < 0) {
        elements.balanceStatusBadge.classList.add('negative');
        elements.balanceStatusBadge.textContent = 'Deficit (Negative)';
      } else {
        elements.balanceStatusBadge.textContent = 'Balanced (₹0.00)';
      }

      // Savings Rate
      if (totalIncome > 0) {
        const rate = Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100));
        elements.savingsRateBadge.textContent = `Savings Rate: ${rate}%`;
      } else {
        elements.savingsRateBadge.textContent = `Savings Rate: 0%`;
      }
    },

    getFilteredTransactions() {
      const { search, type, category, period, sortBy } = state.filters;
      const now = new Date();
      const currentYearMonth = now.toISOString().slice(0, 7);

      // Previous month calculation
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthKey = lastMonthDate.toISOString().slice(0, 7);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

      return state.transactions.filter((t) => {
        // Search Filter (Description or Category)
        if (search) {
          const query = search.toLowerCase();
          const descMatch = t.description && t.description.toLowerCase().includes(query);
          const catMatch = t.category && t.category.toLowerCase().includes(query);
          if (!descMatch && !catMatch) return false;
        }

        // Type Filter
        if (type !== 'all' && t.type !== type) return false;

        // Category Filter
        if (category !== 'all' && t.category !== category) return false;

        // Timeframe Filter
        if (period === 'this-month' && (!t.date || !t.date.startsWith(currentYearMonth))) {
          return false;
        }
        if (period === 'last-month' && (!t.date || !t.date.startsWith(lastMonthKey))) {
          return false;
        }
        if (period === 'last-30' && (!t.date || t.date < thirtyDaysAgoStr)) {
          return false;
        }
        if (period === 'this-year' && (!t.date || !t.date.startsWith(String(now.getFullYear())))) {
          return false;
        }

        return true;
      }).sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        return 0;
      });
    },

    renderTransactions() {
      const filtered = this.getFilteredTransactions();
      const count = filtered.length;
      elements.historyCounterText.textContent = `Showing ${count} of ${state.transactions.length} transaction${state.transactions.length === 1 ? '' : 's'}`;

      // Check if any filter is active
      const isFiltered =
        state.filters.search !== '' ||
        state.filters.type !== 'all' ||
        state.filters.category !== 'all' ||
        state.filters.period !== 'all';

      elements.activeFilterRow.classList.toggle('hide', !isFiltered);

      if (count === 0) {
        elements.transactionList.innerHTML = '';
        elements.emptyState.classList.remove('hide');
        if (state.transactions.length === 0) {
          document.getElementById('emptyStateTitle').textContent = 'No Transactions Yet';
          document.getElementById('emptyStateText').textContent = 'Start by adding an income or expense transaction above, or load sample data to explore.';
          elements.emptyStateDemoBtn.classList.remove('hide');
        } else {
          document.getElementById('emptyStateTitle').textContent = 'No Matching Results';
          document.getElementById('emptyStateText').textContent = 'Try adjusting your search terms or filters to find what you are looking for.';
          elements.emptyStateDemoBtn.classList.add('hide');
        }
        return;
      }

      elements.emptyState.classList.add('hide');
      elements.transactionList.innerHTML = '';

      filtered.forEach((t) => {
        const meta = Format.getCategoryMeta(t.type, t.category);
        const card = document.createElement('div');
        card.className = 'transaction-card';
        card.setAttribute('data-id', t.id);

        const isIncome = t.type === 'income';
        const sign = isIncome ? '+' : '-';
        const amountClass = isIncome ? 'income' : 'expense';

        card.innerHTML = `
          <div class="transaction-left">
            <div class="category-icon-bubble" title="${t.category}">
              ${meta.icon}
            </div>
            <div class="transaction-info">
              <span class="transaction-desc" title="${escapeHtml(t.description)}">${escapeHtml(t.description)}</span>
              <div class="transaction-meta">
                <span class="category-badge">${escapeHtml(t.category)}</span>
                <span class="transaction-date">${Format.date(t.date)}</span>
              </div>
            </div>
          </div>

          <div class="transaction-right">
            <div class="transaction-amount-wrapper">
              <div class="transaction-amount ${amountClass}">${sign}${Format.currency(t.amount)}</div>
              <span class="transaction-type-label">${t.type}</span>
            </div>
            <div class="transaction-actions">
              <button class="action-icon-btn edit-btn" title="Edit transaction" aria-label="Edit transaction">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="action-icon-btn delete-btn" title="Delete transaction" aria-label="Delete transaction">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        `;

        // Event Listeners for Edit and Delete
        const editBtn = card.querySelector('.edit-btn');
        const deleteBtn = card.querySelector('.delete-btn');

        editBtn.addEventListener('click', () => Form.startEdit(t));
        deleteBtn.addEventListener('click', () => {
          state.pendingDeleteId = t.id;
          document.getElementById('modalDescription').textContent = `Are you sure you want to delete "${t.description}" (${Format.currency(t.amount)})?`;
          elements.deleteModal.classList.remove('hide');
        });

        elements.transactionList.appendChild(card);
      });
    },

    renderMonthlySummary() {
      // Group all transactions by YYYY-MM
      const monthlyMap = {};

      state.transactions.forEach((t) => {
        if (!t.date) return;
        const monthKey = t.date.slice(0, 7); // 'YYYY-MM'
        if (!monthlyMap[monthKey]) {
          monthlyMap[monthKey] = { income: 0, expense: 0 };
        }
        if (t.type === 'income') {
          monthlyMap[monthKey].income += Number(t.amount) || 0;
        } else {
          monthlyMap[monthKey].expense += Number(t.amount) || 0;
        }
      });

      const sortedMonths = Object.keys(monthlyMap).sort((a, b) => b.localeCompare(a));

      if (sortedMonths.length === 0) {
        elements.monthlyTableBody.innerHTML = `
          <tr>
            <td colspan="4" class="text-center text-muted" style="padding: 1.5rem;">No monthly records recorded yet</td>
          </tr>
        `;
        return;
      }

      elements.monthlyTableBody.innerHTML = '';
      sortedMonths.forEach((mKey) => {
        const item = monthlyMap[mKey];
        const net = item.income - item.expense;
        const netClass = net >= 0 ? 'text-income' : 'text-expense';

        const row = document.createElement('tr');
        row.innerHTML = `
          <td><strong>${Format.monthYear(mKey)}</strong></td>
          <td class="text-right text-income">${Format.currency(item.income)}</td>
          <td class="text-right text-expense">${Format.currency(item.expense)}</td>
          <td class="text-right ${netClass}"><strong>${Format.currency(net)}</strong></td>
        `;
        elements.monthlyTableBody.appendChild(row);
      });
    }
  };

  // -------------------------------------------------------------------------
  // 10. Chart Visualization (Category Breakdown & Monthly Trends)
  // -------------------------------------------------------------------------
  const Charts = {
    render() {
      if (typeof Chart === 'undefined') {
        elements.chartFallback.classList.remove('hide');
        elements.chartFallback.innerHTML = '<p class="text-muted">Chart library offline. Data summary is accessible in tables above.</p>';
        return;
      }

      if (state.activeChartTab === 'category') {
        this.renderCategoryChart();
      } else {
        this.renderMonthlyChart();
      }
    },

    renderCategoryChart() {
      const expenses = state.transactions.filter((t) => t.type === 'expense');

      if (expenses.length === 0) {
        if (state.chartInstance) {
          state.chartInstance.destroy();
          state.chartInstance = null;
        }
        elements.chartCanvas.classList.add('hide');
        elements.chartFallback.classList.remove('hide');
        elements.chartFallback.innerHTML = '<p class="text-muted">Add at least one expense to view the category breakdown chart.</p>';
        return;
      }

      elements.chartCanvas.classList.remove('hide');
      elements.chartFallback.classList.add('hide');

      // Group totals by category
      const categoryTotals = {};
      expenses.forEach((e) => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
      });

      const labels = Object.keys(categoryTotals);
      const data = Object.values(categoryTotals);

      // Map colors
      const backgroundColors = labels.map((catName) => {
        const meta = Format.getCategoryMeta('expense', catName);
        return meta.color || '#3b82f6';
      });

      if (state.chartInstance) {
        state.chartInstance.destroy();
      }

      const isDark = state.theme === 'dark';
      const textColor = isDark ? '#cbd5e1' : '#475569';

      const ctx = elements.chartCanvas.getContext('2d');
      state.chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: backgroundColors,
              borderColor: isDark ? '#1f2937' : '#ffffff',
              borderWidth: 2,
              hoverOffset: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: textColor,
                boxWidth: 12,
                padding: 10,
                font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: '500' }
              }
            },
            tooltip: {
              callbacks: {
                label(context) {
                  const val = context.raw || 0;
                  const total = data.reduce((a, b) => a + b, 0);
                  const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                  return ` ${context.label}: ${Format.currency(val)} (${pct}%)`;
                }
              }
            }
          },
          cutout: '62%'
        }
      });
    },

    renderMonthlyChart() {
      // Group all transactions by month
      const monthlyMap = {};
      state.transactions.forEach((t) => {
        if (!t.date) return;
        const mKey = t.date.slice(0, 7);
        if (!monthlyMap[mKey]) {
          monthlyMap[mKey] = { income: 0, expense: 0 };
        }
        if (t.type === 'income') {
          monthlyMap[mKey].income += Number(t.amount) || 0;
        } else {
          monthlyMap[mKey].expense += Number(t.amount) || 0;
        }
      });

      const sortedMonths = Object.keys(monthlyMap).sort(); // chronological order

      if (sortedMonths.length === 0) {
        if (state.chartInstance) {
          state.chartInstance.destroy();
          state.chartInstance = null;
        }
        elements.chartCanvas.classList.add('hide');
        elements.chartFallback.classList.remove('hide');
        elements.chartFallback.innerHTML = '<p class="text-muted">No transactions available to generate monthly trend charts.</p>';
        return;
      }

      elements.chartCanvas.classList.remove('hide');
      elements.chartFallback.classList.add('hide');

      const labels = sortedMonths.map((m) => Format.monthYear(m));
      const incomeData = sortedMonths.map((m) => monthlyMap[m].income);
      const expenseData = sortedMonths.map((m) => monthlyMap[m].expense);

      if (state.chartInstance) {
        state.chartInstance.destroy();
      }

      const isDark = state.theme === 'dark';
      const textColor = isDark ? '#cbd5e1' : '#475569';
      const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

      const ctx = elements.chartCanvas.getContext('2d');
      state.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Income',
              data: incomeData,
              backgroundColor: '#10b981',
              borderRadius: 6
            },
            {
              label: 'Expense',
              data: expenseData,
              backgroundColor: '#ef4444',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: textColor, font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 } }
            },
            y: {
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                font: { family: "'Plus Jakarta Sans', sans-serif", size: 10 },
                callback(value) {
                  return state.currency + Number(value).toLocaleString();
                }
              }
            }
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: textColor,
                boxWidth: 12,
                font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: '500' }
              }
            },
            tooltip: {
              callbacks: {
                label(context) {
                  return ` ${context.dataset.label}: ${Format.currency(context.raw)}`;
                }
              }
            }
          }
        }
      });
    }
  };

  // -------------------------------------------------------------------------
  // 11. Export Helpers (CSV & JSON)
  // -------------------------------------------------------------------------
  const Exporter = {
    exportToCSV() {
      if (state.transactions.length === 0) {
        Toast.show('No transactions available to export.', 'info');
        return;
      }

      const headers = ['ID', 'Type', 'Category', 'Amount', 'Date', 'Description'];
      const rows = state.transactions.map((t) => [
        t.id,
        t.type,
        `"${(t.category || '').replace(/"/g, '""')}"`,
        t.amount,
        t.date,
        `"${(t.description || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      const dateStamp = new Date().toISOString().split('T')[0];
      link.setAttribute('href', url);
      link.setAttribute('download', `ExpenseFlow_Export_${dateStamp}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      Toast.show('Transactions exported to CSV!', 'success');
    }
  };

  // -------------------------------------------------------------------------
  // 12. Security Helper
  // -------------------------------------------------------------------------
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // -------------------------------------------------------------------------
  // 13. Event Listeners & Initialization
  // -------------------------------------------------------------------------
  function setupEventListeners() {
    // Transaction Type Radio Buttons
    elements.typeExpenseLabel.addEventListener('click', () => Form.setActiveType('expense'));
    elements.typeIncomeLabel.addEventListener('click', () => Form.setActiveType('income'));

    // Real-time character count on Description
    elements.descriptionInput.addEventListener('input', () => {
      Form.updateCharCount();
      if (elements.descriptionInput.value.trim().length >= 2) {
        elements.descriptionInput.classList.remove('is-invalid');
        elements.descriptionError.textContent = '';
      }
    });

    // Real-time error clearance on amount & date
    elements.amountInput.addEventListener('input', () => {
      if (parseFloat(elements.amountInput.value) > 0) {
        elements.amountInput.classList.remove('is-invalid');
        elements.amountError.textContent = '';
      }
    });

    elements.dateInput.addEventListener('change', () => {
      if (elements.dateInput.value) {
        elements.dateInput.classList.remove('is-invalid');
        elements.dateError.textContent = '';
      }
    });

    elements.categorySelect.addEventListener('change', () => {
      if (elements.categorySelect.value) {
        elements.categorySelect.classList.remove('is-invalid');
        elements.categoryError.textContent = '';
      }
    });

    // Form Submission
    elements.transactionForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!Form.validate()) {
        return;
      }

      const formData = {
        type: Form.getActiveType(),
        amount: elements.amountInput.value,
        category: elements.categorySelect.value,
        date: elements.dateInput.value,
        description: elements.descriptionInput.value
      };

      if (state.editingId) {
        AppController.updateTransaction(state.editingId, formData);
      } else {
        AppController.addTransaction(formData);
      }
    });

    // Cancel Edit Button
    elements.cancelEditBtn.addEventListener('click', () => {
      Form.reset();
      Toast.show('Edit cancelled.', 'info');
    });

    // Search Input
    elements.searchInput.addEventListener('input', (e) => {
      state.filters.search = e.target.value.trim();
      elements.clearSearchBtn.classList.toggle('hide', state.filters.search === '');
      UI.renderTransactions();
    });

    elements.clearSearchBtn.addEventListener('click', () => {
      elements.searchInput.value = '';
      state.filters.search = '';
      elements.clearSearchBtn.classList.add('hide');
      UI.renderTransactions();
    });

    // Filter Dropdowns
    elements.filterType.addEventListener('change', (e) => {
      state.filters.type = e.target.value;
      UI.renderTransactions();
    });

    elements.filterCategory.addEventListener('change', (e) => {
      state.filters.category = e.target.value;
      UI.renderTransactions();
    });

    elements.filterPeriod.addEventListener('change', (e) => {
      state.filters.period = e.target.value;
      UI.renderTransactions();
    });

    elements.sortBy.addEventListener('change', (e) => {
      state.filters.sortBy = e.target.value;
      UI.renderTransactions();
    });

    // Reset Filters Button
    elements.resetFiltersBtn.addEventListener('click', () => {
      state.filters = {
        search: '',
        type: 'all',
        category: 'all',
        period: 'all',
        sortBy: 'date-desc'
      };
      elements.searchInput.value = '';
      elements.clearSearchBtn.classList.add('hide');
      elements.filterType.value = 'all';
      elements.filterCategory.value = 'all';
      elements.filterPeriod.value = 'all';
      elements.sortBy.value = 'date-desc';
      UI.renderTransactions();
    });

    // Currency Switcher
    elements.currencySelect.addEventListener('change', (e) => {
      state.currency = e.target.value;
      Storage.saveCurrency(state.currency);
      elements.amountCurrencySymbol.textContent = state.currency;
      AppController.refreshAll();
      Toast.show(`Currency set to ${state.currency}`, 'info');
    });

    // Theme Switcher
    elements.themeToggleBtn.addEventListener('click', () => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
    });

    // Chart Tabs Switcher
    elements.tabExpenseChart.addEventListener('click', () => {
      state.activeChartTab = 'category';
      elements.tabExpenseChart.classList.add('active');
      elements.tabMonthlyChart.classList.remove('active');
      Charts.render();
    });

    elements.tabMonthlyChart.addEventListener('click', () => {
      state.activeChartTab = 'monthly';
      elements.tabMonthlyChart.classList.add('active');
      elements.tabExpenseChart.classList.remove('active');
      Charts.render();
    });

    // Export CSV Button
    elements.exportCsvBtn.addEventListener('click', () => {
      Exporter.exportToCSV();
    });

    // Demo Data Buttons
    elements.demoDataBtn.addEventListener('click', () => AppController.loadDemoData());
    elements.emptyStateDemoBtn.addEventListener('click', () => AppController.loadDemoData());

    // Clear All Modal
    elements.clearAllBtn.addEventListener('click', () => {
      if (state.transactions.length === 0) {
        Toast.show('No transactions to clear.', 'info');
        return;
      }
      elements.clearAllModal.classList.remove('hide');
    });

    elements.cancelClearAllBtn.addEventListener('click', () => {
      elements.clearAllModal.classList.add('hide');
    });

    elements.confirmClearAllBtn.addEventListener('click', () => {
      elements.clearAllModal.classList.add('hide');
      AppController.clearAllTransactions();
    });

    // Delete Single Transaction Modal
    elements.cancelDeleteBtn.addEventListener('click', () => {
      elements.deleteModal.classList.add('hide');
      state.pendingDeleteId = null;
    });

    elements.confirmDeleteBtn.addEventListener('click', () => {
      elements.deleteModal.classList.add('hide');
      if (state.pendingDeleteId) {
        AppController.deleteTransaction(state.pendingDeleteId);
        state.pendingDeleteId = null;
      }
    });

    // Close modals when clicking backdrop or pressing Escape
    window.addEventListener('click', (e) => {
      if (e.target === elements.deleteModal) {
        elements.deleteModal.classList.add('hide');
        state.pendingDeleteId = null;
      }
      if (e.target === elements.clearAllModal) {
        elements.clearAllModal.classList.add('hide');
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        elements.deleteModal.classList.add('hide');
        elements.clearAllModal.classList.add('hide');
        state.pendingDeleteId = null;
      }
    });
  }

  function applyTheme(theme) {
    state.theme = theme;
    Storage.saveTheme(theme);
    elements.body.setAttribute('data-theme', theme);

    if (theme === 'dark') {
      elements.sunIcon.classList.add('hide');
      elements.moonIcon.classList.remove('hide');
    } else {
      elements.sunIcon.classList.remove('hide');
      elements.moonIcon.classList.add('hide');
    }

    // Redraw charts with dark/light themes
    Charts.render();
  }

  // -------------------------------------------------------------------------
  // 14. Initialization Bootstrapper
  // -------------------------------------------------------------------------
  function init() {
    // 1. Load Theme
    const savedTheme = Storage.loadTheme();
    applyTheme(savedTheme);

    // 2. Load Currency
    const savedCurrency = Storage.loadCurrency();
    state.currency = savedCurrency;
    elements.currencySelect.value = savedCurrency;
    elements.amountCurrencySymbol.textContent = savedCurrency;

    // 3. Load Transactions
    state.transactions = Storage.loadTransactions();

    // 4. Initialize Form default state
    Form.reset();

    // 5. Setup Listeners
    setupEventListeners();

    // 6. Initial Render
    AppController.refreshAll();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
