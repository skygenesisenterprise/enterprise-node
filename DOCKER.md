# 🐳 Docker Guide pour Enterprise SDK

Ce guide explique comment utiliser les images Docker pour le SDK `@skygenesisenterprise/enterprise-node`.

## 📋 Images Disponibles

### 1. **Image de Base** (`skygenesisenterprise/enterprise-node:latest`)

- **Usage**: Runtime de base pour le SDK
- **Taille**: Optimisée pour la production
- **Modules**: Tous les modules disponibles
- **Sécurité**: Utilisateur non-root

### 2. **Image Demo** (`skygenesisenterprise/enterprise-node:1.1.4-demo`)

- **Usage**: Démonstration complète du SDK
- **Contient**: Exemples et tests de tous les modules
- **Idéal**: Présentations et évaluations

### 3. **Image Dev** (`skygenesisenterprise/enterprise-node:1.1.4-dev`)

- **Usage**: Développement et debugging
- **Contient**: Dépendances de dev, outils de debug
- **Ports**: 3000 (app), 9229 (debug)

## 🚀 Utilisation Rapide

### Avec le Script Automatisé

```bash
# Construire toutes les images
./docker-build.sh build all

# Lancer la démo
./docker-build.sh run demo

# Lancer l'environnement de développement
./docker-build.sh run dev

# Nettoyer tout
./docker-build.sh clean
```

### Avec Docker Compose

```bash
# Lancer la démo complète
docker-compose --profile demo up enterprise-demo

# Lancer avec support IA (nécessite AI_API_KEY)
AI_API_KEY=votre-clé docker-compose --profile ai up enterprise-ai

# Lancer avec base de données
docker-compose --profile storage up enterprise-storage

# Lancer Next.js
docker-compose --profile nextjs up enterprise-nextjs

# Lancer le quick start
docker-compose --profile quickstart up enterprise-quickstart
```

### Avec Docker Direct

```bash
# Image de base
docker run --rm -it skygenesisenterprise/enterprise-node:latest --help

# Démonstration
docker run --rm -it \
  -e AI_API_KEY=votre-clé \
  skygenesisenterprise/enterprise-node:1.1.4-demo

# Développement avec volume
docker run --rm -it \
  -p 3000:3000 \
  -p 9229:9229 \
  -v $(pwd):/app \
  skygenesisenterprise/enterprise-node:1.1.4-dev
```

## ⚙️ Configuration

### Variables d'Environnement

| Variable           | Description   | Défaut                 |
| ------------------ | ------------- | ---------------------- |
| `NODE_ENV`         | Environnement | `production`           |
| `SDK_DEBUG`        | Mode debug    | `false`                |
| `SDK_WASM_ENABLED` | WebAssembly   | `true`                 |
| `AI_API_KEY`       | Clé API IA    | -                      |
| `AI_MODEL`         | Modèle IA     | `euse-generate-v0.1.0` |
| `STORAGE_TYPE`     | Type stockage | `memory`               |
| `DATABASE_URL`     | URL BDD       | -                      |

### Volumes Utiles

```bash
# Partager les exemples
-v ./examples:/app/examples:ro

# Développement avec code source
-v $(pwd):/app -v /app/node_modules

# Persistance des données
-v enterprise_data:/app/data
```

## 🔧 Développement

### Mode Debug

```bash
# Lancer avec debugging Node.js
docker-compose --profile dev up enterprise-dev

# Connecter le debugger sur localhost:9229
# VS Code: lancer "Attach to Node.js Process"
```

### Tests

```bash
# Tester les builds Docker
./docker-build.sh test

# Tests dans le conteneur
docker run --rm skygenesisenterprise/enterprise-node:1.1.4-dev pnpm test
```

## 📦 Production

### Déploiement

```bash
# Pousser vers registry
./docker-build.sh push all

# Ou manuellement
docker push skygenesisenterprise/enterprise-node:latest
docker push skygenesisenterprise/enterprise-node:1.1.4-demo
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: enterprise-sdk
spec:
  replicas: 3
  selector:
    matchLabels:
      app: enterprise-sdk
  template:
    metadata:
      labels:
        app: enterprise-sdk
    spec:
      containers:
        - name: enterprise-sdk
          image: skygenesisenterprise/enterprise-node:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: 'production'
            - name: AI_API_KEY
              valueFrom:
                secretKeyRef:
                  name: enterprise-secrets
                  key: ai-api-key
```

## 🛠️ Personnalisation

### Construire une Image Personnalisée

```dockerfile
FROM skygenesisenterprise/enterprise-node:latest

# Ajouter votre application
COPY ./my-app /app/my-app
WORKDIR /app/my-app

# Installer les dépendances
RUN pnpm install

# Point d'entrée personnalisé
ENTRYPOINT ["pnpm", "start"]
```

### Dockerfile Multi-stage

```dockerfile
FROM skygenesisenterprise/enterprise-node:1.1.4-dev AS builder

WORKDIR /app
COPY . .
RUN pnpm build

FROM skygenesisenterprise/enterprise-node:latest AS production
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/index.js"]
```

## 🔍 Dépannage

### Problèmes Communs

1. **Build échoue**

   ```bash
   # Nettoyer et reconstruire
   ./docker-build.sh clean
   ./docker-build.sh build all
   ```

2. **Module IA ne fonctionne pas**

   ```bash
   # Vérifier la clé API
   docker run --rm -e AI_API_KEY=votre-clé skygenesisenterprise/enterprise-node:1.1.4-demo
   ```

3. **Problèmes de permissions**
   ```bash
   # L'image utilise un utilisateur non-root (UID 1001)
   # Assurer la compatibilité avec les volumes
   chown -R 1001:1001 ./data
   ```

### Logs

```bash
# Logs du conteneur
docker logs enterprise-sdk-demo

# Logs docker-compose
docker-compose logs -f enterprise-demo

# Debug mode
docker-compose --profile demo run --rm -e SDK_DEBUG=true enterprise-demo
```

## 📚 Ressources

- [Documentation SDK](./docs/)
- [Exemples](./examples/)
- [Issues GitHub](https://github.com/skygenesisenterprise/enterprise-node/issues)
- [Docker Hub](https://hub.docker.com/r/skygenesisenterprise/enterprise-node)

## 🆘 Support

Pour toute question sur Docker:

1. Vérifier les logs avec `docker logs`
2. Consulter ce guide
3. Ouvrir une issue GitHub avec le tag `docker`
