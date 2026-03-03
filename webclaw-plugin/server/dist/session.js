import { Octokit } from "@octokit/rest";
export class SessionStore {
    sessions = new Map();
    get(sessionId) {
        let state = this.sessions.get(sessionId);
        if (!state) {
            state = { config: null, octokit: null };
            this.sessions.set(sessionId, state);
        }
        return state;
    }
    setConfig(sessionId, config) {
        const state = this.get(sessionId);
        state.config = config;
        state.octokit = new Octokit({ auth: config.token });
    }
    setOctokit(sessionId, octokit) {
        const state = this.get(sessionId);
        state.octokit = octokit;
    }
    delete(sessionId) {
        this.sessions.delete(sessionId);
    }
}
