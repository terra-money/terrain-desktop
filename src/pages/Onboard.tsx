import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { useNavigate } from 'react-router-dom';
import {
  CircularProgress, Checkbox, FormGroup, FormControlLabel,
} from '@material-ui/core';
import { ReactComponent as TerraLogoWithText } from '../assets/Terrarium-full-logo.svg';
import { ReactComponent as ExternalLink } from '../assets/External-link-white.svg';
import { SET_LOCAL_TERRA_PATH, INSTALL_LOCAL_TERRA, CUSTOM_ERROR_DIALOG } from '../constants';

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
      if (isLoading) { return; }
      setIsLoading(true);
      await ipcRenderer.invoke(INSTALL_LOCAL_TERRA);
      navigate('/', { state: { firstOpen: true } });
    } catch (e: any) {
      setIsLoading(false);
      return e;
    }
  };

  return (
    <div className="bg-terra-navy flex items-center justify-center fixed top-0 left-0 right-0 bottom-0 h-screen z-50">
      <div className="flex flex-col items-center justify-center block space-x-4">
        <TerraLogoWithText className="mb-12" />
        <FormGroup>
          <FormControlLabel
            onChange={handleOnChangeDeps}
            control={<Checkbox color="primary" />}
            label="Docker is installed and running"
          />
          {!isDockerSetup && (
            <a
              href="https://www.docker.com/products/docker-desktop/"
              target="_blank"
              rel="noreferrer"
              className="
                bg-terra-button-primary
                text-white text-sm normal-case font-medium
                inline-flex justify-center items-center
                py-3 px-16 mt-4 rounded-3xl transition-all
                hover:brightness-90"
            >
              Install Docker
              <ExternalLink style={{ marginLeft: 10 }} />
            </a>
          )}

          <button
            type="button"
            disabled={!isDockerSetup}
            onClick={onSetLocalTerraPath}
            className="
              bg-terra-button-secondary
              text-terra-text text-sm normal-case font-medium
              inline-flex justify-center items-center
              py-3 px-16 mt-4 rounded-3xl transition-all
              enabled:hover:brightness-90
              disabled:opacity-50"
          >
            Select LocalTerra directory
          </button>

          <button
            type="button"
            disabled={!isDockerSetup}
            onClick={onLocalTerraInstall}
            className="
              bg-terra-button-secondary
              text-terra-text text-sm normal-case font-medium
              inline-flex justify-center items-center
              py-3 px-16 mt-4 rounded-3xl transition-all
              enabled:hover:brightness-90
              disabled:opacity-50"
          >
            {isLoading && <CircularProgress size={20} />}
            {!isLoading && 'Install LocalTerra'}
          </button>
          {isLoading && <h3>Installing. This may take a few minutes...</h3>}
        </FormGroup>
      </div>
    </div>
  );
}
