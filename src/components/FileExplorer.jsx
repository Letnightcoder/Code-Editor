import { useState } from "react";
import {
  Box,
  VStack,
  Text,
  IconButton,
  Input,
  Button,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

const FileExplorer = ({ files, onFileSelect, onFileCreate, onFileDelete }) => {
  const [newFileName, setNewFileName] = useState("");
  const toast = useToast();

  const handleCreateFile = () => {
    if (!newFileName) {
      toast({
        title: "Error",
        description: "Please enter a file name",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onFileCreate(newFileName);
    setNewFileName("");
  };

  return (
    <Box
      w="250px"
      h="100%"
      bg="gray.800"
      p={4}
      borderRight="1px"
      borderColor="gray.700"
    >
      <VStack align="stretch" spacing={4}>
        <Text color="white" fontWeight="bold" fontSize="lg">
          Files
        </Text>
        <Flex gap={2}>
          <Input
            placeholder="New file name"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            color="white"
            size="sm"
          />
          <IconButton
            icon={<AddIcon />}
            onClick={handleCreateFile}
            size="sm"
            colorScheme="blue"
          />
        </Flex>
        <VStack align="stretch" spacing={2}>
          {files.map((file) => (
            <Flex
              key={file.id}
              justify="space-between"
              align="center"
              p={2}
              bg={file.isActive ? "blue.500" : "transparent"}
              borderRadius="md"
              cursor="pointer"
              onClick={() => onFileSelect(file.id)}
              _hover={{ bg: "gray.700" }}
            >
              <Text color="white">{file.name}</Text>
              <IconButton
                icon={<DeleteIcon />}
                size="xs"
                colorScheme="red"
                onClick={() => onFileDelete(file.id)}
              />
            </Flex>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default FileExplorer;
