# 🐳 Enterprise SDK Node.js - Dockerfile de base
# Image multi-usage pour le SDK @skygenesisenterprise/enterprise-node

# ---- Étape 1: Build ----
FROM node:20-alpine AS builder

# Configuration de base
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./

# Installer pnpm et les dépendances
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copier le code source
COPY . .

# Builder tous les packages
RUN pnpm build

# ---- Étape 2: Image de base pour le SDK ----
FROM node:20-alpine AS base

# Métadonnées
LABEL maintainer="Enterprise SDK Team"
LABEL version="1.1.4"
LABEL description="Sky Genesis Enterprise SDK Node.js Runtime"

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV SDK_DEBUG=false
ENV SDK_WASM_ENABLED=true

# Répertoire de travail
WORKDIR /app

# Copier les packages construits
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.d.ts ./
COPY --from=builder /app/index.js ./
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# Installer pnpm en production
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile --prod && \
    pnpm store prune

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S enterprise && \
    adduser -S enterprise -u 1001

# Changer le propriétaire des fichiers
RUN chown -R enterprise:enterprise /app
USER enterprise

# Exposer le port par défaut (peut être overridé)
EXPOSE 3000

# Point d'entrée par défaut
ENTRYPOINT ["node", "index.js"]

# Commande par défaut (peut être overridé)
CMD ["--help"]

# ---- Étape 3: Image de démonstration ----
FROM base AS demo

# Copier les exemples
COPY --from=builder /app/examples ./examples

# Point d'entrée pour la démo
ENTRYPOINT ["node", "examples/enterprise-demo.js"]

# ---- Étape 4: Image de développement ----
FROM base AS development

# Variables d'environnement de développement
ENV NODE_ENV=development
ENV SDK_DEBUG=true

# Installer les dépendances de développement
COPY --from=builder /app/node_modules ./node_modules

# Point d'entrée interactif
ENTRYPOINT ["pnpm", "dev"]