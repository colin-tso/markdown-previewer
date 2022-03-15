import '../node_modules/react-reflex/styles.css';
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex'
import React from 'react';
import { marked } from 'marked';
import { HighlightJS } from 'highlight.js';
import '../node_modules/highlight.js/styles/github.css';

marked.setOptions({
  breaks: true,
  highlight: function (code, lang) {
    try {
      return HighlightJS.highlight(code, { language: (lang ? lang : 'javascript') }).value;
    }
    catch (e) {
      console.log(e);
      return code;
    }
  }
});
const renderer = new marked.Renderer();

const mdPlaceholder = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`javascript
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

\`\`\`html
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
  <script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/marked/4.0.2/marked.min.js" type="module"></script>
  <title>React App</title>
</head>
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mdInput: mdPlaceholder
    };
    this.handleChange = this.handleChange.bind(this);
    this.onEditorScroll = this.onEditorScroll.bind(this);
    this.editorScroll = React.createRef();
    this.editorHighlightScroll = React.createRef();
    this._preventEvent = false;
    this.editorLastScroll = 0;
  }
  //handleChange
  handleChange(e) {
    this.setState({
      mdInput: e.target.value
    });
  }
  //handle editor scroll
  onEditorScroll(e) {
    if (this._preventEvent) {
      this._preventEvent = false;
      return;
    }

    if (e.target.scrollTop !== this.editorLastScroll) {
      this._preventEvent = true;
      this.editorScroll.current.scrollTop = e.target.scrollTop;
      this.editorHighlightScroll.current.scrollTop = e.target.scrollTop;
      this.editorLastScroll = e.target.scrollTop;
    }
  };

  render() {
    return (
      <ReflexContainer orientation="vertical">

        <ReflexElement className="left-pane">
          <h1 id="editor-title" className="pane-title">Markdown Editor</h1>
          <MDEditor onChange={this.handleChange} mdInput={this.state.mdInput} onScroll={this.onEditorScroll} editorRef={this.editorScroll} editorHighlightRef={this.editorHighlightScroll} />
        </ReflexElement>

        <ReflexSplitter />

        <ReflexElement className="right-pane">
          <MDPreview mdInput={this.state.mdInput} />
        </ReflexElement>

      </ReflexContainer >
    )
  };
};

const MDEditor = (props) => {
  return (
    <React.Fragment>
      <textarea
        title="Markdown Editor"
        id="editor"
        className="pane-content editor"
        spellCheck="false"
        placeholder="Enter your markdown code here"
        onChange={props.onChange}
        value={props.mdInput}
        onScroll={props.onScroll}
        ref={props.editorRef}
      />
      <pre id="editor-highlighted" className="pane-content" ref={props.editorHighlightRef}>
        <code
          dangerouslySetInnerHTML={{
            __html: HighlightJS.highlight(props.mdInput, { language: 'markdown' }).value
          }}
        />
      </pre>
    </React.Fragment>
  )
}


const MDPreview = (props) => {
  return (
    <div
      id="preview"
      className="pane-content preview"
      dangerouslySetInnerHTML={{
        __html: marked(props.mdInput, { renderer: renderer })
      }}
    />
  )
}

export default App;
