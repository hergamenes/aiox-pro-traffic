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

export const campaignApiErrorHandler = (endpoint: string, code: number, message: string) =>
  http.post(`${BASE_URL}/act_:adAccountId/${endpoint}`, () => {
    return HttpResponse.json({
      error: { code, message, type: 'OAuthException' },
    });
  });

export const defaultHandlers = [
  imageUploadSuccessHandler,
  videoUploadSuccessHandler,
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
