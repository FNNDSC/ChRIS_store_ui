import StoreClient from "@fnndsc/chrisstoreapi";
import { Form, Spinner } from "@patternfly/react-core";
import { validate } from "email-validator";
import _ from "lodash";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ChrisStore from "../../../../store/ChrisStore";
import Button from "../../../Button";
import FormInput from "../../../FormInput";
import styles from './DeveloperSignup.module.css';

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
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ message: "", controls: "" });
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!username) {
      return setError({
        message: "A valid Email is required",
        controls: ["email"],
      });
    }

    if (!email || !validate(email)) {
      return setError({
        message: "A valid Email is required",
        controls: ["email"],
      });
    }
    if (password.length < 8) {
      return setError({
        message: "Password should be atleast 8 characters",
        controls: ["password"],
      });
    }

    if (!password) {
      return setError({
        message: "Password is required",
        controls: ["password"],
      });
    }

    if (!passwordConfirm) {
      return setError({
        message: "Confirmation is required",
        controls: ["confirmation"],
      });
    }

    if (password !== passwordConfirm) {
      return setError({
        message: "Password and confirmation do not match",
        controls: ["password", "confirmation"],
      });
    }

    setLoading(true);
    setError({
      message: "",
      controls: "",
    });
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
          setError({
            message: "This username is already registered.",
            controls: ["username"],
          });
        } else {
          setLoading(false);
          setError({
            message: "This email is already registered.",
            controls: ["email"],
          });
        }
      } else {
        setLoading(false);
      }
      return console.error(e);
    }

    try {
      authToken = await StoreClient.getAuthToken(authURL, username, password);
      store.set("authToken")(authToken)
      history.push('/dashboard')
    } catch (e) {
      return console.error(e);
    }

  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <p>{loading ? "Creating" : "Create"} a ChRIS Developer account:</p>
      <FormInput
        formLabel="Username"
        fieldId="username"
        validationState={
          error.controls.includes("username") ? "error" : "default"
        }
        helperText="Enter your username"
        inputType="text"
        id="username"
        fieldName="username"
        value={username}
        autofocus={!isTouchDevice}
        onChange={(val) => setUsername(val)}
        error={error}
      />

      <FormInput
        formLabel="Email"
        fieldId="email"
        validationState={error.controls.includes("email") ? "error" : "default"}
        helperText="Enter you email"
        inputType="email"
        id="email"
        fieldName="email"
        value={email}
        onChange={(val) => setEmail(val)}
        error={error}
      />

      <FormInput
        formLabel="Password"
        fieldId="password"
        validationState={
          error.controls.includes("password") ? "error" : "default"
        }
        helperText="Enter your password"
        inputType="password"
        id="password"
        fieldName="password"
        value={password}
        onChange={(val) => setPassword(val)}
        error={error}
      />

      <FormInput
        formLabel="Password Confirmation"
        fieldId="password-confirm"
        validationState={
          error.controls.includes("confirmation") ? "error" : "default"
        }
        helperText="Confirm your password"
        inputType="password"
        id="passwordConfirm"
        fieldName="passwordConfirm"
        value={passwordConfirm}
        onChange={(val) => setPasswordConfirm(val)}
        error={error}
      />

      {loading ? (
        <Spinner size="md" />
      ) : (
        <Button variant="primary" type="submit">
          Create Account
        </Button>
      )}
      {loading && (
        <span className={styles['developer-signup-creating']}>Creating Account</span>
      )}
    </Form>
  );
};

export default ChrisStore.withStore(DeveloperSignup);

DeveloperSignup.propTypes = {
  store: PropTypes.objectOf(PropTypes.object).isRequired,
};
