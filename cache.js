/**
 * JavaScript Caching
 *
 * Provides an API for client-side caching via a JS variable on a page instance
 * or through the HTML5 localStorage/sessionStorage API
 *
 * #Storage Types
 *
 * ##JavaScript
 *
 * This type of storage only lasts for a single page load instance.
 *
 * ##Session Storage
 *
 * Useful for persistent page load instances. If the user refreshes
 * the browser or browse to another site and comes back, the stored
 * data is still there unless the cache timeout is met.
 *
 * ##Local Storage
 *
 * Same as sessionStorage but uses localStorage system to allow for
 * caching even when the browser is closed and reopened (where available)
 *
 *
 * #Usage
 *
 * ##Set a value
 * <code>
 * cache.set('some_key', 'some_value_to_store');
 * </code>
 *
 * ##Retrieve a stored value
 * <code>
 * var value = cache.get('some_key');
 *
 * console.log(value); // returns "some_value_to_store"
 * </code>
 *
 * ##Reset the cache
 * cache.reset();
 *
 * @copyright Copyright (c) 2013 Vu Tran
 * @version 1.1.0
 * @link https://github.com/vutran/js-caching
 * @author Vu Tran <vu@vu-tran.com>
 * @website http://vu-tran.com/
 */
var cache = (function(x) {

  "use strict";

  var _QUOTA_EXCEEDED = 22;

  var _cacheTimeout = 900;              // number of seconds for the sessionStorage to live
  var _storageType = 'localStorage';    // enumeration: js, sessionStorage, localStorage
  var _storage = false;                 // storage array (for js storageType)

  var _expirationTime,
      _expirationTimeString,
      _currentTime;

  // !----- Private Methods

  /**
   * This is called by _initStorage() for "localStorage" and "sessionStorage" storage type
   *
   * Sets the current time, and retrieves the stored expiration time.
   * If the expiration time is not yet set, then it will be set into the localStorage/sessionStorage.
   *
   * Will also check the current time against the expiration time to see
   * if the cache timeout is met. If it is met, then the localStorage/sessionStorage
   * will be cleared.
   *
   * @return void
   */
  var _checkExpiration = function() {
    // Sets the current time
    var d = new Date();
    _currentTime = d.getTime();
    // Retrieves the stored expiration time
    _expirationTime = x.get('_cacheTimeout');
    _expirationTimeString = d;
    // If it is not yet set, set it!
    if(!_expirationTime) {
      _expirationTime = _currentTime + _cacheTimeout;
      _expirationTimeString = new Date(_expirationTime);
      x.set('_cacheTimeout', _expirationTime);
      x.set('_cacheTimeoutString', _expirationTimeString);
    }
    // Checks if the current time is greater than the expiration time
    var timeElapsed = ((_currentTime - _expirationTime) / 1000);
    // Clears it if the condition is met!
    if(timeElapsed > _cacheTimeout) { x.reset(); }
  };

  /**
   * Initializes the caching mechanism
   *
   * @access public
   * @return void
   */
  var _init = function() {
    _storageType = 'localStorage';
    switch(_storageType) {
      case 'localStorage':
        // If localStorage isn't supported
        if(!window.localStorage) { _storageType = 'js'; }
        break;
      case 'sessionStorage':
        // If sessionStorage isn't supported
        if(!window.sessionStorage) { _storageType = 'js'; }
        break;
    }
    _initStorage();
  };

  /**
   * Initializes the caching system based on the storage type
   *
   * @access public
   * @return void
   */
  var _initStorage = function() {
    switch(_storageType) {
      case 'localStorage':
      case 'sessionStorage':
        // Sets the current time and check the expiration time
        _checkExpiration();
        break;
      case 'js':
        _storage = [];
        break;
      default:
        _storage = [];
        break;
    }
  };

  // !----- Public Methods

  /**
   * Sets a value for the stored cache key
   *
   * If the value is not a string, tries to convert the JSON string
   * before storing the value
   *
   * If the localStorage or sessionStorage quota is exceeded when trying to store a new value, the cache gets reset
   *
   * @access public
   * @param string key
   * @param string value
   * @return void
   */
  x.set = function(key, value) {
    var data = {
      type : typeof value,
      value : value
    };
    var json = JSON.stringify(data);
    switch(_storageType) {
      case 'localStorage':
        try {
          localStorage.setItem(key, json);
        }
        catch (e) {
          switch(e.code) {
            case _QUOTA_EXCEEDED:
              cache.reset();
              localStorage.setItem(key, json);
              break;
          }
        }
        break;
      case 'sessionStorage':
        try {
          sessionStorage.setItem(key, json);
        }
        catch (e) {
          switch(e.code) {
            case _QUOTA_EXCEEDED:
              cache.reset();
              sessionStorage.setItem(key, json);
              break;
          }
        }
        break;
      case 'js':
        _storage[key] = json;
        break;
      default:
        _storage[key] = json;
        break;
    }
  };

  /**
   * Returns the value of the stored key in the cache
   *
   * If the value is not set, than false (boolean) will be returned
   *
   * @access public
   * @param string key
   * @return mixed             The value if it exists
   */
  x.get = function(key) {
    var data = false;
    var value = false;
    switch(_storageType) {
      case 'localStorage':
        data = localStorage.getItem(key);
        break;
      case 'sessionStorage':
        data = sessionStorage.getItem(key);
        break;
      case 'js':
        data = _storage[key];
        break;
      default:
        data = _storage[key];
        break;
    }
    if(data) {
      var json = JSON.parse(data);
      value = json.value;
    }
    return value;
  };

  /**
   * Resets the storage
   *
   * @access public
   * @return bool
   */
  x.reset = function() {
    switch(_storageType) {
      case 'localStorage':
        localStorage.clear();
        break;
      case 'sessionStorage':
        sessionStorage.clear();
        break;
      case 'js':
        _storage = [];
        break;
      default:
        _storage = [];
        break;
    }
    return true;
  };

  // Initialize the object
  _init();

  // Return The Object

  return x;

}(cache || {}));