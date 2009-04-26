xi.provide('xi.lang.Hash', function(xi) {

	xi.using('xi.lang.Clone');
	
	/**
	 * Hash Class
	 * 
	 * @module xi.lang
	 * 
	 * @constructor
	 * @id xi.lang.Hash
	 */ 
	xi.Hash = function Hash() {
		
	};
	
	/**
	 * Check whether argument is a hash
	 * 
	 * @id xi.lang.Hash.is
	 */ 
	xi.Hash.is = function (hash) {
		return hash.constructor == xi.Hash;
	};
})