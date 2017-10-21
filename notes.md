### building steps  
#### Create components
* create App component and render using react-dom  
~> assign `className="container"`  
~> assign font to body  

* create Popular component which will be App chidren component  
~> create languages array  
~> map array as lists in render method  
~> assign `className="languages"` to `ul`  
~> assign key to list element  
~> set initial state object in constructor; `selectedLanguage: All`    
```js
  class Popular extends React.component {
    // inherits form React.component which initialize with props as argument  
    //pass in super(props) to access props in constructor
    constructor(props) {
      super(props);
      this.state = {
        selectedLanguage: 'All'
      }
    }
  }
```
~> create method `updateLanguage` which update the language state  
~> bind method context in constructor to get the right context  
```js
//bind in constructor
constructor(props) {
  //...
  //bind to set "this" in method "updateLanguage" to always be the class
  //eg. this.setState, "this" in updateLanguage method will always refer to its class; Popular
  this.updateLanguage = this.updateLanguage.bind(this);
}

//update
updateLanguage(lang) {
  //set context in constructor to always bound "this" to the class context
  this.setState({
    selectedLanguage: lang
  });
}
```

~> create `onSelect` event and callback `updateLanguage` to update language when clicked binds the argument from map   
```js
//this is not needed since we already bound the context  
<li>
  onSelect={this.updateLanguage.bind(null, lang)}
</li>
```

~> set style to toggle class highlight list when active  
```js
<li className={lang === this.state.selectedLanguage ? "active" : ""}>
```

* Refactor `ul` lists to own stateless component `SelectLanguage`  
```js
const SelectLanguage = (props) => {
  const languages = ["All", "Java", "JS", "Python", "Ruby"];
  
  return (
    <ul className="languages">
      {languages.map(lang => {

        const active = (lang === props.selectedLanguage) ? "active" : "";

        return (
          <li
            className={active} 
            key={lang}
            onClick={props.onSelect.bind(null, lang)}
          >
            {lang}
          </li>
        )
      })}
    </ul>
  )
}
```

### making ajax request  
* install `axios`  
~> create `utils/api.js`  
~> create function to fetch popular repos  
```js
import axios from 'axios';

//api obj
const api = {
  fetchPopularRepos: function(lang) {
    const githubEndPoint = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${lang}&sort=star&order=desc&type=Repositories`);

    //get data asyn from api, then after response is done callback with response as argument 
    return axios.get(encodeURI) //async
                .then(function(response) { //callback after response is done
                  //get data from response, and items from response obj
                  return response.data.items;
                });
  }
}

//call function as 
api.fetchPopularRepos('ruby') //return items from github
      //.then method takes callback with obj that returned from promise as arg
      .then(function(items) {
        //do something
      });
```

* Implement API from utils  
~> set initial state in `popular` component to null  
~> call api when component is mouted in the view with  `componentDidMount` life cycle  
```js
//popular component
componentDidMount() {
  api.fetchPopularRepos(this.state.selectedLanguage)
      //.then takes returned obj from previous promise as arg   
      .then(function(repos) {
        console.log(repos);
      })
}
```

~> `componentDidMount` should update depend on selectedLanguage state hence refactor `updateLanguage` to call api and set state for `repos`, then call in `componentDidMount`   
~> update repo
```js
//popular component
componentDidMount() {
  this.updateLanguage(this.state.selectedLanguage);
}

updateLanguage(lang) {
  this.setState({
    selectedLanguage: lang,
    repos: null
  });

  api.fetchPopularRepos(lang)
      .then(repos => console.log(repos))
}
```

~> create `RepoGrid` component to render repos data from state then pass in `render()` as a part of `popular` component  

~> create `loading` component, display `loading...` and check if initial state is `null`. If finished fetching, `repos` state will be array, then display `RepoGrid` component  

### React router  
* install dependencies `react-router-dom`  

* import `Router` and `Route` when use  
```js
import { BrowserRouter as Router, Route } from 'react-router-dom';
```

* Wrap `Router` in `render` function  
~> specify `<Route path=".." component={..} />` for UI to render from specified route  
```js
//App.js
render() {
  return (
    <Router>
      <div className="container">
        <Route path="/popular" component={Popular} />
      </div>
    </Router>
  )
}
```

* Create `Nav` stateless functional component, then create link to specify browser navigation    
~> for link anchor tag, use `Link` property from `react-router-dom`  
~> for active style anchor tag, use `NavLink` property from `react-router-dom`, will use for this project  
~> `NavLink` takes `activeClassName` prop, then specify and style class for `activeClassName`  
~> `NavLink` `to` prop will navigate link to the prop value  
~> add `exact` to `/` path, since it needs to be active when exact `/` not `/...`  
```js
//Nav render jsx
<ul className="nav">
  <li>
    <NavLink exact activeClassName="active" to="/">Home</NavLink>
  </li>
  <li>
    <NavLink activeClassName="active" to="/battle">Battle</NavLink>
  </li>
  <li>
    <NavLink activeClassName="active" to="/popular">Popular</NavLink>
  </li>
