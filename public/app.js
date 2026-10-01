// Construction CRM Application

const API_URL = '/api';
let currentCustomerId = null;
let currentProjectId = null;
let currentQuoteId = null;
let currentTaskId = null;
let currentInvoiceId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  loadCustomers();
  loadProjects();
  loadQuotes();
  loadTasks();
  loadInvoices();
  loadReports();
  populateSelectLists();
});

// ========== SECTION NAVIGATION ==========

function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.style.display = 'none';
  });

  // Show selected section
  document.getElementById(sectionId).style.display = 'block';

  // Update active nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  event.target.classList.add('active');

  // Reload section data
  switch(sectionId) {
    case 'dashboard':
      loadDashboard();
      break;
    case 'customers':
      loadCustomers();
      break;
    case 'projects':
      loadProjects();
      break;
    case 'quotes':
      loadQuotes();
      break;
    case 'tasks':
      loadTasks();
      break;
    case 'invoices':
      loadInvoices();
      break;
    case 'reports':
      loadReports();
      break;
  }
}

// ========== DASHBOARD ==========

async function loadDashboard() {
  try {
    const response = await fetch(`${API_URL}/dashboard`);
    const data = await response.json();

    document.getElementById('statCustomers').textContent = data.totalCustomers || 0;
    document.getElementById('statProjects').textContent = data.activeProjects || 0;
    document.getElementById('statQuotes').textContent = data.pendingQuotes || 0;
    document.getElementById('statTasks').textContent = data.openTasks || 0;
    document.getElementById('statRevenue').textContent = '$' + (data.totalRevenue || 0).toLocaleString();
    document.getElementById('statInvoices').textContent = '$' + (data.pendingInvoices || 0).toLocaleString();

    // Load recent tasks
    const tasksResponse = await fetch(`${API_URL}/tasks`);
    const tasks = await tasksResponse.json();
    
    const tbody = document.querySelector('#tasksTable tbody');
    tbody.innerHTML = tasks.slice(0, 5).map(task => `
      <tr>
        <td>${task.title}</td>
        <td><span class="status-badge">${task.priority}</span></td>
        <td>${task.due_date || '-'}</td>
        <td><span class="status-badge status-${task.status}">${task.status}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn-small" onclick="editTask('${task.id}')">Edit</button>
            <button class="btn-small btn-danger" onclick="deleteTask('${task.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

// ========== CUSTOMERS ==========

async function loadCustomers() {
  try {
    const response = await fetch(`${API_URL}/customers`);
    const customers = await response.json();

    const tbody = document.querySelector('#customersTable tbody');
    tbody.innerHTML = customers.map(customer => `
      <tr>
        <td>${customer.name}</td>
        <td>${customer.email || '-'}</td>
        <td>${customer.phone || '-'}</td>
        <td>${customer.type}</td>
        <td><span class="status-badge status-${customer.status}">${customer.status}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn-small" onclick="editCustomer('${customer.id}')">Edit</button>
            <button class="btn-small" onclick="viewCustomer('${customer.id}')">View</button>
            <button class="btn-small btn-danger" onclick="deleteCustomer('${customer.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading customers:', error);
  }
}

function filterCustomers() {
  const search = document.getElementById('customerSearch').value.toLowerCase();
  const rows = document.querySelectorAll('#customersTable tbody tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(search) ? '' : 'none';
  });
}

function openCustomerModal() {
  clearCustomerForm();
  document.getElementById('customerModal').classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

async function saveCustomer() {
  const customerId = currentCustomerId;
  const customerData = {
    name: document.getElementById('customerName').value,
    email: document.getElementById('customerEmail').value,
    phone: document.getElementById('customerPhone').value,
    company: document.getElementById('customerCompany').value,
    type: document.getElementById('customerType').value,
    address: document.getElementById('customerAddress').value,
    city: document.getElementById('customerCity').value,
    state: document.getElementById('customerState').value,
    zip: document.getElementById('customerZip').value,
    notes: document.getElementById('customerNotes').value,
    status: 'active'
  };

  if (!customerData.name) {
    alert('Please enter customer name');
    return;
  }

  try {
    const url = customerId ? `${API_URL}/customers/${customerId}` : `${API_URL}/customers`;
    const method = customerId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });

    if (response.ok) {
      closeModal('customerModal');
      loadCustomers();
    } else {
      alert('Error saving customer');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error saving customer');
  }
}

