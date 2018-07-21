'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

function cropSection(c) {
	return c.left + 'x' + c.top + ':' + c.right + 'x' + c.bottom;
}

function filtersURIComponent(filters) {
	var elements = ['filters'];
	for (var name in filters) {
		if (filters.hasOwnProperty(name)) {
			var parameters = filters[name];
			var stringParameters = void 0;
			// If we have several parameters, they were passed as an array 
			// and now they need to be comma separated, otherwise there is just one to convert to a string
			if (Array.isArray(parameters)) {
				stringParameters = parameters.join(',');
			}
			// If true, we don't even need to do anything, we just have an empty string and insert ()
			// Ex: {grayscale: true} => grayscale()
			else if (parameters === true) {
					stringParameters = '';
				} else {
					stringParameters = String(parameters);
				}
			elements.push(name + '(' + stringParameters + ')');
		}
	}
	return elements.join(':');
}

function thumborURL(_ref) {
	var server = _ref.server,
	    src = _ref.src,
	    width = _ref.width,
	    height = _ref.height,
	    flipHorizontal = _ref.flipHorizontal,
	    flipVertical = _ref.flipVertical,
	    trim = _ref.trim,
	    fitIn = _ref.fitIn,
	    horizontalAlign = _ref.horizontalAlign,
	    verticalAlign = _ref.verticalAlign,
	    smart = _ref.smart,
	    filters = _ref.filters,
	    manualCrop = _ref.manualCrop;

	var urlComponents = [server, 'unsafe'];

	// Add the trim parameter after unsafe if appliable
	trim && urlComponents.push('trim');

	// Add the crop parameter if any
	manualCrop && urlComponents.push(cropSection(manualCrop));

	// Add the fit-in parameter after crop if appliable
	fitIn && urlComponents.push('fit-in');

	// Adds the final size parameter
	var finalSize = '';
	if (flipHorizontal) {
		// Adds minus to flip horizontally
		finalSize += '-';
	}
	finalSize += width + 'x';
	if (flipVertical) {
		// Adds minus to flip vertically
		finalSize += '-';
	}
	finalSize += height;
	urlComponents.push(finalSize);

	// Adds the horizontal alignement after the size
	urlComponents.push(horizontalAlign);

	// Adds the vertical alignement after the size
	urlComponents.push(verticalAlign);

	// Adds the smart parameter if appliable
	smart && urlComponents.push('smart');

	// Compile the filters and add them right before the URI
	Object.keys(filters).length > 0 && urlComponents.push(filtersURIComponent(filters));

	// Finally, adds the real image uri
	urlComponents.push(src);

	var url = urlComponents.join('/');
	return url;
}

function generateSrcSet(props) {
	var srcSet = [];
	for (var i = 2; i <= 3; i++) {
		var input = Object.assign({}, props, {
			height: props.height * i,
			width: props.width * i
		});
		srcSet.push(thumborURL(input) + ' ' + i + 'x');
	}
	// Source set URLs needs to be separated by a comma and an optional space
	return srcSet.join(', ');
}

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

function ThumborImage(props) {
	var generateSrcSet$$1 = props.generateSrcSet,
	    width = props.width,
	    height = props.height;

	var imgProps = Object.assign({}, props.imgProps);

	// Adds the sourceset if the option was chosen
	if (generateSrcSet$$1) {
		imgProps.srcSet = generateSrcSet(props);
	}

	// Adds the width and heights in case they are set, for styling reasons
	if (Math.abs(width) > 1) {
		imgProps.width = Math.abs(width);
	}
	if (Math.abs(height) > 1) {
		imgProps.height = Math.abs(height);
	}
	return React.createElement('img', _extends({
		src: thumborURL(props)
	}, imgProps));
}

ThumborImage.defaultProps = {
	imgProps: {},
	server: null,
	src: null,
	width: 0,
	height: 0,
	flipHorizontal: false,
	flipVertical: false,
	trim: false,
	fitIn: false,
	manualCrop: false,
	horizontalAlign: 'center',
	verticalAlign: 'middle',
	smart: true,
	filters: {},
	generateSrcSet: true
};

exports.ThumborImage = ThumborImage;
exports.thumborURL = thumborURL;
