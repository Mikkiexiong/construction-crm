# Construction CRM - Free & Open Source

A powerful, free Customer Relationship Management system built for construction businesses. Manage customers, projects, quotes, invoices, tasks, and more.

## ✨ Features

### Customer Management
- ✅ Add, edit, delete customers
- ✅ Track customer info (email, phone, address)
- ✅ Customer type (residential, commercial)
- ✅ Add notes and history
- ✅ Search and filter customers

### Project Management
- ✅ Create and track projects
- ✅ Link projects to customers
- ✅ Budget tracking (planned vs. actual)
- ✅ Project status (planning, in progress, completed)
- ✅ Project types (residential, commercial, remodeling, roofing, etc.)
- ✅ Start/end dates

### Quotes & Estimates
- ✅ Create professional quotes
- ✅ Auto-numbered quote system
- ✅ Quote line items with pricing
- ✅ Valid until dates
- ✅ Quote status tracking

### Task & Activity Management
- ✅ Create tasks with priority levels
- ✅ Due dates and reminders
- ✅ Assign tasks to team members
- ✅ Task status tracking
- ✅ Link tasks to customers/projects

### Invoice Management
- ✅ Create and track invoices
- ✅ Auto-numbered invoices
- ✅ Payment status tracking
- ✅ Due date management
- ✅ Invoice notes

### Dashboard & Reports
- ✅ Real-time statistics
- ✅ Monthly revenue reports
- ✅ Project pipeline overview
- ✅ Open tasks and pending quotes
- ✅ Pending invoices tracking

### Communications Log
- ✅ Track all communications with customers
- ✅ Call, email, SMS notes
- ✅ Link to specific projects

## 🚀 Quick Start

### Requirements
- Node.js (v14+)
- npm

### Installation

1. **Clone/Download the CRM**
```bash
cd construction-crm
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure (Optional)**
```bash
cp .env.example .env
# Edit .env if needed (PORT is optional, defaults to 3000)
```

4. **Start the server**
```bash
npm start
```

5. **Open in browser**
```
http://localhost:3000
```

That's it! Your CRM is ready to use. No database setup needed—SQLite creates everything automatically.

## 📊 Using the CRM

### Dashboard
- View key metrics at a glance
- See recent tasks and activity
- Quick stats on customers, projects, quotes

### Customers
- Add new customers with full contact info
- Track customer type (residential/commercial)
- View all projects for a customer
- Search and filter

### Projects
- Create projects linked to customers
- Set budget and track spending
- Mark progress (planning → in progress → completed)
- Specify project type and dates

### Quotes
- Generate professional quotes for customers
- Track quote status (draft, sent, accepted, rejected)
- Set expiration dates
- Auto-numbered for organization

### Tasks
- Create actionable tasks for your team
- Assign to team members
- Set priorities (high, medium, low)
- Track status and due dates

### Invoices
- Create invoices for completed work
- Track payment status
- Link to projects for better organization
- See pending invoice totals on dashboard

### Reports
- View monthly revenue and expense trends
- Track profitability by month
- Analyze project volume and spending

## 🎯 Typical Workflow

1. **New Customer** → Add to "Customers" section
2. **New Project** → Create in "Projects" section, link to customer
3. **Create Quote** → In "Quotes" section, link to customer/project
4. **Manage Tasks** → Break project into tasks, assign team members
5. **Track Progress** → Update project status as work progresses
6. **Generate Invoice** → Create invoice when work is complete
7. **Monitor Dashboard** → See real-time stats and metrics

## 💾 Data Storage

All data is stored in a **local SQLite database** (`crm.db`). This means:
- ✅ No internet required
- ✅ Completely free (no subscription)
- ✅ Your data stays on your computer
- ✅ No ads or tracking
- ✅ Backup-friendly (just copy crm.db)

## 🌐 Deployment (Optional)

Want to run this on a server for team access? Deploy to:

### Heroku (Free tier available)
```bash
heroku create your-app-name
git push heroku main
```

### Railway.app
```bash
railway up
```

### Render.com
```bash
Connect GitHub repo and deploy
```

## 📱 Mobile Support

- Responsive design works on tablets
- Mobile-friendly interface
- Access from anywhere

## 🔒 Security

- Data stored locally (no cloud)
- HTTPS ready for deployment
- No user tracking
- Open source for transparency

## 📈 Future Enhancements

Potential additions:
- Photo uploads (before/after for projects)
- Team user accounts & permissions
- Email integration
- SMS reminders
- Payment processing
- Automated invoicing
- Google Calendar sync

## 🆘 Troubleshooting

### Port already in use
```bash
# Use different port
PORT=3001 npm start
```

### Database issues
```bash
# Reset database
rm crm.db
npm start
```

### Data backup
```bash
# Copy your database
cp crm.db crm-backup.db
```

## 📞 Support

For issues or questions:
1. Check the README
2. Review the code (it's simple!)
3. Modify as needed (it's open source)

## 📄 License

MIT - Use freely, modify as needed

---

**Built with ❤️ for construction professionals. Completely free, no ads, no tracking.**
