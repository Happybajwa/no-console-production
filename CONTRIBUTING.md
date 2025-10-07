# Contributing to no-console-production

Thanks for your interest in contributing! 🎉

## 🚀 Quick Start

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/no-console-production.git
cd no-console-production

# 2. Install dependencies
npm install

# 3. Run tests
npm test

# 4. Build
npm run build
```

## 📁 Project Structure

```
src/
├── core/           # Core suppression logic
├── types/          # TypeScript definitions  
├── utils/          # Helper functions
├── components/     # React components
├── hooks/          # React hooks
└── index.tsx       # Main exports

test.ts             # Comprehensive test suite
```

## 🧪 Testing

```bash
npm test           # Run all tests (single test.ts file)
```

**All PRs must have tests and pass the full test suite (18 tests).**

## 📝 Code Standards

- **TypeScript**: Use proper types and interfaces
- **Format**: 2 spaces, semicolons, double quotes
- **Comments**: JSDoc for public APIs
- **Tests**: Required for all new features/fixes

## 📋 Pull Request Process

1. **Create feature branch**: `git checkout -b feature/your-feature`
2. **Make changes** with tests
3. **Run tests**: `npm test` (must pass all 18 tests)
4. **Build**: `npm run build` (must succeed)
5. **Commit**: Use clear, descriptive messages
6. **Push**: `git push origin feature/your-feature`
7. **Create PR** with description of changes

## 🐛 Reporting Issues

Use our [issue template](.github/ISSUE_TEMPLATE/bug_report.md) with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details

## 💡 Feature Requests

Open an issue with:
- Use case explanation
- Proposed API (if applicable)
- Why it benefits users

## ⚡ Development Commands

```bash
npm test           # Run all tests (test.ts)
npm run build      # Build distribution
```

## 🏗️ Architecture Guidelines

- **Core logic**: Keep in `src/core/`
- **Types**: Define in `src/types/`
- **Utilities**: Add to `src/utils/`
- **React features**: Use `src/components/` and `src/hooks/`
- **Tests**: Add to `test.ts` with clear test names

## 📦 Release Process

1. Version bump in `package.json`
2. Update changelog/README if needed
3. All tests pass
4. Create PR to `main`
5. Tag release after merge

---

**Questions?** Open an issue or start a discussion. We're here to help! 💬
