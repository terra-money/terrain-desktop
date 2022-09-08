import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { useNavigate } from 'react-router-dom';
import {
  FormGroup, Button, CircularProgress, FormControlLabel, Checkbox,
} from '@material-ui/core';
import { ReactComponent as TerraLogoWithText } from '../assets/logo-with-text.svg';
import { ReactComponent as ExternalLink } from '../assets/external-link.svg';
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
      setIsLoading(true);
      await ipcRenderer.invoke(INSTALL_LOCAL_TERRA);
      navigate('/', { state: { firstOpen: true } });
    } catch (e: any) {
      setIsLoading(false);
      return e;
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{
        position: 'fixed', top: '0', right: '0', bottom: '0', left: '0', zIndex: '10000', backgroundColor: 'rgba(191, 219, 254, 1)',
      }}
    >
      <div className="flex flex-col items-center justify-center block space-x-4">
        <TerraLogoWithText />
        <FormGroup>
          <FormControlLabel onChange={handleOnChangeDeps} control={<Checkbox color="primary" />} label="Docker is installed and running" />
          {!isDockerSetup && (
          <Button>
            <a href="https://www.docker.com/products/docker-desktop/" target="_blank" rel="noreferrer">Install Docker</a>
            <ExternalLink style={{ marginLeft: 10 }} />
          </Button>
          )}
          <Button
            variant="contained"
            style={{ margin: '20px 0px' }}
            disabled={!isDockerSetup}
            onClick={onSetLocalTerraPath}
          >
            LocalTerra is already installed
          </Button>
          <Button
            variant="contained"
            disabled={!isDockerSetup}
            onClick={onLocalTerraInstall}
          >
            {isLoading && <CircularProgress size={20} />}
            {!isLoading && 'Install LocalTerra'}
          </Button>
        </FormGroup>
      </div>
    </div>
  );
}
