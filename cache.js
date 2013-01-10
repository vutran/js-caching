/**
 * JS Caching
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
 * ##Initialize the plugin
 * <code>
 * cache.init();
 * </code>
 *
 * ##Set a value
 * <code>
 * cache.set('some_key','some_value_to_store');
 * </code>
 *
 * ##Retrieve a stored value
 * <code>
 * var value = cache.get('some_key');
 *
 * console.log(value); //returns "some_value_to_store"
 * </code>
 *
 *
 * ##Reset the cache
 * cache.reset();
 *
 * @copyright Copyright (c) 2012, The Uprising Creative
 * @version 1.0.1
 * @link https://github.com/vutran/JS-Caching
 * @author The Uprising Creative <info@theuprisingcreative.com>
 * @website http://theuprisingcreative.com/
 * @contributor Vu Tran <vu@vu-tran.com>
 */
var cache = {
	cacheTimeout : 900, 				//number of seconds for the sessionStorage to live
	storageType : 'localStorage', 		//enumeration: js, sessionStorage, localStorage
	storage : false,					//storage array (for js storageType)
	init : function() {
		/*
		Initializes the caching mechanisms
		 */
		this.storageType = 'localStorage';
		switch(this.storageType) {
			case 'localStorage':
				//if localStorage isn't supported
				if(!window.localStorage) { this.storageType = 'js'; }
				break;
			case 'sessionStorage':
				//if sessionStorage isn't supported
				if(!window.sessionStorage) { this.storageType = 'js'; }
				break;
		}
		this.initStorage();
	},
	/**
	 * This is called by initStorage() for "localStorage" and "sessionStorage" storage type
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
	checkExpiration : function() {
		//Sets the current time
		var d = new Date();
		this.currentTime = d.getTime();
		//Retrieves the stored expiration time
		this.expirationTime = this.get('_cacheTimeout');
		this.expirationTimeString = d;
		//If it is not yet set, set it!
		if(!this.expirationTime) {
			this.expirationTime = this.currentTime + this.cacheTimeout;
			this.expirationTimeString = new Date(this.expirationTime);
			this.set('_cacheTimeout',this.expirationTime);
			this.set('_cacheTimeoutString',this.expirationTimeString);
		}

		//Checks if the current time is greater than the expiration time
		var timeElapsed = ((this.currentTime-this.expirationTime)/1000);
		//Clears it if the condition is met!
		if(timeElapsed>this.cacheTimeout) { this.reset(); }
	},
	/**
	 * Initializes the caching system based on the storage type
	 *
	 * @return void
	 */
	initStorage : function() {
		switch(this.storageType) {
			case 'localStorage':
			case 'sessionStorage':
				//Sets the current time and check the expiration time
				this.checkExpiration();
				break;
			case 'js':
			default:
				this.storage = new Array();
				break;
		}
	},
	/**
	 * Sets a value for the stored cache key
	 *
	 * If the value is not a string, tries to convert the JSON string
	 * before storing the value
	 *
	 * If the localStorage or sessionStorage quota is exceeded when trying to store a new value, the cache gets reset
	 *
	 * @param string key
	 * @param string value
	 * @return void
	 */
	set : function(key,value) {
		var data = {
			type : typeof value,
			value : value
		}
		var json = JSON.stringify(data);
		switch(this.storageType) {
			case 'localStorage':
				try {
					localStorage.setItem(key, json);
				}
				catch (e) {
					switch(e.code) {
						case 22: // quota exceeded
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
						case 22: // quota exceeded
							cache.reset();
							sessionStorage.setItem(key, json);
							break;
					}
				}
				break;
			case 'js':
			default:
				this.storage[key] = json;
				break;
		}
	},
	/**
	 * Returns the value of the stored key in the cache
	 *
	 * If the value is not set, then false (boolean) will be returned
	 *
	 * @param string key
	 * @return string|bool value The value if it exists
	 */
	get : function(key) {
		var data = false;
		var value = false;
		switch(this.storageType) {
			case 'localStorage':
				data = localStorage.getItem(key);
				break;
			case 'sessionStorage':
				data = sessionStorage.getItem(key);
				break;
			case 'js':
			default:
				data = this.storage[key];
				break;
		}
		if(data) {
			var json = JSON.parse(data);
			return json.value;
		}
	},
	/**
	 * Resets the storage
	 *
	 * @return bool true
	 */
	reset : function() {
		switch(this.storageType) {
			case 'localStorage':
				localStorage.clear();
				break;
			case 'sessionStorage':
				sessionStorage.clear();
				break;
			case 'js':
			default:
				this.storage = new Array();
				break;
		}
		return true;
	}
};