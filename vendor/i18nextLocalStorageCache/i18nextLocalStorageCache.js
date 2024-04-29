(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global.i18nextLocalStorageCache = factory());
}(this, (function () {
  'use strict';

  var arr = [];
  var each = arr.forEach;
  var slice = arr.slice;

  function defaults(obj) {
    each.call(slice.call(arguments, 1), function (source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === undefined) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  }



  function debounce(func) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      func.apply(context, args);
    };
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var storage = {
    setItem: function setItem(key, value) {
      if (window.localStorage) {
        try {
          window.localStorage.setItem(key, value);
        } catch (e) {
          // f.log('failed to set value for key "' + key + '" to localStorage.');
        }
      }
    },
    getItem: function getItem(key, value) {
      if (window.localStorage) {
        try {
          return window.localStorage.getItem(key, value);
        } catch (e) {
          // f.log('failed to get value for key "' + key + '" from localStorage.');
        }
      }
      return undefined;
    }
  };

  function getDefaults() {
    return {
      enabled: false,
      prefix: 'i18next_res_',
      expirationTime: 7 * 24 * 60 * 60 * 1000,
      versions: {}
    };
  }

  var Cache = function () {
    function Cache(services) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Cache);

      this.init(services, options);

      this.type = 'cache';
      this.debouncedStore = debounce(this.store);
    }

    _createClass(Cache, [{
      key: 'init',
      value: function init(services) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        this.services = services;
        this.options = defaults(options, this.options || {}, getDefaults());
      }
    }, {
      key: 'read',
      value: function load(lng, namespace, callback) {
        var _this = this;

        var nowMS = new Date().getTime();

        if (!window.localStorage || !lng) {
          return callback(null, null);
        }

        var store = storage.getItem(_this.options.prefix + lng);

        if (store) {
          store = JSON.parse(store);
          if (
            // expiration field is mandatory, and should not be expired
            store.i18nStamp && store.i18nStamp + _this.options.expirationTime > nowMS &&

            // there should be no language version set, or if it is, it should match the one in translation
            _this.options.versions[lng] === store.i18nVersion) {
            return callback(null, store.data);
          }
        }
        callback(null, null);
      }
    }, {
      key: 'store',
      value: function store(language, namespace, data) {
        var store = { data: data };
        if (window.localStorage) {
          // eslint-disable-line
          // timestamp
          store.i18nStamp = new Date().getTime();

          // language version (if set)
          if (this.options.versions[language]) {
            store.i18nVersion = this.options.versions[language];
          }

          // save
          storage.setItem(this.options.prefix + language, JSON.stringify(store));
        }
      }
    }, {
      key: 'save',
      value: function save(language, namespace, data) {
        this.debouncedStore(language, namespace, data);
      }
    }]);

    return Cache;
  }();

  Cache.type = 'cache';

  return Cache;

})));
