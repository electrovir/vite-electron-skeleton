import {ApiRequestType} from '@packages/common/src/electron-api/api-request-type';
import {getElectronWindowInterface} from '@packages/common/src/electron-api/electron-window-interface';
import {GetPathType} from '@packages/common/src/electron-api/get-path-type';
import {ResetType} from '@packages/common/src/electron-api/reset';
import {defineFunctionalElement, html, listen} from 'element-vir';
import {css} from 'lit';

const api = getElectronWindowInterface();
console.info(api.versions);

export const ThreeJsExperimentsAppElement = defineFunctionalElement({
    tagName: 'skeleton-app',
    styles: css`
        :host {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            padding: 16px;
        }
    `,
    renderCallback: ({props, setProps}) => {
        return html`
            It worked!
            <button
                ${listen('click', async () => {
                    const configPath = await api.apiRequest({
                        type: ApiRequestType.GetPath,
                        data: GetPathType.ConfigDir,
                    });

                    if (!configPath.success) {
                        throw new Error(`Failed to get config dir.`);
                    }

                    await api.apiRequest({
                        type: ApiRequestType.ViewFilePath,
                        data: configPath.data,
                    });
                })}
            >
                Show Configs Dir
            </button>
            <button
                ${listen('click', async () => {
                    await api.apiRequest({type: ApiRequestType.ResetConfig, data: ResetType.All});
                })}
            >
                Reset All Configs
            </button>
        `;
    },
});
