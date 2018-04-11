// LICENSE : MIT
"use strict";
import * as React from "react";
import { render } from "react-dom";
import { Router, Route } from "../";
import { History } from "history";
import createHistory from "history/createMemoryHistory";

let history: History;
describe("Router", () => {
    beforeEach(() => {
        history = createHistory();
    });
    describe("when `currentPath` match `<Route pattern>`", () => {
        it("should call `onMatch` handler", () => {
            const div = document.createElement("div");
            const onMath = jest.fn();
            render(
                <Router currentPath="/" history={history}>
                    <Route pattern="/" onMatch={onMath} />
                </Router>,
                div,
                () => {
                    expect(onMath).toHaveBeenCalledTimes(1);
                }
            );
        });
        it("should call `onNext` handler when first handler push hisotry", () => {
            const div = document.createElement("div");
            const onFirst = () => {
                history.push("/next");
            };
            const onNext = jest.fn();
            render(
                <Router currentPath={"/first"} history={history}>
                    <Route pattern="/first" onMatch={onFirst} />
                    <Route pattern="/next" onMatch={onNext} />
                </Router>,
                div,
                () => {
                    expect(onNext).toHaveBeenCalledTimes(1);
                }
            );
        });
        it("`onMatch` handler can receive :param", () => {
            const div = document.createElement("div");
            const onMath = jest.fn();
            render(
                <Router currentPath="/42/add" history={history}>
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
    describe("when `currentPath` match multiple `<Route pattern>`", () => {
        it("should call either `onMatch` handler", () => {
            const div = document.createElement("div");
            const onMatchA = jest.fn();
            const onMatchB = jest.fn();
            render(
                <Router currentPath="/path/both/A" history={history}>
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
    describe("when `currentPath` is not match any `<Route pattern>`", () => {
        it("should call * `onMatch` handler", () => {
            const div = document.createElement("div");
            const onMatchAny = jest.fn();
            render(
                <Router currentPath="/not/match/path" history={history}>
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
