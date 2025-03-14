
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
    logo?: ThemeLogoConfig
}

export interface ThemeColorsConfig {
    primary?: string,
    secondary?: string,
    background?: string
}

export interface ThemeLogoConfig {
    url?: string,
}

// @ts-ignore
export const config: () => Config = () => window._env_.config
