import StoreClient from "@fnndsc/chrisstoreapi";
import { Form, Spinner } from "@patternfly/react-core";
import { validate } from "email-validator";
import _ from "lodash";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ChrisStore from "../../../../store/ChrisStore";
import Button from "../../../Button";
import FormInput from "../../../FormInput";
import "./DeveloperSignup.css";
import Notification from "../../../Notification";
import HttpApiCallError from "../../../../errors/HttpApiCallError";

/* inspired by https://github.com/Modernizr/Modernizr/blob/v3/feature-detects/touchevents.js */
const isTouchDevice = () => {
  if (
    "ontouchstart" in window ||
    (window.DocumentTouch && document instanceof window.DocumentTouch)
  ) {
    return true;
  }

  if (window.matchMedia) {
    const prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
    const query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join(
      ""
    );
    return window.matchMedia(query).matches;
  }

  return false;
};

const DeveloperSignup = ({ store, ...props }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorUsername, setErrorUsername] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorPasswordConfirm, setErrorPasswordConfirm] = useState("");
  const [notifyErr, setNotifyErr] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  useEffect(() => {
    setErrorUsername("");
    setErrorEmail("");
    setErrorPassword("");
    setErrorPasswordConfirm("");
  }, [username, email, password, passwordConfirm]);

  const showNotifications = (error) => {
    setNotifyErr(error.message);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!username) {
      setErrorUsername("username");
      return setErrorMessage("A valid Username is required");
    }

    if (!email || !validate(email)) {
      setErrorEmail("email");
      return setErrorMessage("A valid Email is required");
    }

    if (!password) {
      setErrorPassword("password");
      return setErrorMessage("Password is required");
    }

    if (!passwordConfirm) {
      setErrorPasswordConfirm("confirmation");
      return setErrorMessage("Confirmation is required");
    }

    if (password.length < 8) {
      setErrorPassword("password");
      return setErrorMessage("Password should be atleast 8 characters");
    }

    if (password !== passwordConfirm) {
      setErrorPassword("password");
      setErrorPasswordConfirm("confirmation");

      return setErrorMessage("Password and confirmation do not match");
    }

    setLoading(true);
    store.set("userName")(username);

    return handleStoreLogin();
  };

  const handleStoreLogin = async () => {
    const storeURL = process.env.REACT_APP_STORE_URL;
    const usersURL = `${storeURL}users/`;
    const authURL = `${storeURL}auth-token/`;
    let authToken = null;

    try {
      await StoreClient.createUser(usersURL, username, password, email);
    } catch (e) {
      if (_.has(e, "response")) {
        if (_.has(e, "response.data.username")) {
          setLoading(false);
          setErrorMessage("This username is already registered.");
          setErrorUsername(["username"]);
        }
        if (_.has(e, "response.data.email")) {
          setLoading(false);
          setErrorMessage("This email is already registered.");
          setErrorEmail(["email"]);
        }
      } else {
        setLoading(false);
        showNotifications(new HttpApiCallError(e));
      }
      return console.error(e);
    }

    try {
      authToken = await StoreClient.getAuthToken(authURL, username, password);
      store.set("authToken")(authToken);
      history.push("/dashboard");
    } catch (e) {
      showNotifications(new HttpApiCallError(e));
      return console.error(e);
    }
  };

  return (
    <>
      {notifyErr && (
        <Notification
          title={notifyErr}
          position="top-right"
          variant="danger"
          closeable
          onClose={() => setNotifyErr(null)}
        />
      )}
      <Form onSubmit={handleSubmit} noValidate>
        <p>{loading ? "Creating" : "Create"} a ChRIS Developer account:</p>
        <FormInput
          formLabel="Username"
          fieldId="username"
          validationState={
            errorUsername.includes("username") ? "error" : "default"
          }
          helperText="Enter your username"
          inputType="text"
          id="username"
          fieldName="username"
          value={username}
          autofocus={!isTouchDevice}
          onChange={(val) => setUsername(val)}
          errorControls={errorUsername}
          errorMessage={errorMessage}
        />

        <FormInput
          formLabel="Email"
          fieldId="email"
          validationState={errorEmail.includes("email") ? "error" : "default"}
          helperText="Enter your email"
          inputType="email"
          id="email"
          fieldName="email"
          value={email}
          onChange={(val) => setEmail(val)}
          errorControls={errorEmail}
          errorMessage={errorMessage}
        />

        <FormInput
          formLabel="Password"
          fieldId="password"
          validationState={
            errorPassword.includes("password") ? "error" : "default"
          }
          helperText="Enter your password"
          inputType="password"
          id="password"
          fieldName="password"
          value={password}
          onChange={(val) => setPassword(val)}
          errorControls={errorPassword}
          errorMessage={errorMessage}
        />

        <FormInput
          formLabel="Password Confirmation"
          fieldId="password-confirm"
          validationState={
            errorPasswordConfirm.includes("confirmation") ? "error" : "default"
          }
          helperText="Confirm your password"
          inputType="password"
          id="passwordConfirm"
          fieldName="passwordConfirm"
          value={passwordConfirm}
          onChange={(val) => setPasswordConfirm(val)}
          errorControls={errorPasswordConfirm}
          errorMessage={errorMessage}
        />

        {loading ? (
          <Spinner size="md" />
        ) : (
          <Button variant="primary" type="submit">
            Create Account
          </Button>
        )}
        {loading && (
          <span className="developer-signup-creating">Creating Account</span>
        )}
      </Form>
    </>
  );
};

export default ChrisStore.withStore(DeveloperSignup);

DeveloperSignup.propTypes = {
  store: PropTypes.objectOf(PropTypes.object).isRequired,
};
