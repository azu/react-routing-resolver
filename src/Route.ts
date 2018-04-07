"use strict";
import * as React from "react";
import { ReactElement } from "react";

export interface RouteProps {
    // sub path
    path?: string;
    pattern: string;
    onMatch: (...args: any[]) => void;
    children?: ReactElement<RouteProps> | ReactElement<RouteProps>[];
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
