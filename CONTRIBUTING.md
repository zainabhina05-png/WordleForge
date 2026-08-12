# Contributing to WordForge

Thank you for your interest in contributing to WordForge! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Maintain professional communication

## Getting Started

### 1. Fork and Clone
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/wordforge.git
cd wordforge
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment
```bash
# Copy example env file
cp .env.example .env

# Add your credentials
# See README.md for details
```

### 4. Set Up Database
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```

## Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes
- Write clean, readable code
- Follow existing patterns
- Add comments for complex logic
- Update documentation

### 3. Test Your Changes
```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint

# Type check
npm run type-check
```

### 4. Commit Your Changes
We use conventional commits:

```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "docs: update README"
git commit -m "test: add tests for feature"
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

### 5. Push and Create PR
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Standards

### TypeScript
- Use strict mode
- No `any` types
- Explicit return types for functions
- Use interfaces for objects
- Export types with code

```typescript
// Good
export interface User {
  id: string;
  name: string;
}

export function getUser(id: string): Promise<User> {
  // ...
}

// Bad
export function getUser(id: any): Promise<any> {
  // ...
}
```

### React Components
- Functional components only
- Use TypeScript for props
- Keep components focused
- Extract hooks for logic

```typescript
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// Bad
export function Button(props: any) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### Server Actions
- Always use `'use server'`
- Validate all inputs
- Handle errors gracefully
- Return typed results

```typescript
'use server';

import { z } from 'zod';

const schema = z.object({
  name: z.string(),
});

export async function createItem(input: unknown) {
  try {
    const validated = schema.parse(input);
    // ...
    return { success: true, data };
  } catch (error) {
    return { error: 'Failed to create item' };
  }
}
```

### CSS/Styling
- Use Tailwind classes
- Follow design system
- Mobile-first approach
- Use semantic HTML

### Testing

#### Unit Tests
```typescript
import { describe, it, expect } from 'vitest';

describe('Feature', () => {
  it('should do something', () => {
    const result = doSomething();
    expect(result).toBe(expected);
  });
});
```

#### Component Tests
```typescript
import { render, screen } from '@testing-library/react';
import { Component } from './component';

describe('Component', () => {
  it('should render', () => {
    render(<Component />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Project Structure

### Adding New Features
1. Create feature directory in `src/features/`
2. Add components, hooks, and types
3. Export from index file
4. Add tests

```
src/features/new-feature/
├── components/
├── hooks/
├── types.ts
├── index.ts
└── __tests__/
```

### Adding New Routes
1. Create route in `src/app/`
2. Use proper layout
3. Implement loading/error states
4. Add metadata

```typescript
export const metadata = {
  title: 'Page Title',
  description: 'Page description',
};

export default function Page() {
  // ...
}
```

### Adding New Components
1. Create in `src/components/`
2. Use TypeScript props
3. Add to Storybook (if applicable)
4. Add tests

## Database Changes

### Schema Changes
1. Edit `prisma/schema.prisma`
2. Generate migration
3. Test migration
4. Update seed if needed

```bash
npx prisma migrate dev --name add_field
npm run db:seed
```

### Adding Seeds
Edit `prisma/seed.ts`:

```typescript
const items = [
  { name: 'Item 1' },
  { name: 'Item 2' },
];

for (const item of items) {
  await prisma.item.create({ data: item });
}
```

## Documentation

### Code Comments
- Explain **why**, not **what**
- Use JSDoc for public APIs
- Keep comments up to date

```typescript
/**
 * Calculates user score based on performance metrics.
 * Uses exponential decay for time bonus.
 * 
 * @param guesses - Number of guesses made
 * @param time - Time taken in seconds
 * @returns Calculated score
 */
export function calculateScore(guesses: number, time: number): number {
  // ...
}
```

### README Updates
- Keep instructions current
- Add new features to list
- Update screenshots if needed

## Testing Guidelines

### What to Test
- Business logic
- Game rules
- Validation
- Error handling
- User interactions

### What Not to Test
- Third-party libraries
- Framework internals
- Trivial getters/setters

### Coverage Goals
- Aim for >95% coverage
- 100% for critical paths
- Focus on logic, not lines

## Pull Request Process

### Before Submitting
- [ ] All tests pass
- [ ] No linting errors
- [ ] No TypeScript errors
- [ ] Code is documented
- [ ] Changes are tested

### PR Description
Include:
- What changed
- Why it changed
- How to test
- Screenshots (if UI)
- Breaking changes (if any)

### Review Process
1. Automated checks run
2. Maintainer reviews code
3. Feedback addressed
4. Approved and merged

## Questions?

- Check existing issues
- Read documentation
- Ask in discussions
- Create new issue

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).

## Thank You!

Your contributions make WordForge better for everyone!
