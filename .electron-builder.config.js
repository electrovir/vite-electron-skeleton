function calculateViteVersion() {
    const now = new Date();
    return `${now.getUTCFullYear() - 2000}.${now.getUTCMonth() + 1}.${now.getUTCDate()}-${
        now.getUTCHours() * 60 + now.getUTCMinutes()
    }`;
}

const viteVersion = process.env['VITE_APP_VERSION'] || calculateViteVersion();

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
    directories: {
        output: 'dist',
        buildResources: 'build-resources',
    },
    files: ['packages/**/dist/**'],
    extraMetadata: {
        version: viteVersion,
    },
};

// this needs to use an archaic export format for electron-builder
module.exports = config;
