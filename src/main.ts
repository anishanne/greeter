import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {
      // Get client and context
      const client: github.GitHub = new github.GitHub(
	  core.getInput('repo-token', {required: true})
      );
      const context = github.context;
	  
      // Make sure its an issue getting opened.
      if (context.payload.action !== 'opened') {
	  return;
      }
      
      // Make sure user is new contributor.	  
      console.log("[INFO] Checking if user is new contributor.");
      if (!context.payload.sender) {
	  throw new Error('Internal error, no sender provided by GitHub');
      }
      const sender: string = context.payload.sender!.login;
      const issue: {owner: string; repo: string; number: number} = context.issue;
      console.log("[INFO] Sender " + sender);
	  
      let firstContribution: boolean = await isFirstIssue(
        client,
        issue.owner,
        issue.repo,
        sender,
        issue.number
      );

      if (!firstContribution) {
	  console.log('[INFO] User is not new contributor.');
	  console.log('----Ending Action----');
	  return;
      }
      else {
	  console.log('[INFO] User is new contributor.');
      }

      const greeting: string = core.getInput('greeting');
      const message: string = greeting.replace(/{user}/, sender);
      console.log('[INFO] Sending Message: ' + message );
      const res = await client.issues.createComment({
          owner: issue.owner,
          repo: issue.repo,
          issue_number: issue.number,
          body: message
      });
  } catch (error) {
      console.log('[ERROR]: ' + error);
      core.setFailed(error.message);
      return;
  }
}

// taken from actions/first-interaction
async function isFirstIssue(
  client: github.GitHub,
  owner: string,
  repo: string,
  sender: string,
  curIssueNumber: number
): Promise<boolean> {
  const {status, data: issues} = await client.issues.listForRepo({
    owner: owner,
    repo: repo,
    creator: sender,
    state: 'all'
  });

  if (status !== 200) {
    throw new Error(`Received unexpected API status code ${status}`);
  }

  if (issues.length === 0) {
    return true;
  }

  for (const issue of issues) {
    if (issue.number < curIssueNumber && !issue.pull_request) {
      return false;
    }
  }

  return true;
}


run();
