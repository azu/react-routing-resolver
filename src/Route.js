'use strict';
import React from 'react';
export const routeType = React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.element
]);
/**
 * <Route /> only work under the <Router/>
 * Because, <Route /> refer to context.
 */
export default class Route extends React.Component {
    static propTypes = {
        pattern: React.PropTypes.string.isRequired,
        onMatch: React.PropTypes.func.isRequired
    };

    render() {
        return null;
    }
}
