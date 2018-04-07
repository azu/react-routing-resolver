'use strict';
import * as React from 'react';
import * as  PropTypes from "prop-types"
export const routeType = PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.element
]);
/**
 * <Route /> only work under the <Router/>
 * Because, <Route /> refer to context.
 */
export default class Route extends React.Component {
    static propTypes = {
        pattern: PropTypes.string.isRequired,
        onMatch: PropTypes.func.isRequired
    };

    render() {
        return null;
    }
}
