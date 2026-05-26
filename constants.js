const API_BASE = {
  test: "https://services.staging.wayapay.ng",
  prod: "https://services.wayapay.ng",
};

const PAYMENT_LINK = {
  test: "https://pay.staging.wayapay.ng/?_tranId=",
  prod: "https://pay.wayapay.ng/?_tranId=",
};

module.exports = {
  API_BASE,
  PAYMENT_LINK,
};
