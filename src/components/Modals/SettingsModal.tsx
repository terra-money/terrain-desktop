import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import { useForm, FieldValues } from 'react-hook-form';
import {
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Input,
  Button,
  Tooltip,
} from '@mui/material';
import { PROMPT_USER_RESTART, RESET_APP } from '../../constants';
import { ReactComponent as Close } from '../../assets/icons/close.svg';

export default function SettingsModal({ handleToggleClose }: { handleToggleClose: Function }) {
  const navigate = useNavigate();
  const { register, handleSubmit, resetField } = useForm();
  const [openAtLogin, setOpenAtLogin] = useState(false);
  const [liteMode, setLiteMode] = useState(false);
  const [localTerraPath, setLocalTerraPath] = useState('');
  const [blocktime, setBlocktime] = useState('default');
  const [isLoading, setIsLoading] = useState(true);

  const resetApplication = async () => {
    await ipcRenderer.invoke(RESET_APP);
  };

  const saveSettings = (data: FieldValues) => {
    window.store.setOpenAtLogin(data.openAtLogin);
    window.store.setLiteMode(data.liteMode);
    window.store.setLocalTerraPath(data.localTerraPath);
    window.store.setBlocktime(data.blocktime);
    if (
      localTerraPath !== data.localTerraPath
      || liteMode !== data.liteMode
      || blocktime !== data.blocktime
    ) {
      ipcRenderer.invoke(PROMPT_USER_RESTART);
    }
    navigate('/');
  };

  useEffect(() => {
    const updateCurrentSettings = async () => {
      const [currentOpenAtLogin, currentLiteMode, currentLocalTerraPath, currentBlocktime] = await Promise.all([
        window.store.getOpenAtLogin(),
        window.store.getLiteMode(),
        window.store.getLocalTerraPath(),
        window.store.getBlocktime(),
      ]);
      setOpenAtLogin(currentOpenAtLogin);
      setLiteMode(currentLiteMode);
      setLocalTerraPath(currentLocalTerraPath);
      setBlocktime(currentBlocktime);
      setIsLoading(false);
    };

    updateCurrentSettings();
  }, []);

  if (isLoading) return null;

  return (
    <div
      id="top-left-modal"
      data-modal-placement="top-left"
      tabIndex={-1}
      className="absolute top-2/4 left-2/4 transform -translate-x-2/4 -translate-y-2/4 w-5/12"
    >
      <div className="relative w-full max-w-xl">
        <div className="relative bg-white h-full rounded-lg shadow">
          <div className="flex justify-between items-center p-7 pb-5 rounded-t border-b">
            <h3 className="text-lg font-medium text-terra-text">Settings</h3>
            <button type="button" className="ml-auto">
              <Close
                onClick={() => handleToggleClose()}
                className="w-6 h-6 fill-terra-text hover:fill-terra-navy"
              />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-5 pl-3 py-7 space-y-6 text-sm font-medium text-terra-text">
            <form className="flex flex-col items-start gap-0.5">
              <FormControlLabel
                labelPlacement="start"
                control={(
                  <Checkbox
                    defaultChecked={openAtLogin}
                    classes={{ root: 'p-0' }}
                    {...register('openAtLogin')}
                  />
                )}
                label="Open Terrarium at startup"
                classes={{ label: 'text-sm font-medium font-gotham mr-2' }}
              />
              <br />
              <Tooltip title="disable LiteMode to run the FCD and access transactions and blocks with finder">
                <FormControlLabel
                  labelPlacement="start"
                  control={(
                    <Checkbox
                      defaultChecked={liteMode}
                      classes={{ root: 'p-0' }}
                      {...register('liteMode')}
                    />
                  )}
                  label="Run LocalTerra in LiteMode"
                  classes={{ label: 'text-sm font-medium font-gotham mr-2' }}
                />
              </Tooltip>
              <br />
              <FormControlLabel
                labelPlacement="start"
                control={(
                  <>
                    <Button
                      className="custom-browse-button text-terra-link text-sm font-medium font-gotham p-[2px]"
                      onClick={async () => {
                        const newPath = await ipcRenderer.invoke(
                          'SetLocalTerraPath',
                        );
                        resetField('localTerraPath', { defaultValue: newPath });
                      }}
                    >
                      Browse
                    </Button>
                    <Input
                      className="custom-input mx-3"
                      defaultValue={localTerraPath}
                      classes={{
                        input:
                          'text-sm text-terra-text font-normal font-gotham p-0 decoration-terra-text',
                      }}
                      {...register('localTerraPath')}
                    />
                  </>
                )}
                label="Path to LocalTerra"
                classes={{ label: 'text-sm font-medium font-gotham' }}
              />
              <br />
              <FormControlLabel
                labelPlacement="start"
                control={(
                  <div className="pl-4">
                    <Select
                      size="small"
                      defaultValue={blocktime}
                      {...register('blocktime')}
                      className="custom-select-settings"
                      classes={{
                        select:
                          'text-sm text-terra-text leading-[18px] pl-1.5 py-[3px] rounded border border-[#CFD8EA]',
                        icon: 'text-[16px] my-1 text-terra-text',
                      }}
                    >
                      <MenuItem value="default">Default (5 seconds)</MenuItem>
                      <MenuItem value="1s">1 second</MenuItem>
                      <MenuItem value="200ms">200 milliseconds</MenuItem>
                    </Select>
                  </div>
                )}
                label="Time between Terra blocks"
                classes={{ label: 'text-sm font-medium font-gotham' }}
              />
              <br />
              <Tooltip title="Reset Factory Settings">
                <button
                  onClick={() => {
                    resetApplication();
                  }}
                  type="button"
                  className="text-not-connected-red text-sm font-medium ml-4 px-8 py-1.5 rounded-3xl border border-not-connected-red
                    hover:bg-red-100 focus:ring-4 focus:outline-none focus:ring-red-200 focus:z-10"
                >
                  Reset
                </button>
              </Tooltip>
            </form>
          </div>
          <div className="flex items-center py-5 px-7 rounded-b border-t border-gray-200">
            <button
              data-modal-toggle="top-left-modal"
              type="button"
              onClick={() => handleSubmit(saveSettings)()}
              className="bg-terra-button-primary text-white text-sm font-medium ml-auto px-14 py-3.5 rounded-3xl
              hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
