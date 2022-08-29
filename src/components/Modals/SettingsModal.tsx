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
} from '@mui/material';
import { PROMPT_USER_RESTART } from '../../constants';

export default function SettingsModal({ handleToggleClose }: { handleToggleClose: Function}) {
  const navigate = useNavigate();
  const { register, handleSubmit, resetField } = useForm();
  const [openAtLogin, setOpenAtLogin] = useState(false);
  const [localTerraPath, setLocalTerraPath] = useState('');
  const [blocktime, setBlocktime] = useState('default');
  const [isLoading, setIsLoading] = useState(true);

  const saveSettings = (data: FieldValues) => {
    window.store.setOpenAtLogin(data.openAtLogin);
    window.store.setLocalTerraPath(data.localTerraPath);
    window.store.setBlocktime(data.blocktime);
    if (
      localTerraPath !== data.localTerraPath
      || blocktime !== data.blocktime
    ) {
      ipcRenderer.invoke(PROMPT_USER_RESTART);
    }
    navigate('/');
  };

  useEffect(() => {
    const updateCurrentSettings = () => {
      const currentOpenAtLogin = window.store.getOpenAtLogin();
      setOpenAtLogin(currentOpenAtLogin);

      const currentLocalTerraPath = window.store.getLocalTerraPath();
      setLocalTerraPath(currentLocalTerraPath);

      const currentBlocktime = window.store.getBlocktime();
      setBlocktime(currentBlocktime);

      setIsLoading(false);
    };

    updateCurrentSettings();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <div
      id="top-left-modal"
      data-modal-placement="top-left"
      tabIndex={-1}
      className="absolute top-2/4 left-2/4 transform -translate-x-2/4 -translate-y-2/4 w-5/12"
    >
      <div className="relative w-full">
        <div className="relative bg-white h-full rounded-lg shadow dark:bg-gray-700">
          <div className="flex justify-between items-center p-5 rounded-t border-b dark:border-gray-600">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Settings
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg
              text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="top-left-modal"
            >
              <svg
                onClick={() => handleToggleClose()}
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1
                   1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-6 pb-12 space-y-6">
            <form>
              <FormControlLabel
                labelPlacement="start"
                control={(
                  <Checkbox
                    defaultChecked={openAtLogin}
                    {...register('openAtLogin')}
                  />
                )}
                label="Open Terrarium at startup"
              />
              <br />
              <FormControlLabel
                labelPlacement="start"
                control={(
                  <>
                    <Button
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
                      className="ml-2 pl-1 pr-1"
                      defaultValue={localTerraPath}
                      {...register('localTerraPath')}
                    />
                  </>
                )}
                label="Path to LocalTerra"
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
                      className="flex"
                    >
                      <MenuItem value="default">Default (5 seconds)</MenuItem>
                      <MenuItem value="1s">1 second</MenuItem>
                      <MenuItem value="200ms">200 milliseconds</MenuItem>
                    </Select>
                  </div>
                )}
                label="Time between Terra blocks"
              />
            </form>
          </div>
          <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
            <button
              data-modal-toggle="top-left-modal"
              type="button"
              onClick={() => handleSubmit(saveSettings)()}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg
              text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save
            </button>
            <button
              onClick={() => handleToggleClose()}
              data-modal-toggle="top-left-modal"
              type="button"
              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200
              text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white
              dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
