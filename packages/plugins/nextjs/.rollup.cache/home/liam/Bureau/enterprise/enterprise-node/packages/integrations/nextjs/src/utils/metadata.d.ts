import { Metadata } from 'next';
/**
 * Configuration des métadonnées pour les pages Enterprise
 */
export declare function createEnterpriseMetadata(options: {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    type?: 'website' | 'article';
}): Metadata;
/**
 * Configuration pour le layout principal
 */
export declare const enterpriseLayoutConfig: {
    branding: {
        name: string;
        logo: string;
        favicon: string;
    };
    theme: {
        primaryColor: string;
        secondaryColor: string;
    };
    navigation: {
        header: boolean;
        sidebar: boolean;
        footer: boolean;
    };
};
//# sourceMappingURL=metadata.d.ts.map