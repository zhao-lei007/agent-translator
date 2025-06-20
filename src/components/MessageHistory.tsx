import React from 'react';
import {Box, Text} from 'ink';
import {Message} from './App.js';

interface MessageHistoryProps {
  messages: Message[];
}

export const MessageHistory: React.FC<MessageHistoryProps> = ({messages}) => {
  return (
    <Box 
      flexDirection="column" 
      flexGrow={1} 
      borderStyle="single" 
      borderColor="gray"
      paddingX={1}
      overflowY="hidden"
    >
      {messages.length === 0 ? (
        <Text dimColor>No messages yet. Type something to start!</Text>
      ) : (
        messages.map((message) => (
          <Box key={message.id} marginBottom={1}>
            <Text color="cyan">[{message.timestamp.toLocaleTimeString()}]</Text>
            <Text> {message.text}</Text>
          </Box>
        ))
      )}
    </Box>
  );
};