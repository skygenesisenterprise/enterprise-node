import { EnterpriseApiService } from '@skygenesisenterprise/module-api';

// Exemple d'utilisation du module API
async function demonstrateApiUsage() {
  // Initialiser le service avec une clé API
  const api = new EnterpriseApiService('your-api-key-here');

  try {
    // Health check
    console.log('Checking API health...');
    const health = await api.healthCheck();
    console.log('API Status:', health.data);

    // Lister les utilisateurs
    console.log('\\nFetching users...');
    const users = await api.getUsers({ page: 1, limit: 10 });
    console.log('Users:', users.data);

    // Créer un utilisateur
    console.log('\\nCreating user...');
    const newUser = await api.createUser({
      email: 'demo@example.com',
      name: 'Demo User',
      password: 'securePassword123',
      roles: ['user'],
    });
    console.log('Created user:', newUser.data);

    // Lister les projets
    console.log('\\nFetching projects...');
    const projects = await api.getProjects({ status: 'active' });
    console.log('Projects:', projects.data);

    // Créer un projet
    console.log('\\nCreating project...');
    const newProject = await api.createProject({
      name: 'Demo Project',
      description: 'A demonstration project',
      settings: {
        theme: 'dark',
        notifications: true,
      },
    });
    console.log('Created project:', newProject.data);

    // Obtenir les logs d'audit
    console.log('\\nFetching audit logs...');
    const auditLogs = await api.getAuditLogs({
      page: 1,
      limit: 5,
      action: 'create',
    });
    console.log('Audit logs:', auditLogs.data);
  } catch (error) {
    console.error('API Error:', error);
  }
}

// Export pour utilisation dans d'autres modules
export { demonstrateApiUsage };

// Exécuter la démo si ce fichier est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateApiUsage();
}
