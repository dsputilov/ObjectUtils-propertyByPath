const splitSafe = function (str, splitter) {
	if (!splitter) {
		return [str];
	}
	//TODO: fix. Due to the fact that the script is loaded as a string and evals, slashes break
	let nodes = str.matchAll(new RegExp('(.*?[^\\\\])(?:\\' + splitter + '|$)', 'g'));
	let res = [];
	for (const match of nodes) {
		res.push(match[1]);
	}
	return res;
};

const isHash = function (value) {
	return value instanceof Object && value.constructor === Object && '' + value !== '[object Arguments]';
};

/**
 * @description Returns the value in the object found at the specified path
 * @param obj				{Object}
 * @param path				{String}
 * @param cfg				{Object=}
 * @param cfg.separator		{String=}	The separator is on the way. If the property is not specified but a dot is used
 * @returns {undefined|{hasOwnProperty}|*}
 */
const getPropertyByPath = function (obj, path, cfg) {
	if (path === '') {
		return obj;
	} else if (typeof path === 'string') {
		let pathSteps, pathStep, i, l;
		let separator = (cfg && cfg.separator) ? cfg.separator : '.';
		pathSteps = path.split(separator);
		for (i = 0, l = pathSteps.length; pathStep = pathSteps[i], i < l && pathStep && obj; i++) {
			if (obj.hasOwnProperty && obj.hasOwnProperty(pathStep)) {
				obj = obj[pathStep];
			} else {
				break;
			}
		}
		return i < l ? undefined : obj;
	} else {
		throw new Error('getPropertyByPath argument should be string');
	}
};


/**
 * @description set property by path in object
 * @param obj					{Object}
 * @param path					{String}
 * @param value					{Object}
 * @param options				{Object=}
 * @param options.separator		{String=}	The separator is on the way. If the property is not specified but a dot is used
 * @param options.isProperty	{Boolean=}
 * @param options.force			{Boolean=}	[default:true]	If the property already exists, then the new value will overwrite the existing one.
 * 											If you want the new value to be ignored, set this flag to false
 * @returns {*}
 */
const setPropertyByPath = function (obj, path, value, options) {
	//console.log('[setPropertyByPath]:', path, value, options);
	let originValue = value;
	let nodes;
	if (!options) {
		options = {};
	}

	if (path && typeof path === 'number') {				//isNumber
		path += '';										//fast fix for indexes in arrays //OPTIMIZE
	}
	if (path && typeof path === 'string') {
		//console.log('init obj: ', data.obj);
		if (options.isProperty) {
			nodes = [path];
		} else {
			let separator = options.separator || '.';
			nodes = splitSafe(path, separator);
		}
	} else if (Array.isArray(path)) {
		nodes = path;
	}
	if (nodes) {
		//console.log('[setPropertyByPath] obj:', obj, 'nodes:', nodes);
		let propertyName;
		let propertyPath = '';
		let tmpValue = {};
		let tmpRef = tmpValue;
		let lastPropertyName = nodes.pop();

		nodes.forEach(function (nodeName) {
			if (!Object.prototype.hasOwnProperty.call(obj, nodeName)) {
				//console.log('+create node:', nodeName);
				if (!propertyName) {
					propertyName = nodeName;
				} else {
					tmpRef[nodeName] = {};
					tmpRef = tmpRef[nodeName];
				}
			} else {
				if (!isHash(obj[nodeName]) && !Array.isArray(obj[nodeName])) {
					//console.log('+convert node to hash:', obj, nodeName, 'isHash:', Object.isHash(obj[nodeName]), 'isArr:', Array.isArray(obj[nodeName]));
					obj[nodeName] = {};
				}
				obj = obj[nodeName];
				propertyPath = (propertyPath ? propertyPath + '.' : '') + nodeName;
			}
		});

		if (!propertyName) {
			propertyName = lastPropertyName;
			tmpValue = value;
		} else {
			tmpRef[lastPropertyName] = value;
		}

		if (options.force === false && obj.hasOwnProperty(propertyName)) {		//If the property already exists and cannot be overwritten
			return obj[propertyName];
		}

		value = tmpValue;
		obj[propertyName] = value;

	} else {
		throw new Error('Path should be string: ' + path + '[' + Number.is(path) + ']');
	}
	return originValue;
};

export {getPropertyByPath, setPropertyByPath};