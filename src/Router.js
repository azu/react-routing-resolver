'use strict';
import React from 'react';
import PropTypes from "prop-types"
import assert from 'assert';
import createHistory from 'history/createBrowserHistory';
import enroute from 'enroute';
import {routeType} from './Route';
import {cleanPath, normalizeRoute} from './path-util';
/**
 * Router is parent component
 */
export default class Router extends React.Component {
    static propTypes = {
        // Current Routing path
        path: PropTypes.string.isRequired,
        // call the handler when the history is changed.
        // Timing: browser back, pushState, browser forward
        onHistoryChange: PropTypes.func,
        // children is a collection of <Route>
        children: PropTypes.oneOfType([
            routeType,
            PropTypes.arrayOf(routeType)
        ]).isRequired
    };

    constructor() {
        super();
        this.history = createHistory();
        /**
         * Routing mapping object for enroute
         * @type {Object.<string, function>}
         */
        this.routes = {};
        this.router = null;
    }


    componentWillReceiveProps(nextProps) {
        // When `path` is changed, change history
        this._updateRoutingPath(nextProps.path);
    }

    componentWillMount() {
        // `<Route pattern="" onMatch=fn>`
        // create `this.routes` object
        this._addRoutes(this.props.children);
        // run routing
        // https://github.com/lapwinglabs/enroute
        this.router = enroute(this.routes);
    }

    componentDidMount() {
        // At first time, run routing
        this.router(this.props.path);
        // when the history is change, run routing
        this.unlisten = this.history.listen((location) => {
            if (process.env.NODE_ENV === "development") {
                assert(typeof this.router === 'function', 'this.router should be initialized');
            }
            if (typeof this.props.onHistoryChange === 'function') {
                this.props.onHistoryChange(location);
            }
            this.router(location.pathname);
        });
    }

    componentWillUnmount() {
        this.unlisten();
    }

    // nope
    render() {
        return null;
    }


    /**
     * `path` が変更された時のみ history を変更する
     * @param {string|undefined} path
     * @private
     */
    _updateRoutingPath(path) {
        const hasNextPath = path !== undefined && path.length > 0;
        if (!hasNextPath) {
            return;
        }
        // same path is ignored
        if (this.history.pathname === path) {
            return;
        }
        this.history.push(path);
    }

    /**
     * Add `<Route>`s to `<Router />`
     * @param {Object[]} routes
     * @param {Object} [parent]
     * @private
     */
    _addRoutes(routes, parent) {
        React.Children.forEach(routes, (route) => this._addRoute(route, parent));
    }

    /**
     * Add `<Route>`
     * @param {Object} routeElement
     * @param {Object} [parent]
     * @private
     */
    _addRoute(routeElement, parent) {
        const {pattern, onMatch, children} = routeElement.props;
        const route = normalizeRoute(pattern, parent);
        if (children) {
            this._addRoutes(children, {route});
        }
        this.routes[cleanPath(route)] = onMatch;
    }
}
