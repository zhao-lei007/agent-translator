import React from 'react';
import {Box, Text} from 'ink';
import Spinner from 'ink-spinner';

interface StatusLineProps {
  status: string;
  error?: string;
  isLoading?: boolean;
}

export const StatusLine: React.FC<StatusLineProps> = ({status, error, isLoading}) => {
  return (
    <Box height={1} paddingX={1}>
      {error ? (
        <Text color="red">✗ {error}</Text>
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