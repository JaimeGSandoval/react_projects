/* eslint-disable jsx-a11y/anchor-is-valid */

// ***** important note *****
// The post request will not work in it'\s entirety because it's meant to connect to the refresh-token-rotation api instead of the access_refresh_authentication project.

import { useRef, useState, useEffect } from 'react';
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from './api/axios'; // good reason to use axios instead of fetch because we don't hve to manually change the response to json when posting. It already happens

// user regex says:
// - it must start with an upper or lower case letter [A-z]
// - followed by 3 - 23 characters that can be lower or upper case letter,
//   digits, hyphens or underscores.
// - overall it must be 4 - 24 characters

// pwd regex says:
// - requires at least one uppercase letter
// - requires one lowercase letter
// - requires 1 digit
// - requires 1 special character
// - it can be anywhere from 8 - 24 characters

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';

const Register = () => {
  const userRef = useRef(); // allows up to set the focus on the input when the component loads
  const errRef = useRef(); // if we get an error we need to put the focus on that so it can be announced by a screen reader for accessibility

  // STATE FOR USER FIELD
  // tied to user input
  const [user, setUser] = useState('');
  // tied to whether the name validates or not
  const [validName, setValidName] = useState(false);
  // for whether we have focus on that input field or not
  const [userFocus, setUserFocus] = useState(false);

  // STATE FOR PASSWORD FIELD
  // tied to password input
  const [pwd, setPwd] = useState('');
  // tied to whether or not the password validates or not
  const [validPwd, setValidPwd] = useState(false);
  // for whether we have focus on that input field or not
  const [pwdFocus, setPwdFocus] = useState(false);

  // STATE FOR MATCH PASSWORD FIELD
  // tied to match password input
  const [matchPwd, setMatchPwd] = useState('');
  // tied to whether or not the match validates or not
  const [validMatch, setValidMatch] = useState(false);
  // for whether we have focus on that input field or not
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // sets focus when component loads
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // validate the user name. every time it changes it validates the input
  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    // the nice thing about having both of these in the same useEffect is anytime one of them changes the will will be a valid match check too. It allows it to be in sync at all times
    setValidPwd(PWD_REGEX.test(pwd));
    // setting whether we have a valid match or not
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  // anytime on of the dependencies change we clear out the error message because the user has read the error message and now they're making changes
  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevents forms default behavior of submitting
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg('Invalid Entry');
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          // withCredentials: true, this is only commented out because the express pai that it's posting to is not set up with Access-Control-Allow-Credentials: true. It's set up in the refresh-token-rotation project, but not here. If it was set up in this projects, it would be commented out. refresh-token-rotation project uses mongo, so it won't work in wsl.
        }
      );
      console.log(response?.data);
      console.log(response?.accessToken);
      console.log(JSON.stringify(response));
      setSuccess(true);
      //clear state and controlled inputs
      //need value attrib on inputs for this
      setUser('');
      setPwd('');
      setMatchPwd('');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken');
      } else {
        setErrMsg('Registration Failed');
      }
      errRef.current.focus(); // for screen readers
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="#">Sign In</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            // offscreen class will take this whole paragraph which is position absolutely way off the screen, but it'll still be available to screen readers instead of display: none which will remove it from the document
            className={errMsg ? 'errmsg' : 'offscreen'}
            // assertive means that when you set the focus on the element that has a ref={errRef} it will be announced with the screen reader
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">
              Username:
              <FontAwesomeIcon
                icon={faCheck}
                // hide will set display: none. This is okay visually for us because we're not using a screen reader. If we're using a screen reader that's what the aria-invalid attribute is for
                className={validName ? 'valid' : 'hide'}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validName || !user ? 'hide' : 'invalid'}
              />
            </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              // we set to off because we don't want to see previous values suggested for this field that others may have entered
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
              // set to true when the component loads because we will not have a valid name. This lets the screen reader announce whether this input field needs to be adjusted before the form is submitted
              aria-invalid={validName ? 'false' : 'true'}
              // lets us provide another element that lets us describe the input field
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <p
              id="uidnote"
              className={
                userFocus && user && !validName ? 'instructions' : 'offscreen'
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>

            <label htmlFor="password">
              Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validPwd ? 'valid' : 'hide'}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validPwd || !pwd ? 'hide' : 'invalid'}
              />
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              aria-invalid={validPwd ? 'false' : 'true'}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters:{' '}
              <span aria-label="exclamation mark">!</span>{' '}
              <span aria-label="at symbol">@</span>{' '}
              <span aria-label="hashtag">#</span>{' '}
              <span aria-label="dollar sign">$</span>{' '}
              <span aria-label="percent">%</span>
            </p>

            <label htmlFor="confirm_pwd">
              Confirm Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validMatch && matchPwd ? 'valid' : 'hide'}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validMatch || !matchPwd ? 'hide' : 'invalid'}
              />
            </label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
              aria-invalid={validMatch ? 'false' : 'true'}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch ? 'instructions' : 'offscreen'
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>

            <button
              disabled={!validName || !validPwd || !validMatch ? true : false}
            >
              Sign Up
            </button>
          </form>
          <p>
            Already registered?
            <br />
            <span className="line">
              {/*put react router link here to link to another part of the application*/}
              <a href="#">Sign In</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;