</ul>
```  

~> add `Nav` to `App` component `render` at `container` div  

* Create `Home` component  
~> create react router dom `Link` for anchor tag  
~> add `Route` in `App` component `Router` to specify rendered component to match `Link`  
~> add `exec` in route to ensure rendering match `/` only  
```js
//App
<Route exec path="/" component={Home} >
```

* Create `Balttle` component and `route`  
~> add exact to `battle` route, since the result url will fetch dynamically  

* config webpack to render "/" for server request  
~> add `publicPath`  
~> add `devServer`  
```js
output: {
  //...
  publicPath: "/"
},
devServer: {
  historyApiFallback: true
},
```  

* wrap `Route` in `Switch`, `react-router-dom` `ReactRouter.Switch` to make a condition route which will render if nothing was found  
~> pass function that return jsx for not found route  
```js
//App render
<Router>
  <div className="container">
    <Nav />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/popular" component={Popular} />
      <Route path="/battle" component={Battle} />
      <Route render={() => <h1>Not Found!</h1>} />
    </Switch>
  </div>
</Router>
```

### Form and encapsulation  
* implement battle component, with the function to update state; `handleSubmit(id, name)`, and pass down to child component via `onSubmit` props  
```js
{!!this.state.user1.name ||
  <UserInput 
    label={"User 1"} 
    id="user1" 
    onSubmit={this.handleSubmit} 
  />
}
``` 

* create `UserInput` child component  
~> initial state `username` in constructor  
~> set event handler `onChange` to `this.handleChange` and update username state  
~> set event handler `onSubmit` to `this.handleSubmit` and call `this.props.onSubmit`, then pass in the `id` and `username` state as argument  
```js
//UserInput render()  
<form onSubmit={this.handleSubmit}>
  <label htmlFor="username">{this.props.label}</label>
  <input 
    id="username"
    type="text" 
    placeholder="github usename" 
    autoComplete="off" 
    value={this.state.username}
    onChange={this.handleChange} 
  />
  <button 
    disabled={!this.state.username} type="submit" 
    className="btn btn-info">Submit</button>
</form>
```

* build stateless function component `UserPreview` when submit input  
~> pass `image` and `username` props from `Battle`  
~> set reset from parent, check for id to reset component   
~> pass reset function as prop from parent  
```js
//Parent Battle component  
constructor() {
  //...
  //bound context to be able to always point context to class when callback in child
  this.handleReset = this.handleReset.bind(this);
}

handleReset(id) {
  this.setState({
    [id]: {
      image: null,
      name: ''
    }
  });
}

//render
<UserPreview 
  id="user2" 
  avatar={user2.image} 
  name={user2.name} 
  onReset={this.handleReset} //pass as function in props
/>

//UserPreview child in render
//bind null since this is already bound in class constructor
<small 
  className="btn btn-danger" 
  //call back function bind with this=null and argument 
  onClick={props.onReset.bind(null, props.id)}>
  Reset
</small>
```

* build github api to call `battle(users_arr)` and display winner in `utils/api.js`  

### build routes for /battle/result?params  
* Since component is defined to render with `Route` use `match.url` from component props to get url from Route  
~> specify object in `to` props inside `Link` from react-router-dom to pushState navigate url with `pathname` and querry with`search`    
```js
<Link 
  to={{
    pathname: `${match.url}/results`,
    search: `?user1=${user1.name}&user2=${user2.name}`
}}>
```  
~> include the route to render and component in `App`  
```js
<Route exact path="/battle/results" component={Result} />
```

~> create `Results` component  

### Querry params  
* install `query-string`  
~> parse string to key: value params  

* When using route and specify `path` and `component`, the specified component will have location props, which can access to pathname and search key value  
```js
<Route exact path="/battle/results" component={Results} />

