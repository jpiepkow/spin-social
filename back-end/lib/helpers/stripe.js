var stripe = require('stripe')(process.STRIPE_API_KEY);
var chargeCard = function(token) {
  return new Promise((resolve, reject) => {
    var charge = stripe.charges.create(
      {
        amount: 100,
        currency: 'usd',
        description: 'Pay to Play',
        source: token.id
      },
      function(err, charge) {
        return err ? reject(err) : resolve(charge);
      }
    );
  });
};
module.exports = { chargeCard: chargeCard };
