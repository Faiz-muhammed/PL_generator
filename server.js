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
    generateReports(accounts);
  });

function generateReports(accounts) {
  let totalIncome = 0,
    totalExpenses = 0,
    totalAssets = 0,
    totalLiabilities = 0,
    totalCapital = 0;

  accounts.forEach(({ account, debit, credit }) => {
    if (account.toLowerCase().includes("sales")) {
      totalIncome += credit;
    } else if (
      account.toLowerCase().includes("rent") ||
      account.toLowerCase().includes("salaries") ||
      account.toLowerCase().includes("inventory")
    ) {
      totalExpenses += debit;
    } else if (account.toLowerCase().includes("cash")) {
      totalAssets += credit;
    } else if (
      account.toLowerCase().includes("accounts payable") ||
      account.toLowerCase().includes("loan")
    ) {
      totalLiabilities += credit;
    } else if (account.toLowerCase().includes("capital")) {
      totalCapital += credit;
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
