const fs = require("fs");
const csv = require("csv-parser");

const trialBalanceFile = "trial_balance.csv";
const accounts = [];

// Read CSV file
fs.createReadStream(trialBalanceFile)
  .pipe(csv())
  .on("data", (row) => {
    accounts.push({
      account: row.Account,
      debit: parseFloat(row.Debit) || 0,
      credit: parseFloat(row.Credit) || 0,
    });
  })
  .on("end", () => {
    console.log(accounts,'accounts')
    generateReports(accounts);
  });

function generateReports(accounts) {
  let totalIncome = 0,
    totalExpenses = 0,
    totalAssets = 0,
    totalLiabilities = 0,
    totalCapital = 0;

  accounts?.forEach(({ account, debit, credit }) => {
    if (account.toLowerCase().includes("sales accounts")|| account.toLowerCase().includes("direct incomes")||account.toLowerCase().includes("indirect incomes")) {
      totalIncome += credit;
    } else if (
      account.toLowerCase().includes("direct expenses") ||
      account.toLowerCase().includes("indirect expenses")||
      account.toLowerCase().includes("purchase accounts")
    ) {
      totalExpenses += debit;
      totalExpenses -= credit;
    } else if (account.toLowerCase().includes("fixed assets")||account.toLowerCase().includes("current assets")) {
      totalAssets += debit;
    } else if (
      account.toLowerCase().includes("profit & loss a/c") ||
      account.toLowerCase().includes("loans")
    ) {
      totalLiabilities += credit;
    } else if (account.toLowerCase().includes("capital")) {
      totalCapital += credit;
    // } else if (account.toLowerCase().includes("purchase accounts")) {
    //   totalExpenses -= credit;
    } else if (account.toLowerCase().includes("indirect expenses")) {
      totalExpenses -= credit;
    } else if (account.toLowerCase().includes("closing stock")) {
      totalIncome += debit;
    } else if (account.toLowerCase().includes("opening stock")) {
      totalExpenses += debit;
    }
    
  });

  // Calculate Net Profit/Loss
  const netProfit = totalIncome - totalExpenses;

  // Balance Sheet Calculation
  const totalEquity = totalCapital + netProfit;
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

  // Display Reports
  console.log("\n📊 Profit & Loss Statement:");
  console.log(`Total Income: ${totalIncome}`);
  console.log(`Total Expenses: ${totalExpenses}`);
  console.log(`Net Profit/Loss: ${netProfit}\n`);

  console.log("📄 Balance Sheet:");
  console.log(`Total Assets: ${totalAssets}`);
  console.log(`Total Liabilities: ${totalLiabilities}`);
  console.log(`Total Equity (Capital + Profit): ${totalEquity}`);
  console.log(`Total Liabilities & Equity: ${totalLiabilitiesAndEquity}`);
}
