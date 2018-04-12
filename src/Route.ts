"use strict";
import * as React from "react";
import { ReactElement, ReactNode } from "react";

export const isRoute = (node: any): node is ReactElement<RouteProps> => {
    return node && node.props && typeof node.props.pattern === "string";
};

export interface RouteProps {
    pattern: string;
    onMatch?: (...args: any[]) => any;
    render?: (...args: any[]) => ReactNode | null;
    children?: ReactElement<RouteProps> | ReactElement<RouteProps>[];
    // sub path
    path?: string;
}

/**
 * <Route /> only work under the <Router/>
 * Because, <Route /> refer to context.
 */
export class Route extends React.Component<RouteProps> {
    render() {
        return null;
    }
}
