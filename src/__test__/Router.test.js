// LICENSE : MIT
"use strict";
import assert from 'assert'
import React from 'react'
import Router from '../Router'
import Route from '../Route'
import {render} from 'react-dom'

describe('Router', () => {
    describe("when `path` match `<Route pattern>`", () => {
        it('should call `onMatch` handler', () => {
            const div = document.createElement('div');
            const onMath = () => {
                onMath.isCalled = true;
            };
            render((
                <Router path="/">
                    <Route pattern="/" onMatch={onMath}/>
                </Router>
            ), div, () => {
                assert(onMath.isCalled);
            });
        });
        it('`onMatch` handler can receive :param', () => {
            const div = document.createElement('div');
            const onMath = (param) => {
                onMath.isCalled = true;
                onMath.param = param;
            };
            render((
                <Router path="/42/add">
                    <Route pattern="/:id/:action" onMatch={onMath}/>
                </Router>
            ), div, () => {
                assert(onMath.isCalled);
                assert.deepEqual(onMath.param, {id: "42", action: "add"});
            });
        });
    });
    describe("when `path` match multiple `<Route pattern>`", () => {
        it('should call either `onMatch` handler', () => {
            const div = document.createElement('div');
            const onMatchA = () => {
                onMatchA.isCalled = true;
            };
            const onMatchB = () => {
                onMatchB.isCalled = true;
            };
            render((
                <Router path="/path/both/A">
                    <Route pattern="/path/both/A" onMatch={onMatchA}/>
                    <Route pattern="/path/both/B" onMatch={onMatchB}/>
                </Router>
            ), div, () => {
                assert(onMatchA.isCalled, "A");
                assert(onMatchB.isCalled === undefined, "B");
            });
        });
    });
    describe("when `path` is not match any `<Route pattern>`", () => {
        it('should call * `onMatch` handler', () => {
            const div = document.createElement('div');
            const onMatchAny = () => {
                onMatchAny.isCalled = true;
            };
            render((
                <Router path="/not/match/path">
                    <Route pattern="/a" onMatch={()=>{}}/>
                    <Route pattern="/b" onMatch={()=>{}}/>
                    <Route pattern="/b/c" onMatch={()=>{}}/>
                    <Route pattern="*" onMatch={onMatchAny}/>
                </Router>
            ), div, () => {
                assert(onMatchAny.isCalled, "*");
            });
        });
    });
});