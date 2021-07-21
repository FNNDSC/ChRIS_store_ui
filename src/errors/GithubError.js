/* eslint-disable max-classes-per-file */
export class GithubAPIRepoError extends Error {
  /**
   * Create a new Github repo fetch error
   * @param repo Name of repository
   * @param response Fetch API response
   */
  constructor(repo, response) {
    super(response.statusText);

    this.response = response;
    this.statusCode = response.status;

    this.name = repo
    this.message = `Cannot fetch repository ${this.name}`
  }
}

export class GithubAPIProfileError extends GithubAPIRepoError {
  /**
   * Create a new Github community profile fetch error
   * @param repo Name of repository
   * @param response Fetch API response
   */
  constructor(repo, response) {
    super(repo, response)
    this.message = `Cannot find community profile for ${this.name}`
  }
}

export class GithubAPIReadmeError extends GithubAPIRepoError {
  /**
   * Create a new Github README fetch error
   * @param repo Name of repository
   * @param response Fetch API response
   */
  constructor(repo, response) {
    super(repo, response)
    this.message = `Cannot find README for ${this.name}`
  }
}

export default GithubAPIRepoError