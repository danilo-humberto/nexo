import { renderFrontendHtml } from 'src/engine/core-modules/frontend/utils/render-frontend-html.util';

const TEMPLATE =
  '<html><head><!-- BEGIN: Twenty Config --><script>window._env_ = { stale: true };</script><!-- END: Twenty Config --></head><body></body></html>';

const getBootstrapContent = ({
  html,
  elementId,
}: {
  html: string;
  elementId: string;
}) =>
  html.match(
    new RegExp(
      `<script id="${elementId}" type="application/json">(.*?)</script>`,
    ),
  )?.[1];

describe('renderFrontendHtml', () => {
  it('uses the configured server origin for social preview images', () => {
    const html = renderFrontendHtml({
      template:
        '<head><meta property="og:image" content="/images/branding/nexo-social.png"><meta name="twitter:image" content="/images/branding/nexo-social.png"></head>',
      clientConfig: { serverUrl: 'https://nexo.example.com:8443/api' },
      iframeMediaPermissions: [],
    });

    expect(
      html.match(
        /content="https:\/\/nexo\.example\.com:8443\/images\/branding\/nexo-social\.png"/g,
      ),
    ).toHaveLength(2);
  });

  it('embeds the iframe media permissions used for the document policy', () => {
    const html = renderFrontendHtml({
      template: TEMPLATE,
      clientConfig: {},
      iframeMediaPermissions: [
        {
          origin: 'https://phone.example.com',
          microphone: true,
          camera: false,
        },
      ],
    });

    expect(
      JSON.parse(
        getBootstrapContent({
          html,
          elementId: 'twenty-iframe-media-permissions',
        }) ?? '',
      ),
    ).toEqual([
      { origin: 'https://phone.example.com', microphone: true, camera: false },
    ]);
    expect(html).toContain(
      '<script id="twenty-env-config">window._env_ = {};</script>',
    );
  });

  it('escapes markup characters in embedded values', () => {
    const html = renderFrontendHtml({
      template: TEMPLATE,
      clientConfig: {},
      iframeMediaPermissions: [
        {
          origin: '</script><script>alert(1)</script>',
          microphone: true,
          camera: true,
        },
      ],
    });

    expect(html).not.toContain('<script>alert(1)</script>');
    expect(
      getBootstrapContent({
        html,
        elementId: 'twenty-iframe-media-permissions',
      }),
    ).toContain('\\u003c/script\\u003e');
  });
});
