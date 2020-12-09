function type(o, t) {
    return (Object.prototype.toString.call(o) === `[object ${t}]`);
}

export function isArray(obj) { return type(obj, 'Array'); }

export function isString(obj) { return type(obj, 'String'); }

export function isNumber(obj) { return type(obj, 'Number'); }

export function isFunction(obj) { return type(obj, 'Function'); }

export function isObject(obj) { return type(obj, 'Object'); }

export function isEmptyObject(e) {
    if (!isObject(e) || e === undefined) return false;

    for (const t in e) {
        return !1;
    }

    return !0;
}

export function trim(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

export var freeze = Object.freeze;
Object.freeze = function(obj) { return obj; };

export function extend(dest) {
    var i, j, len, src;

    for (j = 1, len = arguments.length; j < len; j++) {
        src = arguments[j];
        for (i in src) {
            dest[i] = src[i];
        }
    }
    return dest;
}

export function mixin(obj, sources) {
    if (isObject(sources)) {
        for (const key in sources) {
            if (isObject(sources[key])) {
                if (!isObject(obj[key])) {
                    obj[key] = {};
                }
                mixin(obj[key], sources[key]);
            } else {
                obj[key] = sources[key];
            }
        }
    }

    return obj;
}

export function merge(target, source) {
    const copyObj = {},
        copyFuns = {};

    for (const key in target) {
        if (!isFunction(target[key])) {
            copyObj[key] = target[key];
        } else {
            copyFuns[key] = target[key];
        }
    }
    /*eslint-disable */
    const newObj = mixin(JSON.parse(JSON.stringify(copyObj)), source);
    /*eslint-enable */
    for (const key in copyFuns) {
        newObj[key] = copyFuns[key];
    }

    return newObj;
}

export function throttle(fn, time, context) {
    var lock, args, wrapperFn, later;

    later = function() {
        // reset lock and call if queued
        lock = false;
        if (args) {
            wrapperFn.apply(context, args);
            args = false;
        }
    };

    wrapperFn = function() {
        if (lock) {
            // called too soon, queue to call later
            args = arguments;

        } else {
            // call and lock until later
            fn.apply(context, arguments);
            setTimeout(later, time);
            lock = true;
        }
    };

    return wrapperFn;
}

export function formatNum(num, digits) {
    var pow = Math.pow(10, (digits === undefined ? 6 : digits));
    return Math.round(num * pow) / pow;
}

export function guid(isShort) {
    const s = (isShort ? 'yxxxxxxyxx' : 'xxxxxxxx-xxxx-yxxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);

        return v.toString(16);
    });

    return s.toLowerCase();
}

export function getObjectFromArray(arr, key, value, index) {
    // return arr.filter((i) => i[key] === value)[0];
    if (!arr || !arr.length || !key) return;
    for (let i = 0, len = arr.length; i < len; i++) {
        if (arr[i][key] && arr[i][key] === value) {
            return index ? i : arr[i];
        }
    }
    return undefined;
}

export function removeObjectFromArray(arr, key, value) {
    for (let i = 0, len = arr.length; i < len; i++) {
        if ((value !== undefined && arr[i][key] === value) || (value === undefined && arr[i] === key)) {
            return arr.splice(i, 1);
        }
    }

    return [];
}

export function measureTextWidth(str, options) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    options = extend({
        style: 'normal',
        variant: 'normal',
        weight: 'normal',
        size: 'medium',
        family: 'sans-serif',
        align: 'start',
        baseline: 'alphabetic'
    }, options);
    const { style, variant, weight, family, align, baseline } = options;
    let size = options.size;
    if (isNumber(size)) size = size + 'px';
    context.font = `${style} ${variant} ${weight} ${size} ${family}`
    context.textAlign = align;
    context.textBaseline = baseline;
    return context.measureText(str).width;
}

export function bindAll(fns, context) {
    fns.forEach((fn) => {
        if (!context[fn]) { return; }
        context[fn] = context[fn].bind(context);
    });
}