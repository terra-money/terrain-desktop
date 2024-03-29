const INSTALL_LOCAL_TERRA = 'installLocalTerra';
const CUSTOM_ERROR_DIALOG = 'customErrorDialog';
const TOGGLE_LOCAL_TERRA = 'toggleLocalTerra';
const IMPORT_SAVED_CONTRACTS = 'importSavedContracts';
const IMPORT_NEW_CONTRACTS = 'importNewContracts';
const DELETE_ALL_CONTRACTS = 'deleteAllContracts';
const DELETE_CONTRACT = 'deleteContract';
const REFRESH_CONTRACT_REFS = 'refreshContractRefs';
const SET_LOCAL_TERRA_PATH = 'setLocalTerraPath';
const GET_BLOCKTIME = 'getBlocktime';
const SET_BLOCKTIME = 'setBlocktime';
const SET_LITE_MODE = 'setLiteMode';
const GET_LITE_MODE = 'getLiteMode';
const PROMPT_USER_RESTART = 'promptUserRestart';
const RESET_APP = 'resetApp';
const GET_OPEN_AT_LOGIN = 'getOpenAtLogin';
const SET_OPEN_AT_LOGIN = 'setOpenAtLogin';
const GET_LOCAL_TERRA_STATUS = 'getLocalTerraStatus';
const LOCAL_TERRA_PATH_CONFIGURED = 'localTerraPathConfigured';
const LOCAL_TERRA_IS_RUNNING = 'localTerraIsRunning';
const TX = 'Tx';
const NEW_BLOCK = 'NewBlock';
const NEW_LOG = 'NewLog';

const LOCAL_TERRA_WS = 'ws://localhost:26657/websocket';
const REACT_APP_FINDER_URL = 'https://finder.terra.money/localterra';
const REACT_APP_DOCS_URL = 'https://docs.terra.money/search.html';
const FINDER_ORIGIN = 'https://finder.terra.money';
const DOCKER_ORIGIN = 'https://www.docker.com';
const DOCS_ORIGIN = 'https://docs.terra.money';
const LOCAL_TERRA_GIT = 'https://github.com/terra-money/LocalTerra.git';

const MEM_USE_THRESHOLD_MB = 100 * 1024 * 1024; // 100MB
const BROWSER_WINDOW_WIDTH = 1200;
const BROWSER_WINDOW_HEIGHT = 720;
const MAX_LOG_LENGTH = 500;
const MAX_BLOCKS_LENGTH = 500;
const TOGGLE_DEBOUNCE_MS = 3000;

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
  REFRESH_CONTRACT_REFS,
  SET_BLOCKTIME,
  IMPORT_NEW_CONTRACTS,
  GET_BLOCKTIME,
  DELETE_ALL_CONTRACTS,
  DELETE_CONTRACT,
  PROMPT_USER_RESTART,
  CUSTOM_ERROR_DIALOG,
  GET_OPEN_AT_LOGIN,
  DEFAULT_BLOCKTIME,
  TWOHUNDREDMS_BLOCKTIME,
  ONESECOND_BLOCKTIME,
  LOCAL_TERRA_PATH_CONFIGURED,
  LOCAL_TERRA_IS_RUNNING,
  SET_LITE_MODE,
  GET_LITE_MODE,
  INSTALL_LOCAL_TERRA,
  TOGGLE_LOCAL_TERRA,
  TOGGLE_DEBOUNCE_MS,
  IMPORT_SAVED_CONTRACTS,
  LOCAL_TERRA_WS,
  MAX_LOG_LENGTH,
  MAX_BLOCKS_LENGTH,
  LOCAL_TERRA_GIT,
  BROWSER_WINDOW_WIDTH,
  BROWSER_WINDOW_HEIGHT,
  REACT_APP_FINDER_URL,
  REACT_APP_DOCS_URL,
  TX,
  NEW_BLOCK,
  NEW_LOG,
  FINDER_ORIGIN,
  DOCS_ORIGIN,
  RESET_APP,
  DOCKER_ORIGIN,
  MEM_USE_THRESHOLD_MB,
};
