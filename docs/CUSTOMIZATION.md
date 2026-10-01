# Customization Guide

This CRM is completely customizable. Here are common modifications:

## Change Business Name

### In HTML (public/index.html)
Find and change:
```html
<div class="logo">
  🏗️ Construction CRM  <!-- Change this -->
</div>
```

To:
```html
<div class="logo">
  🏗️ Advance Construction Pros
</div>
```

### In Title (public/index.html)
```html
<title>Construction CRM - Advance Construction Pros</title>
```

## Change Colors

In `public/index.html`, find `:root` CSS:

```css
:root {
  --primary: #667eea;      /* Main blue */
  --secondary: #764ba2;    /* Purple */
  --success: #4CAF50;      /* Green */
  --warning: #ff9800;      /* Orange */
  --danger: #f44336;       /* Red */
}
```

Change to your brand colors:
```css
:root {
  --primary: #1a73e8;      /* Google Blue */
  --secondary: #ea4335;    /* Google Red */
  --success: #34a853;      /* Google Green */
  --warning: #fbbc04;      /* Google Yellow */
  --danger: #d33527;       /* Dark Red */
}
```

## Add New Database Fields

### Example: Add "License Number" to Customers

1. **Add to database** (server.js):
```javascript
// In initializeDatabase(), find CREATE TABLE customers:
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
    license_number TEXT,  /* ADD THIS LINE */
    created_at TEXT,
    updated_at TEXT
  )
`);
```

2. **Add to HTML form** (public/index.html):
```html
<!-- In customerModal, add: -->
<div class="form-group">
  <label>License Number</label>
  <input type="text" id="customerLicense" placeholder="Contractor license">
</div>
```

3. **Add to JavaScript** (public/app.js):
```javascript
// In saveCustomer() function, add:
const customerData = {
  name: document.getElementById('customerName').value,
  email: document.getElementById('customerEmail').value,
  phone: document.getElementById('customerPhone').value,
  company: document.getElementById('customerCompany').value,
  license_number: document.getElementById('customerLicense').value,  /* ADD */
  // ... rest of fields
};

// In editCustomer() function, add:
document.getElementById('customerLicense').value = customer.license_number || '';

// In clearCustomerForm() function, add:
document.getElementById('customerLicense').value = '';
```

## Add New Section (Page)

### Example: Add "Materials" Section

1. **Add navigation item** (public/index.html):
```html
<div class="nav-item" onclick="showSection('materials')">📦 Materials</div>
```

2. **Add section content**:
```html
<div id="materials" class="section" style="display:none;">
  <div class="header">
    <h1>📦 Materials</h1>
    <button class="btn-primary" onclick="openMaterialModal()">+ Add Material</button>
  </div>
  <div class="table-container">
    <table id="materialsTable">
      <thead>
        <tr>
          <th>Name</th>
          <th>Supplier</th>
          <th>Cost</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
</div>
```

3. **Add modal**:
```html
<div id="materialModal" class="modal">
  <div class="modal-content">
    <h2>Add Material</h2>
    <div class="form-group">
      <label>Name *</label>
      <input type="text" id="materialName">
    </div>
    <div class="form-group">
      <label>Supplier</label>
      <input type="text" id="materialSupplier">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Cost</label>
        <input type="number" id="materialCost">
      </div>
      <div class="form-group">
        <label>Stock</label>
        <input type="number" id="materialStock">
      </div>
    </div>
    <div class="btn-group">
      <button class="btn-primary" onclick="saveMaterial()">Save</button>
      <button class="btn-secondary" onclick="closeModal('materialModal')">Cancel</button>
    </div>
  </div>
</div>
```

4. **Add server endpoint** (server.js):
```javascript
// Create materials table
db.run(`
  CREATE TABLE IF NOT EXISTS materials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    supplier TEXT,
    cost REAL,
    stock REAL,
    created_at TEXT,
    updated_at TEXT
  )
`);

