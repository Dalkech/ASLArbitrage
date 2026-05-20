/**
 * @jest-environment jsdom
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import Score from '../../../src/components/score/score';

const distHtml = readFileSync(resolve(__dirname, '../../../dist/src/index.html'), 'utf-8');
const bodyContent = distHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? '';

describe('Score - rendered HTML structure', () => {
    beforeEach(() => {
        document.body.innerHTML = bodyContent;
    });

    test('renders #score container', () => {
        expect(document.getElementById('score')).not.toBeNull();
    });

    test('renders h1 heading "Score"', () => {
        expect(document.querySelector('#score h1')?.textContent?.trim()).toBe('Score');
    });

    test('renders #msg with data-binding="msg"', () => {
        const msg = document.getElementById('msg');
        expect(msg).not.toBeNull();
        expect(msg?.getAttribute('data-binding')).toBe('msg');
    });

    test('msg has isActive and isDisabled class-binding rules', () => {
        const binding = document.getElementById('msg')?.getAttribute('data-class-binding') ?? '';
        expect(binding).toMatch(/isActive\s*==\s*true\s*\?/);
        expect(binding).toMatch(/isDisabled\s*==\s*true\s*\?/);
    });

    test('renders active indicator paragraph', () => {
        expect(document.querySelector('p[data-class-binding*="isActive == true"]')).not.toBeNull();
    });

    test('renders inactive indicator paragraph', () => {
        expect(document.querySelector('p[data-class-binding*="isActive == false"]')).not.toBeNull();
    });

    test('renders change-msg button', () => {
        expect(document.querySelector('[data-binding="on-click-change-msg"]')).not.toBeNull();
    });

    test('renders toggle-active button', () => {
        expect(document.querySelector('[data-binding="toggle-active"]')).not.toBeNull();
    });

    test('renders toggle-disabled button', () => {
        expect(document.querySelector('[data-binding="toggle-disabled"]')).not.toBeNull();
    });
});

describe('Score - initial state', () => {
    beforeEach(() => {
        document.body.innerHTML = bodyContent;
        new Score();
    });

    test('sets msg text to "Hello"', () => {
        expect(document.getElementById('msg')?.textContent).toBe('Hello');
    });

    test('applies "inactive" class to msg when isActive is false', () => {
        expect(document.getElementById('msg')?.classList.contains('inactive')).toBe(true);
    });

    test('does not apply "disabled" class to msg when isDisabled is false', () => {
        expect(document.getElementById('msg')?.classList.contains('disabled')).toBe(false);
    });

    test('active indicator has "none" class when isActive is false', () => {
        const p = document.querySelector('p[data-class-binding*="isActive == true"]') as HTMLElement;
        expect(p?.classList.contains('none')).toBe(true);
    });

    test('inactive indicator does not have "none" class when isActive is false', () => {
        const p = document.querySelector('p[data-class-binding*="isActive == false"]') as HTMLElement;
        expect(p?.classList.contains('none')).toBe(false);
    });
});

describe('Score - msg toggling', () => {
    beforeEach(() => {
        document.body.innerHTML = bodyContent;
        new Score();
    });

    test('click change-msg sets msg to "Goodbye"', () => {
        (document.querySelector('[data-binding="on-click-change-msg"]') as HTMLButtonElement).click();
        expect(document.getElementById('msg')?.textContent).toBe('Goodbye');
    });

    test('second click on change-msg sets msg back to "Hello"', () => {
        const btn = document.querySelector('[data-binding="on-click-change-msg"]') as HTMLButtonElement;
        btn.click();
        btn.click();
        expect(document.getElementById('msg')?.textContent).toBe('Hello');
    });
});

describe('Score - class bindings', () => {
    let score: Score;

    beforeEach(() => {
        document.body.innerHTML = bodyContent;
        score = new Score();
    });

    test('toggle-active removes "inactive" class from msg', () => {
        (document.querySelector('[data-binding="toggle-active"]') as HTMLButtonElement).click();
        expect(document.getElementById('msg')?.classList.contains('inactive')).toBe(false);
    });

    test('toggle-active twice re-adds "inactive" class to msg', () => {
        const btn = document.querySelector('[data-binding="toggle-active"]') as HTMLButtonElement;
        btn.click();
        btn.click();
        expect(document.getElementById('msg')?.classList.contains('inactive')).toBe(true);
    });

    test('toggle-active shows active indicator and hides inactive indicator', () => {
        (document.querySelector('[data-binding="toggle-active"]') as HTMLButtonElement).click();
        const active = document.querySelector('p[data-class-binding*="isActive == true"]') as HTMLElement;
        const inactive = document.querySelector('p[data-class-binding*="isActive == false"]') as HTMLElement;
        expect(active?.classList.contains('none')).toBe(false);
        expect(inactive?.classList.contains('none')).toBe(true);
    });

    test('toggle-active twice restores original indicator visibility', () => {
        const btn = document.querySelector('[data-binding="toggle-active"]') as HTMLButtonElement;
        btn.click();
        btn.click();
        const active = document.querySelector('p[data-class-binding*="isActive == true"]') as HTMLElement;
        const inactive = document.querySelector('p[data-class-binding*="isActive == false"]') as HTMLElement;
        expect(active?.classList.contains('none')).toBe(true);
        expect(inactive?.classList.contains('none')).toBe(false);
    });

    test('toggle-disabled adds "disabled" class to msg', () => {
        (document.querySelector('[data-binding="toggle-disabled"]') as HTMLButtonElement).click();
        expect(document.getElementById('msg')?.classList.contains('disabled')).toBe(true);
    });

    test('toggle-disabled twice removes "disabled" class from msg', () => {
        const btn = document.querySelector('[data-binding="toggle-disabled"]') as HTMLButtonElement;
        btn.click();
        btn.click();
        expect(document.getElementById('msg')?.classList.contains('disabled')).toBe(false);
    });

    test('printScore throws "Method not implemented."', () => {
        expect(() => score.printScore()).toThrow('Method not implemented.');
    });
});
