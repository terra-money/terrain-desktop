const INSTALL_LOCAL_TERRA = 'installLocalTerra';
const TOGGLE_LOCAL_TERRA = 'toggleLocalTerra';
const IMPORT_SAVED_CONTRACTS = 'importSavedContracts';
const IMPORT_NEW_CONTRACTS = 'importNewContracts';
const DELETE_CONTRACT_REFS = 'deleteContractRefs';
const SET_LOCAL_TERRA_PATH = 'setLocalTerraPath';
const GET_BLOCKTIME = 'getBlocktime';
const SET_BLOCKTIME = 'setBlocktime';
const PROMT_USER_RESTART = 'promptUserRestart';
const GET_OPEN_AT_LOGIN = 'getOpenAtLogin';
const SET_OPEN_AT_LOGIN = 'setOpenAtLogin';
const GET_LOCAL_TERRA_STATUS = 'getLocalTerraStatus';

const LOCAL_TERRA_WS = 'ws://localhost:26657/websocket';
const REACT_APP_FINDER_URL = 'https://finder.terra.money/localterra';
const REACT_APP_DOCS_URL = 'https://docs.terra.money/search.html';
const LOCAL_TERRA_GIT = 'https://github.com/terra-money/LocalTerra.git';

const BROWSER_WINDOW_WIDTH = 1200;
const MAX_LOG_LENGTH = 500;
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
  GET_LOCAL_TERRA_STATUS,
  SET_OPEN_AT_LOGIN,
  SET_LOCAL_TERRA_PATH,
  SET_BLOCKTIME,
  IMPORT_NEW_CONTRACTS,
  GET_BLOCKTIME,
  DELETE_CONTRACT_REFS,
  PROMT_USER_RESTART,
  GET_OPEN_AT_LOGIN,
  DEFAULT_BLOCKTIME,
  TWOHUNDREDMS_BLOCKTIME,
  ONESECOND_BLOCKTIME,
  INSTALL_LOCAL_TERRA,
  TOGGLE_LOCAL_TERRA,
  IMPORT_SAVED_CONTRACTS,
  LOCAL_TERRA_WS,
  MAX_LOG_LENGTH,
  LOCAL_TERRA_GIT,
  BROWSER_WINDOW_WIDTH,
  BROWSER_WINDOW_HEIGHT,
  REACT_APP_FINDER_URL,
  REACT_APP_DOCS_URL,
};