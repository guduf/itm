import * as React from 'react';
import { render } from 'react-dom';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-yaml';
import * as PrismDecorator from 'draft-js-prism';

class PrismDraft extends React.Component {
  constructor(props) {
    super(props);
    this._onChange = (
      (editorState) => this.setState(state => ({
        ...state,
        editorState: props.onChange(editorState)
      }))
    );
    const decorator = new PrismDecorator({
      // Provide your own instance of PrismJS
      prism: Prism,
      defaultSyntax: 'yaml',
    });
    console.log(decorator, Prism.languages.insertBefore());
    const contentState = convertFromRaw({
      entityMap: {},
      block: [{type: 'code-block'}]
    });
    this.state = {editorState: EditorState.createWithContent(contentState, decorator)};
  }

  render() {
    return React.createElement(Editor, {
      editorState: this.state.editorState,
      onChange: this._onChange
    });
  }
}

function buildPrismDraft(nativeElement, onChange) {
  render(
    React.createElement(PrismDraft, {onChange}),
    nativeElement
  );
}

if (typeof window !== 'undefined') window['buildPrismDraft'] = buildPrismDraft;
