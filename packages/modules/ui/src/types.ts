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

export interface ComponentLibrary {
  name: string;
  version: string;
  components: Record<string, UIComponent>;
}