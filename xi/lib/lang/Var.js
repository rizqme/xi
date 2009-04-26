xi.provide('xi.lang.Var', function(xi) {
	
	xi.using('xi.lang.Clone');
	xi.using('xi.lang.Function');
	xi.using('xi.lang.Array');
	
	/**
	 * Class for creating property with getter & setter
	 * 
	 * @module xi.lang
	 * 
	 * @constructor
	 * @id Var
	 */ 
	
	xi.Var = function Var(source) {
		
		var mutator = {
			
			getter: defaultGetter,
			setter: defaultSetter
		};
		
		mutator = xi.extend(mutator, source);
		
		var lock, instance = function(value) {
			
			var old = mutator.value;
			
			mutator.caller = arguments.callee.caller || {};
			mutator.parent = this;
			
			if(arguments.length) {
				
				if(instance.binding && mutator.caller != instance.binding)
					return mutator.getter();
				if(lock && xi.Array.contain(lock, mutator.caller))
					return mutator.getter();
				
				mutator.setter(value);
				if(mutator.value != old)
					instance.trigger(old, mutator.value);
				
				return mutator.getter();
			}
			else {
				
				if(mutator.caller.binding && !mutator.caller.binding.initialized)
					instance.watch(mutator.caller.binding);
				return mutator.getter();
			}
		};
		
		instance.watchers = [];
		instance.source = source;
		instance.constructor = xi.Var;
		
		instance.lock = function() {
			
			lock = xi.Array.pure(arguments);
			instance.lock = xi.Function.empty;
		};
		
		return xi.extend(instance, xi.Var.prototype);
	};
	
	/**
	 * Default getter
	 * 
	 * @private
	 * @property
	 * 
	 * @id defaultGetter
	 */ 
	var defaultGetter = function() {
		return this.value;
	};
	
	/**
	 * Default setter
	 * 
	 * @private
	 * @property
	 * 
	 * @id defaultSetter
	 */ 
	var defaultSetter = function(x) {
		this.value = x;
	};
	
	/**
	 * Var prototypes
	 * 
	 * @prototype
	 * @id Var.prototype
	 */ 
	xi.Var.prototype = {
		
		/**
		 * Trigger Change
		 * 
		 * @id Var.prototype.trigger
		 */ 
		trigger: function trigger(oldval, newval) {
			
			var array = [];
			
			for(var i=0; i<this.watchers.length; i++) {
				
				if(this.watchers[i].obsolete)
					continue;
				
				array.push(this.watchers[i]);
				this.watchers[i](oldval, newval);
			}
			
			this.watchers = array;
		},
		
		/**
		 * Watch to change
		 * 
		 * @id Var.prototype.watch
		 */ 
		watch: function watch(fn) {
			
			if(typeof fn == 'function')
				xi.Array.include(this.watchers, fn);
		},
		
		/**
		 * Unwatch
		 * 
		 * @id Var.prototype.unwatch
		 */ 
		unwatch: function unwatch(fn) {
			
			if(!arguments.length)
				this.watchers.length = 0;
			else
				xi.Array.exclude(this.watchers, fn);
		},
		
		/**
		 * Bind
		 * 
		 * @id Var.prototype.bind
		 */ 
		bind: function bind(fn) {
			
			var self = this;
			
			this.unbind();
			this.binding = fn.binding = function() {
				
				self(fn());
			};
			
			this.binding();
			this.binding.initialized = true;
		},
		
		/**
		 * Unbind
		 * 
		 * @id Var.prototype.unbind
		 */ 
		unbind: function unbind() {
			
			if(this.binding)
				this.binding.obsolete = true;
		}
	};
	
	/**
	 * Check wheter argument is a Var
	 * 
	 * @id Var.is
	 */ 
	xi.Var.is = function is(v) {
		
		return v ? (v.constructor == xi.Var) : false;
	};
	
	/**
	 * Module for Clone
	 * 
	 * @private
	 * @property
	 * 
	 * @id cloneModule
	 */ 
	xi.Clone.addModule({
		
		match: function match(object) {
			
			return xi.Var.is(object);
		},
		
		clone: function clone(object) {
			
			return new xi.Var(new Clone(object.source));
		}
	});
});