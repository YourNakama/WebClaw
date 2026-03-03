import type { SessionState, VaultConfig } from "./types.js";
import { Octokit } from "@octokit/rest";

export class SessionStore {
  private sessions = new Map<string, SessionState>();

  get(sessionId: string): SessionState {
    let state = this.sessions.get(sessionId);
    if (!state) {
      state = { config: null, octokit: null };
      this.sessions.set(sessionId, state);
    }
    return state;
  }

  setConfig(sessionId: string, config: VaultConfig): void {
    const state = this.get(sessionId);
    state.config = config;
    state.octokit = new Octokit({ auth: config.token });
  }

  setOctokit(sessionId: string, octokit: Octokit): void {
    const state = this.get(sessionId);
    state.octokit = octokit;
  }

  delete(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}
