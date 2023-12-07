import React, { useMemo } from 'react'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import isHotkey from 'is-hotkey'
import { Transforms, createEditor, Descendant, Editor } from 'slate'
import Grid2 from "@mui/material/Unstable_Grid2";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import {
  Slate,
  Editable,
  useSlateStatic,
  useSelected,
  useFocused,
  withReact,
  ReactEditor,
} from 'slate-react'
import { withHistory } from 'slate-history'
import { css } from '@emotion/css'
import {
  Switch,
  FormGroup,
  FormControlLabel,
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  IconButton,
  Fab,
} from "@mui/material";

/*
 * TODO
 *
 * let the images be dragged in
 * images deleted
 * hyperlinkk
 * save this to the db
 * render these all out in the comments
 *
 */


//import { Button, Icon, Toolbar } from '../components' // TODO 
import { ImageElement } from './custom-types.d'

const RichEditor = ({ onChange }) => {
  const editor = useMemo(
    () => withImages(withHistory(withReact(createEditor()))),
    []
  )

  return (
      <>
          <Slate editor={editor} initialValue={initialValue}
              onChange={value => {
                  const isAstChange = editor.operations.some(
                      op => 'set_selection' !== op.type
                  )
                  if (isAstChange) {
                      const content = JSON.stringify(value)
                      onChange(content)
                  }
              }}

      >
          {/*<Toolbar>
             <InsertImageButton />
             </Toolbar>*/}
          <Editable
              onKeyDown={event => {
                  if (isHotkey('mod+a', event)) {
                      event.preventDefault()
                      Transforms.select(editor, [])
                  }
              }}

              //onChange={(value) => {
              //    console.log("value", value)
              //}}

              renderElement={props => <Element {...props} />}
              placeholder="What do you want to talk about?"

              decorate={myDecorator}
              renderLeaf={Leaf}

              className={css`
                  outline: none;
                  margin: 1rem;
                  max-height: 20em;
                  overflow-y: auto;
                  white-space: pre-wrap;
                  word-break: break-word; 

                  `}
          />
      </Slate>
          <Grid2 display="flex" flexDirection={"row"} sx={{ marginTop: 2 }}>
              <Button>
                  <ImageOutlinedIcon />
              </Button>
              {/*<Button>
                 <UploadFileOutlinedIcon />
                 </Button>*/}
              {/*<Button>
                  <LinkOutlinedIcon 
                      onClick={() => {
                      }}
                  />
              </Button>*/}
          </Grid2>
      </>
  )
}

const withImages = editor => {
  const { insertData, isVoid } = editor

  editor.isVoid = element => {
    return element.type === 'image' ? true : isVoid(element)
  }

  editor.insertData = data => {
    const text = data.getData('text/plain')
    const { files } = data

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader()
        const [mime] = file.type.split('/')

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result
            insertImage(editor, url)
          })

          reader.readAsDataURL(file)
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}

const insertImage = (editor, url) => {
  const text = { text: '' }
  const image: ImageElement = { type: 'image', url, children: [text] }
  Transforms.insertNodes(editor, image)
  // insert a blank line after the image
  Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] })
}

const Element = props => {
  const { attributes, children, element } = props

  switch (element.type) {
    case 'image':
      return <Image {...props} />
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Image = ({ attributes, children, element }) => {
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, element)

  const selected = useSelected()
  const focused = useFocused()

  return (
    <div {...attributes}>
      {children}
      <div
        contentEditable={false}
        className={css`
          position: relative;
        `}
      >
        <img
          src={element.url}
          className={css`
            display: block;
            max-width: 100%;
            max-height: 20em;
            box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
          `}
        />
        <div
          //active
            onClick={() => {
                Transforms.removeNodes(editor, { at: path })
                console.log("getting clicked")
            }}
            className={css`
            display: ${focused && selected? 'inline' : 'none'};
            position: absolute;
            top: 0.5em;
            left: 0.5em;
            background-color: white;
          `}
        >
          <IconButton>delete</IconButton> {/* TODO */}
        </div>
      </div>
    </div>
  )
}

const InsertImageButton = () => {
  const editor = useSlateStatic()
  return (
      <>
    {/*<Button
      onMouseDown={event => {
        event.preventDefault()
        const url = window.prompt('Enter the URL of the image:')
        if (url && !isImageUrl(url)) {
          alert('URL is not an image')
          return
        }
        url && insertImage(editor, url)
      }}
    >
      <Icon>image</Icon>
    </Button>*/}
          </>
  )
}

const isImageUrl = url => {
  if (!url) return false
  if (!isUrl(url)) return false
  const ext = new URL(url).pathname.split('.').pop()
  return imageExtensions.includes(ext)
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
]


const myDecorator = ([node, path]) => {
  const nodeText = node.text;

  if (!nodeText) return [];

  const urls = findUrlsInText(nodeText);

  return urls.map(([url, index]) => {
    return {
      anchor: {
        path,
        offset: index,
      },
      focus: {
        path,
        offset: index + url.length,
      },
      decoration: "link",
    };
  });
};


const findUrlsInText = (text) => {
  const urlRegex =
    // eslint-disable-next-line no-useless-escape
    /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;

  const matches = text.match(urlRegex);

  return matches ? matches.map((m) => [m.trim(), text.indexOf(m.trim())]) : [];
};


const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.decoration === "link") {
    children = (
      <a
        style={{ cursor: "pointer" }}
        href={leaf.text}
        onClick={() => {
          window.open(leaf.text, "_blank", "noopener,noreferrer");
        }}
      >
        {children}
      </a>
    );
  }

  return <span {...attributes}>{children}</span>;

};

export default RichEditor
