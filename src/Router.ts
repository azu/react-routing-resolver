"use strict";
import * as React from "react";
import { ReactElement, ReactNode } from "react";
import { History, Location } from "history";
import { cleanPath, normalizeRoute } from "./path-util";
import { isRoute, RouteProps } from "./Route";

const enroute = require("enroute");

export interface RouterProps {
    history: History;
    children: React.ReactNode | React.ReactNode[];
}

/**
 * Router is parent component
 */
export class Router extends React.PureComponent<RouterProps> {
    private routes: {
        [index: string]: (...args: any[]) => void;
    };
    private renderRoutes: {
        [index: string]: (...args: any[]) => ReactNode | null;
    };
    private router: (pathname: string) => void;
    private renderRouter: (pathname: string) => ReactNode | null;
    private unlisten?: () => void;
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
        this.unlisten = this.props.history.listen((location: Location) => {
            this.router(location.pathname);
            // update render for current location
            this.forceUpdate();
        });
    }

    componentDidMount() {
        // At first time, run routing
        const { location } = this.props.history;
        this.router(location.pathname);
    }

    componentWillUnmount() {
        if (this.unlisten) {
            this.unlisten();
        }
    }

    render() {
        const { location } = this.props.history;
        return this.renderRouter(location.pathname);
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
        if (render === undefined && onMatch === undefined) {
            throw new Error(`The <Route pattern="${pattern}" /> must have either one of onMatch or render props.`);
        }
        const route = normalizeRoute(pattern, parent);
        if (children) {
            this.addRoutes(children, { route });
        }
        // https://github.com/lapwinglabs/enroute
        const routingHandler = (args: any, _sharedProps: any) => {
            if (onMatch) {
                onMatch(args);
            }
        };
        (routingHandler as any).displayName = pattern;
        // render routing
        const renderHandler = (args: any, _sharedProps: any) => {
            if (render) {
                return render(args);
            } else {
                return null;
            }
        };
        const cleanedPath = cleanPath(route);
        this.routes[cleanedPath] = routingHandler;
        this.renderRoutes[cleanedPath] = renderHandler;
    }
}
