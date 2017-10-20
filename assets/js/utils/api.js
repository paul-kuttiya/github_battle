import axios from 'axios';

const githubAPI = {
  endpoint: "https://api.github.com/users/",
  getProfile(username) {
    const apiUrl = `${this.endpoint}${username}`;

    return axios.get(apiUrl)
                .then(user => {
                  return user.data;
                });
  },
  getRepos(username) {
    const apiUrl = `${this.endpoint}${username}/repos?&per_page=100`;
    
    return axios.get(apiUrl)
                .then(repo => {
                  return repo.data;
                });
  },
  getStarCount(repos) {
    return repos.reduce((count, repo) => {
      return count + repo.stargazers_count;
    }, 0)
  },
  calculateScore(profile, repos) {
    const followers = profile.followers,
          totalStars = this.getStarCount(repos);

    return (followers * 3) + totalStars;
  },
  handleError(error) {
    console.warn(error);
    return null;
  },
  getUserData(user) {
    return axios.all([
      this.getProfile(user),
      this.getRepos(user)
    ]).then((data) => {
      const [profile, repos] = data

      return {
        profile, 
        score: this.calculateScore(profile, repos) 
      }
    });
  },
  displayWinner(users) {
    const [a, b] = users;

    let [winner, loser] = (a.score > b.score ? [a, b] : [b, a]);
    
    if (a.score === b.score) { [winner, loser] = [null, null] };

    return { winner, loser };
  },
  battle(players) {
    const API_arrays = players.map(player => this.getUserData(player));
    
    return axios.all(API_arrays)
                .then(datas => this.displayWinner(datas))
                .catch(this.handleError);
  },
  fetchPopularRepos(lang) {
    const githubEndPoint = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${lang}&sort=star&order=desc&type=Repositories`);
  
    return axios.get(githubEndPoint)
                .then(function(response) {
                  return response.data.items;
                });
  }
}


export default githubAPI;