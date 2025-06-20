import React from 'react';
import {Box, Text} from 'ink';
import Spinner from 'ink-spinner';

interface StatusLineProps {
  status: string;
  error?: string;
  isLoading?: boolean;
  toolStatus?: string;
}

export const StatusLine: React.FC<StatusLineProps> = ({status, error, isLoading, toolStatus}) => {
  return (
    <Box height={1} paddingX={1}>
      {error ? (
        <Text color="red">✗ {error}</Text>
      ) : toolStatus ? (
        <Text color="magenta">
          <Spinner type="dots" /> {toolStatus}
        </Text>
      ) : isLoading ? (
        <Text color="blue">
          <Spinner type="dots" /> {status || 'Processing...'}
        </Text>
      ) : status ? (
        <Text color="green">✓ {status}</Text>
      ) : (
        <Text dimColor>Ready</Text>
      )}
    </Box>
  );
};