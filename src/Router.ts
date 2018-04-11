"use strict";
import * as React from "react";
import { ReactElement, ReactNode } from "react";
import { History, Location } from "history";
import { cleanPath, normalizeRoute } from "./path-util";
import { isRoute, RouteProps } from "./Route";

const enroute = require("enroute");

export interface RouterProps {
    history: History;
    currentPath: string;
    onHistoryChange?: (location: Location) => void;
    children: React.ReactNode | React.ReactNode[];
}

export interface RouterState {
    currentNode: ReactNode | null;
}

/**
 * Router is parent component
 */
export class Router extends React.Component<RouterProps, RouterState> {
    private routes: {
        [index: string]: (...args: any[]) => void;
    };
    private renderRoutes: {
        [index: string]: (...args: any[]) => void;
    };
    private router: (pathname: string) => void;
    private renderRouter: (pathname: string) => void;
    private unlisten?: () => void;

    state = {
        currentNode: null
    };

    constructor(args: RouterProps) {
        super(args);
        /**
         * Routing mapping object for enroute
         * @type {Object.<string, function>}
         */
        this.routes = {};
        this.renderRoutes = {};
        // `<Route pattern="" onMatch=fn>`
        // create `this.routes` object
        this.addRoutes(this.props.children);
        // run routing
        // https://github.com/lapwinglabs/enroute
        this.router = enroute(this.routes);
        this.renderRouter = enroute(this.renderRoutes);
        // when the history is change, run routing
        this.unlisten = this.props.history.listen(location => {
            if (typeof this.props.onHistoryChange === "function") {
                this.props.onHistoryChange(location);
            }
            this.router(location.pathname);
            this.renderRouter(location.pathname);
        });
    }

    componentDidMount() {
        // At first time, run routing
        this.router(this.props.currentPath);
        this.renderRouter(this.props.currentPath);
    }

    componentDidUpdate(prevProps: RouterProps) {
        if (this.props.currentPath !== prevProps.currentPath) {
            this.updateRoutingPath(this.props.currentPath);
        }
    }

    componentWillUnmount() {
        if (this.unlisten) {
            this.unlisten();
        }
    }

    // nope
    render() {
        return this.state.currentNode;
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
    private addRoutes(routes: React.ReactNode | React.ReactNode[], parent?: any) {
        if (!routes) {
            return;
        }
        React.Children.forEach(routes, route => {
            if (isRoute(route)) {
                this.addRoute(route, parent);
            }
        });
    }

    /**
     * Add `<Route>`
     * @param {Object} routeElement
     * @param {Object} [parent]
     * @private
     */
    private addRoute(routeElement: ReactElement<RouteProps>, parent?: ReactElement<RouteProps>) {
        const { pattern, onMatch, children, render } = routeElement.props;
        const route = normalizeRoute(pattern, parent);
        if (children) {
            this.addRoutes(children, { route });
        }
        // https://github.com/lapwinglabs/enroute
        const routingHandler = (args: any, _sharedProps: any) => {
            onMatch(args);
        };
        (routingHandler as any).displayName = pattern;
        const cleanedPath = cleanPath(route);
        this.routes[cleanedPath] = routingHandler;
        // render routing
        this.renderRoutes[cleanedPath] = (args: any, _sharedProps: any) => {
            if (render) {
                const currentNode = render(args);
                if (this.state.currentNode !== currentNode) {
                    this.setState({
                        currentNode: currentNode
                    });
                }
            } else {
                if (this.state.currentNode !== null) {
                    this.setState({
                        currentNode: null
                    });
                }
            }
        };
    }
}
