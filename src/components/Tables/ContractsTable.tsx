/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';
import {
  Table, Column, HeaderCell, Cell, RowDataType,
} from 'rsuite-table';
import 'rsuite-table/dist/css/rsuite-table.css';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { Collapse } from '@mui/material';
import { useTour } from '@reactour/tour';
import { SmartContract } from '../../models';
import { ReactComponent as ExternalLinkIcon } from '../../assets/external-link.svg';
import { REACT_APP_FINDER_URL } from '../../constants';
import { useWindowDimensions } from '../../utils';
import ContractMethodsView from '../ContractMethodsView';

type RowData = RowDataType & {
  name: string;
  path: string;
  address: string;
  codeId: number;
  schemas: any[] | null;
}

const ContractsTable = ({
  handleDeleteContract,
  handleQuery,
  handleExecute,
  handleRefreshRefs,
  contracts,
  contractCallResponseByAddress,
}: {
  contracts: SmartContract[];
  handleDeleteContract: Function;
  handleQuery: Function;
  handleExecute: Function;
  handleRefreshRefs: Function;
  contractCallResponseByAddress: any;
}) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
  const [hideCustomEllipsis, setHideCustomEllipsis] = useState(false);
  const [open, setOpen] = useState(false);

  const { width } = useWindowDimensions();
  const addressRef = useRef<any>();
  const { isOpen, currentStep } = useTour();

  useEffect(() => {
    if (isOpen && currentStep >= 10) setOpen(true);
  }, [currentStep]);

  useEffect(() => {
    if (addressRef?.current?.clientWidth > 319) {
      setHideCustomEllipsis(true);
    } else if (addressRef?.current?.clientWidth <= 319) {
      setHideCustomEllipsis(false);
    }
  }, [width]);

  const toggleContractRow = (address: any) => {
    let isCurrentlyOpen = false;
    const nextExpandedRowKeys = [];

    expandedRowKeys.forEach((key: string) => {
      if (key === address) {
        isCurrentlyOpen = true;
      } else {
        nextExpandedRowKeys.push(key);
      }
    });

    if (!isCurrentlyOpen) {
      nextExpandedRowKeys.push(address);
    }

    setExpandedRowKeys(nextExpandedRowKeys);
    setOpen(!!nextExpandedRowKeys.length);
  };

  return (
    <div className="flex-auto shadow-nav">
      <Table
        shouldUpdateScroll={false}
        autoHeight
        data={contracts}
        rowKey="address"
        rowHeight={100}
        rowExpandedHeight={500}
        headerHeight={68}
        expandedRowKeys={expandedRowKeys}
        hover={false}
        virtualized
        renderRow={(children, rowData) => (
          <div
            className={`${
              rowData && 'force-height-88 m-2 mr-4 shadow-row rounded-2xl'
            }`}
          >
            {children}
          </div>
        )}
        renderRowExpanded={(rowData) => (
          <div className="flex flex-row pt-[8px] gap-[10px] h-[480px] bg-gray-background">
            <div
              className={`bg-white border-2 border-blue-200 rounded-2xl shadow-row flex-1 lg:flex-2 h-[480px] overflow-y-scroll ${
                !contractCallResponseByAddress[rowData?.address] && 'mr-6'
              }`}
            >
              <Collapse
                in={open}
                timeout="auto"
                className="pl-8 pr-6 lg:px-16 py-8"
              >
                <ContractMethodsView
                  handleQuery={handleQuery}
                  handleExecute={handleExecute}
                  schemas={rowData?.schemas}
                  address={rowData?.address}
                />
              </Collapse>
            </div>
            {contractCallResponseByAddress[rowData?.address] && (
              <div className="bg-white mr-6 flex-1 h-[480px] w-full overflow-auto border-2 border-blue-200 rounded-2xl shadow-row">
                <Collapse in={open} timeout="auto" className="pr-8 pt-8">
                  <div className="inner-res-overflow overflow-auto">
                    <div className="mb-1 ml-8 xl:ml-12">
                      {contractCallResponseByAddress[rowData?.address]
                        && contractCallResponseByAddress[rowData?.address]}
                    </div>
                  </div>
                </Collapse>
              </div>
            )}
          </div>
        )}
      >
        <Column flexGrow={1} minWidth={120} align="left" verticalAlign="middle">
          <HeaderCell>
            <div className="text-blue-600 font-bold z-50 text-md lg:text-lg font-bold uppercase px-2 md:pl-5">
              Name
            </div>
          </HeaderCell>
          <Cell className="rounded-l-xl force-height-88 border-2 border-blue-200">
            {(rowData: RowData) => (
              <a
                className="inline-block text-blue-700 font-semibold text-sm md:text-base hover:text-blue-500 hover:underline"
                target="_blank"
                href={`${REACT_APP_FINDER_URL}/address/${rowData.address}`}
                rel="noreferrer"
                style={{ width: 'inherit' }}
              >
                <div className="bg-blue-200 flex items-center">
                  <div className="px-2 py-[34px] md:py-8 md:pl-5 md:pr-3 text-ellipsis overflow-hidden rounded-l-xl">
                    {rowData.name}
                  </div>
                  <div className="pr-2 md:pr-4 py-[38px]">
                    <ExternalLinkIcon />
                  </div>
                </div>
              </a>
            )}
          </Cell>
        </Column>
        <Column
          flexGrow={0.75}
          minWidth={100}
          align="center"
          verticalAlign="middle"
        >
          <HeaderCell>
            <div className="text-blue-600 font-bold z-50 text-md lg:text-lg font-bold uppercase">
              Code ID
            </div>
          </HeaderCell>
          <Cell
            dataKey="codeId"
            className="px-1 md:px-3 text-sm md:text-lg force-height-88 border-2 border-r-0 border-l-0 border-blue-200"
          />
        </Column>
        <Column
          flexGrow={width > 930 ? 1.25 : 0.75}
          align="center"
          verticalAlign="middle"
          colSpan={2}
        >
          <HeaderCell>
            <div className="text-blue-600 font-bold z-50 text-md lg:text-lg font-bold uppercase">
              Address
            </div>
          </HeaderCell>
          <Cell className="force-height-88 border-2 border-r-0 border-l-0 border-blue-200">
            {(rowData) => (
              <div className="flex" style={{ width: 'inherit' }}>
                <div
                  className="text-right text-[3px] text-ellipsis overflow-hidden text-transparent"
                  style={{ width: 'inherit' }}
                >
                  <span className="text-sm md:text-lg text-black">
                    {rowData.address.slice(0, rowData.address.length / 2)}
                  </span>
                </div>
                {!hideCustomEllipsis && (
                  <span className="text-sm md:text-lg text-black">...</span>
                )}
              </div>
            )}
          </Cell>
        </Column>
        <Column
          flexGrow={width > 930 ? 1.25 : 0.75}
          align="center"
          verticalAlign="middle"
        >
          <HeaderCell>{undefined}</HeaderCell>
          <Cell className="force-height-88 border-2 border-r-0 border-l-0 border-blue-200">
            {(rowData) => (
              <div
                className="text-left text-[3px] text-ellipsis overflow-hidden text-transparent"
                style={{ width: 'inherit', direction: 'rtl' }}
                ref={addressRef}
              >
                <span className="text-sm md:text-lg text-black">
                  {rowData.address.slice(
                    rowData.address.length / 2,
                    rowData.address.length,
                  )}
                </span>
              </div>
            )}
          </Cell>
        </Column>
        <Column width={24}>
          <HeaderCell>
            <div className="py-9" />
          </HeaderCell>
          <Cell className="px-1 md:px-3 text-sm md:text-lg force-height-88 border-2 border-blue-200" />
        </Column>
        <Column
          flexGrow={0.75}
          minWidth={100}
          align="right"
          verticalAlign="middle"
        >
          <HeaderCell>
            <div className="py-9" />
          </HeaderCell>
          <Cell className="rounded-r-2xl -ml-6 force-height-88 border-2 border-blue-200 border-l-0 rounded-r-2xl">
            {(rowData) => (
              <div className="inline-block">
                <button
                  type="button"
                  onClick={() => handleDeleteContract(rowData.codeId)}
                  className="text-blue"
                >
                  <DeleteIcon className="text-blue" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRefreshRefs(rowData.path)}
                  className="text-blue"
                >
                  <RefreshIcon className="text-blue" />
                </button>
                {rowData.schemas && (
                  <div className="inline-block px-3 pl-2">
                    <KeyboardArrowDownIcon
                      className={`cursor-pointer ${
                        expandedRowKeys.includes(rowData.address)
                          ? 'rotate-180'
                          : 'rotate-0'
                      }`}
                      onClick={() => toggleContractRow(rowData.address)}
                    />
                  </div>
                )}
              </div>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default React.memo(ContractsTable);
