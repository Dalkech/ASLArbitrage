/**
 * @jest-environment jsdom
 */

import { reactive } from '../../src/ts/core';

describe('data-class-binding - initial render', () => {
    test('applies trueClass when condition is true at init', () => {
        document.body.innerHTML = `<div id="el" data-class-binding="score >= 10 ? 'winning' : 'losing'"></div>`;
        reactive({ score: 15 });
        expect(document.getElementById('el')!.classList.contains('winning')).toBe(true);
        expect(document.getElementById('el')!.classList.contains('losing')).toBe(false);
    });

    test('applies falseClass when condition is false at init', () => {
        document.body.innerHTML = `<div id="el" data-class-binding="score >= 10 ? 'winning' : 'losing'"></div>`;
        reactive({ score: 5 });
        expect(document.getElementById('el')!.classList.contains('losing')).toBe(true);
        expect(document.getElementById('el')!.classList.contains('winning')).toBe(false);
    });
});

describe('data-class-binding - reactivity', () => {
    test('updates class when property changes from false to true condition', () => {
        document.body.innerHTML = `<div id="el" data-class-binding="score >= 10 ? 'winning' : 'losing'"></div>`;
        const state = reactive({ score: 0 });
        state.score = 15;
        expect(document.getElementById('el')!.classList.contains('winning')).toBe(true);
        expect(document.getElementById('el')!.classList.contains('losing')).toBe(false);
    });

    test('updates class when property changes from true to false condition', () => {
        document.body.innerHTML = `<div id="el" data-class-binding="score >= 10 ? 'winning' : 'losing'"></div>`;
        const state = reactive({ score: 15 });
        state.score = 5;
        expect(document.getElementById('el')!.classList.contains('losing')).toBe(true);
        expect(document.getElementById('el')!.classList.contains('winning')).toBe(false);
    });

    test('does not affect element when unrelated property changes', () => {
        document.body.innerHTML = `<div id="el" data-class-binding="score >= 10 ? 'winning' : 'losing'"></div>`;
        const state = reactive({ score: 15, other: 0 });
        state.other = 99;
        expect(document.getElementById('el')!.classList.contains('winning')).toBe(true);
    });
});

describe('data-class-binding - operators', () => {
    test('> strict greater than', () => {
        document.body.innerHTML = `<div id="el" data-class-binding="score > 10 ? 'yes' : 'no'"></div>`;
        const state = reactive({ score: 10 });
        expect(document.getElementById('el')!.classList.contains('no')).toBe(true);
        state.score = 11;
        expect(document.getElementById('el')!.classList.contains('yes')).toBe(true);
    });

    test('< strict less than', () => {
        document.body.innerHTML = `<div id="el" data-class-binding="score < 10 ? 'yes' : 'no'"></div>`;
        const state = reactive({ score: 10 });
        expect(document.getElementById('el')!.classList.contains('no')).toBe(true);
        state.score = 9;
        expect(document.getElementById('el')!.classList.contains('yes')).toBe(true);
    });

    test('<= less than or equal', () => {
        document.body.innerHTML = `<div id="el" data-class-binding="score <= 10 ? 'yes' : 'no'"></div>`;
        const state = reactive({ score: 10 });
        expect(document.getElementById('el')!.classList.contains('yes')).toBe(true);
        state.score = 11;
        expect(document.getElementById('el')!.classList.contains('no')).toBe(true);
    });

    test('== loose equality', () => {
        document.body.innerHTML = `<div id="el" data-class-binding="score == 0 ? 'zero' : 'nonzero'"></div>`;
        const state = reactive({ score: 0 });
        expect(document.getElementById('el')!.classList.contains('zero')).toBe(true);
        state.score = 1;
        expect(document.getElementById('el')!.classList.contains('nonzero')).toBe(true);
    });

    test('!= loose inequality', () => {
        document.body.innerHTML = `<div id="el" data-class-binding="score != 0 ? 'nonzero' : 'zero'"></div>`;
        const state = reactive({ score: 1 });
        expect(document.getElementById('el')!.classList.contains('nonzero')).toBe(true);
        state.score = 0;
        expect(document.getElementById('el')!.classList.contains('zero')).toBe(true);
    });
});

describe('data-class-binding - value types', () => {
    test('compares against a string literal', () => {
        document.body.innerHTML = `<div id="el" data-class-binding="status == 'active' ? 'green' : 'grey'"></div>`;
        const state = reactive({ status: 'active' });
        expect(document.getElementById('el')!.classList.contains('green')).toBe(true);
        state.status = 'inactive';
        expect(document.getElementById('el')!.classList.contains('grey')).toBe(true);
    });

    test('compares against a boolean literal', () => {
        document.body.innerHTML = `<div id="el" data-class-binding="flag == true ? 'on' : 'off'"></div>`;
        const state = reactive({ flag: true });
        expect(document.getElementById('el')!.classList.contains('on')).toBe(true);
        state.flag = false;
        expect(document.getElementById('el')!.classList.contains('off')).toBe(true);
    });
});

describe('data-class-binding - multiple rules', () => {
    test('applies independent rules on the same element', () => {
        document.body.innerHTML = `
            <div id="el" data-class-binding="
                score >= 10 ? 'winning' : 'losing';
                score == 0  ? 'zero'   : '';">
            </div>`;
        const state = reactive({ score: 0 });
        expect(document.getElementById('el')!.classList.contains('losing')).toBe(true);
        expect(document.getElementById('el')!.classList.contains('zero')).toBe(true);
        state.score = 10;
        expect(document.getElementById('el')!.classList.contains('winning')).toBe(true);
        expect(document.getElementById('el')!.classList.contains('zero')).toBe(false);
    });
});
