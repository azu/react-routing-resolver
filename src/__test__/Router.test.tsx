// LICENSE : MIT
"use strict";
import * as React from "react";
import { render } from "react-dom";
import { Router, Route } from "../";
import { History } from "history";
import createHistory from "history/createMemoryHistory";

const createHistoryWithInitial = (initialPath: string): History => {
    return createHistory({
        initialEntries: [initialPath]
    });
};
describe("Router", () => {
    describe("when `currentPath` match `<Route pattern>`", () => {
        it("should call `onMatch` handler", () => {
            const history = createHistoryWithInitial("/");
            const div = document.createElement("div");
            const onMath = jest.fn();
            render(
                <Router history={history}>
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
            const history = createHistoryWithInitial("/first");
            const onFirst = () => {
                history.push("/next");
            };
            const onNext = jest.fn();
            render(
                <Router history={history}>
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
            const history = createHistoryWithInitial("/42/add");
            const div = document.createElement("div");
            const onMath = jest.fn();
            render(
                <Router history={history}>
                    <Route pattern="/:id/:action" onMatch={onMath} />
                </Router>,
                div,
                () => {
                    expect(onMath).toHaveBeenCalledTimes(1);
                    expect(onMath).toHaveBeenLastCalledWith({ id: "42", action: "add" });
                }
            );
        });

        it("`render` should render the node", () => {
            const history = createHistoryWithInitial("/view");
            const div = document.createElement("div");
            const onMath = jest.fn();
            render(
                <Router history={history}>
                    <Route pattern="/view" onMatch={onMath} render={() => <span>1</span>} />
                </Router>,
                div,
                () => {
                    expect(div.innerHTML).toEqual(`<span>1</span>`);
                }
            );
        });

        it("`render` should render the node when history is changed", () => {
            const history = createHistoryWithInitial("/first");
            const div = document.createElement("div");
            return new Promise(resolve => {
                render(
                    <Router history={history}>
                        <Route pattern="/first" render={() => <span>first</span>} />
                        <Route pattern="/final" render={() => <span>final</span>} />
                    </Router>,
                    div,
                    () => {
                        expect(div.innerHTML).toEqual(`<span>first</span>`);
                        resolve();
                    }
                );
            })
                .then(() => {
                    history.push("/final");
                })
                .then(() => {
                    expect(div.innerHTML).toEqual(`<span>final</span>`);
                });
        });
    });
    describe("when `currentPath` match multiple `<Route pattern>`", () => {
        it("should call either `onMatch` handler", () => {
            const history = createHistoryWithInitial("/path/both/A");
            const div = document.createElement("div");
            const onMatchA = jest.fn();
            const onMatchB = jest.fn();
            render(
                <Router history={history}>
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
            const history = createHistoryWithInitial("/not/match/path");

            const div = document.createElement("div");
            const onMatchAny = jest.fn();
            render(
                <Router history={history}>
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
