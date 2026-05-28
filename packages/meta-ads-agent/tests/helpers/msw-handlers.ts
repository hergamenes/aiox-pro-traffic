import { http, HttpResponse } from 'msw';

const BASE_URL = 'https://graph.facebook.com/v21.0';

export const imageUploadSuccessHandler = http.post(
  `${BASE_URL}/act_:adAccountId/adimages`,
  async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('filename') as File | null;
    const fileName = file?.name ?? 'unknown.jpg';

    return HttpResponse.json({
      images: {
        [fileName]: { hash: `hash_${Date.now()}` },
      },
    });
  },
);

export const videoUploadSuccessHandler = http.post(
  `${BASE_URL}/act_:adAccountId/advideos`,
  () => {
    return HttpResponse.json({
      id: `video_${Date.now()}`,
    });
  },
);

// Polling de processamento de vídeo: GET /{video_id}?fields=status
export const videoStatusReadyHandler = http.get(
  `${BASE_URL}/:videoId`,
  () => {
    return HttpResponse.json({ status: { video_status: 'ready' } });
  },
);

export const metaApiErrorHandler = (code: number, message: string) =>
  http.post(`${BASE_URL}/act_:adAccountId/adimages`, () => {
    return HttpResponse.json({
      error: { code, message, type: 'OAuthException' },
    });
  });

export const networkErrorHandler = http.post(
  `${BASE_URL}/act_:adAccountId/adimages`,
  () => {
    return HttpResponse.error();
  },
);

// Campaign creation handlers (Story 2.3)

export const campaignCreateSuccessHandler = http.post(
  `${BASE_URL}/act_:adAccountId/campaigns`,
  () => {
    return HttpResponse.json({ id: `camp_${Date.now()}` });
  },
);

export const adSetCreateSuccessHandler = http.post(
  `${BASE_URL}/act_:adAccountId/adsets`,
  () => {
    return HttpResponse.json({ id: `adset_${Date.now()}` });
  },
);

export const adCreateSuccessHandler = http.post(
  `${BASE_URL}/act_:adAccountId/ads`,
  () => {
    return HttpResponse.json({ id: `ad_${Date.now()}` });
  },
);

export const campaignStatusUpdateHandler = http.post(
  `${BASE_URL}/:campaignId`,
  () => {
    return HttpResponse.json({ success: true });
  },
);

export const deleteResourceHandler = http.delete(
  `${BASE_URL}/:resourceId`,
  () => {
    return HttpResponse.json({ success: true });
  },
);

// Lead Ads handlers (formulário nativo)

export const pageAccessTokenHandler = http.get(
  `${BASE_URL}/:pageId`,
  ({ params }) => {
    return HttpResponse.json({ id: params.pageId, access_token: 'mock-page-token' });
  },
);

export const leadFormCreateSuccessHandler = http.post(
  `${BASE_URL}/:pageId/leadgen_forms`,
  () => {
    return HttpResponse.json({ id: `form_${Date.now()}` });
  },
);

export const campaignApiErrorHandler = (endpoint: string, code: number, message: string) =>
  http.post(`${BASE_URL}/act_:adAccountId/${endpoint}`, () => {
    return HttpResponse.json({
      error: { code, message, type: 'OAuthException' },
    });
  });

export const defaultHandlers = [
  imageUploadSuccessHandler,
  videoUploadSuccessHandler,
  videoStatusReadyHandler,
];

export const campaignHandlers = [
  imageUploadSuccessHandler,
  videoUploadSuccessHandler,
  campaignCreateSuccessHandler,
  adSetCreateSuccessHandler,
  adCreateSuccessHandler,
  campaignStatusUpdateHandler,
  deleteResourceHandler,
];

// Handlers para fluxos que envolvem formulário de Lead Ads (inclui troca de
// token de página e criação do formulário).
export const leadFormHandlers = [
  ...campaignHandlers,
  leadFormCreateSuccessHandler,
  pageAccessTokenHandler,
];
