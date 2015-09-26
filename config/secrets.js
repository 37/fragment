/**
 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 *
 * This should be changed before going to production, as when using a public repository
 * this secrets.js file is searchable and viewable publicly. Be sure to edit before publish.
 *
 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 */

module.exports = {

  db: process.env.MONGODB || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/test',

  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',

  mailgun: {
    user: process.env.MAILGUN_USER || 'postmaster@sandbox697fcddc09814c6b83718b9fd5d4e5dc.mailgun.org',
    password: process.env.MAILGUN_PASSWORD || '29eldds1uri6'
  },

  mandrill: {
    user: process.env.MANDRILL_USER || 'hackathonstarterdemo',
    password: process.env.MANDRILL_PASSWORD || 'E1K950_ydLR4mHw12a0ldA'
  },

  sendgrid: {
    user: process.env.SENDGRID_USER || 'hslogin',
    password: process.env.SENDGRID_PASSWORD || 'hspassword00'
  },

  nyt: {
    key: process.env.NYT_KEY || '9548be6f3a64163d23e1539f067fcabd:5:68537648'
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || '478232152301788',
    clientSecret: process.env.FACEBOOK_SECRET || '881d1042ec7ef1f359e19ea031e6f400',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true
  },

  steam: {
    apiKey: process.env.STEAM_KEY || 'D1240DEF4D41D416FD291D0075B6ED3F'
  },

  twilio: {
    sid: process.env.TWILIO_SID || 'AC6f0edc4c47becc6d0a952536fc9a6025',
    token: process.env.TWILIO_TOKEN || 'a67170ff7afa2df3f4c7d97cd240d0f3'
  },

  clockwork: {
    apiKey: process.env.CLOCKWORK_KEY || '9ffb267f88df55762f74ba2f517a66dc8bedac5a'
  },

  stripe: {
    secretKey: process.env.STRIPE_SKEY || 'sk_test_BQokikJOvBiI2HlWgH4olfQ2',
    publishableKey: process.env.STRIPE_PKEY || 'pk_test_6pRNASCoBOKtIshFeQd4XMUh'
  },

  venmo: {
    clientId: process.env.VENMO_ID || '1688',
    clientSecret: process.env.VENMO_SECRET || 'uQXtNBa6KVphDLAEx8suEush3scX8grs',
    redirectUrl: process.env.VENMO_REDIRECT_URL || 'http://localhost:3000/auth/venmo/callback'
  },

  paypal: {
    host: 'api.sandbox.paypal.com',
    client_id: process.env.PAYPAL_ID || 'AdGE8hDyixVoHmbhASqAThfbBcrbcgiJPBwlAM7u7Kfq3YU-iPGc6BXaTppt',
    client_secret: process.env.PAYPAL_SECRET || 'EPN0WxB5PaRaumTB1ZpCuuTqLqIlF6_EWUcAbZV99Eu86YeNBVm9KVsw_Ez5',
    returnUrl: process.env.PAYPAL_RETURN_URL || 'http://localhost:3000/api/paypal/success',
    cancelUrl: process.env.PAYPAL_CANCEL_URL || 'http://localhost:3000/api/paypal/cancel'
  },

  lob: {
    apiKey: process.env.LOB_KEY || 'test_814e892b199d65ef6dbb3e4ad24689559ca'
  },

  bitgo: {
    accessToken: process.env.BITGO_ACCESS_TOKEN || '4fca3ed3c2839be45b03bbd330e5ab1f9b3989ddd949bf6b8765518bc6a0e709'
  },

  bitcore: {
    bitcoinNetwork: process.env.BITCORE_BITCOIN_NETWORK || 'testnet'
  }

};
