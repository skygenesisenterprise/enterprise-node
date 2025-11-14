export function createLogoComponent(brandingManager) {
    return function Logo(props) {
        const { className, style, width, height, alt, fallback } = props;
        return {
            render: async () => {
                const logoUrl = await brandingManager.getLogoUrl();
                const config = brandingManager.getConfig();
                if (!logoUrl) {
                    return fallback || '<div>Logo</div>';
                }
                const logoConfig = config?.logo;
                const finalWidth = width || logoConfig?.width || 200;
                const finalHeight = height || logoConfig?.height || 60;
                const finalAlt = alt || logoConfig?.alt || 'Company Logo';
                return `<img 
          src="${logoUrl}" 
          alt="${finalAlt}" 
          width="${finalWidth}" 
          height="${finalHeight}" 
          class="${className || ''}" 
          style="object-fit: contain; ${style || ''}" 
        />`;
            },
        };
    };
}
export { createLogoComponent as Logo };
//# sourceMappingURL=logo.js.map