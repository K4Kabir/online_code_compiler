import React, { useRef } from "react";
import Editor from "@monaco-editor/react";

function App({ font, Language, theme, handleInput }) {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function showValue() {
    alert(editorRef.current?.getValue());
  }

  return (
    <>
      <Editor
        height="90vh"
        options={{
          fontSize: font,
        }}
        theme={`vs-${theme}`}
        language={Language}
        defaultValue={`// Line 1\n// Line 2\n// Line 3\n// Line 4\n// Line 5`}
        onMount={handleEditorDidMount}
        onChange={(e) => handleInput(e)}
      />
    </>
  );
}

export default App;
