# Enterprise SDK Commands Documentation

## Overview

The Enterprise SDK provides unified commands with our own identity that work seamlessly across different frameworks (Next.js, React, Svelte, Vue, Angular, etc.). These commands automatically detect your framework and provide appropriate development experience.

## Quick Start

1. **Initialize SDK configuration:**

   ```bash
   enterprise init
   ```

2. **Start development:**

   ```bash
   enterprise dev
   ```

3. **Build for production:**
   ```bash
   enterprise build
   ```

## Available Commands

### `enterprise init`

Initializes Enterprise SDK configuration for your project.

**Usage:**

```bash
enterprise init [--force]
```

**Options:**

- `--force`: Force overwrite existing configuration

**What it does:**

- Creates `enterprise.sdk.config.js` in your project root
- Prompts for framework selection and preferences
- Sets up default configuration based on your choices

### `enterprise dev`

Lance le mode développement avec détection automatique du framework.

**Usage:**

```bash
enterprise dev [options]
```

**Options:**

- `-p, --port <port>`: Port du serveur de développement (default: 3000)
- `-h, --host <host>`: Hôte du serveur (default: localhost)
- `--hot`: Activer le rechargement à chaud
- `--inspect`: Activer l'inspecteur Node.js
- `--turbo`: Activer le mode Turbo (Next.js)
- `--experimental`: Activer les fonctionnalités expérimentales
- `--env <environment>`: Définir l'environnement

**Framework-specific behavior:**

| Framework  | Command          | Special Features                  |
| ---------- | ---------------- | --------------------------------- |
| Next.js    | `next dev`       | Turbo mode, experimental features |
| React/Vite | `vite`           | Hot reload, force restart         |
| SvelteKit  | `npm run dev`    | SvelteKit-specific options        |
| Nuxt       | `nuxt dev`       | Nuxt-specific options             |
| Angular    | `ng serve`       | Live reload support               |
| Remix      | `remix dev`      | Remix-specific options            |
| Gatsby     | `gatsby develop` | Gatsby development mode           |

### `enterprise build`

Construit pour la production avec optimisations automatiques.

**Usage:**

```bash
enterprise build [options]
```

**Options:**

- `-o, --output <output>`: Répertoire de sortie (default: dist)
- `--target <target>`: Cible de build (default: production)
- `--analyze`: Analyser la taille du bundle
- `--minify`: Minifier le code
- `--sourcemap`: Générer les sourcemaps
- `--mode <mode>`: Mode de build (development/production)
- `--platform <platform>`: Plateforme cible (default: browser)
- `--experimental`: Activer les fonctionnalités expérimentales

**Framework-specific output:**

| Framework  | Output Directory  | Notes                |
| ---------- | ----------------- | -------------------- |
| Next.js    | `.next/`          | Next.js build output |
| React/Vite | `dist/`           | Static files         |
| SvelteKit  | `build/`          | SvelteKit build      |
| Nuxt       | `.output/public/` | Nuxt static output   |
| Angular    | `dist/<project>/` | Angular build        |
| Remix      | `build/`          | Remix build          |
| Gatsby     | `public/`         | Gatsby static site   |

### `enterprise start`

Démarrer le serveur de production local.

**Usage:**

```bash
enterprise start [options]
```

**Options:**

- `-p, --port <port>`: Port du serveur (default: 3000)
- `-h, --host <host>`: Hôte du serveur (default: 0.0.0.0)
- `--workers <count>`: Nombre de workers (default: auto)
- `--production`: Forcer le mode production
- `--env <environment>`: Définir l'environnement

### `enterprise lint`

Lint et vérifications du code avec détection automatique du framework.

**Usage:**

```bash
enterprise lint [options]
```

**Options:**

- `--fix`: Corriger automatiquement les erreurs
- `--cache`: Utiliser le cache (default: true)
- `--max-warnings <count>`: Nombre maximum d'avertissements
- `--quiet`: Mode silencieux
- `--format <format>`: Format de sortie (default: stylish)
- `--output-file <file>`: Fichier de sortie

### `enterprise fmt`

Formattage TypeScript + Rust avec outils appropriés.

**Usage:**

```bash
enterprise fmt [options]
```

**Options:**

