# Contributing to KatoKits

Thank you for your interest in contributing to KatoKits! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Testing](#testing)
- [Deployment](#deployment)

## Code of Conduct

This project follows a Code of Conduct to ensure a welcoming environment for all contributors. By participating, you agree to uphold this code.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js 18.19.0 or higher (check `.nvmrc`)
- npm or yarn package manager
- Git for version control
- A code editor (VS Code recommended)

### Development Setup

1. **Fork the repository**

   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR-USERNAME/KatoKits.git
   cd KatoKits
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Verify setup**
   - Open `http://localhost:3000`
   - Ensure the application loads correctly

## Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

- 🐛 **Bug fixes**: Fix issues in existing functionality
- ✨ **Features**: Add new features or enhance existing ones
- 📝 **Documentation**: Improve docs, comments, or examples
- 🎨 **UI/UX**: Design improvements and user experience enhancements
- ⚡ **Performance**: Optimize code for better performance
- 🧪 **Testing**: Add or improve test coverage

### Before You Start

1. **Check existing issues**: Look for existing issues related to your contribution
2. **Create an issue**: If none exists, create one to discuss your proposed changes
3. **Get feedback**: Wait for maintainer feedback before starting work
4. **Assign yourself**: Once approved, assign the issue to yourself

### Branch Naming

Use descriptive branch names following this pattern:

- `feature/short-description` - For new features
- `fix/short-description` - For bug fixes
- `docs/short-description` - For documentation changes
- `refactor/short-description` - For code refactoring
- `test/short-description` - For testing improvements

Examples:

- `feature/ai-lesson-customization`
- `fix/login-validation-error`
- `docs/api-documentation-update`

## Pull Request Process

### 1. Create Your Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Follow the [Code Style](#code-style) guidelines
- Add tests if applicable
- Update documentation as needed
- Ensure your changes don't break existing functionality

### 3. Test Your Changes

```bash
# Run linting
npm run lint:check

# Check formatting
npm run format:check

# Build the project
npm run build

# Test the application manually
npm run dev
```

### 4. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add AI lesson plan customization options

- Add theme selection dropdown
- Implement age group filtering
- Update API to handle new parameters
- Add tests for new functionality"
```

### Commit Message Format

Follow the conventional commits format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:

- **Clear title**: Summarize the change in 50 characters or less
- **Detailed description**: Explain what changed and why
- **Issue reference**: Link to related issues using `Fixes #123`
- **Screenshots**: Include before/after screenshots for UI changes
- **Testing instructions**: Explain how to test your changes

### Pull Request Template

```markdown
## Description

Brief description of changes made.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Testing

- [ ] I have tested these changes locally
- [ ] All existing tests pass
- [ ] I have added new tests where appropriate

## Screenshots (if applicable)

Add screenshots to help explain your changes.

## Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Code is commented where necessary
- [ ] Documentation updated as needed
```

## Code Style

### JavaScript

We use ESLint and Prettier for consistent code formatting:

```bash
# Check linting
npm run lint:check

# Fix linting issues
npm run lint

# Check formatting
npm run format:check

# Fix formatting
npm run format
```

### Key Guidelines

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at end of statements
- Use meaningful variable and function names
- Add JSDoc comments for functions
- Keep functions small and focused

### Example:

```javascript
/**
 * Generate AI lesson plan based on user parameters
 * @param {Object} params - Generation parameters
 * @param {string} params.theme - Lesson theme
 * @param {string} params.ageGroup - Target age group
 * @returns {Promise<Object>} Generated lesson plan
 */
async function generateLessonPlan(params) {
  const { theme, ageGroup } = params;

  if (!theme || !ageGroup) {
    throw new Error('Theme and age group are required');
  }

  // Implementation here
  return lessonPlan;
}
```

### HTML/CSS

- Use semantic HTML elements
- Follow BEM methodology for CSS classes
- Ensure accessibility (proper ARIA labels, alt text)
- Responsive design for all screen sizes
- Use CSS custom properties for theming

## Testing

### Manual Testing

Before submitting:

1. Test all affected functionality
2. Check responsive design on different screen sizes
3. Verify accessibility with screen readers
4. Test with different browsers (Chrome, Firefox, Safari)

### Future: Automated Testing

We plan to add automated testing. When implemented:

- Write unit tests for new functions
- Add integration tests for API endpoints
- Include end-to-end tests for critical user flows

## Deployment

The application is deployed automatically to Netlify:

1. **Staging**: Pull requests trigger preview deployments
2. **Production**: Merges to `main` branch trigger production deployments

### Environment Variables

Required for deployment:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `STRIPE_PUBLIC_KEY`

## Getting Help

### Resources

- [Project Documentation](../README.md)
- [API Documentation](API.md)
- [Database Schema](database-schema.sql)

### Contact

- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Email**: [Contact us](https://katokits.ca/contact) for private matters

### Review Process

1. **Automated checks**: CI runs linting, formatting, and build checks
2. **Manual review**: Maintainers review code quality and functionality
3. **Testing**: Changes are tested in preview environment
4. **Approval**: At least one maintainer approval required
5. **Merge**: Approved changes are merged to main branch

## Recognition

Contributors are recognized in:

- GitHub Contributors section
- Release notes for significant contributions
- Project README (for major contributions)

Thank you for contributing to KatoKits! Your help makes this project better for educators and children everywhere. 🎨📚
