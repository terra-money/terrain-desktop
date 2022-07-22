const LOCAL_TERRA_WS = 'ws://localhost:26657/websocket';
const LOCAL_TERRA_GIT = 'https://github.com/terra-money/LocalTerra.git';
const BROWSER_WINDOW_WIDTH = 1200;
const BROWSER_WINDOW_HEIGHT = 720;

const DEFAULT_BLOCKTIME = {
  timeout_propose: '3s',
  timeout_propose_delta: '500ms',
  timeout_prevote: '1s',
  timeout_prevote_delta: '500ms',
  timeout_precommit: '1s',
  timeout_precommit_delta: '500ms',
  timeout_commit: '5s',
};

const TWOHUNDREDMS_BLOCKTIME = {
  timeout_propose: '200ms',
  timeout_propose_delta: '200ms',
  timeout_prevote: '200ms',
  timeout_prevote_delta: '200ms',
  timeout_precommit: '200ms',
  timeout_precommit_delta: '200ms',
  timeout_commit: '200ms',
};

const ONESECOND_BLOCKTIME = {
  timeout_propose: '1s',
  timeout_propose_delta: '1s',
  timeout_prevote: '1s',
  timeout_prevote_delta: '1s',
  timeout_precommit: '1s',
  timeout_precommit_delta: '1s',
  timeout_commit: '1s',
};

module.exports = {
  LOCAL_TERRA_WS,
  LOCAL_TERRA_GIT,
  BROWSER_WINDOW_WIDTH,
  BROWSER_WINDOW_HEIGHT,
  DEFAULT_BLOCKTIME,
  TWOHUNDREDMS_BLOCKTIME,
  ONESECOND_BLOCKTIME,
};
