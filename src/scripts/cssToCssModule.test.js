import {convertCssString, convertCssClasses, convertSingleCssClass} from "./cssToCssModule";

describe('css module conversion script', () => {
    it('should work with one class', () => {
        const exampleData = '<div className="hello-world" />';
        const expected = "<div className={`${styles['hello-world']}`} />";
        const actual = convertCssClasses(exampleData, []);
        expect(actual).toBe(expected);
    });


    it('should work with muliple class names', () => {
        const exampleData = '"hello-world bottom-footer"';
        const expected = "{`${styles['hello-world']} ${styles['bottom-footer']}`}";
        const actual = convertCssString(exampleData, []);
        expect(actual).toBe(expected);
    });

    it('should not process blacklisted class names', () => {
        const exampleData = '<div className="hello-world bottom-footer" />';
        const expected = "<div className={`hello-world ${styles['bottom-footer']}`} />";
        const actual = convertCssClasses(exampleData, ['hello-world']);
        expect(actual).toBe(expected);
    });

    it('should not process multiple blacklisted classNames', () => {
        const exampleData = '"fa-file fa bottom-footer"';
        const expected = "{`fa-file fa ${styles['bottom-footer']}`}";
        const actual = convertCssString(exampleData, ['fa-file', 'fa']);
        expect(actual).toBe(expected);
    });

    it('should not process blacklisted classNames', () => {
        const exampleData = '"fa-file fa"';
        const expected = "{`fa-file fa`}";
        const actual = convertCssString(exampleData, ['fa-file', 'fa']);
        expect(actual).toBe(expected);
    });

    it('should be able to convert a single class', () => {
        const exampleData = '"bottom-footer"';
        const expected = "{`${styles['bottom-footer']}`}";
        const actual = convertCssString(exampleData, []);
        expect(actual).toBe(expected);
    });


    it('should be able to convert a single class', () => {
        const actual1 = convertSingleCssClass("hello-world", "styles");
        expect(actual1).toBe("styles['hello-world']");
        const actual2 = convertSingleCssClass("footer-text", "secondStyles");
        expect(actual2).toBe("secondStyles['footer-text']");
    });

});

