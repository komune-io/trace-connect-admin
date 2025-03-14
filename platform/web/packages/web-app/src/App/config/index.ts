
export interface Config {
    theme?: ThemeConfig,
    applications?: ApplicationConfig[]
}

export interface ApplicationConfig {
    id: string,
    name: string,
    url: string,
    icon: string,
}


export interface ThemeConfig {
    colors?: ThemeColorsConfig,
}

export interface ThemeColorsConfig {
    primary?: string,
    secondary?: string,
    background?: string
}


// @ts-ignore
export const config: () => Config = () => window._env_.config
