'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.AdvancedProxyManager = exports.ProxyType = void 0;
const config_1 = require('../config/config');
var ProxyType;
(function (ProxyType) {
  ProxyType['RESIDENTIAL'] = 'residential';
  ProxyType['DATACENTER'] = 'datacenter';
  ProxyType['ISP'] = 'isp';
  ProxyType['MOBILE'] = 'mobile';
})(ProxyType || (exports.ProxyType = ProxyType = {}));
class AdvancedProxyManager {
  constructor(
    username = config_1.config.brightData.username,
    password = config_1.config.brightData.password
  ) {
    this.username = username;
    this.password = password;
    this.maxRetries = 3;
    this.rotationThreshold = 100; // ilość requestów przed rotacją
    this.requestCount = new Map();
    this.bannedIPs = new Set();
  }
  getProxyUrl(proxyConfig) {
    const { host, port, username, password, session, country, city } = proxyConfig;
    let auth = `${username}:${password}`;
    if (session) {
      auth += `-session-${session}`;
    }
    if (country) {
      auth += `-country-${country}`;
    }
    if (city) {
      auth += `-city-${city}`;
    }
    return `http://${auth}@${host}:${port}`;
  }
  getProxyConfigByType(type) {
    const baseConfig = {
      username: this.username,
      password: this.password,
      session: Math.random().toString(36).substring(7),
    };
    switch (type) {
      case ProxyType.RESIDENTIAL:
        return Object.assign(Object.assign({}, baseConfig), {
          host: 'zproxy.lum-superproxy.io',
          port: 22225,
          proxyType: ProxyType.RESIDENTIAL,
        });
      case ProxyType.DATACENTER:
        return Object.assign(Object.assign({}, baseConfig), {
          host: 'brd.superproxy.io',
          port: 22225,
          proxyType: ProxyType.DATACENTER,
        });
      case ProxyType.ISP:
        return Object.assign(Object.assign({}, baseConfig), {
          host: 'isp.lum-superproxy.io',
          port: 22225,
          proxyType: ProxyType.ISP,
        });
      case ProxyType.MOBILE:
        return Object.assign(Object.assign({}, baseConfig), {
          host: 'mobile.lum-superproxy.io',
          port: 22225,
          proxyType: ProxyType.MOBILE,
        });
    }
  }
  shouldRotateProxy(proxyConfig) {
    const key = this.getProxyUrl(proxyConfig);
    const count = this.requestCount.get(key) || 0;
    return count >= this.rotationThreshold;
  }
  rotateProxy(proxyConfig) {
    const newConfig = Object.assign({}, proxyConfig);
    newConfig.session = Math.random().toString(36).substring(7);
    this.requestCount.set(this.getProxyUrl(newConfig), 0);
    return newConfig;
  }
  incrementRequestCount(proxyConfig) {
    const key = this.getProxyUrl(proxyConfig);
    const count = this.requestCount.get(key) || 0;
    this.requestCount.set(key, count + 1);
  }
  handleProxyError(error, proxyConfig) {
    if (error.statusCode === 403 || error.statusCode === 429) {
      this.bannedIPs.add(this.getProxyUrl(proxyConfig));
      return this.rotateProxy(proxyConfig);
    }
    return proxyConfig;
  }
  getWorkingProxy() {
    return __awaiter(this, arguments, void 0, function* (preferredType = ProxyType.RESIDENTIAL) {
      let proxyConfig = this.getProxyConfigByType(preferredType);
      if (this.shouldRotateProxy(proxyConfig)) {
        proxyConfig = this.rotateProxy(proxyConfig);
      }
      // Sprawdź czy proxy nie jest zbanowane
      if (this.bannedIPs.has(this.getProxyUrl(proxyConfig))) {
        proxyConfig = this.rotateProxy(proxyConfig);
      }
      return proxyConfig;
    });
  }
  executeWithProxy(action_1) {
    return __awaiter(
      this,
      arguments,
      void 0,
      function* (action, preferredType = ProxyType.RESIDENTIAL) {
        let retries = 0;
        let lastError;
        while (retries < this.maxRetries) {
          const proxyConfig = yield this.getWorkingProxy(preferredType);
          const proxyUrl = this.getProxyUrl(proxyConfig);
          try {
            const result = yield action(proxyUrl);
            this.incrementRequestCount(proxyConfig);
            return result;
          } catch (error) {
            lastError = error;
            this.handleProxyError(error, proxyConfig);
            retries++;
            // Jeśli błąd wskazuje na zablokowane proxy, spróbuj innego typu
            if (error.statusCode === 403 || error.statusCode === 429) {
              const fallbackTypes = [ProxyType.ISP, ProxyType.DATACENTER, ProxyType.MOBILE].filter(
                (type) => type !== preferredType
              );
              for (const type of fallbackTypes) {
                try {
                  const newProxyConfig = yield this.getWorkingProxy(type);
                  const result = yield action(this.getProxyUrl(newProxyConfig));
                  this.incrementRequestCount(newProxyConfig);
                  return result;
                } catch (fallbackError) {
                  lastError = fallbackError;
                }
              }
            }
          }
        }
        throw new Error(
          `Failed after ${this.maxRetries} retries. Last error: ${lastError.message}`
        );
      }
    );
  }
}
exports.AdvancedProxyManager = AdvancedProxyManager;
