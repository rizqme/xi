xi.provide('xi.lang.Enum', function(xi) {
	
	/**
	 * Enumerable
	 * 
	 * @module xi.lang
	 * 
	 * @id Enum
	 */ 
	
	xi.Enum = {};
	
	/**
	 * Map Object/Array
	 * 
	 * @id Enum.map
	 */ 
	xi.Enum.map = function(object, iter) {
		
		var result = new object.constructor;
		
		this.each(object, function(value, key) {
			
			result[key] = iter(value, key);
		});
		
		return result;
	};
})