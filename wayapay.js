var WayaPay = (function () {
  var backendDomain =
    "https://services.staging.wayapay.ng/payment-gateway/api/v1/";
  var backendDomainForLive =
    "https://services.staging.wayapay.ng/payment-gateway/api/v1/";
  var redirectUrlForTest = "https://pay.staging.wayapay.ng/";
  var redirectUrlForLive = "https://pay.staging.wayapay.ng/";

  var Initialize = async function (payload) {
    var domain,
      redirectUrl = "";
    return await new Promise(function (resolve, reject) {
      if (!payload) {
        resolve({
          success: false,
          message:
            "sorry, cannot find wayaPublicKey or merchantId on the request",
          data: {
            authorizeUrl: null,
            authorizeUrl: null,
            transactionId: null,
            customerName: null,
            customerId: null,
            customerAvoid: null,
          },
        });
      } else if (
        !payload.wayaPublicKey ||
        !payload.merchantId ||
        payload.wayaPublicKey === null ||
        payload.merchantId === null
      ) {
        resolve({
          success: false,
          message: "sorry, wayaPublicKey or merchantId is a compulsory field",
          data: {
            authorizeUrl: null,
            authorizeUrl: null,
            transactionId: null,
            customerName: null,
            customerId: null,
            customerAvoid: null,
          },
        });
      }
      if (payload.mode && payload.mode === "Live") {
        domain = backendDomainForLive;
        redirectUrl = redirectUrlForLive;
      } else {
        domain = backendDomain;
        redirectUrl = redirectUrlForTest;
      }
      var xhttp = new XMLHttpRequest();
      xhttp.onload = function () {
        var response = JSON.parse(xhttp.responseText);
        if (xhttp.status === 200 && response.status === true) {
          resolve({
            success: true,
            message: response.message,
            data: {
              authorizeUrl: redirectUrl + "?_tranId=" + response.data.tranId,
              transactionId: response.tranId,
              customerName: response.name,
              customerId: response.customerId,
              customerAvoid: response.customerAvoid,
            },
          });
        } else if (xhttp.status === 400) {
          resolve({
            success: false,
            message: response.message,
            data: {
              authorizeUrl: null,
              authorizeUrl: null,
              transactionId: null,
              customerName: null,
              customerId: null,
              customerAvoid: null,
            },
          });
        } else if (xhttp.status === 500) {
          resolve({
            success: false,
            message:
              "Sorry, Error occurred on the server while processing. Please contact the admin",
            data: {
              authorizeUrl: null,
              authorizeUrl: null,
              transactionId: null,
              customerName: null,
              customerId: null,
              customerAvoid: null,
            },
          });
        }
      };
      xhttp.onerror = function () {
        resolve({
          success: false,
          message: "Sorry, Service unavailable. Please try again later",
          data: {
            authorizeUrl: null,
            authorizeUrl: null,
            transactionId: null,
            customerName: null,
            customerId: null,
            customerAvoid: null,
          },
        });
      };
      xhttp.open("POST", domain + "request/transaction");
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify(payload));
    });
  };

  var Verify = async function (payload) {
    var domain = "";
    if (!payload) {
      resolve({
        success: false,
        message: "Please supply transactionId",
        data: {},
      });
    } else if (payload && !payload.transactionId) {
      resolve({
        success: false,
        message: "Please supply transactionId",
        data: {},
      });
    }
    var xhttp = new XMLHttpRequest();
    if (payload.mode && payload.mode === "Live") {
      domain = backendDomainForLive;
    } else {
      domain = backendDomain;
    }
    xhttp.onload = function () {
      var response = JSON.parse(xhttp.responseText);
      if (xhttp.status === 200 && response.status === true) {
        resolve({
          success: true,
          message: response.message,
          data: response.data,
        });
      } else if (xhttp.status === 400) {
        resolve({
          success: false,
          message: response.message,
          data: {},
        });
      } else if (xhttp.status === 500) {
        resolve({
          success: false,
          message:
            "Sorry, Error occurred on the server while processing. Please contact the admin",
          data: {},
        });
      }
    };
    xhttp.onerror = function () {
      resolve({
        success: false,
        message: "Sorry, Service unavailable. Please try again later",
        data: {},
      });
    };
    xhttp.open("GET", domain + "reference/query/" + payload.transactionId);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(payload));
  };
  return {
    InitializePayment: async function (payload) {
      return new Promise(async function (resolve, reject) {
        resolve(Initialize(payload));
      });
    },
    VerifyPayment: async function (a) {
      return new Promise(async function (resolve, reject) {
        resolve(Verify(payload));
      });
    },
  };
})();