function editCustomer(id) {
  currentCustomerId = id;
  fetch(`${API_URL}/customers/${id}`)
    .then(r => r.json())
    .then(customer => {
      document.getElementById('customerName').value = customer.name;
      document.getElementById('customerEmail').value = customer.email || '';
      document.getElementById('customerPhone').value = customer.phone || '';
      document.getElementById('customerCompany').value = customer.company || '';
      document.getElementById('customerType').value = customer.type;
      document.getElementById('customerAddress').value = customer.address || '';
      document.getElementById('customerCity').value = customer.city || '';
      document.getElementById('customerState').value = customer.state || '';
      document.getElementById('customerZip').value = customer.zip || '';
      document.getElementById('customerNotes').value = customer.notes || '';
      document.getElementById('customerModal').classList.add('active');
    });
}

function clearCustomerForm() {
  currentCustomerId = null;
  document.getElementById('customerName').value = '';
  document.getElementById('customerEmail').value = '';
  document.getElementById('customerPhone').value = '';
  document.getElementById('customerCompany').value = '';
  document.getElementById('customerType').value = 'residential';
  document.getElementById('customerAddress').value = '';
  document.getElementById('customerCity').value = '';
  document.getElementById('customerState').value = '';
  document.getElementById('customerZip').value = '';
  document.getElementById('customerNotes').value = '';
}

async function deleteCustomer(id) {
  if (confirm('Are you sure?')) {
    await fetch(`${API_URL}/customers/${id}`, { method: 'DELETE' });
    loadCustomers();
  }
}

async function viewCustomer(id) {
  currentCustomerId = id;
  const customer = await fetch(`${API_URL}/customers/${id}`).then(r => r.json());
  const projects = await fetch(`${API_URL}/customers/${id}/projects`).then(r => r.json());
  
  let html = `<h2>${customer.name}</h2>
    <p><strong>Email:</strong> ${customer.email}</p>
    <p><strong>Phone:</strong> ${customer.phone}</p>
    <p><strong>Address:</strong> ${customer.city}, ${customer.state} ${customer.zip}</p>
    <p><strong>Type:</strong> ${customer.type}</p>
    <h3>Projects (${projects.length})</h3>`;
  
  projects.forEach(p => {
    html += `<p>📋 ${p.name} - ${p.status}</p>`;
  });
  
  alert(html);
}

// ========== PROJECTS ==========

