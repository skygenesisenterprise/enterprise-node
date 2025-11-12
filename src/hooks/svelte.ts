import { writable, derived, get } from 'svelte/store';

interface EnterpriseState {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  enterprise: any;
}

function createEnterpriseStore() {
  const { subscribe, set, update } = writable<EnterpriseState>({
    isInitialized: false,
    isLoading: false,
    error: null,
    enterprise: null
  });

  return {
    subscribe,
    initialize: async (config?: any) => {
      update(state => ({ ...state, isLoading: true, error: null }));

      try {
        const Enterprise = (await import('../index')).Enterprise;
        const instance = new Enterprise(config);
        await instance.initialize();
        
        set({
          isInitialized: true,
          isLoading: false,
          error: null,
          enterprise: instance
        });
      } catch (err) {
        update(state => ({
          ...state,
          isLoading: false,
          error: err instanceof Error ? err : new Error('Failed to initialize Enterprise')
        }));
      }
    },
    reset: () => {
      set({
        isInitialized: false,
        isLoading: false,
        error: null,
        enterprise: null
      });
    }
  };
}

export const enterpriseStore = createEnterpriseStore();

export const isInitialized = derived(enterpriseStore, $enterprise => $enterprise.isInitialized);
export const isLoading = derived(enterpriseStore, $enterprise => $enterprise.isLoading);
export const error = derived(enterpriseStore, $enterprise => $enterprise.error);
export const enterprise = derived(enterpriseStore, $enterprise => $enterprise.enterprise);

export function useAi() {
  const isProcessing = writable(false);

  return {
    isProcessing,
    enhance: async (image: any) => {
      const $enterprise = get(enterprise);
      if (!$enterprise) {
        throw new Error('Enterprise not initialized');
      }

      isProcessing.set(true);
      try {
        return await $enterprise.ai.enhance(image);
      } finally {
        isProcessing.set(false);
      }
    },
    generate: async (prompt: string, options?: any) => {
      const $enterprise = get(enterprise);
      if (!$enterprise) {
        throw new Error('Enterprise not initialized');
      }

      isProcessing.set(true);
      try {
        return await $enterprise.ai.generate(prompt, options);
      } finally {
        isProcessing.set(false);
      }
    },
    isAvailable: derived([isInitialized, enterprise], ([$isInitialized, $enterprise]) => 
      $isInitialized && !!$enterprise?.ai
    )
  };
}

export function useStorage() {
  const isUploading = writable(false);

  return {
    isUploading,
    save: async (file: any, options?: any) => {
      const $enterprise = get(enterprise);
      if (!$enterprise) {
        throw new Error('Enterprise not initialized');
      }

      isUploading.set(true);
      try {
        return await $enterprise.storage.save(file, options);
      } finally {
        isUploading.set(false);
      }
    },
    load: async (path: string) => {
      const $enterprise = get(enterprise);
      if (!$enterprise) {
        throw new Error('Enterprise not initialized');
      }

      return await $enterprise.storage.load(path);
    },
    isAvailable: derived([isInitialized, enterprise], ([$isInitialized, $enterprise]) => 
      $isInitialized && !!$enterprise?.storage
    )
  };
}

export function useAuth() {
  const isAuthenticating = writable(false);
  const user = derived(enterprise, $enterprise => 
    $enterprise?.auth?.getCurrentUser?.() || null
  );
  const isAuthenticated = derived(enterprise, $enterprise => 
    $enterprise?.auth?.isAuthenticated?.() || false
  );

  return {
    user,
    isAuthenticated,
    isAuthenticating,
    login: async (credentials: any) => {
      const $enterprise = get(enterprise);
      if (!$enterprise) {
        throw new Error('Enterprise not initialized');
      }

      isAuthenticating.set(true);
      try {
        return await $enterprise.auth.login(credentials);
      } finally {
        isAuthenticating.set(false);
      }
    },
    logout: async () => {
      const $enterprise = get(enterprise);
      if (!$enterprise) {
        throw new Error('Enterprise not initialized');
      }

      isAuthenticating.set(true);
      try {
        return await $enterprise.auth.logout();
      } finally {
        isAuthenticating.set(false);
      }
    },
    register: async (userData: any) => {
      const $enterprise = get(enterprise);
      if (!$enterprise) {
        throw new Error('Enterprise not initialized');
      }

      isAuthenticating.set(true);
      try {
        return await $enterprise.auth.register(userData);
      } finally {
        isAuthenticating.set(false);
      }
    },
    isAvailable: derived([isInitialized, enterprise], ([$isInitialized, $enterprise]) => 
      $isInitialized && !!$enterprise?.auth
    )
  };
}

export function useProject() {
  const currentProject = writable<any>(null);

  const updateCurrentProject = () => {
    const $enterprise = get(enterprise);
    if ($enterprise?.project) {
      currentProject.set($enterprise.project.getCurrentProject());
    }
  };

  isInitialized.subscribe(updateCurrentProject);
  enterprise.subscribe(updateCurrentProject);

  return {
    currentProject,
    create: async (name: string, options?: any) => {
      const $enterprise = get(enterprise);
      if (!$enterprise) {
        throw new Error('Enterprise not initialized');
      }

      return await $enterprise.project.create(name, options);
    },
    open: async (projectIdOrName: string) => {
      const $enterprise = get(enterprise);
      if (!$enterprise) {
        throw new Error('Enterprise not initialized');
      }

      const result = await $enterprise.project.open(projectIdOrName);
      currentProject.set(result.project);
      return result;
    },
    save: async (projectId?: string) => {
      const $enterprise = get(enterprise);
      if (!$enterprise) {
        throw new Error('Enterprise not initialized');
      }

      return await $enterprise.project.save(projectId);
    },
    isAvailable: derived([isInitialized, enterprise], ([$isInitialized, $enterprise]) => 
      $isInitialized && !!$enterprise?.project
    )
  };
}

export function useUi() {
  return {
    notify: async (message: string, options?: any) => {
      const $enterprise = get(enterprise);
      if (!$enterprise) {
        console.warn('Enterprise not initialized, using fallback notification');
        console.log(message);
        return { id: 'fallback', shown: true };
      }

      return await $enterprise.ui.notify(message, options);
    },
    modal: async (options?: any) => {
      const $enterprise = get(enterprise);
      if (!$enterprise) {
        console.warn('Enterprise not initialized, using fallback modal');
        const result = window.confirm(options?.content || options?.title || 'Modal');
        return { id: 'fallback', opened: true, result };
      }

      return await $enterprise.ui.modal(options);
    },
    toast: async (message: string, type?: any) => {
      const $enterprise = get(enterprise);
      if (!$enterprise) {
        console.log(`${type?.toUpperCase()}: ${message}`);
        return { id: 'fallback', shown: true };
      }

      return await $enterprise.ui.toast(message, type);
    },
    isAvailable: derived([isInitialized, enterprise], ([$isInitialized, $enterprise]) => 
      $isInitialized && !!$enterprise?.ui
    )
  };
}