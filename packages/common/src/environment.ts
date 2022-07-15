export enum BuildMode {
    Prod = 'production',
    Dev = 'development',
}

function determineBuildMode(): BuildMode {
    const envMode = process.env['MODE'];
    if (envMode === BuildMode.Prod) {
        return envMode;
    } else {
        return BuildMode.Dev;
    }
}

function getBuildMode(): BuildMode {
    const mode = determineBuildMode();
    process.env['MODE'] = mode;
    return mode;
}

export const buildMode = getBuildMode();
export const isDevMode = buildMode === BuildMode.Dev;

export const viteDevServerEnvKey = 'VITE_DEV_SERVER_URL';
export const devServerUrl = process.env[viteDevServerEnvKey]?.replace(/\/$/, '');

export enum Package {
    Common = 'common',
    Jest = 'jest',
    Main = 'main',
    Preload = 'preload',
    Renderer = 'renderer',
    Scripts = 'scripts',
}

export const appName = 'electron-skeleton' as const;
export const displayAppName = appName[0]?.toUpperCase() + appName.slice(1);
