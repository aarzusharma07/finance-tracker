const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const Expense = require("./models/Expense");
const Budget = require("./models/Budget");
const User = require("./models/User");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// ROOT
app.get("/", (req, res) => {
    res.redirect("/login.html");
});

// MONGODB
mongoose.connect("mongodb://127.0.0.1:27017/finance_tracker")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// REGISTER
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    await new User({ name, email, password }).save();
    res.send("Registered");
});

// LOGIN
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) res.redirect("/home.html");
    else res.send("Invalid login");
});

// ADD TRANSACTION  ✅ (ONLY SMALL ADDITION: category)
app.post("/add-expense", async (req, res) => {
    const { title, amount, type, category } = req.body;

    await new Expense({
        title,
        amount,
        type: type || "expense",
        category: category || "General"
    }).save();

    res.redirect("/transactions.html");
});

// VIEW ALL EXPENSES
app.get("/expenses", async (req, res) => {
    const expenses = await Expense.find();
    res.json(expenses);
});

// MONTHLY TRANSACTIONS
app.get("/transactions/monthly", async (req, res) => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);

    const tx = await Expense.find({ date: { $gte: start } });

    let income = 0, expense = 0;
    tx.forEach(t => {
        if (t.type === "income") income += t.amount;
        else expense += t.amount;
    });

    res.json({ income, expense, total: income - expense, transactions: tx });
});

// WEEKLY TRANSACTIONS
app.get("/transactions/weekly", async (req, res) => {
    const start = new Date();
    start.setDate(start.getDate() - 7);

    const tx = await Expense.find({ date: { $gte: start } });

    let income = 0, expense = 0;
    tx.forEach(t => {
        if (t.type === "income") income += t.amount;
        else expense += t.amount;
    });

    res.json({ income, expense, total: income - expense, transactions: tx });
});

// DAILY TRANSACTIONS
app.get("/transactions/daily", async (req, res) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const tx = await Expense.find({ date: { $gte: start } });

    let income = 0, expense = 0;
    tx.forEach(t => {
        if (t.type === "income") income += t.amount;
        else expense += t.amount;
    });

    res.json({ income, expense, total: income - expense, transactions: tx });
});

// SET BUDGET
app.post("/set-budget", async (req, res) => {
    const { amount } = req.body;
    const now = new Date();

    await Budget.findOneAndUpdate(
        { month: now.getMonth(), year: now.getFullYear() },
        { amount },
        { upsert: true }
    );

    res.redirect("/budget.html");
});

// GET BUDGET STATUS
app.get("/budget/status", async (req, res) => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const budget = await Budget.findOne({ month, year });

    const start = new Date(year, month, 1);
    const expenses = await Expense.find({
        type: "expense",
        date: { $gte: start }
    });

    let spent = 0;
    expenses.forEach(e => spent += e.amount);

    res.json({
        budget: budget ? budget.amount : 0,
        spent,
        remaining: budget ? budget.amount - spent : 0
    });
});


// =================== NEW FOR STATISTICS PAGE ===================

// STATISTICS SUMMARY (Income / Expense / Balance)
app.get("/summary/statistics", async (req, res) => {
    const tx = await Expense.find();

    let income = 0;
    let expense = 0;

    tx.forEach(t => {
        if (t.type === "income") income += t.amount;
        else expense += t.amount;
    });

    res.json({
        income,
        expense,
        balance: income - expense
    });
});

// CATEGORY-WISE SUMMARY (for graph)
app.get("/summary/category", async (req, res) => {
    const expenses = await Expense.find({ type: "expense" });

    const summary = {};
    expenses.forEach(e => {
        summary[e.category] = (summary[e.category] || 0) + e.amount;
    });

    res.json(summary);
});

// ===============================================================

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
