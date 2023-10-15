const express = require("express");
const axios = require("axios");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8080;

// Retrieve commits from GitHub Integration Service
async function getCommits(username, repository) {
  try {
    const commitsResponse = await axios.get(
      `http://github-integration-service:3000/github/commits/${username}/${repository}`
    );
    const commits = commitsResponse.data.commits;

    const today = new Date().toISOString().split("T")[0];

    // Filter commits made today
    const commitsToday = commits.filter((commit) => {
      const commitDate = commit.commit.author.date.split("T")[0];
      return commitDate === today;
    });

    return commitsToday.length;
  } catch (error) {
    throw error;
  }
}

// Retrieve pull requests from GitHub Integration Service
async function getPullRequests(username, repository) {
  try {
    const pullsResponse = await axios.get(
      `http://github-integration-service:3000/github/pullrequests/${username}/${repository}`
    );
    const pullRequests = pullsResponse.data.pull_requests;

    const today = new Date().toISOString().split("T")[0];

    // Filter pull requests made today
    const pullRequestsToday = pullRequests.filter((pullRequest) => {
      const pullRequestDate = pullRequest.created_at.split("T")[0];
      return pullRequestDate === today;
    });

    return pullRequestsToday.length;
  } catch (error) {
    throw error;
  }
}

// Retrieve issues from GitHub Integration Service
async function getIssues(username, repository) {
  try {
    const issues_response = await axios.get(
      `http://github-integration-service:3000/github/issues/${username}/${repository}`
    );
    const issues = issues_response.data.issues;

    const today = new Date().toISOString().split("T")[0];

    // Filter issues created today
    const issuesToday = issues.filter((issue) => {
      const issueDate = issue.created_at.split("T")[0];
      return issueDate === today;
    });

    return issuesToday.length;
  } catch (error) {
    throw error;
  }
}

// Retrieve releases from GitHub Integration Service
async function getReleases(username, repository) {
  try {
    const releases_response = await axios.get(
      `http://github-integration-service:3000/github/releases/${username}/${repository}`
    );
    const releases = releases_response.data.releases;

    const today = new Date().toISOString().split("T")[0];

    // Filter releases made today
    const releasesToday = releases.filter((release) => {
      const releaseDate = release.published_at.split("T")[0];
      return releaseDate === today;
    });

    return releasesToday.length;
  } catch (error) {
    throw error;
  }
}

// Processing data
app.get("/process/data/:username/:repository", async (req, res) => {
  const { username, repository } = req.params;
  const data = {};

  try {
    data.commits = await getCommits(username, repository);
    data.pullRequests = await getPullRequests(username, repository);
    data.issues = await getIssues(username, repository);
    data.releases = await getReleases(username, repository);

    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
