import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ContentCopy as ContentCopyIcon, FileCopy as FileCopyIcon } from '@mui/icons-material';

const TextCopyButton = (props: any) => {
  const [copied, setCopied] = React.useState(false);
  setTimeout(() => setCopied(false), copied ? 500 : 0);
  console.log('props in TextCopyButton', props);

  return (
    <CopyToClipboard
      {...props}
      className="text-blue-700 float-right ml-1"
      onCopy={() => setCopied(true)}
    >
      <button onClick={(e) => e.stopPropagation()} type="button">
        {copied ? <FileCopyIcon className="w-4 h-4" /> : <ContentCopyIcon className="w-4 h-4" />}
      </button>
    </CopyToClipboard>
  );
};

export default TextCopyButton;