// props in Result component wrapped by Route  
// Propsread-only
  history: //{…},
  location: //{…},
  hash: "",
  key: "qq4tnf",
  pathname: "/battle/results",
  search: "?user1=123&user2=poookzzz",
  match: //{…}
```  

* set initial state in `Results` component `constructor`  
```js
//constructor
this.state {
  winner: null,
  loser: null,
  error: null,
  loading: true
}
```

* Implement `componentDidMount()` in `Results` component  
~> get users name from query string  
~> call github api `api.battle` and pass users array from query string, then call `.then` and update state    
~> call `then` after `api.battle` return promise and check for null. if promise return null, setState `error` and `loading` to false in state  
~> If promise is truthy, setState `error` to null, and set loading to false, set winner and loser.

* implement `render` in `Results` component  
~> check loading state, if true return `loading JSX`  
~> check error state, if true return `error JSX`  
~> return `User` JSX  
```js
const error = this.state.error,
      winner = this.state.winner,
      loser = this.state.loser,
      loading = this.state.loading;

if (!!loading) {
  return <h1>Loading...</h1>
}

if (!!error) {
  return (
    <div>
      <p>{error}</p>
      <Link path="/battle" className="btn btn-danger">Reset</Link>
    </div>
  )
}

//check with JSON if API returns JSON back correctly   
return (
  <div>
    {JSON.stringify(this.state, null, 2)}
  </div>
)
```

* `User` component  
~> return UI  
```js
return (
  <div className="battle">
    <User 
      label="Winner" 
      score={winner.score} 
      profile={winner.profile}
    />

    <User 
      label="Loser" 
      score={loser.score} 
      profile={loser.profile}
    />
  </div>
)  
```

~> create `User` component  
```js
const User = (props) => {
  return (
    <div>
      <h1>{props.label}</h1>
      <h3 className="inline-center">Scores: {props.score}</h3>
    </div>
  )
}
```

~> verify with `prop-types`  

* Reuse component with `props.children`  
~> `{props.children}` specified inside component `render()` method will look for html/jsx in `<component>...</component>` when specified and render as `props.children`; similar to `yeild` in ROR    
~> pull `UserPreview` into module  
~> refactor `button` to `props.children`, then use `<UserPreview>...button<UserPreview>` component  
```js
//Battle component  
<UserPreview>
  <small 
    className="btn btn-danger" 
    onClick={this.handleReset.bind(null, "user1")}>
      Reset
  </small>
</UserPreview>
```

~> create `Profile` component return `<UserPreview>..</UserPreview>` within, passing require props `avatar` and `name`, and then pass in `<ul>...</ul>` as `props.children` for `<UserPreview>`  
```js
const Profile = (props) => {
  return(
    <UserPreview avatar={info.avatar_url} name={info.login} >
      <ul>
        {info.name && <li>{info.name}</li>}
        {info.location && <li>{info.location}</li>}
        {info.company && <li>{info.company}</li>}
        <li>Following: {info.following}</li>
        <li>Followers: {info.followers}</li>
        <li>Public Repos: {info.public_repos}</li>             
        {info.blog && <li><a href={info.blog}>{info.blog}</a></li>}        
      </ul>
    </UserPreview>
  )
}
```
~> render `Profile` component inside `User` component   

### Reusable component and props.default  
* create `Loading` compoent  
~> set state to be `props.text` in `constructor()`  
~> set `defaultProps` for defult  
~> render in `render`  

```js
//Loading component
Loading.defaultProps = {
  text: 'Loading',
  className: 'inline-center'
}
```

* add `...` while loading to Loading text  
~> in `componentDidMount` check if text state === 'Loading...'  
~> if true return the default props  
~> else return the `prevState` for text and + .  
```js
componentDidMount() {
  const done = `${this.props.text}...`;

  this.interval = window.setInterval(() => {
    if (this.state.text === done) {
      this.setState(() => {
        return {
          text: this.props.text
        }
      });
    } else {
      this.setState((prevState, props) => {
        return {
          text: `${prevState.text}.`
        };
      });
    }
  }, this.props.speed);
}
```

~> the `this.interval` inside `componentDidMount` will recurring while visiting, hence need to remove the listener when component `Loading` unmount  
```js
//Loading component  
componentWillUnMount() {
  window.clearInterval(this.interval);
}
```