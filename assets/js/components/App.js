import React from 'react';
import '../../css/app.sass';
import Home from './Home';
import Popular from './Popular';
import Battle from './Battle';
import Nav from './Nav';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="container">
          <Nav />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/popular" component={Popular} />
            <Route exact path="/battle" component={Battle} />
            <Route render={() => <h1>Not Found!</h1>} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;