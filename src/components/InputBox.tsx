import React, {useState} from 'react';
import {Box, Text, useStdin} from 'ink';
import TextInput from 'ink-text-input';

interface InputBoxProps {
  onSubmit: (text: string) => void;
}

export const InputBox: React.FC<InputBoxProps> = ({onSubmit}) => {
  const [value, setValue] = useState('');
  const {isRawModeSupported} = useStdin();

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
      setValue('');
    }
  };

  if (!isRawModeSupported) {
    return (
      <Box borderStyle="single" borderColor="yellow" paddingX={1}>
        <Text color="yellow">
          ⚠ Interactive mode not supported. Type 'exit' or use Ctrl+C to quit.
        </Text>
      </Box>
    );
  }

  return (
    <Box borderStyle="single" borderColor="blue" paddingX={1}>
      <Text color="blue">{'> '}</Text>
      <TextInput
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
        placeholder="Type your message here..."
      />
    </Box>
  );
};