- `--check`: Vérifier le formatage sans modifier les fichiers
- `--rust-only`: Formater uniquement les fichiers Rust
- `--ts-only`: Formater uniquement les fichiers TypeScript
- `--files <files>`: Fichiers spécifiques à formater

**What it does:**

- Formate les fichiers TypeScript/JavaScript avec Prettier
- Formate les fichiers Rust avec rustfmt
- Supporte la vérification seule avec `--check`
- Détecte automatiquement les fichiers à formater

### `enterprise test`

Tests unifiés pour tous les frameworks et types de tests.

**Usage:**

```bash
enterprise test [options]
```

**Options:**

- `--watch`: Mode watch pour les tests
- `--coverage`: Générer la couverture de code
- `--ui`: Interface utilisateur pour les tests
- `--run-in-band`: Exécuter les tests en série
- `--test-name-pattern <pattern>`: Filtrer les tests par nom
- `--test-path-pattern <pattern>`: Filtrer les tests par chemin
- `--verbose`: Mode verbeux

**Test Types:**

- **Unit tests**: Tests unitaires avec Vitest
- **Integration tests**: Tests d'intégration automatiquement détectés
- **E2E tests**: Tests end-to-end si disponibles

**Framework-specific behavior:**

| Framework  | Unit Command   | Integration                | E2E                |
| ---------- | -------------- | -------------------------- | ------------------ |
| Next.js    | `npm run test` | `npm run test:integration` | `npm run test:e2e` |
| React/Vite | `vitest run`   | `npm run test:integration` | `npm run test:e2e` |
| Angular    | `ng test`      | `ng e2e`                   | `ng e2e`           |
| SvelteKit  | `vitest run`   | `npm run test:integration` | `npm run test:e2e` |

### `enterprise upgrade`

Mise à jour du SDK Enterprise avec gestion des dépendances.

**Usage:**

```bash
enterprise upgrade [options]
```

**Options:**

- `--check`: Vérifier les mises à jour disponibles
- `--dry-run`: Simuler la mise à jour sans appliquer
- `--force`: Forcer la mise à jour sans confirmation
- `--latest`: Mettre à jour vers la dernière version
- `--version <version>`: Mettre à jour vers une version spécifique

**What it does:**

- Vérifie les dernières versions disponibles
- Met à jour toutes les dépendances @skygenesisenterprise
- Gère les conflits de versions
- Propose une confirmation avant mise à jour
- Supporte le mode simulation

## Configuration

The SDK uses a configuration file (`enterprise.sdk.config.js`) to customize behavior.

### Example Configuration

```javascript
// enterprise.sdk.config.js
export default {
  framework: 'nextjs', // Auto-detected, can be overridden

  dev: {
    port: 3000,
    host: 'localhost',
    hot: true,
    turbo: false,
    experimental: false,
    inspect: false,
  },

  build: {
    output: 'dist',
    target: 'production',
    mode: 'production',
    platform: 'browser',
    minify: true,
    sourcemap: false,
    analyze: false,
  },

  start: {
    port: 3000,
    host: '0.0.0.0',
    workers: 'auto',
  },

  lint: {
    fix: false,
    cache: true,
    maxWarnings: 10,
    quiet: false,
    format: 'stylish',
  },

  fmt: {
    check: false,
    rustOnly: false,
    tsOnly: false,
  },

  test: {
    watch: false,
    coverage: false,
    ui: false,
    runInBand: false,
    verbose: false,
  },

  plugins: [],
  env: {
    CUSTOM_VAR: 'value',
  },
};
```

### Environment Variables

The SDK automatically sets these environment variables:

- `PORT`: Server port
- `HOST`: Server host
- `NODE_ENV`: Environment mode
- `HOT_RELOAD`: Hot reload status
- `TURBO`: Turbo mode status
- `EXPERIMENTAL`: Experimental features status
- Custom variables from `env` configuration

## Framework Detection

The SDK automatically detects your framework based on:

1. **Configuration files** (next.config.js, vite.config.js, etc.)
2. **Package.json dependencies** (next, react, svelte, etc.)
3. **Project structure**

### Detection Priority

1. Next.js → React/Vite → Svelte → Vue/Nuxt → Angular → Remix → Gatsby → Generic

## Examples

### Next.js Project

