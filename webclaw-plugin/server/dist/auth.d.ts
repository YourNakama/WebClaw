import type { DeviceCodeResponse, OAuthTokenResponse } from "./types.js";
export declare const GITHUB_CLIENT_ID = "Ov23ctlK0eSRxyelzeNs";
export declare function requestDeviceCode(): Promise<DeviceCodeResponse>;
export declare function pollForAccessToken(deviceCode: string, interval: number, expiresIn: number, signal?: AbortSignal): Promise<OAuthTokenResponse>;
export declare function openBrowser(url: string): void;
