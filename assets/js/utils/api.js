import axios from 'axios';

const api = {
  fetchPopularRepos: function(lang) {
    const githubEndPoint = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${lang}&sort=star&order=desc&type=Repositories`);
  
    return axios.get(githubEndPoint)
                .then(function(response) {
                  return response.data.items;
                });
  }
}

export default api; 