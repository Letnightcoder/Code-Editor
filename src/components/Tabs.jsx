import { Box, Flex, Text, IconButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const Tabs = ({ files, activeFile, onTabSelect, onTabClose }) => {
  return (
    <Flex
      bg="gray.800"
      borderBottom="1px"
      borderColor="gray.700"
      overflowX="auto"
      h="40px"
    >
      {files.map((file) => (
        <Flex
          key={file.id}
          align="center"
          px={3}
          py={1}
          bg={file.id === activeFile ? "blue.500" : "gray.700"}
          cursor="pointer"
          onClick={() => onTabSelect(file.id)}
          _hover={{ bg: file.id === activeFile ? "blue.600" : "gray.600" }}
          minW="120px"
          maxW="200px"
        >
          <Text color="white" fontSize="sm" isTruncated flex={1} mr={2}>
            {file.name}
          </Text>
          <IconButton
            icon={<CloseIcon />}
            size="xs"
            variant="ghost"
            color="white"
            onClick={() => onTabClose(file.id)}
            _hover={{ bg: "transparent" }}
          />
        </Flex>
      ))}
    </Flex>
  );
};

export default Tabs;
