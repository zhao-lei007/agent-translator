import React from 'react';
import {Box, Text} from 'ink';

interface StatusLineProps {
  status: string;
  error?: string;
}

export const StatusLine: React.FC<StatusLineProps> = ({status, error}) => {
  return (
    <Box height={1} paddingX={1}>
      {error ? (
        <Text color="red">✗ {error}</Text>
      ) : status ? (
        <Text color="green">✓ {status}</Text>
      ) : (
        <Text dimColor>Ready</Text>
      )}
    </Box>
  );
};