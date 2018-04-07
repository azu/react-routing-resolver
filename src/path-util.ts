// LICENSE : MIT
"use strict";
import { ReactElement } from "react";
import { RouteProps } from "./Route";

/**
 * Normalize route based on the parent.
 * @param {string} path
 * @param {Object} [parent]
 * @returns {string}
 */
export function normalizeRoute(path: string, parent?: ReactElement<RouteProps>) {
    // "/" signifies an absolute route
    if (path[0] === '/') {
        return path;
    }
    if (parent === null || parent === undefined) {
        return path;
    }
    // no need for a join
    return `${parent.props.path}/${path}`; // join
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
