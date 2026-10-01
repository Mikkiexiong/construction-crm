# Complete Setup Instructions

## Prerequisites

### 1. Install Node.js

**Windows:**
1. Go to https://nodejs.org
2. Download LTS version (recommended)
3. Run installer
4. Follow setup wizard (accept defaults)
5. Verify installation:
   ```bash
   node --version
   npm --version
   ```

**Mac:**
1. Go to https://nodejs.org
2. Download LTS version
3. Run installer
4. Follow setup
5. Verify:
   ```bash
   node --version
   npm --version
   ```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install nodejs npm
```

## Installation Steps

### Step 1: Navigate to Project Folder

```bash
cd construction-crm
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages:
- Express (web server)
- SQLite3 (database)
- UUID (unique IDs)
- CORS (security)

Wait for installation to complete (1-2 minutes)

### Step 3: Configuration (Optional)

The CRM works without configuration. If you want to change the port:

```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=3000
NODE_ENV=development
```

Available options:
- `PORT`: Which port to run on (default: 3000)
- `NODE_ENV`: development or production

### Step 4: Start the CRM

```bash
npm start
```

You should see:
```
✅ Connected to CRM database
🏗️  Construction CRM running on port 3000
📱 Open: http://localhost:3000
```

### Step 5: Open in Browser

- Click: http://localhost:3000
- Or type in browser address bar: `localhost:3000`

## Your First Use

### Add a Customer

1. Click "👥 Customers" in left sidebar
2. Click "+ Add Customer" button
3. Fill in fields:
   - Name (required)
   - Email
   - Phone
   - Company
   - Type (Residential/Commercial)
   - Address, City, State, Zip
   - Notes
4. Click "Save Customer"

### Create a Project

1. Click "📋 Projects" 
2. Click "+ New Project"
3. Fill in:
   - Choose customer (dropdown)
   - Project name (required)
   - Type (Residential, Commercial, Remodeling, etc.)
   - Budget amount
   - Start and end dates
   - Description
4. Click "Save Project"

### Create a Quote

1. Click "💰 Quotes"
2. Click "+ New Quote"
3. Fill in:
   - Choose customer
   - Choose project (optional)
   - Quote title
   - Quote amount
   - Valid until date
4. Click "Create Quote"

### Create a Task

1. Click "✓ Tasks"
2. Click "+ New Task"
3. Fill in:
   - Task title
   - Customer (optional)
   - Project (optional)
   - Priority (Low/Medium/High)
   - Due date
   - Description
4. Click "Create Task"

### Create an Invoice

1. Click "📄 Invoices"
2. Click "+ New Invoice"
3. Fill in:
   - Choose customer
   - Choose project
   - Amount
   - Due date
   - Status (Pending/Paid)
4. Click "Create Invoice"

## Using the Dashboard

The dashboard shows:
- **Total Customers**: How many customers in system
- **Active Projects**: Projects in planning or progress
- **Pending Quotes**: Quotes not yet accepted
- **Open Tasks**: Tasks not yet completed
- **Total Revenue**: Sum of completed project budgets
- **Pending Invoices**: Unpaid invoice total

Plus recent tasks and activity.

## Data Storage

Your data is stored in `crm.db` (SQLite database) in the same folder.

### Backup Your Data

```bash
# Copy database to create backup
cp crm.db crm-backup-$(date +%Y%m%d).db
```

### Move to New Computer

1. Copy `crm.db` file
2. Paste in new `construction-crm` folder
3. Run `npm start`
4. All data will be there!

### Reset Everything

```bash
# Delete database (WARNING: deletes all data)
rm crm.db

# Restart (creates fresh database)
npm start
```

## Stopping the CRM

Press `Ctrl+C` in terminal

To restart: `npm start`

## Troubleshooting

### "Port 3000 already in use"

Use different port:
```bash
PORT=3001 npm start
```

### "Cannot find module..."

Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Database locked"

This usually means:
1. CRM is running in another terminal/window
2. Another app is using the database

Solution:
1. Stop all running CRM instances
2. Restart: `npm start`

### "Cannot connect to localhost:3000"

Check:
1. CRM is running (see "Connected to CRM database" message)
2. Browser shows `http://localhost:3000` (not `localhost:3000` without `http://`)
3. Port isn't blocked by firewall
4. Try different port: `PORT=3001 npm start`

### "Blank page or no styling"

Try:
1. Hard refresh (Ctrl+F5 on Windows, Cmd+Shift+R on Mac)
2. Clear browser cache
3. Try different browser

### Data not saving

Check:
1. No errors in terminal
2. Folder has write permissions
3. Disk has space
4. Try restarting: `Ctrl+C` then `npm start`

## Development Features

### Adding Custom Fields

Edit `server.js` to add new database columns:

```javascript
db.run(`
  ALTER TABLE customers ADD COLUMN new_field TEXT
`);
```

### Viewing Raw Data

The database is a standard SQLite file. You can view it with:
- SQLite Browser (free desktop app)
- VS Code SQLite extension
- Online SQLite viewer

## Team Access (Optional)

To let multiple people use the CRM:

### Option 1: Same Computer
- Just share login/computer access
- Data syncs automatically

### Option 2: Network
- Run on one central computer
- Others access via network address
- Replace `localhost:3000` with computer's IP
- Example: `192.168.1.100:3000`

### Option 3: Cloud Deployment
See deployment guides at bottom of README.md

## Next Steps

1. Start using the CRM for your business
2. Add your existing customers
3. Create projects for active work
4. Generate quotes
5. Track tasks and invoices
6. Check dashboard for insights

## Support Resources

- README.md - Full features guide
- QUICK_START.md - Quick reference
- Code is well-commented for customization

---

**Congratulations! Your free CRM is ready to use.** 🎉
