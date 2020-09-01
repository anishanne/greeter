"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get client and context
            const client = new github.GitHub(core.getInput('repo-token', { required: true }));
            const context = github.context;
            if (context.payload.action !== 'opened') {
                console.log('No issue was opened, skipping');
                return;
            }
            // Do nothing if its not their first contribution
            console.log("[INFO] Checking if user is new contributor.");
            if (!context.payload.sender) {
                throw new Error('Internal error, no sender provided by GitHub');
            }
            const sender = context.payload.sender.login;
            const issue = context.issue;
            console.log("[INFO] Sender " + sender);
            let firstContribution = yield isFirstIssue(client, issue.owner, issue.repo, sender, issue.number);
            if (!firstContribution) {
                console.log('[INFO] User is not new contributor.');
	            console.log('----Ending Action----');
                return;
            }
            else{
                console.log('[INFO] User is new contributor.');
            }
            const greeting = core.getInput('greeting');
            const message = greeting.replace(/{user}/, sender);
            console.log('[INFO] Sending Message: ' + message );
            const res = yield client.issues.createComment({
                owner: issue.owner,
                repo: issue.repo,
                issue_number: issue.number,
                body: message
            });
            
        }
        catch (error) {
            console.log('[ERROR]: ' + error);
            core.setFailed(error.message);
            return;
        }
    });
}
// taken from actions/first-interaction
function isFirstIssue(client, owner, repo, sender, curIssueNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const { status, data: issues } = yield client.issues.listForRepo({
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
    });
}
run();
