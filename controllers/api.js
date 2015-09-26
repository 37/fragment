var secrets = require('../config/secrets');
var querystring = require('querystring');
var validator = require('validator');
var async = require('async');
var cheerio = require('cheerio');
var request = require('request');
var graph = require('fbgraph');
var stripe = require('stripe')(secrets.stripe.secretKey);
var twilio = require('twilio')(secrets.twilio.sid, secrets.twilio.token);
var clockwork = require('clockwork')({ key: secrets.clockwork.apiKey });
var paypal = require('paypal-rest-sdk');
var lob = require('lob')(secrets.lob.apiKey);
var ig = require('instagram-node').instagram();
var Y = require('yui/yql');
var _ = require('lodash');
var Bitcore = require('bitcore');
var BitcoreInsight = require('bitcore-explorers').Insight;
Bitcore.Networks.defaultNetwork = secrets.bitcore.bitcoinNetwork == 'testnet' ? Bitcore.Networks.testnet : Bitcore.Networks.mainnet;

/**
 * GET /api
 * List of API examples.
 */
exports.getApi = function(req, res) {
  res.render('api/index', {
    title: 'Scan API',
    user: req.user
  });
};

/**
 * GET /api/facebook
 * Facebook API example.
 */
 
exports.getFacebook = function(req, res, next) {
  var token = _.find(req.user.tokens, { kind: 'facebook' });
  graph.setAccessToken(token.accessToken);
  async.parallel({
    getMe: function(done) {
      graph.get(req.user.facebook, function(err, me) {
        done(err, me);
      });
    },
    getMyFriends: function(done) {
      graph.get(req.user.facebook + '/friends', function(err, friends) {
        done(err, friends.data);
      });
    }
  },
  function(err, results) {
    if (err) return next(err);
    res.render('api/facebook', {
      title: 'Facebook API',
      me: results.getMe,
      friends: results.getMyFriends
    });
  });
};

/**
 * GET /api/scraping
 * Web scraping example using Cheerio library.
 */
exports.getScraping = function(req, res, next) {
  request.get('https://news.ycombinator.com/', function(err, request, body) {
    if (err) return next(err);
    var $ = cheerio.load(body);
    var links = [];
    $('.title a[href^="http"], a[href^="https"]').each(function() {
      links.push($(this));
    });
    res.render('api/scraping', {
      title: 'Web Scraping',
      links: links
    });
  });
};

/**
 * GET /api/stripe
 * Stripe API example.
 */
exports.getStripe = function(req, res) {
  res.render('api/stripe', {
    title: 'Stripe API',
    publishableKey: secrets.stripe.publishableKey
  });
};

/**
 * POST /api/stripe
 * Make a payment.
 */
exports.postStripe = function(req, res, next) {
  var stripeToken = req.body.stripeToken;
  var stripeEmail = req.body.stripeEmail;
  stripe.charges.create({
    amount: 395,
    currency: 'usd',
    source: stripeToken,
    description: stripeEmail
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      req.flash('errors', { msg: 'Your card has been declined.' });
      res.redirect('/api/stripe');
    }
    req.flash('success', { msg: 'Your card has been charged successfully.' });
    res.redirect('/api/stripe');
  });
};

/**
 * GET /api/twilio
 * Twilio API example.
 */
exports.getTwilio = function(req, res) {
  res.render('api/twilio', {
    title: 'Twilio API'
  });
};

/**
 * POST /api/twilio
 * Send a text message using Twilio.
 */
exports.postTwilio = function(req, res, next) {
  req.assert('number', 'Phone number is required.').notEmpty();
  req.assert('message', 'Message cannot be blank.').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/api/twilio');
  }
  var message = {
    to: req.body.number,
    from: '+13472235148',
    body: req.body.message
  };
  twilio.sendMessage(message, function(err, responseData) {
    if (err) return next(err.message);
    req.flash('success', { msg: 'Text sent to ' + responseData.to + '.'});
    res.redirect('/api/twilio');
  });
};

/**
 * GET /api/clockwork
 * Clockwork SMS API example.
 */
exports.getClockwork = function(req, res) {
  res.render('api/clockwork', {
    title: 'Clockwork SMS API'
  });
};

