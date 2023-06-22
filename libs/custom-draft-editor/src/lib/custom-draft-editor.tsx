/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useRef, useState } from 'react';
import { CompositeDecorator, Editor, EditorState, Modifier } from 'draft-js';
import 'draft-js/dist/Draft.css';
import './styles.css';

export interface CustomDraftEditorProps {
  placeholders: string[];
}

export function CustomDraftEditor(props: CustomDraftEditorProps) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const editor = useRef(null);

  // Function to handle editor state changes
  const handleEditorChange = (newEditorState: any) => {
    setEditorState(newEditorState);
  };

  // Custom decorator to add a class name to the <span> element
  const spanDecorator = {
    strategy: (contentBlock: any, callback: any, contentState: any) => {
      contentBlock.findEntityRanges((character: any) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === 'SPAN'
        );
      }, callback);
    },
    component: (props: any) => {
      // @ts-ignore
      const { className } = contentState.getEntity(props.entityKey).getData();
      return <span className={className}>{props.children}</span>;
    },
  };

  // Apply the custom decorator to the editor
  const compositeDecorator = new CompositeDecorator([spanDecorator]);

  // Function to add a custom <span> element to the editor content
  const addCustomSpan = () => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();

    // Create the custom span entity
    const contentStateWithEntity = contentState.createEntity(
      'SPAN',
      'IMMUTABLE',
      {
        className: 'placeholder', // Add your desired classname
      }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    // Apply the custom span entity to the selected text
    const newContentState = Modifier.applyEntity(
      contentStateWithEntity,
      selection,
      entityKey
    );
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'apply-entity'
    );

    setEditorState(newEditorState);
  };

  return (
    <div>
      <h1>Welcome to CustomDraftEditor!</h1>
      <Editor
        ref={editor}
        editorState={editorState}
        onChange={handleEditorChange}
      />
      <button onClick={addCustomSpan}>add span elem</button>
    </div>
  );
}

export default CustomDraftEditor;
