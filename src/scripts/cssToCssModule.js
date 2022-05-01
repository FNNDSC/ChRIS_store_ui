const fs = require("fs");
const path = require("path");

const blackListedClasses = [
    "row",
    "cards-pf",
    "pficon ",
    "pficon-info",
    "fa",
    "fa-database",
    "fa-file",
    "btn",
    "btn-large",
    "login-pf-signup",
    "text-light",
    "no-flex",
    "row-cards-pf",
    "container-fluid",
    "container-cards-pf",
    "pf-c-button",
    "pf-m-primary",
    "pf-m-link",
    "pf-c-button__icon",
    "pf-m-start",
    "fas",
    "fa-user",
];

const filesToChange = function (dirPath, fileList) {
    const files = fs.readdirSync(dirPath);

    let arrayOfFiles = fileList || [];

    files.forEach((file) => {
        if (fs.statSync(`${dirPath  }/${  file}`).isDirectory()) {
            arrayOfFiles = filesToChange(`${dirPath  }/${  file}`, arrayOfFiles);
        } else if (file.split(".").slice(-1)[0] === "jsx") {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });
    return arrayOfFiles;
};

// const pathToComponents = path.resolve(__dirname, '../src/components')
// const arrayOfFiles = filesToChange(pathToComponents);

/**
 * Converts .css to .module.css file format and CSS classes to use CSS module object syntax
 *
 * @param filePath path to the files to be changed
 * @return files converted to CSS module object syntax
 */
function convertFile(filePath) {
    fs.readFile(filePath, "utf8", (err, textData) => {
        const cssFileName = filePath.replace(".jsx", ".css");
        const cssModuleName = filePath.replace(".jsx", ".module.css");
        fs.rename(cssFileName, cssModuleName, () => {});
        let data = textData.replace(
            `import './${cssFileName.split("/").slice(-1)}'`,
            `import styles from './${cssModuleName.split("/").slice(-1)}'`
        );
        data = convertCssClasses(data, blackListedClasses);
        fs.writeFileSync(filePath, data, { encoding: "utf8", flag: "w" });
    });
}

/**
 * Convert all classes in a className to use CSS module object syntax.
 *
 * @param data string containing JSX file contents
 * @param blackListedClasses list of strings representing class names not to convert
 * @returns a classname using CSS module object syntax
 */
export function convertCssClasses(data, blackListedClasses) {
    return data.replace(/(?<=className=)".+?"/g, (classNames) => {
        const className = classNames.slice(1, -1).split(/[, ]+/);
        let res;
        if (className.length > 1) {
            res = "{`";
            className.forEach((cls, index) => {
                if (Number(index) !== 0) {
                    res += " ";
                }
                if (blackListedClasses.includes(cls)) {
                    res += cls;
                } else {
                    res += `\${styles['${cls}']}`;
                }
            });
            res += "`}";
        } else if (blackListedClasses.includes(className[0])) {
            res = `{\`${className[0]}\`}`;
        } else {
            res = "{`$";
            res += `{styles['${className[0]}']}`;
            res += "`}";
        }
        return res;
    });
}

/**
 * Convert all CSS classes to use object syntax as if they were imported from a CSS module.
 *
 * @param data string containing JSX file contents
 * @param blackListedClasses list of strings representing class names not to convert
 * @return data where CSS classes were changed to use CSS module object syntax
 */
export function processFile(data, blackListedClasses) {
    return data.replace(/(?<=className=)".+?"/g, );
}

/**
 * Convert a className to use CSS module syntax.
 *
 * @param className a class from the className of a JSX object
 * @param blackListedClasses list of strings representing class names not to convert
 * @returns className using CSS module syntax
 */
export function convertCssString(classNames, blackListedClasses) {
    const className = classNames.slice(1, -1).split(/[, ]+/);
    let res;
    if (className.length > 1) {
        res = "{`";
        className.forEach((cls, index) => {
            if (Number(index) !== 0) {
                res += " ";
            }
            if (blackListedClasses.includes(cls)) {
                res += cls;
            } else {
                res += `\${styles['${  cls  }']}`;
            }
        });
        res += "`}";
    } else if (blackListedClasses.includes(className[0])) {
        res = `{\`${  className[0]  }\`}`;
    } else {
        res = "{`$";
        res += `{styles['${className[0]}']}`;
        res += "`}";
    }
    return res;
}

/**
 * Convert a className to use CSS module syntax.
 *
 * @param className a class from the className of a JSX object
 * @param cssModuleName name of imported CSS module
 * @returns className using CSS module syntax
 */
export function convertSingleCssClass(className, cssModuleName) {
    return `${cssModuleName}['${className}']`
}


// arrayOfFiles.forEach(async (filePath) => convertFile(filePath));