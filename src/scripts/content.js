const targetAPI = "v1/user/info";
const originalOpen = XMLHttpRequest.prototype.open;
const originalSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function (method, url, ...rest) {
  this._isTargetApi = url.includes(targetAPI);
  return originalOpen.call(this, method, url, ...rest);
};

XMLHttpRequest.prototype.send = function (...args) {
  const originalOnReadyStateChange = this.onreadystatechange;

  this.onreadystatechange = function (...cbArgs) {
    if (this._isTargetApi && this.readyState === 4 && this.status === 200) {
      try {
        let json = JSON.parse(this.responseText);
        json.result = {
          ...json.result,
          coin_balance: 282004,
          vip_expires_at: 1091404800,
          is_vip: true,
        };

        Object.defineProperty(this, "responseText", {
          value: JSON.stringify(json),
        });
        Object.defineProperty(this, "response", { value: json });
      } catch (error) {
        console.error(error);
      }
    }

    if (originalOnReadyStateChange) {
      return originalOnReadyStateChange.apply(this, cbArgs);
    }
  };

  return originalSend.apply(this, args);
};
