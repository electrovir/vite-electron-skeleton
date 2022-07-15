import {OpenDialogProperty} from '@packages/common/src/electron-api/electron-types';
import {isValidUserPreferences, UserPreferences} from '../data/user-preferences';
import {
    createAllowUndefinedValidator,
    createArrayValidator,
    createEnumValidator,
    typeofValidators,
} from './api-validation';
import {GetPathType} from './get-path-type';
import {ResetType} from './reset';

export const apiRequestKey = 'api-request-key' as const;

export enum ApiRequestType {
    /** Get the current user preferences saved on disk. */
    GetPreferences = 'get-preferences',
    /** Overwrite user preferences */
    SavePreferences = 'save-preferences',
    /** Trigger a native file selection popup. */
    SelectFiles = 'select-files',
    /** Get the path to the config directory. */
    GetPath = 'get-path',
    /** Open a given file path in the system's default file browser. */
    ViewFilePath = 'view-file-path',
    ResetConfig = 'reset-config',
}

export type ApiRequestData = {
    [ApiRequestType.GetPreferences]: undefined;
    [ApiRequestType.SavePreferences]: UserPreferences;
    [ApiRequestType.SelectFiles]: OpenDialogProperty[] | undefined;
    [ApiRequestType.GetPath]: GetPathType;
    [ApiRequestType.ViewFilePath]: string;
    [ApiRequestType.ResetConfig]: ResetType;
};

export type ApiResponseData = {
    [ApiRequestType.GetPreferences]: UserPreferences | undefined;
    [ApiRequestType.SavePreferences]: boolean;
    [ApiRequestType.SelectFiles]: string[] | undefined;
    [ApiRequestType.GetPath]: string;
    [ApiRequestType.ViewFilePath]: void;
    [ApiRequestType.ResetConfig]: boolean;
};

export const apiValidators: {
    [RequestTypeGeneric in ApiRequestType]: ApiValidation<RequestTypeGeneric>;
} = {
    [ApiRequestType.GetPreferences]: {
        request: undefined,
        response: (data): data is UserPreferences | undefined => {
            return data === undefined || isValidUserPreferences(data);
        },
    },
    [ApiRequestType.SavePreferences]: {
        request: isValidUserPreferences,
        response: typeofValidators.boolean,
    },
    [ApiRequestType.SelectFiles]: {
        request: createAllowUndefinedValidator(
            createArrayValidator(createEnumValidator(OpenDialogProperty)),
        ),
        response: createAllowUndefinedValidator(createArrayValidator(typeofValidators.string)),
    },
    [ApiRequestType.GetPath]: {
        request: createEnumValidator(GetPathType),
        response: typeofValidators.string,
    },
    [ApiRequestType.ViewFilePath]: {
        request: typeofValidators.string,
        response: undefined,
    },
    [ApiRequestType.ResetConfig]: {
        request: createEnumValidator(ResetType),
        response: typeofValidators.boolean,
    },
};

export type ApiValidator<
    RequestTypeGeneric extends ApiRequestType,
    ResponseOrRequestData extends ApiRequestData | ApiResponseData,
> = (input: any) => input is ResponseOrRequestData[RequestTypeGeneric];

export type ApiValidation<RequestTypeGeneric extends ApiRequestType> = {
    request: ApiRequestData[RequestTypeGeneric] extends undefined | void
        ? undefined
        : ApiValidator<RequestTypeGeneric, ApiRequestData>;
    response: ApiResponseData[RequestTypeGeneric] extends undefined | void
        ? undefined
        : ApiValidator<RequestTypeGeneric, ApiResponseData>;
};

export function getGenericApiValidator(requestType: ApiRequestType): ApiValidation<ApiRequestType> {
    const validator = apiValidators[requestType];
    if (!validator) {
        throw new Error(`No validators defined for request type "${requestType}".`);
    }
    return validator;
}