async function loadProjects() {
  try {
    const response = await fetch(`${API_URL}/projects`);
    const projects = await response.json();

    const tbody = document.querySelector('#projectsTable tbody');
    tbody.innerHTML = projects.map(project => `
      <tr>
        <td>${project.name}</td>
        <td>${project.customer_id}</td>
        <td>${project.project_type}</td>
        <td>$${(project.budget || 0).toLocaleString()}</td>
        <td><span class="status-badge status-${project.status}">${project.status}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn-small" onclick="editProject('${project.id}')">Edit</button>
            <button class="btn-small btn-danger" onclick="deleteProject('${project.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

function openProjectModal() {
  clearProjectForm();
  populateCustomerSelect('projectCustomer');
  document.getElementById('projectModal').classList.add('active');
}

async function saveProject() {
  const projectId = currentProjectId;
  const projectData = {
    customer_id: document.getElementById('projectCustomer').value,
    name: document.getElementById('projectName').value,
    description: document.getElementById('projectDescription').value,
    status: document.getElementById('projectStatus').value,
    project_type: document.getElementById('projectType').value,
    start_date: document.getElementById('projectStartDate').value,
    end_date: document.getElementById('projectEndDate').value,
    budget: parseFloat(document.getElementById('projectBudget').value) || 0,
    spent: parseFloat(document.getElementById('projectSpent').value) || 0
  };

  if (!projectData.name) {
    alert('Please enter project name');
    return;
  }

  try {
    const url = projectId ? `${API_URL}/projects/${projectId}` : `${API_URL}/projects`;
    const method = projectId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });

    if (response.ok) {
      closeModal('projectModal');
      loadProjects();
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error saving project');
  }
}

function editProject(id) {
  currentProjectId = id;
  fetch(`${API_URL}/projects/${id}`)
    .then(r => r.json())
    .then(project => {
      populateCustomerSelect('projectCustomer', project.customer_id);
      document.getElementById('projectName').value = project.name;
      document.getElementById('projectDescription').value = project.description || '';
      document.getElementById('projectStatus').value = project.status;
      document.getElementById('projectType').value = project.project_type;
      document.getElementById('projectStartDate').value = project.start_date || '';
      document.getElementById('projectEndDate').value = project.end_date || '';
      document.getElementById('projectBudget').value = project.budget || 0;
      document.getElementById('projectSpent').value = project.spent || 0;
      document.getElementById('projectModal').classList.add('active');
    });
}

function clearProjectForm() {
  currentProjectId = null;
  document.getElementById('projectName').value = '';
  document.getElementById('projectDescription').value = '';
  document.getElementById('projectStatus').value = 'planning';
  document.getElementById('projectType').value = 'residential';
  document.getElementById('projectStartDate').value = '';
  document.getElementById('projectEndDate').value = '';
  document.getElementById('projectBudget').value = '';
  document.getElementById('projectSpent').value = '';
}

async function deleteProject(id) {
  if (confirm('Are you sure?')) {
    await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
    loadProjects();
  }
}

// ========== QUOTES ==========

async function loadQuotes() {
  try {
    const response = await fetch(`${API_URL}/quotes`);
    const quotes = await response.json();

    const tbody = document.querySelector('#quotesTable tbody');
    tbody.innerHTML = quotes.map(quote => `
      <tr>
        <td>${quote.quote_number}</td>
        <td>${quote.customer_id}</td>
        <td>$${(quote.amount || 0).toLocaleString()}</td>
        <td>${quote.valid_until || '-'}</td>
        <td><span class="status-badge status-${quote.status}">${quote.status}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn-small btn-danger" onclick="deleteQuote('${quote.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading quotes:', error);
  }
}

function openQuoteModal() {
  currentQuoteId = null;
  populateCustomerSelect('quoteCustomer');
  populateProjectSelect('quoteProject');
  document.getElementById('quoteTitle').value = '';
  document.getElementById('quoteAmount').value = '';
  document.getElementById('quoteValid').value = '';
  document.getElementById('quoteModal').classList.add('active');
}

async function saveQuote() {
  const quoteData = {
    customer_id: document.getElementById('quoteCustomer').value,
    project_id: document.getElementById('quoteProject').value,
    title: document.getElementById('quoteTitle').value,
    amount: parseFloat(document.getElementById('quoteAmount').value) || 0,
    valid_until: document.getElementById('quoteValid').value
  };

  if (!quoteData.title || !quoteData.amount) {
    alert('Please fill in all required fields');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quoteData)
    });

    if (response.ok) {
      closeModal('quoteModal');
      loadQuotes();
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error saving quote');
  }
}

async function deleteQuote(id) {
  if (confirm('Are you sure?')) {
    // Implement delete quote endpoint
    console.log('Delete quote:', id);
  }
}

// ========== TASKS ==========

async function loadTasks() {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    const tasks = await response.json();

    const tbody = document.querySelector('#allTasksTable tbody');
    tbody.innerHTML = tasks.map(task => `
      <tr>
        <td>${task.title}</td>
        <td>${task.assigned_to || '-'}</td>
        <td><span class="status-badge">${task.priority}</span></td>
        <td>${task.due_date || '-'}</td>
        <td><span class="status-badge status-${task.status}">${task.status}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn-small" onclick="editTask('${task.id}')">Edit</button>
            <button class="btn-small btn-danger" onclick="deleteTask('${task.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

function openTaskModal() {
  currentTaskId = null;
  populateCustomerSelect('taskCustomer');
  populateProjectSelect('taskProject');
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDescription').value = '';
  document.getElementById('taskPriority').value = 'medium';
  document.getElementById('taskStatus').value = 'todo';
  document.getElementById('taskDue').value = '';
  document.getElementById('taskModal').classList.add('active');
}

async function saveTask() {
  const taskData = {
    customer_id: document.getElementById('taskCustomer').value || null,
    project_id: document.getElementById('taskProject').value || null,
    title: document.getElementById('taskTitle').value,
    description: document.getElementById('taskDescription').value,
    status: document.getElementById('taskStatus').value,
    priority: document.getElementById('taskPriority').value,
    due_date: document.getElementById('taskDue').value
  };

  if (!taskData.title) {
    alert('Please enter task title');
    return;
  }

  try {
    const url = currentTaskId ? `${API_URL}/tasks/${currentTaskId}` : `${API_URL}/tasks`;
    const method = currentTaskId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });

    if (response.ok) {
      closeModal('taskModal');
      loadTasks();
      loadDashboard();
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error saving task');
  }
}

function editTask(id) {
  currentTaskId = id;
  fetch(`${API_URL}/tasks`)
    .then(r => r.json())
    .then(tasks => {
      const task = tasks.find(t => t.id === id);
      if (task) {
        populateCustomerSelect('taskCustomer', task.customer_id);
        populateProjectSelect('taskProject', task.project_id);
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskStatus').value = task.status;
        document.getElementById('taskDue').value = task.due_date || '';
        document.getElementById('taskModal').classList.add('active');
      }
    });
}

async function deleteTask(id) {
  if (confirm('Are you sure?')) {
    // Implement delete task endpoint
    console.log('Delete task:', id);
  }
}

// ========== INVOICES ==========

async function loadInvoices() {
  try {
    const response = await fetch(`${API_URL}/invoices`);
    const invoices = await response.json();

    const tbody = document.querySelector('#invoicesTable tbody');
    tbody.innerHTML = invoices.map(invoice => `
      <tr>
        <td>${invoice.invoice_number}</td>
        <td>${invoice.customer_id}</td>
        <td>$${(invoice.amount || 0).toLocaleString()}</td>
        <td>${invoice.due_date || '-'}</td>
        <td><span class="status-badge status-${invoice.status}">${invoice.status}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn-small" onclick="editInvoice('${invoice.id}')">Edit</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading invoices:', error);
  }
}

