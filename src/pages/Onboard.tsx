import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { useNavigate } from 'react-router-dom';
import {
  CircularProgress,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@material-ui/core';
import { ReactComponent as TextLogo } from '../../assets/logo.svg';
import { ReactComponent as ExternalLink } from '../../assets/external-link.svg';
import {
  SET_LOCAL_TERRA_PATH,
  INSTALL_LOCAL_TERRA,
  CUSTOM_ERROR_DIALOG,
} from '../../public/constants';

export default function Onboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDockerSetup, setIsDockerSetup] = useState(false);
  const navigate = useNavigate();

  const handleOnChangeDeps = (e: any) => setIsDockerSetup(e.target.checked);

  const onSetLocalTerraPath = async () => {
    try {
      await ipcRenderer.invoke(SET_LOCAL_TERRA_PATH);
      navigate('/', { state: { firstOpen: true } });
    } catch (e: any) {
      await ipcRenderer.invoke(CUSTOM_ERROR_DIALOG, e);
    }
  };

  const onLocalTerraInstall = async () => {
    try {
      if (isLoading) {
        return;
      }
      setIsLoading(true);
      await ipcRenderer.invoke(INSTALL_LOCAL_TERRA);
      navigate('/', { state: { firstOpen: true } });
    } catch (e: any) {
      setIsLoading(false);
      return e;
    }
  };

  return (
    <div className="bg-terra-main-bg flex items-center justify-center fixed top-0 left-0 right-0 bottom-0 h-screen z-50">
      <div className="flex flex-col items-center justify-center block space-x-4">
        <TextLogo className="mb-12" />
        <FormGroup>
          <FormControlLabel
            onChange={handleOnChangeDeps}
            control={
              <Checkbox color="primary" className="onboard-checkbox p-0" />
            }
            className="text-white text-sm gap-2 ml-0"
            label="Docker is installed and running"
            classes={{ label: 'text-sm font-normal font-gotham' }}
          />
          {!isDockerSetup && (
            <a
              href="https://www.docker.com/products/docker-desktop/"
              target="_blank"
              rel="noreferrer"
              className="
                bg-terra-button-secondary
                text-white text-sm normal-case font-medium
                inline-flex justify-center items-center
                py-3 px-16 mt-4 rounded-3xl transition-all
                hover:brightness-90"
            >
              Install Docker
              <ExternalLink className="fill-white ml-2.5" />
            </a>
          )}

          <button
            type="button"
            disabled={!isDockerSetup}
            onClick={onSetLocalTerraPath}
            className="
              bg-terra-button-primary
              text-sm normal-case font-medium
              inline-flex justify-center items-center
              py-3 px-16 mt-4 rounded-3xl transition-all
              enabled:hover:bg-terra-button-secondary
              enabled:hover:text-white
              disabled:opacity-50"
          >
            Select LocalTerra directory
          </button>

          <button
            type="button"
            disabled={!isDockerSetup}
            onClick={onLocalTerraInstall}
            className="
              bg-terra-button-primary
              text-sm normal-case font-medium
              inline-flex justify-center items-center
              py-3 px-16 mt-4 rounded-3xl transition-all
              enabled:hover:bg-terra-button-secondary
              enabled:hover:text-white
              disabled:opacity-50"
          >
            {isLoading && <CircularProgress size={20} />}
            {!isLoading && 'Install LocalTerra'}
          </button>
          {isLoading && (
            <h3 className="text-sm text-white font-normal font-gotham mt-4 ml-3.5">
              Installing. This may take a few minutes...
            </h3>
          )}
        </FormGroup>
      </div>
    </div>
  );
}
