const DEFAULT_SERVER_URL = 'http://localhost:3000';
const NEXO_MARK_PATH = '/images/branding/nexo-mark.png';

export const getNexoMarkUrl = (serverUrl = process.env.SERVER_URL) => {
  const parsedUrl = URL.parse(serverUrl ?? '');
  const origin =
    parsedUrl?.protocol === 'https:' || parsedUrl?.protocol === 'http:'
      ? parsedUrl.origin
      : DEFAULT_SERVER_URL;

  return `${origin}${NEXO_MARK_PATH}`;
};
