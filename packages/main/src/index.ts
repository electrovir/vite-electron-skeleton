import {isDevMode} from '@packages/common/src/environment';
import {app} from 'electron';
import {SkeletonApp} from './augments/electron';
import {initConfig} from './config/config-init';
import {addAppListeners} from './setup/add-app-listeners';
import {checkForUpdates} from './setup/auto-updates';
import {setupLogging} from './setup/logging';
import {setSecurityRestrictions} from './setup/security-restrictions';
import {setupApiHandlers} from './setup/setup-api-handlers';
import {startupWindow} from './setup/setup-main-window';

async function setupApp(devMode: boolean) {
    const skeletonApp: SkeletonApp = app;

    setupLogging(skeletonApp);

    /** Disable Hardware Acceleration for power savings */
    skeletonApp.disableHardwareAcceleration();

    await initConfig(skeletonApp);
    await addAppListeners(skeletonApp);

    setupApiHandlers(devMode, skeletonApp);
    setSecurityRestrictions(skeletonApp, devMode);

    await startupWindow(skeletonApp, devMode);
    await checkForUpdates(devMode);
}

setupApp(isDevMode).catch((error) => {
    console.error(`Failed to startup app`);
    console.error(error);
    process.exit(1);
});
