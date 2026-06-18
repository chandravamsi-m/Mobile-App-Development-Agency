# AppForge — Mobile App Development Agency Website

AppForge is a premium, modern, SaaS-inspired agency website engineered using pure **HTML, CSS, and Vanilla JavaScript** (no build frameworks). 

---

## ⚡ Key Features

- **Multi-Homepage System**: 
  - **Home 1 (`index.html`)**: Features a clean split-layout hero presenting key stats, client testimonials, and a phone dashboard mockup.
  - **Home 2 (`index-2.html`)**: A centered premium SaaS-inspired homepage designed from scratch with visual interactive cards, carousel previews, and success metrics.
- **Client Collaboration Portal (`dashboard.html`)**: Allows project tracking across 8 dynamic views: Overview, Milestones, Requirements, Prototypes, Messaging, Files, Invoices, Settings.
- **Interactive Scopes & Budget Tools**:
  - **Project Cost Estimator** (`services.html` & `index-2.html`): Computes custom budget windows based on platforms, complexity multipliers, and features.
  - **ROI Calculator** (`pricing.html`): Projects monthly revenue, annual run-rate, total timeframe returns, and break-even timelines.
  - **Discovery Booking Scheduler** (`contact.html`): Dynamically builds next 14 business days to request a scoping meeting.
  - **App Feature Planner** (`services.html`): Checklist logic estimating timeline weeks and plan download options.
- **System Customizations**:
  - **Dark / Light Mode Toggle**: Adjusts custom properties at the `html[data-theme]` scope.
  - **RTL (Right-to-Left) Toggle**: Aligns flex and grid columns automatically using the `html[dir="rtl"]` attribute.
  - **WCAG 2.1 AA Compliance**: Keyboard-accessible modals, accordions, skip-links, and semantic structures.

---

## 📁 Directory Structure

```
mobile-app-agency/
├── assets/
│   ├── css/
│   │   ├── main.css          ← Typography resets, navigation dropdowns, utility layouts
│   │   ├── components.css    ← Glassmorphic cards, buttons, interactive sliders
│   │   └── dashboard.css     ← Multi-view dashboard layout, chats, grids
│   └── js/
│       ├── main.js           ← Theme management, RTL alignment, hamburger, mobile menus
│       ├── dashboard.js      ← View swapper, requirements tracker, prototype approvals
│       └── tools.js          ← ROI/Cost algorithms, login authentication, booking calendars
├── index.html                ← Home 1 (Split Hero layout)
├── index-2.html              ← Home 2 (Premium SaaS layout)
├── about.html                ← Story, Timeline, and Certifications
├── services.html             ← Interactive Checklist and Recommender
├── case-studies.html         ← Dynamic Portfolio and Metrics
├── pricing.html              ← Comparison Grid and ROI Slider
├── blog.html                 ← Dynamic Filters Hub
├── contact.html              ← Scoping Form and Appointment Grid
├── login.html                ← Center login with Password visibility toggles
├── dashboard.html            ← Project dashboard center
├── 404.html                  ← Crash Error landing page
├── coming-soon.html          ← Launch countdown ticker
├── sitemap.xml               ← SEO crawler route list
└── robots.txt                ← Search index crawler rules
```

---

## 🛠️ Testing & Running Locally

1. Open any page (e.g. `index.html`) in a standard web browser.
2. Toggle the **🌙/☀️** icons to swap styles.
3. Toggle the **RTL** buttons to switch layout flows.
4. Try typing credentials in `login.html` and hit submit to view the dashboard portal.
5. In the dashboard, click on various sidebar options to test the interactive views.
