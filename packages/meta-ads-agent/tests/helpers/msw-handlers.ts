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

export const defaultHandlers = [
  imageUploadSuccessHandler,
  videoUploadSuccessHandler,
];
