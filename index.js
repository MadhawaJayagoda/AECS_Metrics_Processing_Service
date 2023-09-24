const express = require("express");
const axios = require("axios");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8080;

// Fetch and process data from GitHub Data Integration Service

// Function to retrieve commits from GitHub Integration Service
async function getCommits(username, repository) {
  try {
    const commitsResponse = await axios.get(
      `http://localhost:3000/github/commits/${username}/${repository}`
    );
    const commits = commitsResponse.data.commits;

    // Calculate today's date as a string in the format "YYYY-MM-DD"
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

// Function to retrieve pull requests from GitHub Integration Service
async function getPullRequests(username, repository) {
  try {
    const pullsResponse = await axios.get(
      `http://localhost:3000/github/pullrequests/${username}/${repository}`
    );
    const pullRequests = pullsResponse.data.pull_requests;

    // Calculate today's date as a string in the format "YYYY-MM-DD"
    const today = new Date().toISOString().split("T")[0];

    // Filter pull requests made today
    const pullRequestsToday = pullRequests.filter((pullRequest) => {
      const pullRequestDate = pullRequest.created_at.split("T")[0];
      return pullRequestDate === today;
    });

    return pullRequestsToday.length;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Function to retrieve issues from GitHub Integration Service
async function getIssues(username, repository) {
  try {
    const issues_response = await axios.get(
      `http://localhost:3000/github/issues/${username}/${repository}`
    );
    const issues = issues_response.data.issues;

    // Calculate today's date as a string in the format "YYYY-MM-DD"
    const today = new Date().toISOString().split("T")[0];

    // Filter issues created today
    const issuesToday = issues.filter((issue) => {
      const issueDate = issue.created_at.split("T")[0];
      return issueDate === today;
    });

    return issuesToday.length;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Function to retrieve releases from GitHub Integration Service
async function getReleases(username, repository) {
  try {
    const releases_response = await axios.get(
      `http://localhost:3000/github/releases/${username}/${repository}`
    );
    const releases = releases_response.data.releases;

    // Calculate today's date as a string in the format "YYYY-MM-DD"
    const today = new Date().toISOString().split("T")[0];

    // Filter releases made today
    const releasesToday = releases.filter((release) => {
      const releaseDate = release.published_at.split("T")[0];
      return releaseDate === today;
    });

    return releasesToday.length;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Route for Processing data
app.get("/process/data/:username/:repository", async (req, res) => {
  const { username, repository } = req.params;

  try {
    const [commits, pullRequests, issues, releases] = await Promise.all([
      getCommits(username, repository),
      getPullRequests(username, repository),
      getIssues(username, repository),
      getReleases(username, repository),
    ]);

    res.json({
      commits: commits,
      pullRequests: pullRequests,
      issues: issues,
      releases: releases,
    });
  } catch (error) {
    console.log(error);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
