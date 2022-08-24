import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import { useForm, FieldValues } from 'react-hook-form';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

export default function Settings() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    resetField,
    reset,
  } = useForm();
  const [openAtLogin, setOpenAtLogin] = useState(false);
  const [localTerraPath, setLocalTerraPath] = useState('');
  const [blocktime, setBlocktime] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const saveSettings = async (data: FieldValues) => {
    window.store.setOpenAtLogin(data.openAtLogin);

    if (localTerraPath !== data.localTerraPath || blocktime !== data.blocktime) {
      window.store.setLocalTerraPath(data.localTerraPath);
      window.store.setBlocktime(data.blocktime);
      await ipcRenderer.invoke('promptUserRestart');
    }

    navigate('/');
  };

  useEffect(() => {
    const updateCurrentSettings = async () => {
      const currentOpenAtLogin = await window.store.getOpenAtLogin();
      setOpenAtLogin(currentOpenAtLogin);

      const currentLocalTerraPath = window.store.getLocalTerraPath();
      setLocalTerraPath(currentLocalTerraPath);

      const currentBlockTime = await ipcRenderer.invoke('getBlocktime');
      setBlocktime(currentBlockTime);

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
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 w-full md:inset-0 h-modal md:h-full"
    >
      <div className="relative w-full h-full">
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
                onClick={() => navigate('/')}
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
          <div className="p-6 space-y-6">
            <form>
              <FormControlLabel
                labelPlacement="end"
                control={(
                  <Checkbox
                    {...register('openAtLogin')}
                    defaultChecked={openAtLogin}
                  />
                )}
                label="Open Terrarium at startup"
              />
              <br />
              <br />
              <FormControl sx={{ minWidth: 190 }}>
                <InputLabel>Block Time</InputLabel>
                <Select
                  {...register('blocktime')}
                  size="medium"
                  label="Block Time"
                  defaultValue={blocktime}
                >
                  <MenuItem value="default">Default (5 seconds)</MenuItem>
                  <MenuItem value="1s">1 second</MenuItem>
                  <MenuItem value="200ms">200 milliseconds</MenuItem>
                </Select>
              </FormControl>
              <br />
              <br />
              <FormControl sx={{ minWidth: 400 }}>
                <TextField
                  {...register('localTerraPath')}
                  label="LocalTerra Path"
                  defaultValue={localTerraPath}
                  InputProps={{
                    endAdornment: (
                      <Button onClick={async () => {
                        const newPath = await ipcRenderer.invoke('setLocalTerraPath', false);
                        if (newPath) {
                          resetField('localTerraPath', { defaultValue: newPath });
                        }
                      }}
                      >
                        Browse
                      </Button>
                    ),
                  }}
                />
              </FormControl>
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
              onClick={() => {
                reset();
                navigate('/');
              }}
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
