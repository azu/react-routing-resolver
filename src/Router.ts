'use strict';
import * as React from 'react';
import { ReactElement } from 'react';
import * as assert from 'assert';
import { History } from "history";
import createHistory from 'history/createBrowserHistory';
import { cleanPath, normalizeRoute } from './path-util';
import { RouteProps } from "./Route";

const enroute = require('enroute');

export interface RouterProps {
    currentPath: string;
    onHistoryChange?: (arg: any) => void;
    children: ReactElement<RouteProps> | ReactElement<RouteProps>[];
}

/**
 * Router is parent component
 */
export class Router extends React.Component<RouterProps> {
    private routes: {
        [index: string]: (...args: any[]) => void;
    };
    private router: any;
    private history: History;
    private unlisten?: () => void;

    constructor(args: RouterProps) {
        super(args);
        this.history = createHistory();
        /**
         * Routing mapping object for enroute
         * @type {Object.<string, function>}
         */
        this.routes = {};
        // `<Route pattern="" onMatch=fn>`
        // create `this.routes` object
        this._addRoutes(this.props.children);
        // run routing
        // https://github.com/lapwinglabs/enroute
        this.router = enroute(this.routes);
    }


    componentWillReceiveProps(nextProps: RouterProps) {
        // When `path` is changed, change history
        this._updateRoutingPath(nextProps.currentPath);
    }

    componentDidMount() {
        // At first time, run routing
        this.router(this.props.currentPath);
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
        if (this.unlisten) {
            this.unlisten();
        }
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
    _updateRoutingPath(path?: string) {
        if (!path) {
            return;
        }
        if (path.length === 0) {
            return;
        }
        // same path is ignored
        const location = this.history.location;
        if (location.pathname === path) {
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
    _addRoutes(routes?: ReactElement<RouteProps> | ReactElement<RouteProps>[], parent?: any) {
        if (!routes) {
            return;
        }
        React.Children.forEach(routes, (route) => this._addRoute(route as ReactElement<RouteProps>, parent));
    }

    /**
     * Add `<Route>`
     * @param {Object} routeElement
     * @param {Object} [parent]
     * @private
     */
    _addRoute(routeElement: ReactElement<RouteProps>, parent?: ReactElement<RouteProps>) {
        const { pattern, onMatch, children } = routeElement.props;
        const route = normalizeRoute(pattern, parent);
        if (children) {
            this._addRoutes(children, { route });
        }
        // https://github.com/lapwinglabs/enroute
        const routingHandler = (args: any, _sharedProps: any) => {
            onMatch(args);
        };
        (routingHandler as any).displayName = pattern;
        this.routes[cleanPath(route)] = routingHandler;
    }
}
