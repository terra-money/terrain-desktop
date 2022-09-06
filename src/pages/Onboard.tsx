import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { useNavigate } from 'react-router-dom';
import {
  Checkbox, FormGroup, FormControlLabel, Button,
} from '@material-ui/core';
import { ReactComponent as TerraLogo } from '../assets/terra-logo-base.svg';
import { SET_LOCAL_TERRA_PATH, INSTALL_LOCAL_TERRA, CUSTOM_ERROR_DIALOG } from '../constants';

export default function Onboard() {
  const [isDockerInstalled, setIsDockerInstalled] = useState(false);
  const [isDockerRunning, setDockerIsRunning] = useState(false);
  const navigate = useNavigate();

  const handleOnChangeDeps = (e: any) => setIsDockerInstalled(e.target.checked);
  const handleOnDocker = (e: any) => setDockerIsRunning(e.target.checked);

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
      await ipcRenderer.invoke(INSTALL_LOCAL_TERRA);
      navigate('/', { state: { firstOpen: true } });
    } catch (e: any) { return e; }
  };

  return (
    <div
      className="flex items-center justify-center bg-terra-dark-blue h-screen"
      style={{
        position: 'fixed', top: '0', right: '0', bottom: '0', left: '0', zIndex: '10000',
      }}
    >
      <div className="flex flex-col items-center block space-x-4">
        <div className="block h-40 w-40 mb-4">
          <TerraLogo />
        </div>
        <FormGroup>
          <FormControlLabel onChange={handleOnChangeDeps} control={<Checkbox color="primary" />} label="I have Docker and Git Installed" />
          <FormControlLabel disabled={!isDockerInstalled} onChange={handleOnDocker} control={<Checkbox color="primary" />} label="Docker is currently running" />
          <Button
            variant="contained"
            style={{ marginBottom: 10 }}
            disabled={!(isDockerRunning && isDockerInstalled)}
            onClick={onSetLocalTerraPath}
          >
            I already have LocalTerra installed
          </Button>
          <Button variant="contained" disabled={!(isDockerRunning && isDockerInstalled)} onClick={onLocalTerraInstall}> Install LocalTerra</Button>
        </FormGroup>
      </div>
    </div>
  );
}
