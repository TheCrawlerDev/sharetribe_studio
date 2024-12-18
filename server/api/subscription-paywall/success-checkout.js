const http = require('http');
const https = require('https');
const sharetribeSdk = require('sharetribe-flex-sdk');
const sdkUtils = require('../../api-util/sdk');
const { checkoutCustomer, sessionCustomer, cancelSubscription, getSession } = require('./plans');
const userUpdate = require('../../external-app/userUpdate');

const CLIENT_ID = process.env.REACT_APP_SHARETRIBE_SDK_CLIENT_ID;
const BASE_URL = process.env.REACT_APP_SHARETRIBE_SDK_BASE_URL;
const TRANSIT_VERBOSE = process.env.REACT_APP_SHARETRIBE_SDK_TRANSIT_VERBOSE === 'true';
const USING_SSL = process.env.REACT_APP_SHARETRIBE_USING_SSL === 'true';

// Instantiate HTTP(S) Agents with keepAlive set to true.
// This will reduce the request time for consecutive requests by
// reusing the existing TCP connection, thus eliminating the time used
// for setting up new TCP connections.
const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

// Works as the redirect_uri passed in an authorization code request. Receives
// an authorization code and uses that to log in and redirect to the landing
// page.
exports.successCheckout = async (req, res) => {

    const baseUrl = BASE_URL ? { baseUrl: BASE_URL } : {};
    const tokenStore = sharetribeSdk.tokenStore.expressCookieStore({
        clientId: CLIENT_ID,
        req,
        res,
        secure: USING_SSL,
    });

    const sdk = sharetribeSdk.createInstance({
        transitVerbose: TRANSIT_VERBOSE,
        clientId: CLIENT_ID,
        httpAgent: httpAgent,
        httpsAgent: httpsAgent,
        tokenStore,
        typeHandlers: sdkUtils.typeHandlers,
        ...baseUrl,
    });

    sdk.currentUser
        .show({})
        .then(async response => {
            if (response.status == 200) {
                let customerSaved = response.data.data;
                let oldSession = !!customerSaved.attributes.profile.protectedData?.subscription_paywall ?
                    customerSaved.attributes.profile.protectedData?.subscription_paywall?.session : null;
                let newSession = await getSession(req.query.session);
                let oldSubscriptionRemoved = {};
                if (!!newSession.id) {
                    if (!!oldSession && !!oldSession.subscription && oldSession.subscription != newSession.subscription) {
                        console.log({ a: 'Old signature will be cancelled', oldSession, newSession });
                        oldSubscriptionRemoved = await cancelSubscription(oldSession);
                    }
                    userUpdate({
                        id: customerSaved.id.uuid,
                        protectedData: {
                            subscription_paywall: {
                                plan: req.query.plan,
                                session: req.query.session,
                                customer: newSession.customer
                            }
                        },
                    }, {
                        expand: true,
                    }).then(responseUpdate => {
                        return res
                            .status(200)
                            .set('Content-Type', 'application/json')
                            .send({
                                ok: true,
                                newSession,
                                oldSubscriptionRemoved,
                            })
                            .end();
                    }).catch((err) => {
                        console.log(err);
                        return res
                            .status(404)
                            .set('Content-Type', 'application/json')
                            .send({
                                ok: false,
                                message: "Can't update your user.",
                            })
                            .end();
                    });
                } else {
                    return res
                        .status(404)
                        .set('Content-Type', 'application/json')
                        .send({
                            ok: false,
                            message: "Session not exists.",
                        })
                        .end();
                }


            } else {
                return res
                    .status(404)
                    .set('Content-Type', 'application/json')
                    .send({
                        ok: false,
                        message: "Can't found your user.",
                    })
                    .end();
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(401).send('Unable to authenticate as a user');
        }
        );
};
