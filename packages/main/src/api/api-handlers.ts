import {
    ApiRequestData,
    ApiRequestType,
    ApiResponseData,
} from '@packages/common/src/electron-api/api-request-type';
import {SkeletonApp} from '../augments/electron';
import {getPath} from '../config/config-path';
import {resetConfig} from '../config/config-reset';
import {readUserPreferences, saveUserPreferences} from '../config/user-preferences';
import {selectFiles} from './dialogs';
import {viewPath} from './view-file';

export type ApiHandlerFunction<RequestTypeGeneric extends ApiRequestType> = (
    requestInput: ApiRequestData[RequestTypeGeneric],
    skeletonApp: SkeletonApp,
) => Promise<ApiResponseData[RequestTypeGeneric]> | ApiResponseData[RequestTypeGeneric];

const apiHandlers: {
    [RequestTypeGeneric in ApiRequestType]: ApiHandlerFunction<RequestTypeGeneric>;
} = {
    [ApiRequestType.SavePreferences]: saveUserPreferences,
    [ApiRequestType.GetPreferences]: (input, app) => readUserPreferences(app),
    [ApiRequestType.SelectFiles]: selectFiles,
    [ApiRequestType.GetPath]: (input, app) => getPath(input, app),
    [ApiRequestType.ViewFilePath]: (input) => viewPath(input),
    [ApiRequestType.ResetConfig]: resetConfig,
};

export function getGenericApiHandler(
    requestType: ApiRequestType,
): ApiHandlerFunction<ApiRequestType> {
    const handler = apiHandlers[requestType];
    if (!handler) {
        throw new Error(`No handler defined for request type "${requestType}"`);
    }
    return handler as ApiHandlerFunction<ApiRequestType>;
}
