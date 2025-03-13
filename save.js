const fs = require("fs");
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Load API Key from env

// Predefined ledger mappings (Rule-based)
const ACCOUNT_MAPPINGS = {
  "Sales Revenue": "Revenue",
  "Product Income": "Revenue",
  "COGS": "Cost of Goods Sold",
  "Salaries": "Operating Expenses",
  "Rent Expense": "Operating Expenses",
};

async function mapLedgerToCategory(ledgerName) {
  if (ACCOUNT_MAPPINGS[ledgerName]) {
    return ACCOUNT_MAPPINGS[ledgerName];
  }

  // Use LLM for unknown mappings
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "system",
      content: "Classify the following ledger account into standard accounting categories (Revenue, Expenses, COGS, etc.). Return only the category name."
    }, {
      role: "user",
      content: `Ledger Account: ${ledgerName}`
    }],
  });

  return response.choices[0].message.content.trim();
}

async function generatePL(trialBalance) {
  let pnl = { Revenue: 0, "Cost of Goods Sold": 0, "Operating Expenses": 0, "Net Profit": 0 };

  for (let entry of trialBalance) {
    let category = await mapLedgerToCategory(entry.ledger);
    if (!pnl[category]) pnl[category] = 0;
    pnl[category] += entry.amount;
  }

  pnl["Net Profit"] = pnl["Revenue"] - (pnl["Cost of Goods Sold"] || 0) - (pnl["Operating Expenses"] || 0);
  return pnl;
}

// Sample trial balance
const trialBalance = [
  { ledger: "Sales Revenue", amount: 50000 },
  { ledger: "COGS", amount: -20000 },
  { ledger: "Salaries", amount: -10000 },
  { ledger: "Rent Expense", amount: -5000 },
  { ledger: "Custom Ledger XYZ", amount: -2000 }, // Unknown ledger
];

(async () => {
  const pnl = await generatePL(trialBalance);
  console.log("Profit & Loss Statement:", pnl);
})();


//7187587