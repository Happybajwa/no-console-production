# Contributing to no-console-production

Thank you for your interest in contributing to `no-console-production`! We welcome contributions from the community and are grateful for any help you can provide.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Release Process](#release-process)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git
- TypeScript knowledge (helpful but not required)

### Types of Contributions

We welcome many different types of contributions:

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🧪 **Tests**
- 🎨 **Code style improvements**
- 🔧 **Tooling and infrastructure**
- 💡 **Ideas and suggestions**

## 🛠️ Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/no-console-production.git
   cd no-console-production
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm test
   ```

5. **Create a branch for your work**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

## 📝 Coding Standards

### TypeScript Guidelines

- Use TypeScript for all new code
- Prefer interfaces over types when possible
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use double quotes for strings
- Use trailing commas in multi-line objects/arrays
- Maximum line length: 80 characters

### File Structure

```
src/
├── components/     # Core functionality
├── hooks/          # React hooks
├── types/          # TypeScript type definitions
└── index.tsx       # Main exports
```

### Example Code Style

```typescript
/**
 * Suppresses console methods based on configuration
 * @param options - Configuration options
 * @returns Cleanup function
 */
export const suppressConsole = ({
  methods = [],
  preserveErrors = true,
}: ConsoleSuppressionOptions = {}): (() => void) => {
  // Implementation here
};
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
node test.js
```

### Writing Tests

- Add tests for all new features
- Add tests for bug fixes
- Aim for high test coverage
- Use descriptive test names

### Test Structure

```javascript
// Test example
console.log('🧪 Testing [Feature Name]...\n');

// Test case 1
const result = yourFunction(input);
const passed = result === expectedOutput;
console.log(`${passed ? '✅' : '❌'} Test description`);
```

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure your code follows our style guide**
2. **Add or update tests** as needed
3. **Update documentation** if you've changed APIs
4. **Run the test suite** and ensure all tests pass
5. **Build the project** and ensure it compiles successfully

### PR Checklist

- [ ] Code follows the project's coding standards
- [ ] Tests have been added/updated and are passing
- [ ] Documentation has been updated (if applicable)
- [ ] Commit messages are clear and descriptive
- [ ] PR description explains what and why

### Commit Message Format

Use clear, descriptive commit messages:

```
type(scope): brief description

Optional longer description explaining the change.

Closes #123
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `chore`: Maintenance tasks

**Examples:**
```
feat(core): add preserveErrors option to suppressConsole
fix(hooks): prevent memory leaks in useConsoleSuppression
docs(readme): add React usage examples
test(core): add edge case tests for error suppression
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (please describe)

## Testing
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or marked as breaking)
```

## 🐛 Issue Guidelines

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check the documentation** for solutions
3. **Try the latest version** of the package

### Bug Reports

Include:
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node.js version, browser, etc.)
- Code example (minimal reproduction case)

### Feature Requests

Include:
- Clear description of the feature
- Use case and motivation
- Possible implementation approach
- Any breaking changes

### Issue Templates

**Bug Report:**
```markdown
## Bug Description
A clear description of the bug

## Steps to Reproduce
1. Step one
2. Step two
3. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- Node.js version:
- Package version:
- Browser (if applicable):

## Code Example
```typescript
// Minimal code to reproduce the issue
```

## 🚀 Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (x.0.0): Breaking changes
- **MINOR** (0.x.0): New features (backward compatible)
- **PATCH** (0.0.x): Bug fixes (backward compatible)

### Release Checklist

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release commit
4. Tag the release
5. Push to GitHub
6. Publish to npm
7. Create GitHub release

## 🤝 Community

### Getting Help

- 📖 Check the [README](README.md) for usage examples
- 🐛 Create an [issue](https://github.com/Happybajwa/no-console-production/issues) for bugs
- 💡 Start a [discussion](https://github.com/Happybajwa/no-console-production/discussions) for questions
- 📧 Email maintainers for private concerns

### Recognition

All contributors will be recognized in our:
- GitHub contributors list
- Release notes (for significant contributions)
- README acknowledgments

## 📄 License

By contributing to no-console-production, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

**Thank you for contributing! 🎉**

Your contributions make this project better for everyone. We appreciate your time and effort!
