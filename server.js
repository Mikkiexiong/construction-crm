require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./crm.db', (err) => {
  if (err) {
    console.error('Database error:', err);
  } else {
    console.log('✅ Connected to CRM database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Customers table
    db.run(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        company TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        zip TEXT,
        notes TEXT,
        type TEXT,
        status TEXT,
        created_at TEXT,
        updated_at TEXT
      )
    `);

    // Projects table
    db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT,
        project_type TEXT,
        start_date TEXT,
        end_date TEXT,
        budget REAL,
        spent REAL,
        address TEXT,
        notes TEXT,
        created_at TEXT,
        updated_at TEXT,
        FOREIGN KEY(customer_id) REFERENCES customers(id)
      )
    `);

    // Quotes table
    db.run(`
      CREATE TABLE IF NOT EXISTS quotes (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        project_id TEXT,
        quote_number TEXT UNIQUE,
        title TEXT,
        description TEXT,
        amount REAL,
        status TEXT,
        valid_until TEXT,
        created_at TEXT,
        updated_at TEXT,
        FOREIGN KEY(customer_id) REFERENCES customers(id),
        FOREIGN KEY(project_id) REFERENCES projects(id)
      )
    `);

    // Quote line items
    db.run(`
      CREATE TABLE IF NOT EXISTS quote_items (
        id TEXT PRIMARY KEY,
        quote_id TEXT NOT NULL,
        description TEXT,
        quantity REAL,
        unit_price REAL,
        total REAL,
        FOREIGN KEY(quote_id) REFERENCES quotes(id)
      )
    `);

    // Tasks table
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        customer_id TEXT,
        project_id TEXT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT,
        priority TEXT,
        due_date TEXT,
        assigned_to TEXT,
        created_at TEXT,
        updated_at TEXT,
        FOREIGN KEY(customer_id) REFERENCES customers(id),
        FOREIGN KEY(project_id) REFERENCES projects(id)
      )
    `);

    // Communications table
    db.run(`
      CREATE TABLE IF NOT EXISTS communications (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        project_id TEXT,
        type TEXT,
        subject TEXT,
        message TEXT,
        date TEXT,
        created_at TEXT,
        FOREIGN KEY(customer_id) REFERENCES customers(id),
        FOREIGN KEY(project_id) REFERENCES projects(id)
      )
    `);

    // Invoices table
    db.run(`
      CREATE TABLE IF NOT EXISTS invoices (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        project_id TEXT,
        invoice_number TEXT UNIQUE,
        amount REAL,
        status TEXT,
        due_date TEXT,
        paid_date TEXT,
        notes TEXT,
        created_at TEXT,
        updated_at TEXT,
        FOREIGN KEY(customer_id) REFERENCES customers(id),
        FOREIGN KEY(project_id) REFERENCES projects(id)
      )
    `);
  });
}

// ========== CUSTOMER ENDPOINTS ==========

// Get all customers
app.get('/api/customers', (req, res) => {
  db.all('SELECT * FROM customers ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows || []);
  });
});

// Get customer by ID
app.get('/api/customers/:id', (req, res) => {
  db.get('SELECT * FROM customers WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(row);
  });
});

// Create customer
app.post('/api/customers', (req, res) => {
  const { name, email, phone, company, address, city, state, zip, notes, type, status } = req.body;
  const id = uuidv4();
  const now = new Date().toISOString();

  db.run(
    `INSERT INTO customers (id, name, email, phone, company, address, city, state, zip, notes, type, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, name, email, phone, company, address, city, state, zip, notes, type || 'residential', status || 'active', now, now],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id, name, email, phone, company, address, city, state, zip, notes, type, status, created_at: now });
    }
  );
});

// Update customer
app.put('/api/customers/:id', (req, res) => {
  const { name, email, phone, company, address, city, state, zip, notes, type, status } = req.body;
  const now = new Date().toISOString();

  db.run(
    `UPDATE customers SET name = ?, email = ?, phone = ?, company = ?, address = ?, city = ?, state = ?, zip = ?, notes = ?, type = ?, status = ?, updated_at = ?
     WHERE id = ?`,
    [name, email, phone, company, address, city, state, zip, notes, type, status, now, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    }
  );
});