/**
 * POST /api/clockwork
 * Send a text message using Clockwork SMS
 */
exports.postClockwork = function(req, res, next) {
  var message = {
    To: req.body.telephone,
    From: 'Hackathon',
    Content: 'Hello from the Hackathon Starter'
  };
  clockwork.sendSms(message, function(err, responseData) {
    if (err) return next(err.errDesc);
    req.flash('success', { msg: 'Text sent to ' + responseData.responses[0].to });
    res.redirect('/api/clockwork');
  });
};

/**
 * GET /api/linkedin
 * LinkedIn API example.
 */
exports.getLinkedin = function(req, res, next) {
  var token = _.find(req.user.tokens, { kind: 'linkedin' });
  var linkedin = Linkedin.init(token.accessToken);
  linkedin.people.me(function(err, $in) {
    if (err) return next(err);
    res.render('api/linkedin', {
      title: 'LinkedIn API',
      profile: $in
    });
  });
};


/**
 * GET /api/paypal
 * PayPal SDK example.
 */
exports.getPayPal = function(req, res, next) {
  paypal.configure({
    mode: 'sandbox',
    client_id: secrets.paypal.client_id,
    client_secret: secrets.paypal.client_secret
  });

  var paymentDetails = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: secrets.paypal.returnUrl,
      cancel_url: secrets.paypal.cancelUrl
    },
    transactions: [{
      description: 'Fragment donation',
      amount: {
        currency: 'USD',
        total: '1.99'
      }
    }]
  };

  paypal.payment.create(paymentDetails, function(err, payment) {
    if (err) return next(err);
    req.session.paymentId = payment.id;
    var links = payment.links;
    for (var i = 0; i < links.length; i++) {
      if (links[i].rel === 'approval_url') {
        res.render('api/paypal', {
          approvalUrl: links[i].href
        });
      }
    }
  });
};

/**
 * GET /api/paypal/success
 * PayPal SDK example.
 */
exports.getPayPalSuccess = function(req, res) {
  var paymentId = req.session.paymentId;
  var paymentDetails = { payer_id: req.query.PayerID };
  paypal.payment.execute(paymentId, paymentDetails, function(err) {
    if (err) {
      res.render('api/paypal', {
        result: true,
        success: false
      });
    } else {
      res.render('api/paypal', {
        result: true,
        success: true
      });
    }
  });
};

/**
 * GET /api/paypal/cancel
 * PayPal SDK example.
 */
exports.getPayPalCancel = function(req, res) {
  req.session.paymentId = null;
  res.render('api/paypal', {
    result: true,
    canceled: true
  });
};

/**
 * GET /api/lob
 * Lob API example.
 */
exports.getLob = function(req, res, next) {
  lob.routes.list({
    zip_codes: ['10007']
  }, function(err, routes) {
    if(err) return next(err);
    res.render('api/lob', {
      title: 'Lob API',
      routes: routes.data[0].routes
    });
  });
};

/**
 * GET /api/bitgo
 * BitGo wallet example
 */
exports.getBitGo = function(req, res, next) {
  var bitgo = new BitGo.BitGo({ env: 'test', accessToken: secrets.bitgo.accessToken });
  var walletId = req.session.walletId;

  var renderWalletInfo = function(walletId) {
    bitgo.wallets().get({ id: walletId }, function(err, walletResponse) {
      walletResponse.createAddress({}, function(err, addressResponse) {
        walletResponse.transactions({}, function(err, transactionsResponse) {
          res.render('api/bitgo', {
            title: 'BitGo API',
            wallet: walletResponse.wallet,
            address: addressResponse.address,
            transactions: transactionsResponse.transactions
          });
        });
      });
    });
  };

  if (walletId) {
    renderWalletInfo(walletId);
  } else {
    bitgo.wallets().createWalletWithKeychains({
        passphrase: req.sessionID, // change this!
        label: 'wallet for session ' + req.sessionID,
        backupXpub: 'xpub6AHA9hZDN11k2ijHMeS5QqHx2KP9aMBRhTDqANMnwVtdyw2TDYRmF8PjpvwUFcL1Et8Hj59S3gTSMcUQ5gAqTz3Wd8EsMTmF3DChhqPQBnU'
      }, function(err, res) {
        req.session.walletId = res.wallet.wallet.id;
        renderWalletInfo(req.session.walletId);
      }
    );
  }
};


