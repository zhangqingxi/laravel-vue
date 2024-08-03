import { getAppEnvConfig } from '@/utils/env';

const { VITE_GLOB_API_URL } = getAppEnvConfig();

export interface initConfigModel {
  encryptionEnabled: boolean;
  publicKey: string;
  apiBaseURL: string;
  wsUrl: string;
}
const initConfig: initConfigModel = {
  apiBaseURL: VITE_GLOB_API_URL,
  publicKey: '',
  encryptionEnabled: true,
  wsUrl: '',
};

export function setInitConfig(
  isEncrypted: boolean,
  publicKey: string,
  apiUrl: string,
  wsUrl: string,
) {
  initConfig.encryptionEnabled = isEncrypted;
  initConfig.publicKey = publicKey;
  initConfig.apiBaseURL = apiUrl;
  initConfig.wsUrl = wsUrl;
}

export function getInitConfig() {
  return initConfig;
}
