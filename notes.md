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
* 