```bash
# Initialize configuration
enterprise init

# Start development with Turbo mode
enterprise dev --turbo --experimental

# Build with analysis
enterprise build --analyze

# Start production server
enterprise start --host 0.0.0.0

# Format code
enterprise fmt

# Run tests with coverage
enterprise test --coverage

# Check for updates
enterprise upgrade --check
```

### React/Vite Project

```bash
# Initialize configuration
enterprise init

# Start development with custom port
enterprise dev --port 8080 --hot

# Build with sourcemaps
enterprise build --sourcemap

# Format and check
enterprise fmt --check

# Run tests
enterprise test --watch

# Lint and fix
enterprise lint --fix
```

### SvelteKit Project

```bash
# Initialize configuration
enterprise init

# Development mode
enterprise dev

# Build for production
enterprise build

# Format TypeScript only
enterprise fmt --ts-only

# Run all tests
enterprise test --coverage

# Upgrade SDK
enterprise upgrade
```

### Project with Rust Components

```bash
# Format both TypeScript and Rust
enterprise fmt

# Format only Rust files
enterprise fmt --rust-only

# Check formatting without changes
enterprise fmt --check
```

## Integration with Existing Workflows

The SDK commands are designed to complement existing framework commands:

### Migration from Framework Commands

| From             | To                   |
| ---------------- | -------------------- |
| `npm run dev`    | `enterprise dev`     |
| `npm run build`  | `enterprise build`   |
| `npm run start`  | `enterprise start`   |
| `npm run lint`   | `enterprise lint`    |
| `npm run test`   | `enterprise test`    |
| `npm run format` | `enterprise fmt`     |
| N/A              | `enterprise upgrade` |

### Package.json Scripts

You can update your package.json to use SDK commands:

```json
{
  "scripts": {
    "dev": "enterprise dev",
    "build": "enterprise build",
    "start": "enterprise start",
    "lint": "enterprise lint",
    "fmt": "enterprise fmt",
    "test": "enterprise test",
    "test:coverage": "enterprise test --coverage",
    "upgrade": "enterprise upgrade"
  }
}
```

## Troubleshooting

### Common Issues

1. **Framework not detected:**
   - Ensure you have framework-specific config files
   - Check package.json dependencies
   - Use `enterprise init` to set framework manually

2. **Port already in use:**
   - Use `--port` option to specify different port
   - Check configuration file for port settings

3. **Build fails:**
   - Check framework-specific requirements
   - Ensure all dependencies are installed
   - Use `--verbose` for detailed error information

4. **Format issues:**
   - Install Prettier: `npm install --save-dev prettier`
   - Install rustfmt for Rust projects
   - Use `enterprise fmt --check` to verify formatting

5. **Test failures:**
   - Ensure Vitest is installed: `npm install --save-dev vitest`
   - Check test configuration in vitest.config.ts
   - Use `enterprise test --verbose` for detailed output

### Debug Mode

Enable verbose output for debugging:

```bash
enterprise dev --verbose
enterprise build --verbose
enterprise test --verbose
```

## Best Practices

1. **Initialize configuration** when starting a new project
2. **Use consistent ports** across development and production
3. **Enable source maps** for development builds
4. **Use fmt command** before committing changes
5. **Run tests with coverage** before deployment
6. **Check for updates regularly** with `enterprise upgrade --check`
7. **Customize configuration** based on project needs

## Next Steps

- Explore [Universal Commands](./universal-commands.md) for advanced usage
- Check [Plugin System](./plugins.md) for extending functionality
- Review [Integration Guide](./integration-guide.md) for specific frameworks

---

## Comparison with Other Tools

| Tool               | Enterprise SDK       | Benefits                               |
| ------------------ | -------------------- | -------------------------------------- |
| `npm run dev`      | `enterprise dev`     | Framework-agnostic, auto-detection     |
| `prettier --write` | `enterprise fmt`     | TypeScript + Rust in one command       |
| `vitest`           | `enterprise test`    | Unified test runner for all frameworks |
| `npm update`       | `enterprise upgrade` | SDK-specific update management         |
| `eslint`           | `enterprise lint`    | Multi-framework linting support        |

The Enterprise SDK commands provide a unified experience across all frameworks with additional features like Rust support, unified testing, and automatic SDK management.
