const flexIntegrationSdk = require('sharetribe-flex-integration-sdk');

const { BigDecimal, LatLng, UUID } = flexIntegrationSdk.types;

const integrationSdk = flexIntegrationSdk.createInstance({
  clientId: process.env.EXTERNAL_SHARETRIBE_APP_CLIENT_ID,
  clientSecret: process.env.EXTERNAL_SHARETRIBE_APP_CLIENT_SECRET,
  typeHandlers: [
    {
      sdkType: UUID,
      canHandle: v => v.isMyOwnUuidType,
      writer: v => new UUID(v.myOwnUuidValue),
      reader: v => ({ myOwnUuidValue: v.uuid, isMyOwnUuidType: true }),
    },
  ],
});

module.exports = integrationSdk;
