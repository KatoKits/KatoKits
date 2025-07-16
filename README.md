# 🎨 KatoKits – Printable Preschool Activities & Lesson Plans

KatoKits is a collection of joyful, themed printable activities, AI-powered lesson plans, and early childhood resources designed for home educators, daycares, and early learning centers.

🧠 Learn through play.  
📥 Instant downloads.  
✅ Simple setup for busy teachers & caregivers.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.19.0 or higher (see `.nvmrc`)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/KatoKits/KatoKits.git
   cd KatoKits
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
# Build the application
npm run build

# The built files will be in the `dist/` directory
```

---

## 🧩 Features

- 🖨️ **Printable PDF Activity Sheets** - Starting at $0.99
- 📚 **Full Lesson Plans** - With transitions and learning objectives
- 🧾 **Editable Developmental Checklists** - Track student progress
- 🎯 **AI Lesson Plan Generator** - Free and Pro plans available
- 🏫 **Daycare Subscriptions** - Multi-user support for institutions

---

## 🧪 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Build Tool**: Parcel.js
- **Hosting**: Netlify
- **Authentication & Database**: Supabase
- **AI Integration**: Custom AI lesson plan generator
- **Payments**: Stripe integration
- **Functions**: Netlify serverless functions

---

## 📁 Project Structure

```
KatoKits/
├── src/                    # Source files
│   └── index.html         # Main application entry point
├── js/                    # JavaScript modules
│   ├── main.js           # Core application logic
│   └── auth-api.js       # Authentication and API client
├── netlify/              # Netlify functions
│   └── functions/        # Serverless function implementations
├── images/               # Static image assets
├── docs/                 # Documentation files
├── products/             # Product data and configurations
├── dist/                 # Built application (generated)
└── .parcel-cache/        # Parcel build cache (generated)
```

---

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run start` - Start development server and open browser
- `npm run build` - Build for production
- `npm run lint` - Run ESLint and fix issues
- `npm run lint:check` - Check code style without fixing
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run clean` - Clean build artifacts

### Code Quality

This project uses ESLint and Prettier for code quality and formatting:

- **ESLint**: Enforces coding standards and catches potential bugs
- **Prettier**: Ensures consistent code formatting
- **Pre-configured rules**: Optimized for modern JavaScript development

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
OPENAI_API_KEY=your_openai_api_key
```

---

## 🧠 AI Integration

Educators can generate custom lesson plans by theme, skill level, or materials on hand using our smart AI interface — built to reduce planning time by 90%.

### AI Features

- **Theme-based generation**: Create lessons around specific topics
- **Age-appropriate content**: Tailored for different developmental stages
- **Materials integration**: Use items you already have available
- **Learning objectives**: Automatically generated educational goals
- **Assessment tools**: Built-in progress tracking

---

## 📖 API Documentation

### Netlify Functions

The application uses serverless functions for backend operations:

- `auth-signup` - User registration
- `auth-login` - User authentication
- `auth-logout` - Session termination
- `generateAIPlan` - AI lesson plan generation
- `contact-form` - Contact form submission
- `email-capture` - Email list subscription
- `ai-usage` - Usage tracking and limits

### Authentication Flow

1. User submits credentials through the UI
2. Frontend calls Netlify function
3. Function validates with Supabase
4. Session token stored in localStorage
5. Subsequent API calls include auth header

---

## 🧪 Testing

Currently, this project focuses on manual testing. Future improvements will include:

- Unit tests for JavaScript modules
- Integration tests for API endpoints
- End-to-end testing for critical user flows

---

## 📦 Deployment

### Netlify Deployment

This application is optimized for Netlify deployment:

1. **Connect repository** to Netlify
2. **Set environment variables** in Netlify dashboard
3. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Deploy** automatically on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy the dist/ directory to your hosting provider
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and ensure they follow our coding standards
4. **Run tests**: `npm run lint && npm run format:check`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Style

- Use ESLint configuration for JavaScript
- Follow Prettier formatting rules
- Add meaningful comments for complex logic
- Write descriptive commit messages

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 📬 Support & Contact

- 🎁 [Get a Free Activity + Checklist](https://katokits.ca/free)
- 🌐 [Visit the Live App](https://katokits.ca)
- 📧 [Contact Support](https://katokits.ca/contact)
- 📬 [Subscribe for Updates](https://katokits.ca/signup)

---

## 🎯 Roadmap

- [ ] Enhanced AI lesson plan customization
- [ ] Mobile application development
- [ ] Advanced assessment tools
- [ ] Multi-language support
- [ ] Collaborative planning features
- [ ] Offline mode capabilities

---

_Built with ❤️ for educators and children everywhere._
