import { useState, useCallback } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Select,
  useToast,
  VStack,
  Spinner,
  Text,
  useColorMode,
  Tabs as ChakraTabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import FileExplorer from "./components/FileExplorer";
import Tabs from "./components/Tabs";
import ThemeToggle from "./components/ThemeToggle";
import ResizablePanel from "./components/ResizablePanel";
import Terminal from "./components/Terminal";
import { ThemeProvider } from "./context/ThemeContext";

const LANGUAGES = {
  python: { name: "Python", version: "3.10.0", id: "python" },
  javascript: { name: "JavaScript", version: "18.15.0", id: "javascript" },
  java: { name: "Java", version: "15.0.2", id: "java" },
  typescript: { name: "TypeScript", version: "5.0.0", id: "typescript" },
  cpp: { name: "C++", version: "17.0.0", id: "cpp" },
  csharp: { name: "C#", version: "10.0.0", id: "csharp" },
  go: { name: "Go", version: "1.20.0", id: "go" },
  rust: { name: "Rust", version: "1.70.0", id: "rust" },
};

function App() {
  const [files, setFiles] = useState([
    {
      id: "1",
      name: "main.js",
      content: "// Write your code here",
      language: "javascript",
      isActive: true,
    },
  ]);
  const [activeFile, setActiveFile] = useState("1");
  const [output, setOutput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [fileExplorerWidth, setFileExplorerWidth] = useState(250);
  const toast = useToast();
  const { colorMode } = useColorMode();

  const handleEditorChange = useCallback(
    (value) => {
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === activeFile ? { ...file, content: value || "" } : file
        )
      );
    },
    [activeFile]
  );

  const handleEditorDidMount = () => {
    setIsEditorReady(true);
  };

  const handleEditorError = () => {
    toast({
      title: "Editor Error",
      description: "Failed to load the code editor",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleFileSelect = (fileId) => {
    setActiveFile(fileId);
    setFiles((prevFiles) =>
      prevFiles.map((file) => ({
        ...file,
        isActive: file.id === fileId,
      }))
    );
  };

  const handleFileCreate = (fileName) => {
    const newFile = {
      id: Date.now().toString(),
      name: fileName,
      content: "",
      language: "javascript",
      isActive: false,
    };
    setFiles((prevFiles) => [...prevFiles, newFile]);
    handleFileSelect(newFile.id);
  };

  const handleFileDelete = (fileId) => {
    if (files.length === 1) {
      toast({
        title: "Error",
        description: "Cannot delete the last file",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setFiles((prevFiles) => {
      const newFiles = prevFiles.filter((file) => file.id !== fileId);
      if (fileId === activeFile) {
        setActiveFile(newFiles[0].id);
        newFiles[0].isActive = true;
      }
      return newFiles;
    });
  };

  const handleTabClose = (fileId) => {
    handleFileDelete(fileId);
  };

  const handleTerminalCommand = async (command) => {
    const activeFileData = files.find((file) => file.id === activeFile);
    if (!activeFileData) return;

    setTerminalOutput((prev) => `${prev}$ ${command}\n`);

    try {
      if (command.startsWith("run")) {
        await executeCode();
      } else if (command.startsWith("clear")) {
        setTerminalOutput("");
      } else if (command.startsWith("help")) {
        setTerminalOutput(
          (prev) =>
            `${prev}Available commands:\n- run: Execute the current file\n- clear: Clear the terminal\n- help: Show this help message\n`
        );
      } else {
        setTerminalOutput(
          (prev) =>
            `${prev}Unknown command. Type 'help' for available commands.\n`
        );
      }
    } catch (error) {
      setTerminalOutput((prev) => `${prev}Error: ${error.message}\n`);
    }
  };

  const executeCode = async () => {
    const activeFileData = files.find((file) => file.id === activeFile);
    if (!activeFileData) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://emkc.org/api/v2/piston/execute",
        {
          language: LANGUAGES[activeFileData.language].id,
          version: LANGUAGES[activeFileData.language].version,
          files: [
            {
              content: activeFileData.content,
            },
          ],
        }
      );

      const result = response.data.run.output || "No output";
      setOutput(result);
      setTerminalOutput((prev) => `${prev}Execution completed:\n${result}\n`);
    } catch (error) {
      toast({
        title: "Error executing code",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setOutput("Error executing code");
      setTerminalOutput((prev) => `${prev}Error: ${error.message}\n`);
    }
    setIsLoading(false);
  };

  const activeFileData = files.find((file) => file.id === activeFile);

  return (
    <ThemeProvider>
      <Container maxW="container.xxl" minH="100vh" py={4} px={10}>
        <Flex justify="space-between" align="center" mb={4}>
          <h1
            style={{
              color: colorMode === "dark" ? "white" : "black",
              fontSize: "2em",
              fontWeight: "bold",
            }}
          >
            Code Editor
          </h1>
          <ThemeToggle />
        </Flex>
        <Flex h="calc(100vh - 100px)" gap={4}>
          <ResizablePanel
            initialWidth={250}
            minWidth={200}
            maxWidth={400}
            onResize={setFileExplorerWidth}
          >
            <FileExplorer
              files={files}
              onFileSelect={handleFileSelect}
              onFileCreate={handleFileCreate}
              onFileDelete={handleFileDelete}
            />
          </ResizablePanel>
          <Box flex={1} display="flex" flexDirection="column">
            <Tabs
              files={files}
              activeFile={activeFile}
              onTabSelect={handleFileSelect}
              onTabClose={handleTabClose}
            />
            <ChakraTabs flex={1} display="flex" flexDirection="column">
              <TabList>
                <Tab>Editor</Tab>
                <Tab>Terminal</Tab>
              </TabList>
              <TabPanels flex={1} overflow="hidden">
                <TabPanel h="100%" p={0}>
                  <VStack spacing={4} align="stretch" h="100%">
                    <Flex gap={4} justify="space-between" align="center">
                      <Select
                        value={activeFileData?.language || "javascript"}
                        onChange={(e) => {
                          setFiles((prevFiles) =>
                            prevFiles.map((file) =>
                              file.id === activeFile
                                ? { ...file, language: e.target.value }
                                : file
                            )
                          );
                        }}
                        maxW="200px"
                        bg={colorMode === "dark" ? "white" : "gray.100"}
                        color={colorMode === "dark" ? "black" : "gray.900"}
                      >
                        {Object.entries(LANGUAGES).map(([key, lang]) => (
                          <option key={key} value={key}>
                            {lang.name}
                          </option>
                        ))}
                      </Select>
                      <Button
                        colorScheme="blue"
                        onClick={executeCode}
                        isLoading={isLoading}
                        loadingText="Executing..."
                        isDisabled={!isEditorReady}
                      >
                        Run Code
                      </Button>
                    </Flex>

                    <Box
                      flex={1}
                      border="1px"
                      borderColor={
                        colorMode === "dark" ? "gray.900" : "gray.200"
                      }
                      borderRadius="md"
                      position="relative"
                    >
                      {!isEditorReady && (
                        <Flex
                          position="absolute"
                          top="0"
                          left="0"
                          right="0"
                          bottom="0"
                          align="center"
                          justify="center"
                          bg={colorMode === "dark" ? "gray.50" : "white"}
                        >
                          <Spinner size="xl" />
                        </Flex>
                      )}
                      <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        language={activeFileData?.language || "javascript"}
                        value={activeFileData?.content || ""}
                        onChange={handleEditorChange}
                        onMount={handleEditorDidMount}
                        onError={handleEditorError}
                        theme={colorMode === "dark" ? "vs-dark" : "light"}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          wordWrap: "on",
                          automaticLayout: true,
                          scrollBeyondLastLine: false,
                          lineNumbers: "on",
                          folding: true,
                          renderLineHighlight: "all",
                          formatOnPaste: true,
                          formatOnType: true,
                          suggestOnTriggerCharacters: true,
                          quickSuggestions: true,
                          parameterHints: true,
                          autoClosingBrackets: true,
                          autoClosingQuotes: true,
                          autoIndent: true,
                        }}
                      />
                    </Box>

                    <Box
                      bg={colorMode === "dark" ? "black" : "gray.100"}
                      color={colorMode === "dark" ? "white" : "black"}
                      p={4}
                      borderRadius="md"
                      minH="150px"
                      maxH="300px"
                      overflow="auto"
                      fontFamily="monospace"
                      whiteSpace="pre-wrap"
                    >
                      <Text fontSize="md" as="div">
                        {output || "Output will appear here..."}
                      </Text>
                    </Box>
                  </VStack>
                </TabPanel>
                <TabPanel h="100%" p={0}>
                  <Terminal
                    onExecute={handleTerminalCommand}
                    output={terminalOutput}
                    onClear={() => setTerminalOutput("")}
                  />
                </TabPanel>
              </TabPanels>
            </ChakraTabs>
          </Box>
        </Flex>
      </Container>
    </ThemeProvider>
  );
}

export default App;
