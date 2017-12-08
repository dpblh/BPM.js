/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Login.css';

class Login extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.loginForm}>
          <div className={s.head}>
            <div className={s.img} />
          </div>
          <form className={s.form}>
            <li>
              <input type="text" value="USERNAME" className={s.input} />
              <i className={cx(s.icon, s.user)} />
            </li>
            <li>
              <input type="password" value="Password" className={s.input} />
              <i className={cx(s.icon, s.lock)} />
            </li>
            <div className={s.container}>
              <button className={s.button}>
                <span className={s.buttonText}>Sign In</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Login);
