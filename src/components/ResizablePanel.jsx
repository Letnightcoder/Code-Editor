import { useState, useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";

const ResizablePanel = ({
  children,
  initialWidth,
  minWidth,
  maxWidth,
  onResize,
}) => {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const container = panelRef.current.parentElement;
      const containerRect = container.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
        if (onResize) onResize(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, minWidth, maxWidth, onResize]);

  return (
    <Box
      ref={panelRef}
      position="relative"
      width={`${width}px`}
      height="100%"
      overflow="hidden"
    >
      {children}
      <Box
        position="absolute"
        right="0"
        top="0"
        bottom="0"
        width="4px"
        cursor="col-resize"
        bg="gray.600"
        _hover={{ bg: "blue.500" }}
        onMouseDown={() => setIsResizing(true)}
      />
    </Box>
  );
};

export default ResizablePanel;
