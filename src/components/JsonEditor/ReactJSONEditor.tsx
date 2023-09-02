import * as React from "react";
// @ts-ignore
import JSONEditor, {JSONEditorOptions} from "jsoneditor";
import "jsoneditor/dist/jsoneditor.min.css";
import "./ReactJSONEditor.css";

interface ReactJSONEditorProps {
  json?: any;
  text?: any;
  name: string;
  mode?: string;
  modes?: string[];

  onJsonChange?(json: any): void;
}

class ReactJSONEditor extends React.Component<ReactJSONEditorProps> {
  private editor: JSONEditor | null = null;
  private editorref: HTMLDivElement | null = null;

  public componentDidMount() {
    this.createEditor();
  }

  public componentWillUnmount() {
    if (this.editor) {
      this.editor.destroy();
    }
  }

  // eslint-disable-next-line react/no-deprecated
  public componentWillReceiveProps(nextProps: ReactJSONEditorProps) {
    if (nextProps.json) {
      if (this.editor) {
        this.editor.update(nextProps.json);
      }
    } else if (nextProps.text) {
      if (this.editor) {
        this.editor.updateText(nextProps.text);
      }
    }
  }

  public createEditor() {
    this.editor = null;
    let mode = "form";
    let name = "JSON editor";
    if (this.props.mode) {
      mode = this.props.mode;
    }
    if (this.props.name) {
      name = this.props.name;
    }
    const container = this.editorref;
    let modes = ["form", "tree", "code", "view"];
    if (this.props.modes && this.props.modes.length > 0) {
      modes = this.props.modes;
    }
    const editorOptions = {
      mode,
      modes,
      name,
      search: false,
      onChange: this.handleJsonChange,
    } as JSONEditorOptions;
    if (container) {
      this.editor = new JSONEditor(container, editorOptions);
      if (this.props.json) {
        this.editor.set(this.props.json);
      } else if (this.props.text) {
        this.editor.setText(this.props.text);
      }
    }
  }

  public handleJsonChange = () => {
    try {
      const modifiedJson = this.editor ? this.editor.get() : undefined;
      if (this.props.onJsonChange) {
        this.props.onJsonChange(modifiedJson);
      }
    } catch (e) {
      return null;
    }
  };

  public render() {
    return (
      <div
        className="ReactJSONEditor"
        ref={(ref) => (this.editorref = ref)}
      />
    );
  }
}

export default ReactJSONEditor;
