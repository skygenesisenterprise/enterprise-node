export interface LogoProps {
    className?: string;
    style?: any;
    width?: number;
    height?: number;
    alt?: string;
    fallback?: any;
}
export declare function createLogoComponent(brandingManager: any): (props: LogoProps) => {
    render: () => Promise<any>;
};
export { createLogoComponent as Logo };
