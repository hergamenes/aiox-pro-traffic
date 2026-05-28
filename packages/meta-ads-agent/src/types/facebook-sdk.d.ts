// O pacote `facebook-nodejs-business-sdk` não publica tipos próprios e não há
// `@types/facebook-nodejs-business-sdk` disponível. Declaramos o módulo para
// que o `tsc --noEmit` não falhe; o uso real (FacebookAdsApi.init) é restrito
// ao adapter e validado em runtime/testes.
declare module 'facebook-nodejs-business-sdk';
