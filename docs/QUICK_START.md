# Quick Start - 5 Minutes

## Install & Run

1. **Install Node.js** (if needed)
   - Download from https://nodejs.org
   - Choose LTS version

2. **Navigate to folder**
   ```bash
   cd construction-crm
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start CRM**
   ```bash
   npm start
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

✅ Done! Your free CRM is running.

## First Steps

1. **Add a customer** (👥 Customers tab)
   - Click "+ Add Customer"
   - Fill in name, email, phone
   - Save

2. **Create a project** (📋 Projects tab)
   - Click "+ New Project"
   - Choose customer
   - Set name, type, budget
   - Save

3. **Create a quote** (💰 Quotes tab)
   - Click "+ New Quote"
   - Choose customer/project
   - Enter amount
   - Save

4. **Create task** (✓ Tasks tab)
   - Click "+ New Task"
   - Enter task description
   - Set priority and due date
   - Save

5. **View dashboard** (📊 Dashboard)
   - See all your stats
   - Recent tasks
   - Revenue tracking

## Stop CRM

Press `Ctrl+C` in terminal

## Backup Data

```bash
# Your database file is: crm.db
# Just copy it to backup:
cp crm.db crm-backup.db
```

## Delete Everything & Start Fresh

```bash
rm crm.db
npm start
```

---

**That's it! You now have a professional CRM. No subscriptions, no fees, no ads.**
