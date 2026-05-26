"use strict";

const axios = require("axios");

const { API_BASE, PAYMENT_LINK } = require("./constants");
const { isEmpty, error } = require("./utils");

class WayaPayClient {
  constructor({ merchantId, publicKey, environment = "development" }) {
    if (isEmpty(merchantId)) {
      throw new Error("merchantId is required");
    }

    if (isEmpty(publicKey)) {
      throw new Error("publicKey is required");
    }

    const isProd =
      environment.trim().toLowerCase() === "production" ||
      environment.trim().toLowerCase() === "prod";

    this.merchantId = merchantId;
    this.publicKey = publicKey;

    this.baseUrl = isProd ? API_BASE.prod : API_BASE.test;

    this.paymentLink = isProd ? PAYMENT_LINK.prod : PAYMENT_LINK.test;

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        "Merchant-ID": this.merchantId,
        "API-Secret-Key": this.publicKey,
      },
      timeout: 30000,
    });
  }

  async initializePayment(payload) {
    try {
      const {
        currency,
        amount,
        callBackUrl,
        idempotencyKey,
        paymentRef,
        metadata,
      } = payload;

      if (isEmpty(currency)) {
        return error("currency is required");
      }

      if (isEmpty(amount)) {
        return error("amount is required");
      }

      if (isEmpty(callBackUrl)) {
        return error("callBackUrl is required");
      }

      if (isEmpty(idempotencyKey)) {
        return error("idempotencyKey is required");
      }

      if (isEmpty(paymentRef)) {
        return error("paymentRef is required");
      }

      if (!metadata) {
        return error("metadata is required");
      }

      if (isEmpty(metadata.firstName)) {
        return error("metadata.firstName is required");
      }

      if (isEmpty(metadata.lastName)) {
        return error("metadata.lastName is required");
      }

      if (isEmpty(metadata.phoneNumber)) {
        return error("metadata.phoneNumber is required");
      }

      if (isEmpty(metadata.emailAddress)) {
        return error("metadata.emailAddress is required");
      }

      const { data } = await this.client.post(
        "/payment-collect/initiate",
        payload,
      );

      return {
        status: true,
        data: data.data || data,
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  async initiatePayout(payload) {
    try {
      const { currency, amount, idempotencyKey, bankCode, accountNumber } =
        payload;

      if (isEmpty(currency)) {
        return error("currency is required");
      }

      if (isEmpty(amount)) {
        return error("amount is required");
      }

      if (isEmpty(idempotencyKey)) {
        return error("idempotencyKey is required");
      }

      if (isEmpty(bankCode)) {
        return error("bankCode is required");
      }

      if (isEmpty(accountNumber)) {
        return error("accountNumber is required");
      }

      const { data } = await this.client.post(
        "/payment-payout/initiate",
        payload,
      );

      return {
        status: true,
        data,
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  async verifyTransaction(transactionRef) {
    try {
      if (isEmpty(transactionRef)) {
        return error("transactionRef is required");
      }

      const { data } = await this.client.get(
        `/payment/transaction?ref=${transactionRef}`,
      );

      return {
        status: true,
        data: data.data || data,
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  async fetchBankList() {
    try {
      const { data } = await this.client.get("/banks-list");

      return {
        status: true,
        data: data.data || data,
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  async verifyAccount(payload) {
    try {
      const { accountNumber, bankCode } = payload;

      if (isEmpty(accountNumber)) {
        return error("accountNumber is required");
      }

      if (isEmpty(bankCode)) {
        return error("bankCode is required");
      }

      const { data } = await this.client.get("/account-verification", {
        data: payload,
      });

      return {
        status: true,
        data: data.data || data,
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  handleError(error) {
    if (error.response) {
      return error.response.data;
    }

    if (error.request) {
      return {
        status: false,
        message: error.message,
      };
    }

    return {
      status: false,
      message: error.message,
    };
  }
}

module.exports = WayaPayClient;
