import React from 'react';
import api from '../utils/api';
import SelectLanguage from './SelectLanguage';
import RepoGrid from './RepoGrid';
import Loading from './Loading';

class Popular extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedLanguage: "All",
      repos: null
    }

    this.updateLanguage = this.updateLanguage.bind(this);
  }

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage);
  }

  updateLanguage(lang) {
    this.setState({
      selectedLanguage: lang,
      repos: null
    });

    api.fetchPopularRepos(lang)
       .then(repos => {
         this.setState({repos: repos}) 
       });
  }

  render() {
    const validRepos = !this.state.repos ? <Loading /> : <RepoGrid repos={this.state.repos} />

    return (
      <div>
        <SelectLanguage 
          selectedLanguage={this.state.selectedLanguage} 
          onSelect={this.updateLanguage}
        />
        {validRepos}
      </div>
    )
  }
}

export default Popular;