# ![ChRIS logo](https://github.com/FNNDSC/ChRIS_ultron_backEnd/blob/master/docs/assets/logo_chris.png) ChRIS_store_ui

UI for the ChRIS Store.

![Homepage](../assets/home.png?raw=true)

![License][license-badge]
![Last Commit][last-commit-badge]
[![Stars][stars-badge]][repo-link]
[![Forks][forks-badge]][repo-link]


## Preconditions

### Install latest Docker. Currently tested platforms:
* ``Ubuntu 16.04+``
* ``MAC OS X 10.11+``
* ``Fedora 31+`` ([Additional instructions for Fedora](https://github.com/mairin/ChRIS_store/wiki/Getting-the-ChRIS-Store-to-work-on-Fedora))

### Optionally get the backend services up so you can fully test the UI against actual data
* Install latest ``Docker Compose``
* On a Linux machine make sure to add your computer user to the ``docker`` group

Then open a terminal and fire the backend services up:
```bash
$ git clone https://github.com/FNNDSC/ChRIS_store.git
$ cd ChRIS_store
$ ./make.sh up
```

You can later remove all the backend containers and release storage volumes with:
```bash
$ cd ChRIS_store
$ ./make.sh down
```


## Start UI development server

### Using ``node`` and ``yarn`` package manager directly on the metal

Open a new terminal and type:
```bash
$ git clone https://github.com/FNNDSC/ChRIS_store_ui.git
$ cd ChRIS_store_ui
$ yarn install
$ yarn start
```

### Using `docker`
Open a new terminal and type:
```bash
$ git clone https://github.com/FNNDSC/ChRIS_store_ui.git
$ cd ChRIS_store_ui
$ docker run --rm -it -v $(pwd):/home/localuser -p 3000:3000 -u $(id -u):$(id -g) --name chris_store_ui fnndsc/chris_store_ui:dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

#### Precommit

Before each commit, a precommit script is run automatically to ensure all tests pass and all JavaScript code follows the [Airbnb style guide][airbnb-style].

Please note that if you are using the ``docker`` commands then you need to run git inside the container. For instance open a new terminal and type:
```bash
$ docker exec -it chris_store_ui git status
```

## Notes:
1. Add .env.local, .env.local, .env.development.local, .env.test.local, .env.production.local file at root to change any local settings


## Additional Notes from Create React App:
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## Run the interactive tests

### Using ``node`` and ``yarn`` package manager directly on the metal

Open a new terminal and type:
```bash
$ yarn test
```

### Using `docker`

Open a new terminal and type:
```bash
$ docker exec -it chris_store_ui yarn test
```

Launches the test runner in the interactive watch mode.<br>

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.


## Build the ChRIS Store UI app for production

```bash
$ cd ChRIS_store_ui
$ docker build -t local/chris_store_ui .
```
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!


## Deploy and serve the ChRIS Store UI app

```bash
$ docker run --name chris_store_ui -p <desired port>:3000 -d local/chris_store_ui
```


## Development and deployment of the ChRIS Store UI directly on the metal

Consult the Wiki [here](https://github.com/FNNDSC/ChRIS_store_ui/wiki).


## Learn More

Interested in contributing? https://chrisproject.org/join-us

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details

[repo-link]: https://github.com/FNNDSC/ChRIS_store_ui
[airbnb-style]: https://github.com/airbnb/javascript
[license-badge]: https://img.shields.io/github/license/fnndsc/chris_store_ui.svg
[stars-badge]: https://img.shields.io/github/stars/fnndsc/chris_store_ui.svg?style=social&label=Stars
[last-commit-badge]: https://img.shields.io/github/last-commit/fnndsc/chris_store_ui.svg
[forks-badge]: https://img.shields.io/github/forks/fnndsc/chris_store_ui.svg?style=social&label=Fork
