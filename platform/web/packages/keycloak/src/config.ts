export interface PlatformConfig {
    url: string
}

export interface Config {
    platform: PlatformConfig
    theme?: ThemeConfig
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
