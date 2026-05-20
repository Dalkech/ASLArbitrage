import Board from "../src/ts/board";

describe('Board tests', () => {
    test('PrintScore should return a warning "Score not implemented yet"', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn');

        new Board().printScore();

        expect(consoleWarnSpy).toHaveBeenCalledWith('Score not implemented yet');
    });
})