/**
 * POST /api/bitgo
 * BitGo send coins example
 */
exports.postBitGo = function(req, res, next) {
  var bitgo = new BitGo.BitGo({ env: 'test', accessToken: secrets.bitgo.accessToken });
  var walletId = req.session.walletId;

  try {
    bitgo.wallets().get({ id: walletId }, function(err, wallet) {
      wallet.sendCoins({
        address: req.body.address,
        amount: parseInt(req.body.amount),
        walletPassphrase: req.sessionID
      }, function(err, result) {
        if (err) {
          req.flash('errors', { msg: err.message });
          return res.redirect('/api/bitgo');
        }
        req.flash('info', { msg: 'txid: ' + result.hash + ', hex: ' + result.tx });
        return res.redirect('/api/bitgo');
      });
    });
  } catch (e) {
    req.flash('errors', { msg: e.message });
    return res.redirect('/api/bitgo');
  }
};


/**
 * GET /api/bicore
 * Bitcore example
 */
exports.getBitcore = function(req, res, next) {
  try {
    var privateKey;

    if (req.session.bitcorePrivateKeyWIF) {
      privateKey = Bitcore.PrivateKey.fromWIF(req.session.bitcorePrivateKeyWIF);
    } else {
      privateKey = new Bitcore.PrivateKey();
      req.session.bitcorePrivateKeyWIF = privateKey.toWIF();
      req.flash('info', {
        msg: 'A new ' + secrets.bitcore.bitcoinNetwork + ' private key has been created for you and is stored in ' +
        'req.session.bitcorePrivateKeyWIF. Unless you changed the Bitcoin network near the require bitcore line, ' +
        'this is a testnet address.'
      });
    }

    var myAddress = privateKey.toAddress();
    var bitcoreUTXOAddress = '';

    if (req.session.bitcoreUTXOAddress)
      bitcoreUTXOAddress = req.session.bitcoreUTXOAddress;
    res.render('api/bitcore', {
      title: 'Bitcore API',
      network: secrets.bitcore.bitcoinNetwork,
      address: myAddress,
      getUTXOAddress: bitcoreUTXOAddress
    });
  } catch (e) {
    req.flash('errors', { msg: e.message });
    return next(e);
  }
};

/**
 * POST /api/bitcore
 * Bitcore send coins example
 */
exports.postBitcore = function(req, res, next) {
  try {
    var getUTXOAddress;

    if (req.body.address) {
      getUTXOAddress = req.body.address;
      req.session.bitcoreUTXOAddress = getUTXOAddress;
    } else if (req.session.bitcoreUTXOAddress) {
      getUTXOAddress = req.session.bitcoreUTXOAddress;
    } else {
      getUTXOAddress = '';
    }

    var myAddress;

    if (req.session.bitcorePrivateKeyWIF) {
      myAddress = Bitcore.PrivateKey.fromWIF(req.session.bitcorePrivateKeyWIF).toAddress();
    } else {
      myAddress = '';
    }

    var insight = new BitcoreInsight();

    insight.getUnspentUtxos(getUTXOAddress, function(err, utxos) {
      if (err) {
        req.flash('errors', { msg: err.message });
        return next(err);
      } else {
        req.flash('info', { msg: 'UTXO information obtained from the Bitcoin network via Bitpay Insight. You can use your own full Bitcoin node.' });

        // Results are in the form of an array of items which need to be turned into JS objects.
        for (var i = 0; i < utxos.length; ++i) {
          utxos[i] = utxos[i].toObject();
        }

        res.render('api/bitcore', {
          title: 'Bitcore API',
          myAddress: myAddress,
          getUTXOAddress: getUTXOAddress,
          utxos: utxos,
          network: secrets.bitcore.bitcoinNetwork
        });
      }
    });
  } catch (e) {
    req.flash('errors', { msg: e.message });
    return next(e);
  }
};
