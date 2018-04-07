// LICENSE : MIT
"use strict";

/**
 * Normalize route based on the parent.
 * @param {string} path
 * @param {Object} [parent]
 * @returns {string}
 */
export function normalizeRoute(path: string, parent?: { route: string }) {
    // "/" signifies an absolute route
    if (path[0] === '/') {
        return path;
    }
    if (parent === null || parent === undefined) {
        return path;
    }
    // no need for a join
    return `${parent.route}/${path}`; // join
}

/**
 * Clean path by stripping subsequent "//"'s.
 * Without this the user must be careful when to use "/" or not, which leads
 * to bad UX.
 * @param {string} path
 * @returns {string}
 */
export function cleanPath(path: string) {
    return path.replace(/\/\//g, '/');
}