// Get materials
app.get('/api/materials', (req, res) => {
  db.all('SELECT * FROM materials ORDER BY name', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// Add material
app.post('/api/materials', (req, res) => {
  const { name, supplier, cost, stock } = req.body;
  const id = uuidv4();
  const now = new Date().toISOString();

  db.run(
    `INSERT INTO materials (id, name, supplier, cost, stock, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, name, supplier, cost, stock, now, now],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, name, supplier, cost, stock });
    }
  );
});
```

5. **Add JavaScript functions** (public/app.js):
```javascript
function openMaterialModal() {
  document.getElementById('materialName').value = '';
  document.getElementById('materialSupplier').value = '';
  document.getElementById('materialCost').value = '';
  document.getElementById('materialStock').value = '';
  document.getElementById('materialModal').classList.add('active');
}

async function saveMaterial() {
  const materialData = {
    name: document.getElementById('materialName').value,
    supplier: document.getElementById('materialSupplier').value,
    cost: parseFloat(document.getElementById('materialCost').value) || 0,
    stock: parseFloat(document.getElementById('materialStock').value) || 0
  };

  if (!materialData.name) {
    alert('Please enter material name');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(materialData)
    });

    if (response.ok) {
      closeModal('materialModal');
      loadMaterials();
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error saving material');
  }
}

async function loadMaterials() {
  try {
    const response = await fetch(`${API_URL}/materials`);
    const materials = await response.json();

    const tbody = document.querySelector('#materialsTable tbody');
    tbody.innerHTML = materials.map(material => `
      <tr>
        <td>${material.name}</td>
        <td>${material.supplier || '-'}</td>
        <td>$${(material.cost || 0).toLocaleString()}</td>
        <td>${material.stock || 0}</td>
        <td>
          <button class="btn-small btn-danger" onclick="deleteMaterial('${material.id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading materials:', error);
  }
}

async function deleteMaterial(id) {
  if (confirm('Delete this material?')) {
    // Add delete endpoint
    console.log('Delete material:', id);
  }
}
```

## Add Email Notifications

Install nodemailer:
```bash
npm install nodemailer
```

Example: Email quote to customer:
```javascript
const nodemailer = require('nodemailer');

// Configure email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

// Send quote email
app.post('/api/quotes/:id/send-email', async (req, res) => {
  const quote = await db.get('SELECT * FROM quotes WHERE id = ?', [req.params.id]);
  const customer = await db.get('SELECT * FROM customers WHERE id = ?', [quote.customer_id]);

  await transporter.sendMail({
    from: 'your-email@gmail.com',
    to: customer.email,
    subject: `Quote ${quote.quote_number} from Advance Construction`,
    html: `
      <h2>${quote.title}</h2>
      <p>Quote Amount: $${quote.amount}</p>
      <p>Valid Until: ${quote.valid_until}</p>
    `
  });

  res.json({ success: true });
});
```

## Add Image Uploads

Install multer:
```bash
npm install multer
```

## Export to Excel/PDF

Install libraries:
```bash
npm install xlsx pdfkit
```

Example: Export customers to Excel:
```javascript
const xlsx = require('xlsx');

app.get('/api/export/customers', (req, res) => {
  db.all('SELECT * FROM customers', (err, customers) => {
    const ws = xlsx.utils.json_to_sheet(customers);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Customers');
    
    res.setHeader('Content-Disposition', 'attachment; filename="customers.xlsx"');
    xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });
  });
});
```

## Deploy Customized Version

Once customized, deploy to:
- Heroku
- Railway.app
- Render.com

(See README.md for deployment instructions)

## Common Customizations Checklist

- [ ] Change business name
- [ ] Update colors to match branding
- [ ] Add custom fields to customers/projects
- [ ] Add new sections/pages
- [ ] Setup email notifications
- [ ] Add image uploads
- [ ] Export functionality
- [ ] Deploy to cloud

---

**Need help? The code is well-commented and straightforward. Modify as needed!**
