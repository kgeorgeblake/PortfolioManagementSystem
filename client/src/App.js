import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from "react-redux";
import setAuthToken from "./utils/setAuthToken";
import store from './store'
import jwt_decode from "jwt-decode";
import PrivateRoute from './components/private-route/PrivateRoute';
import { setCurrentUser, logoutUser } from './actions/authActions';

import Portfolio from './pages/portfolio/';
import Dashboard from "./pages/dashboard/";
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Check localStorage for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken
  setAuthToken(token)
  // Decode token and get user info and exp
  const decoded = jwt_decode(token)
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded))

  // Checks for an iexpired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    alert("Your session has expired. Please login again")
    //Logout User
    store.dispatch(logoutUser());
    // Redirect to Login
    window.location.href = "./login"
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Route exact path="/" component={Portfolio}/>
          <Route exact path="/register" component={Register}/>
          <Route exact path="/login" component={Login}/>
          <Switch>
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
          </Switch>
        </div>
      </Router>
    </Provider>
  )
}

export default App;
