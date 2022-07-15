import {SkeletonApp} from '../augments/electron';
import {handleClosing} from './on-close';

export async function addAppListeners(skeletonApp: SkeletonApp) {
    saveWindowPositionBeforeQuit(skeletonApp);
}

function saveWindowPositionBeforeQuit(skeletonApp: SkeletonApp): void {
    skeletonApp.on('before-quit', async (event) => {
        await handleClosing(skeletonApp, event);
        skeletonApp.quit();
    });
}
