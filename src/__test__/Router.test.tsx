// LICENSE : MIT
"use strict";
import * as React from "react";
import { render } from "react-dom";
import { Router, Route } from "../";

describe("Router", () => {
    describe("when `path` match `<Route pattern>`", () => {
        it("should call `onMatch` handler", () => {
            const div = document.createElement("div");
            const onMath = jest.fn();
            render(
                <Router currentPath="/">
                    <Route pattern="/" onMatch={onMath} />
                </Router>,
                div,
                () => {
                    expect(onMath).toHaveBeenCalledTimes(1);
                }
            );
        });
        it("`onMatch` handler can receive :param", () => {
            const div = document.createElement("div");
            const onMath = jest.fn();
            render(
                <Router currentPath="/42/add">
                    <Route pattern="/:id/:action" onMatch={onMath} />
                </Router>,
                div,
                () => {
                    expect(onMath).toHaveBeenCalledTimes(1);
                    expect(onMath).toHaveBeenLastCalledWith({ id: "42", action: "add" });
                }
            );
        });
    });
    describe("when `path` match multiple `<Route pattern>`", () => {
        it("should call either `onMatch` handler", () => {
            const div = document.createElement("div");
            const onMatchA = jest.fn();
            const onMatchB = jest.fn();
            render(
                <Router currentPath="/path/both/A">
                    <Route pattern="/path/both/A" onMatch={onMatchA} />
                    <Route pattern="/path/both/B" onMatch={onMatchB} />
                </Router>,
                div,
                () => {
                    expect(onMatchA.mock.calls[0]).toEqual([{}]);
                    expect(onMatchB).not.toHaveBeenCalled();
                }
            );
        });
    });
    describe("when `path` is not match any `<Route pattern>`", () => {
        it("should call * `onMatch` handler", () => {
            const div = document.createElement("div");
            const onMatchAny = jest.fn();
            render(
                <Router currentPath="/not/match/path">
                    <Route pattern="/a" onMatch={() => {}} />
                    <Route pattern="/b" onMatch={() => {}} />
                    <Route pattern="/b/c" onMatch={() => {}} />
                    <Route pattern="*" onMatch={onMatchAny} />
                </Router>,
                div,
                () => {
                    expect(onMatchAny).toHaveBeenCalledTimes(1);
                }
            );
        });
    });
});
