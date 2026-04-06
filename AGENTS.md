# my-expo-app — Agent Guidelines

## Stack

- **Runtime**: Expo SDK 54 · React Native 0.81 · React 19
- **Routing**: Expo Router v6 (file-based, `app/` directory)
- **Styling**: Uniwind v1.6 + Tailwind CSS v4 (via `className`)
- **Navigation**: React Navigation v7 (Bottom Tabs + Stack)
- **Icons**: `@expo/vector-icons` (Ionicons)
- **Package Manager**: pnpm (MANDATORY — never use npm, yarn, or bun)
- **Language**: TypeScript (strict)

## Critical Rules

### Styling — Uniwind ONLY

- Use `className` props for all styling. Never use inline `style` unless absolutely necessary for dynamic values that Uniwind cannot handle.
- Theme variables are defined in `global.css` using `@layer theme` with `@variant dark` / `@variant light`. **Do NOT use `.dark` CSS selectors** — Uniwind does not respond to them.
- Use `dark:` variant for theme-specific styles: `className="bg-white dark:bg-gray-900"`
- Available CSS variables: `bg-background`, `bg-foreground`, `bg-card`, `bg-primary`, `bg-muted`, `bg-destructive`, `bg-border`, `bg-input`, `bg-ring`, `bg-secondary`, `bg-accent` (and `text-*`, `border-*` equivalents)
- To change themes programmatically, use `Uniwind.setTheme('light' | 'dark' | 'system')` from `'uniwind'`. **Do NOT use `Appearance.setColorScheme()`** for theme switching.
- To read theme info, use `useUniwind()` from `'uniwind'` or the app's custom `useTheme()` from `@/components/theme-provider`.

### Expo Native Modules — Prefer Built-in

Always prefer Expo's built-in packages over third-party alternatives:

| Need | Use |
|---|---|
| Icons | `@expo/vector-icons` (Ionicons) |
| Images | `expo-image` |
| Haptics | `expo-haptics` |
| Status bar | `expo-status-bar` |
| System UI | `expo-system-ui` |
| Fonts | `expo-font` |
| Linking | `expo-linking` |
| Web browser | `expo-web-browser` |
| Symbols (iOS) | `expo-symbols` |
| Safe areas | `react-native-safe-area-context` |
| Animations | `react-native-reanimated` |
| Gestures | `react-native-gesture-handler` |

### Component Architecture

- UI components live in `components/ui/` with barrel exports via `components/ui/index.ts`
- The `components/index.ts` barrel re-exports from `./ui` and `./theme-provider`
- Custom components accept `variant` props for predefined styles and `className` for overrides
- Theme provider is a custom wrapper around Uniwind at `components/theme-provider.tsx`

### Theme Provider

The app exposes a `useTheme()` hook from `@/components/theme-provider`:

```ts
const { theme, actualTheme, setTheme } = useTheme();
// theme: 'light' | 'dark' | 'system' (user selection)
// actualTheme: 'light' | 'dark' (resolved value)
// setTheme: (theme: Theme) => void
```

### Routing

- File-based routing under `app/` using Expo Router
- Tab navigation: `app/(tabs)/` — currently `index.tsx` (Home) and `explore.tsx` (Settings)
- Tab icons use `Ionicons` in `app/(tabs)/_layout.tsx`
- Import `import '../global.css'` in `app/_layout.tsx` (entry point)

### Path Aliases

- `@/*` → `./*` (root)
- `@components/*` → `./components/*`
- `@components` → `./components/index.ts`

### Code Style

- No comments unless explicitly requested
- No emojis in code
- TypeScript strict mode — no `any`
- Use functional components with named exports where appropriate
- Keep components small and focused
