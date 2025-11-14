export interface UIComponent {
    id: string;
    type: string;
    props: Record<string, any>;
    children?: UIComponent[];
}
export interface Theme {
    colors: Record<string, string>;
    typography: Record<string, any>;
    spacing: Record<string, string>;
}
export declare class UIManager {
    constructor(_theme: Theme);
    createComponent(config: Omit<UIComponent, 'id'>): UIComponent;
    render(component: UIComponent): string;
    private generateId;
}
export * from './types';
export * from './logo';
//# sourceMappingURL=index.d.ts.map