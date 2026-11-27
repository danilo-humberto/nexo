import {
  CLIENT_CONFIG_BOOTSTRAP_ELEMENT_ID,
  IFRAME_MEDIA_PERMISSIONS_BOOTSTRAP_ELEMENT_ID,
} from 'twenty-shared/constants';
import { type IframeMediaPermission } from 'twenty-shared/types';

import { serializeJsonForHtmlScript } from 'src/engine/core-modules/frontend/utils/serialize-json-for-html-script.util';

export const renderFrontendHtml = ({
  template,
  clientConfig,
  iframeMediaPermissions,
}: {
  template: string;
  clientConfig: object & { serverUrl?: string };
  iframeMediaPermissions: IframeMediaPermission[];
}): string => {
  const serverUrl = URL.parse(clientConfig.serverUrl ?? '');
  const socialImagePath = '/images/branding/nexo-social.png';
  const socialImageUrl =
    serverUrl?.protocol === 'https:' || serverUrl?.protocol === 'http:'
      ? `${serverUrl.origin}${socialImagePath}`
      : socialImagePath;

  return template
    .replaceAll(
      `content="${socialImagePath}"`,
      () => `content="${socialImageUrl}"`,
    )
    .replace(
      /<!-- BEGIN: Twenty Config -->[\s\S]*?<!-- END: Twenty Config -->/,
      '<script id="twenty-env-config">window._env_ = {};</script>',
    )
    .replace(
      '</head>',
      () =>
        `<script id="${CLIENT_CONFIG_BOOTSTRAP_ELEMENT_ID}" type="application/json">${serializeJsonForHtmlScript(clientConfig)}</script>` +
        `<script id="${IFRAME_MEDIA_PERMISSIONS_BOOTSTRAP_ELEMENT_ID}" type="application/json">${serializeJsonForHtmlScript(iframeMediaPermissions)}</script></head>`,
    );
};
