"use strict";
import * as React from "react";
import { ReactElement } from "react";
import { History, Location } from "history";
import { cleanPath, normalizeRoute } from "./path-util";
import { RouteProps } from "./Route";

const enroute = require("enroute");

export interface RouterProps {
    history: History;
    currentPath: string;
    onHistoryChange?: (location: Location) => void;
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
    private unlisten?: () => void;

    constructor(args: RouterProps) {
        super(args);
        /**
         * Routing mapping object for enroute
         * @type {Object.<string, function>}
         */
        this.routes = {};
        // `<Route pattern="" onMatch=fn>`
        // create `this.routes` object
        this.addRoutes(this.props.children);
        // run routing
        // https://github.com/lapwinglabs/enroute
        this.router = enroute(this.routes);
        // when the history is change, run routing
        this.unlisten = this.props.history.listen(location => {
            if (typeof this.props.onHistoryChange === "function") {
                this.props.onHistoryChange(location);
            }
            this.router(location.pathname);
        });
    }

    componentDidMount() {
        // At first time, run routing
        this.router(this.props.currentPath);
    }

    componentDidUpdate() {
        this.updateRoutingPath(this.props.currentPath);
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
     * Push history state when actually change`path`
     * @param {string|undefined} path
     * @private
     */
    private updateRoutingPath(path?: string) {
        if (!path) {
            return;
        }
        if (path.length === 0) {
            return;
        }
        // same path is ignored
        const location = this.props.history.location;
        if (location.pathname === path) {
            return;
        }
        this.props.history.push(path);
    }

    /**
     * Add `<Route>`s to `<Router />`
     * @param {Object[]} routes
     * @param {Object} [parent]
     * @private
     */
    private addRoutes(routes?: ReactElement<RouteProps> | ReactElement<RouteProps>[], parent?: any) {
        if (!routes) {
            return;
        }
        React.Children.forEach(routes, route => this.addRoute(route as ReactElement<RouteProps>, parent));
    }

    /**
     * Add `<Route>`
     * @param {Object} routeElement
     * @param {Object} [parent]
     * @private
     */
    private addRoute(routeElement: ReactElement<RouteProps>, parent?: ReactElement<RouteProps>) {
        const { pattern, onMatch, children } = routeElement.props;
        const route = normalizeRoute(pattern, parent);
        if (children) {
            this.addRoutes(children, { route });
        }
        // https://github.com/lapwinglabs/enroute
        const routingHandler = (args: any, _sharedProps: any) => {
            onMatch(args);
        };
        (routingHandler as any).displayName = pattern;
        this.routes[cleanPath(route)] = routingHandler;
    }
}
