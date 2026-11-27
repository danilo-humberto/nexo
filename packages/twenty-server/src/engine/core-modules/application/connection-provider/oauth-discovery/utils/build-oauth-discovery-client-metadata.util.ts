import { type OAuthClientMetadata } from '@modelcontextprotocol/client';

import { buildAppOAuthCallbackUrl } from 'src/engine/core-modules/application/connection-provider/utils/build-callback-url.util';
import { TWENTY_CURRENT_VERSION } from 'src/engine/core-modules/upgrade/constants/twenty-current-version.constant';

const TWENTY_WEBSITE_URL = 'https://twenty.com';
const NEXO_MARK_PATH = '/images/branding/nexo-mark.png';

export const buildOAuthDiscoveryClientMetadata = ({
  serverUrl,
  frontendUrl,
}: {
  serverUrl: string;
  frontendUrl: string;
}): OAuthClientMetadata => ({
  client_name: 'Twenty',
  client_uri: TWENTY_WEBSITE_URL,
  logo_uri: new URL(NEXO_MARK_PATH, frontendUrl).toString(),
  software_id: 'twenty',
  software_version: TWENTY_CURRENT_VERSION,
  redirect_uris: [buildAppOAuthCallbackUrl(serverUrl)],
  grant_types: ['authorization_code', 'refresh_token'],
  response_types: ['code'],
  token_endpoint_auth_method: 'none',
});
