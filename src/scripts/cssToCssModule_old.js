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

const pathToComponents = path.resolve(__dirname, '../components')
const arrayOfFiles = filesToChange(pathToComponents);

function convertFile(filePath) {
  fs.readFile(filePath, "utf8", (err, textData) => {
    const cssFileName = filePath.replace(".jsx", ".css");
    const cssModuleName = filePath.replace(".jsx", ".module.css");
    fs.rename(cssFileName, cssModuleName, () => {});
    let data = textData.replace(
      `import './${cssFileName.split("/").slice(-1)}'`,
      `import styles from './${cssModuleName.split("/").slice(-1)}'`
    );
    data = data.replace(/(?<=className=)".+?"/g, (classNames) => {
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
    });
    fs.writeFileSync(filePath, data, { encoding: "utf8", flag: "w" });
  });
}

arrayOfFiles.forEach(async (filePath) => convertFile(filePath));