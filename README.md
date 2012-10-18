JS Caching
======================

Provides an API for client-side caching via a JS variable on a page instance
or through the HTML5 localStorage/sessionStorage API

Storage Types
--------------------

##JavaScript

This type of storage only lasts for a single page load instance.

##Session Storage

Useful for persistent page load instances. If the user refreshes
the browser or browse to another site and comes back, the stored
data is still there unless the cache timeout is met.

##Local Storage

Same as sessionStorage but uses localStorage system to allow for
caching even when the browser is closed and reopened (where available)

Usage
--------------------

##Initialize the plugin
    cache.init();

##Set a value
    cache.set('some_key','some_value_to_store');

##Retrieve a stored value
    var value = cache.get('some_key');
    console.log(value); //returns "some_value_to_store"

##Reset the cache
    cache.reset();