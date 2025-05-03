import { useState, useRef, useEffect } from "react";
import {
  Box,
  Input,
  Text,
  VStack,
  Flex,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";

const Terminal = ({ onExecute, output, onClear }) => {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (command.trim()) {
        setHistory((prev) => [...prev, command]);
        setHistoryIndex(-1);
        onExecute(command);
        setCommand("");
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand("");
      }
    }
  };

  return (
    <Box
      bg={colorMode === "dark" ? "gray.800" : "gray.100"}
      color={colorMode === "dark" ? "white" : "black"}
      p={4}
      borderRadius="md"
      h="100%"
      display="flex"
      flexDirection="column"
    >
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontWeight="bold">Terminal</Text>
        <IconButton
          icon={<CloseIcon />}
          size="sm"
          variant="ghost"
          onClick={onClear}
          aria-label="Clear terminal"
        />
      </Flex>
      <Box
        flex={1}
        overflow="auto"
        mb={2}
        fontFamily="monospace"
        fontSize="sm"
        whiteSpace="pre-wrap"
      >
        {output.split("\n").map((line, i) => (
          <Text key={i}>{line}</Text>
        ))}
      </Box>
      <Flex align="center">
        <ChevronRightIcon color="green.500" mr={2} />
        <Input
          ref={inputRef}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter command..."
          variant="unstyled"
          fontFamily="monospace"
          fontSize="sm"
          _placeholder={{
            color: colorMode === "dark" ? "gray.500" : "gray.400",
          }}
        />
      </Flex>
    </Box>
  );
};

export default Terminal;
