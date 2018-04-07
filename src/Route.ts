'use strict';
import * as React from 'react';

export interface RouteProps {
    pattern: string;
    onMatch: (...args: any[]) => void;
}

/**
 * <Route /> only work under the <Router/>
 * Because, <Route /> refer to context.
 */
export default class Route extends React.Component<RouteProps> {
    render() {
        return null;
    }
}
