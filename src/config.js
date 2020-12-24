export const config = {};

export const setConfig = (options) => {
	for (const key in options) {
		config[key] = options[key];
	}
};

// cfToken
// mapboxToken
 