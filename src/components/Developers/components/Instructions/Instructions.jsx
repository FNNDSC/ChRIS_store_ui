import React from 'react';
import './Instructions.css';
import BashLine from '../BashLine/BashLine';

const Instructions = () => (
  <div className="instructions">
    <div className="row no-flex">
      <h1 className="instructions-header">
        Get Started - 4 Simple Steps
        {' '}
        <a className="instructions-source" href="http://bit.ly/2KghHdY">[source]</a>
      </h1>
      <div className="instructions-steps">
        <div className="instructions-step">
          <div className="instructions-number">
            Step 1
            <sub>Setting up the environment</sub>
          </div>
          <div className="instructions-body">
            <h3>
              Create a
              {' '}
              <strong>Python3</strong>
              {' '}
              virtual environment for
              your plugin apps and activate it.
            </h3>
            <h3>
              Install the latest Cookiecutter in
              {' '}
              <pre>chrisapp_env</pre>
              {' '}
              if you haven
              &apos;
              t installed it yet:
            </h3>
            <BashLine command="pip install -U cookiecutter" />
            <h3>
              Generate a ChRIS plugin app project:
            </h3>
            <BashLine command="cookiecutter https://github.com/FNNDSC/cookiecutter-chrisapp.git" />
            <h3>
              <strong>More information:</strong>
              <ul>
                <li>
                  <a
                    href="http://bit.ly/2Iih52m"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Creating the python virtual environment.
                  </a>
                </li>
                <li>
                  <a
                    href="http://bit.ly/2KghHdY"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Generating a ChRIS plugin project.
                  </a>
                </li>
              </ul>
            </h3>
          </div>
        </div>
        <div className="instructions-step">
          <div className="instructions-number">
            Step 2
            <sub>Creating a git repository</sub>
          </div>
          <div className="instructions-body">
            <h3>
              Create a new repository on
              {' '}
              <a href="https://github.com">https://github.com</a>
              <strong>/your_github_username</strong>
              {' '}
              with the same name as the
              app project directory generated by the previous cookiecutter
              command.
            </h3>
            <h3>
              Make the repository public.
            </h3>
            <h3>
              Don’t initialize the repository with a README, a license or
              a .gitignore file.
            </h3>
            <h3>
              Change the current working directory to the app project and
              initialize this local directory as a Git repository:
            </h3>
            <BashLine command="git init" />
          </div>
        </div>
        <div className="instructions-step">
          <div className="instructions-number">
            Step 3
            <sub>Push to git repository</sub>
          </div>
          <div className="instructions-body">
            <h3>
              Add and commit the files in the local repository:
            </h3>
            <BashLine command="git add ." />
            <BashLine
              command='git commit -m "First commit"'
              style={{ marginTop: 0 }}
            />
            <h3>
              Add the URL for the remote Github repository created
              in
              {' '}
              <pre>step 2</pre>
              {' '}
              where your local repository will be pushed:
            </h3>
            <BashLine command="git remote add origin **remote_Github_repository_URL** (eg. https://github.com/FNNDSC/pl-neuproseg.git)" />
            <BashLine command="git remote -v" style={{ marginTop: 0 }} />
            <h3>
              Push the changes in your local repository to GitHub:
            </h3>
            <BashLine command="git push origin master" />
          </div>
        </div>
        <div className="instructions-step">
          <div className="instructions-number">
            Step 4
            <sub>Add to Docker Hub</sub>
          </div>
          <div className="instructions-body">
            <h3>
              Create a new automated build and repository on your
              {' '}
              <a href="https://dockr.ly/2K2pnRF">Docker Hub</a>
              {' '}
              account.
            </h3>
            <h3>
              Once you log in, click the Create button in the header and select
              Automated Build from the drop-down menu. The website will walk you through
              setting up the automated build.
            </h3>
            <h3>
              Next, when prompted for the GitHub repository that you’d like to
              use for the automated build select the repository that you
              just created.
            </h3>
            <br />
            <h3>
              For more information on Automated Builds, visit the
              {' '}
              <a href="https://dockr.ly/2tmNDDz">Docker build documentation</a>
              .
            </h3>
            <h3>
              Modify
              {' '}
              <pre>requirements.txt</pre>
              ,
              {' '}
              <pre>Dockerfile</pre>
              {' '}
              and the
              Python code with the proper versions of Python dependencies and
              libraries and push your changes to Github.
            </h3>
            <h3>
              Look at this
              {' '}
              <a href="http://bit.ly/2yzbRzF">
                simple
                <strong>fs</strong>
                {' '}
                plugin
              </a>
              {' '}
              or this
              {' '}
              <a href="http://bit.ly/2KbHosS">
                simple
                <strong>ds</strong>
                {' '}
                plugin
              </a>
              {' '}
              for guidance on getting started with your ChRIS plugin.
            </h3>
          </div>
        </div>
        <div className="instructions-step">
          <div className="instructions-number">
            Conclusion
            <sub>Extra resources</sub>
          </div>
          <div className="instructions-body">
            <h3>
              Once you
              &apos;
              ve developed and properly tested your plugin app
              consult the
              {' '}
              <a href="http://bit.ly/2ltTJ0w">wiki</a>
              {' '}
              to learn how to register it to
              ChRIS.
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Instructions;