function openInvoiceModal() {
  currentInvoiceId = null;
  populateCustomerSelect('invoiceCustomer');
  populateProjectSelect('invoiceProject');
  document.getElementById('invoiceAmount').value = '';
  document.getElementById('invoiceDue').value = '';
  document.getElementById('invoiceStatus').value = 'pending';
  document.getElementById('invoiceModal').classList.add('active');
}

async function saveInvoice() {
  const invoiceData = {
    customer_id: document.getElementById('invoiceCustomer').value,
    project_id: document.getElementById('invoiceProject').value,
    amount: parseFloat(document.getElementById('invoiceAmount').value) || 0,
    status: document.getElementById('invoiceStatus').value,
    due_date: document.getElementById('invoiceDue').value
  };

  if (!invoiceData.amount) {
    alert('Please enter amount');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData)
    });

    if (response.ok) {
      closeModal('invoiceModal');
      loadInvoices();
      loadDashboard();
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error saving invoice');
  }
}

async function editInvoice(id) {
  // Implement edit invoice
  console.log('Edit invoice:', id);
}

// ========== REPORTS ==========

async function loadReports() {
  try {
    const response = await fetch(`${API_URL}/reports/revenue`);
    const data = await response.json();

    const tbody = document.querySelector('#revenueTable tbody');
    tbody.innerHTML = data.map(row => {
      const profit = (row.revenue || 0) - (row.expenses || 0);
      return `
        <tr>
          <td>${row.month}</td>
          <td>${row.projects}</td>
          <td>$${(row.revenue || 0).toLocaleString()}</td>
          <td>$${(row.expenses || 0).toLocaleString()}</td>
          <td>$${profit.toLocaleString()}</td>
        </tr>
      `;
    }).join('');
  } catch (error) {
    console.error('Error loading reports:', error);
  }
}

// ========== HELPER FUNCTIONS ==========

async function populateSelectLists() {
  populateCustomerSelect('projectCustomer');
  populateCustomerSelect('quoteCustomer');
  populateCustomerSelect('taskCustomer');
  populateCustomerSelect('invoiceCustomer');
  populateProjectSelect('quoteProject');
  populateProjectSelect('taskProject');
  populateProjectSelect('invoiceProject');
}

async function populateCustomerSelect(selectId, selectedId) {
  try {
    const response = await fetch(`${API_URL}/customers`);
    const customers = await response.json();

    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">Select customer...</option>' + 
      customers.map(c => `<option value="${c.id}" ${c.id === selectedId ? 'selected' : ''}>${c.name}</option>`).join('');
  } catch (error) {
    console.error('Error populating customer select:', error);
  }
}

async function populateProjectSelect(selectId, selectedId) {
  try {
    const response = await fetch(`${API_URL}/projects`);
    const projects = await response.json();

    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">Select project...</option>' + 
      projects.map(p => `<option value="${p.id}" ${p.id === selectedId ? 'selected' : ''}>${p.name}</option>`).join('');
  } catch (error) {
    console.error('Error populating project select:', error);
  }
}
