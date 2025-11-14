# Enterprise API Module

Ce module fournit un client TypeScript pour interagir avec l'API Sky Genesis Enterprise officielle.

## Installation

```bash
npm install @skygenesisenterprise/module-api
```

## Utilisation de base

```typescript
import { EnterpriseApiService } from '@skygenesisenterprise/module-api';

// Initialiser avec une clé API
const api = new EnterpriseApiService('votre-api-key');

// Utiliser les endpoints
const users = await api.getUsers({ page: 1, limit: 10 });
const user = await api.getUser('user-id');
const projects = await api.getProjects({ status: 'active' });
```

## Configuration avancée

```typescript
import { EnterpriseApiService, ApiClient } from '@skygenesisenterprise/module-api';

// Configuration personnalisée
const api = new EnterpriseApiService('votre-api-key', {
  baseUrl: 'https://api.skygenesisenterprise.com/api/v1',
  timeout: 15000,
});

// Accès direct au client HTTP pour des requêtes personnalisées
const client = new ApiClient({
  apiKey: 'votre-api-key',
  headers: {
    'X-Custom-Header': 'custom-value',
  },
});

const response = await client.get('/custom-endpoint');
```

## Endpoints disponibles

### Users

- `getUsers(params?)` - Lister les utilisateurs
- `getUser(id)` - Obtenir un utilisateur
- `createUser(data)` - Créer un utilisateur
- `updateUser(id, data)` - Mettre à jour un utilisateur
- `deleteUser(id)` - Supprimer un utilisateur

### Projects

- `getProjects(params?)` - Lister les projets
- `getProject(id)` - Obtenir un projet
- `createProject(data)` - Créer un projet
- `updateProject(id, data)` - Mettre à jour un projet
- `deleteProject(id)` - Supprimer un projet
- `addProjectMember(projectId, userId)` - Ajouter un membre
- `removeProjectMember(projectId, userId)` - Retirer un membre

### API Keys

- `getApiKeys(params?)` - Lister les clés API
- `getApiKey(id)` - Obtenir une clé API
- `createApiKey(data)` - Créer une clé API
- `updateApiKey(id, data)` - Mettre à jour une clé API
- `deleteApiKey(id)` - Supprimer une clé API

### Audit Logs

- `getAuditLogs(params?)` - Lister les logs d'audit
- `getAuditLog(id)` - Obtenir un log d'audit

### System

- `healthCheck()` - Vérifier la santé de l'API
- `getApiInfo()` - Obtenir les informations de l'API

## Types

Le module inclut des types TypeScript complets pour toutes les réponses API:

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'archived';
  ownerId: string;
  members: string[];
  settings?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
```

## Gestion des erreurs

```typescript
import { ApiError } from '@skygenesisenterprise/module-api';

try {
  const user = await api.getUser('invalid-id');
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.code, error.message);
    console.error('Status:', error.status);
  }
}
```

## Pagination

Les endpoints de liste supportent la pagination:

```typescript
const response = await api.getUsers({
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  search: 'john',
  active: true,
});

console.log(response.meta?.pagination);
// { page: 1, limit: 20, total: 150, totalPages: 8 }
```
