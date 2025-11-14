/**
 * Configuration des métadonnées pour les pages Enterprise
 */
export function createEnterpriseMetadata(options) {
    const { title = 'Enterprise Application', description = 'Application Enterprise powered by Sky Genesis', keywords = ['enterprise', 'skygenesis', 'application'], image = '/images/og-image.jpg', type = 'website', } = options;
    return {
        title,
        description,
        keywords: keywords.join(', '),
        openGraph: {
            title,
            description,
            type,
            images: [image],
            siteName: 'Enterprise Application',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}
/**
 * Configuration pour le layout principal
 */
export const enterpriseLayoutConfig = {
    branding: {
        name: 'Enterprise',
        logo: '/images/logo.svg',
        favicon: '/favicon.ico',
    },
    theme: {
        primaryColor: '#0066cc',
        secondaryColor: '#004499',
    },
    navigation: {
        header: true,
        sidebar: true,
        footer: true,
    },
};
//# sourceMappingURL=metadata.js.map