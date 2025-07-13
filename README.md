# 🎨 KatoKits – Printable Preschool Activities & Lesson Plans

KatoKits is a collection of joyful, themed printable activities, AI-powered lesson plans, and early childhood resources designed for home educators, daycares, and early learning centers.

🧠 Learn through play.  
📥 Instant downloads.  
✅ Simple setup for busy teachers & caregivers.

---

## 🧩 Features

- 🖨️ Printable PDF Activity Sheets (starting at $0.99)
- 📚 Full Lesson Plans with Transitions + Objectives
- 🧾 Editable Developmental Checklists
- 🎯 AI Lesson Plan Generator (Free & Pro Plans)
- 🏫 Daycare Subscriptions (Multi-user support)

---

## 🧪 Tech Stack

- 🧬 **Frontend**: Static HTML/CSS with vanilla JavaScript
- 🔐 **Auth & Database**: Netlify Identity (planned)
- ⚙️ **Hosting**: Netlify with serverless functions
- 🧠 **AI Plan Generator**: OpenAI API integration
- 🛒 **Payments**: Stripe (planned)

---

## 🚀 Development Setup

### Prerequisites
- Node.js 18+ 
- Netlify CLI (optional for local development)

### Local Development
```bash
# Clone the repository
git clone https://github.com/KatoKits/KatoKits.git
cd KatoKits

# Install dependencies for Netlify functions
npm install

# Start local development server (optional)
npm run dev

# Or simply open index.html in your browser for static development
```

### Environment Variables
Create a `.env` file in the root directory:
```
OPENAI_API_KEY=your_openai_api_key_here
```

---

## 📁 Project Structure

```
KatoKits/
├── index.html              # Homepage
├── about.html              # About page
├── ai.html                 # AI lesson plan generator
├── pricing.html            # Pricing and subscriptions
├── contact.html            # Contact form
├── library.html            # Resource library
├── lesson-plans.html       # Lesson plan catalog
├── freebies.html           # Free resources
├── styles.css              # Main stylesheet
├── images/                 # Static assets
├── products/               # Product definitions (JSON)
│   └── bundle-1/
│       └── product.json
├── netlify/
│   └── functions/          # Serverless functions
│       └── generateAIPlan.js
├── netlify.toml            # Netlify configuration
├── package.json            # Node.js dependencies
└── README.md               # This file
```

---

## 🧠 AI Integration

Educators can generate custom lesson plans by theme, skill level, or materials on hand using a smart AI interface — built to reduce planning time by 90%.

### AI Function
The `/netlify/functions/generateAIPlan.js` function integrates with OpenAI's API to create detailed preschool lesson plans including:
- Clear learning objectives
- Materials lists
- Step-by-step procedures
- Teaching strategies
- Developmental checklists

---

## 🛒 Products

Products are defined in JSON format in the `/products` directory. Each product includes:
- Title and description
- Age range and subject area
- Learning objectives
- Price and file information
- Preview availability

---

## 📦 Try It Out

- 🎁 [Get a Free Activity + Checklist](https://katokits.ca/freebies.html)
- 🌐 [Visit the Live App](https://katokits.ca)
- 🤖 [Try the AI Generator](https://katokits.ca/ai.html)

---

## 🤝 Contributing

This is a commercial project. For questions or collaboration opportunities, please contact us through our website.

---

## 📄 License

Copyright © 2024 KatoKits. All rights reserved.
