xi.provide('xi.lang.String', function(xi) {
	
	/**
	 * String Methods Collection
	 * Ported from Mootools (c) Mootools Devs
	 * 
	 * @module xi.lang
	 * 
	 * @static
	 * @id String
	 */ 
	xi.String = {};
	
	/**
	 * Check whether string contains pattern
	 * 
	 * @id String.contain
	 */ 
	xi.String.contain = function contain(string, pattern, separator) {
		
		return separator ? (separator + string + separator).indexOf(separator + pattern + separator) > -1 : string.indexOf(pattern) > -1;
	};
	
	/**
	 * Trim whitespace
	 * 
	 * @id String.trim
	 */ 
	xi.String.trim = function trim(string) {
		
		return string.replace(/^\s+|\s+$/g, '');
	};
	
	/**
	 * Clean text from whitespaces
	 * 
	 * @id String.clean
	 */ 
	xi.String.clean = function clean(string) {
		
		return xi.String.trim(string.replace(/\s+/g, ' '));
	};
	
	/**
	 * Convert String to CamelCase
	 * 
	 * @id String.camelCase
	 */ 
	xi.String.camelCase = function camelCase(string) {
		
		return string.replace(/-\D/g, function(match) {
      		
			return match.charAt(1).toUpperCase();
		});
	};
	
	/**
	 * Convert CamelCase to Hypenate
	 * 
	 * @id String.hypenate
	 */ 
	xi.String.hypenate = function hypenate(string) {
		
		return string.replace(/[A-Z]/g, function(match) {
			
			return ('-' + match.charAt(0).toLowerCase());
		});
	};
	
	/**
	 * Capitalize text
	 * 
	 * @id String.capitalize
	 */ 
	xi.String.capitalize = function capitalize(string) {
		
		return string.replace(/\b[a-z]/g, function(match) {
			
			return match.toUpperCase();
		});
	};
	
	/**
	 * Convert String to Int
	 * 
	 * @id String.toInt
	 */ 
	xi.String.toInt = function toInt(string, base) {
		
		return parseInt(string, base || 10);
	};
});