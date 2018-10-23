# ChRIS_store_ui

UI for the ChRIS Store.

![Homepage](../assets/home.png?raw=true)

![License][license-badge]
![Last Commit][last-commit-badge]
[![Stars][stars-badge]][repo-link]
[![Forks][forks-badge]][repo-link]

## Installation

```bash
$> git clone https://github.com/FNNDSC/ChRIS_store_ui
$> cd ChRIS_store_ui
$> yarn install
```

## Serve

```bash
$> yarn build
$> yarn serve
```

## Development and testing

### JavaScript package manager prerequisite

* [yarn][yarn-link]

Open a terminal in the directory of this README file

### ChRIS Store server prerequisite

[Click here][chris-store] for instructions on how to setup the ChRIS Store

### Commands

Install dependencies

```bash
$> yarn install
```

Start web server in watch mode (used for developing)

```bash
$> yarn start
```

Start tests in watch mode

```bash
$> yarn test
```

### Precommit

Before each commit, a precommit script is run automatically to ensure all tests pass and all JavaScript code follows the [Airbnb style guide][airbnb-style]

To do this step manually, run `yarn precommit` after staging files

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details

[repo-link]: https://github.com/FNNDSC/ChRIS_store_ui
[yarn-link]: https://yarnpkg.com/
[chris-store]: https://github.com/FNNDSC/chris_store#preconditions
[airbnb-style]: https://github.com/airbnb/javascript
[license-badge]: https://img.shields.io/github/license/fnndsc/chris_store_ui.svg
[stars-badge]: https://img.shields.io/github/stars/fnndsc/chris_store_ui.svg?style=social&label=Stars
[last-commit-badge]: https://img.shields.io/github/last-commit/fnndsc/chris_store_ui.svg
[forks-badge]: https://img.shields.io/github/forks/fnndsc/chris_store_ui.svg?style=social&label=Fork