// Delete customer
app.delete('/api/customers/:id', (req, res) => {
  db.run('DELETE FROM customers WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

// ========== PROJECT ENDPOINTS ==========

// Get all projects
app.get('/api/projects', (req, res) => {
  db.all('SELECT * FROM projects ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows || []);
  });
});

// Get projects for customer
app.get('/api/customers/:id/projects', (req, res) => {
  db.all('SELECT * FROM projects WHERE customer_id = ? ORDER BY created_at DESC', [req.params.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows || []);
  });
});

// Create project
app.post('/api/projects', (req, res) => {
  const { customer_id, name, description, status, project_type, start_date, end_date, budget, spent, address, notes } = req.body;
  const id = uuidv4();
  const now = new Date().toISOString();

  db.run(
    `INSERT INTO projects (id, customer_id, name, description, status, project_type, start_date, end_date, budget, spent, address, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, customer_id, name, description, status || 'planning', project_type, start_date, end_date, budget || 0, spent || 0, address, notes, now, now],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id, customer_id, name, description, status, project_type, start_date, end_date, budget, spent, address, notes, created_at: now });
    }
  );
});

// Update project
app.put('/api/projects/:id', (req, res) => {
  const { name, description, status, project_type, start_date, end_date, budget, spent, address, notes } = req.body;
  const now = new Date().toISOString();

  db.run(
    `UPDATE projects SET name = ?, description = ?, status = ?, project_type = ?, start_date = ?, end_date = ?, budget = ?, spent = ?, address = ?, notes = ?, updated_at = ?
     WHERE id = ?`,
    [name, description, status, project_type, start_date, end_date, budget, spent, address, notes, now, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    }
  );
});

// Delete project
app.delete('/api/projects/:id', (req, res) => {
  db.run('DELETE FROM projects WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

// ========== QUOTE ENDPOINTS ==========

// Get all quotes
app.get('/api/quotes', (req, res) => {
  db.all('SELECT * FROM quotes ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows || []);
  });
});

// Get quote with items
app.get('/api/quotes/:id', (req, res) => {
  db.get('SELECT * FROM quotes WHERE id = ?', [req.params.id], (err, quote) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    db.all('SELECT * FROM quote_items WHERE quote_id = ?', [req.params.id], (err, items) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ ...quote, items: items || [] });
    });
  });
});

// Create quote
app.post('/api/quotes', (req, res) => {
  const { customer_id, project_id, title, description, amount, items } = req.body;
  const id = uuidv4();
  const quote_number = `Q-${Date.now()}`;
  const now = new Date().toISOString();

  db.run(
    `INSERT INTO quotes (id, customer_id, project_id, quote_number, title, description, amount, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, customer_id, project_id, quote_number, title, description, amount || 0, 'draft', now, now],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Add line items
      if (items && items.length > 0) {
        items.forEach(item => {
          const itemId = uuidv4();
          db.run(
            `INSERT INTO quote_items (id, quote_id, description, quantity, unit_price, total)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [itemId, id, item.description, item.quantity, item.unit_price, item.total]
          );
        });
      }

      res.json({ id, customer_id, project_id, quote_number, title, description, amount, status: 'draft', items: items || [] });
    }
  );
});

// ========== TASK ENDPOINTS ==========

// Get all tasks
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY due_date ASC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows || []);
  });
});

// Create task
app.post('/api/tasks', (req, res) => {
  const { customer_id, project_id, title, description, status, priority, due_date, assigned_to } = req.body;
  const id = uuidv4();
  const now = new Date().toISOString();

  db.run(
    `INSERT INTO tasks (id, customer_id, project_id, title, description, status, priority, due_date, assigned_to, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, customer_id, project_id, title, description, status || 'todo', priority || 'medium', due_date, assigned_to, now, now],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id, customer_id, project_id, title, description, status, priority, due_date, assigned_to, created_at: now });
    }
  );
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
  const { title, description, status, priority, due_date, assigned_to } = req.body;
  const now = new Date().toISOString();

  db.run(
    `UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, assigned_to = ?, updated_at = ?
     WHERE id = ?`,
    [title, description, status, priority, due_date, assigned_to, now, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    }
  );
});

// ========== COMMUNICATION ENDPOINTS ==========

// Get communications for customer
app.get('/api/customers/:id/communications', (req, res) => {
  db.all('SELECT * FROM communications WHERE customer_id = ? ORDER BY date DESC', [req.params.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows || []);
  });
});

// Add communication
app.post('/api/communications', (req, res) => {
  const { customer_id, project_id, type, subject, message } = req.body;
  const id = uuidv4();
  const now = new Date().toISOString();

  db.run(
    `INSERT INTO communications (id, customer_id, project_id, type, subject, message, date, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, customer_id, project_id, type, subject, message, now, now],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id, customer_id, project_id, type, subject, message, date: now });
    }
  );
});

// ========== DASHBOARD ENDPOINTS ==========

// Get dashboard stats
app.get('/api/dashboard', (req, res) => {
  const stats = {};

  // Total customers
  db.get('SELECT COUNT(*) as count FROM customers', (err, row) => {
    stats.totalCustomers = row?.count || 0;

    // Active projects
    db.get("SELECT COUNT(*) as count FROM projects WHERE status IN ('planning', 'in_progress')", (err, row) => {
      stats.activeProjects = row?.count || 0;

      // Pending quotes
      db.get("SELECT COUNT(*) as count FROM quotes WHERE status = 'draft'", (err, row) => {
        stats.pendingQuotes = row?.count || 0;

        // Open tasks
        db.get("SELECT COUNT(*) as count FROM tasks WHERE status IN ('todo', 'in_progress')", (err, row) => {
          stats.openTasks = row?.count || 0;

          // Total revenue (sum of completed projects)
          db.get("SELECT COALESCE(SUM(budget), 0) as total FROM projects WHERE status = 'completed'", (err, row) => {
            stats.totalRevenue = row?.total || 0;

            // Pending invoices
            db.get("SELECT COALESCE(SUM(amount), 0) as total FROM invoices WHERE status = 'pending'", (err, row) => {
              stats.pendingInvoices = row?.total || 0;

              res.json(stats);
            });
          });
        });
      });
    });
  });
});

// ========== INVOICE ENDPOINTS ==========

// Get all invoices
app.get('/api/invoices', (req, res) => {
  db.all('SELECT * FROM invoices ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows || []);
  });
});

// Create invoice
app.post('/api/invoices', (req, res) => {
  const { customer_id, project_id, amount, status, due_date, notes } = req.body;
  const id = uuidv4();
  const invoice_number = `INV-${Date.now()}`;
  const now = new Date().toISOString();

  db.run(
    `INSERT INTO invoices (id, customer_id, project_id, invoice_number, amount, status, due_date, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, customer_id, project_id, invoice_number, amount, status || 'pending', due_date, notes, now, now],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id, customer_id, project_id, invoice_number, amount, status, due_date, notes });
    }
  );
});

// ========== REPORTS ENDPOINTS ==========

// Get revenue report
app.get('/api/reports/revenue', (req, res) => {
  db.all(`
    SELECT 
      strftime('%Y-%m', created_at) as month,
      COUNT(*) as projects,
      SUM(budget) as revenue,
      SUM(spent) as expenses
    FROM projects
    GROUP BY strftime('%Y-%m', created_at)
    ORDER BY month DESC
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows || []);
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🏗️  Construction CRM running on port ${PORT}`);
  console.log(`📱 Open: http://localhost:${PORT}`);
  console.log(`📧 Manage customers, projects, quotes & more\n`);
});
