import React, { useMemo, useEffect, useCallback, useState } from 'react'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import isHotkey from 'is-hotkey'
import { Node, Transforms, createEditor, Descendant, Editor } from 'slate'
import Grid2 from "@mui/material/Unstable_Grid2";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import { useDropzone } from 'react-dropzone'
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

import DeleteIcon from '@mui/icons-material/Delete';
import { imageUpload } from "../../db_functions/imageDB";

/*
 * TODO
 *
 * [x] let the images be dragged in
 * ~~images deleted~~
 * ~~hyperlinkk~~
 * [x] save this to the db
 * [x] render these all out in the comments
 *
 */

const RichEditor = ({ onChange, readOnly, initialValue, post_id }) => {

  const editor = useMemo(
    () => withImages(withHistory(withReact(createEditor()))),
    []
  )

  const [processedInitialValue, setProcessedInitialValue] = React.useState([])

  useEffect(() => { // to ensure backwards compatitibility...
      if (!readOnly) return 
      if (typeof initialValue === 'string') {
          try {
              const parsed = JSON.parse(initialValue)
              setProcessedInitialValue(parsed)
              editor.children = parsed // hacky
          } catch (e) {
              setProcessedInitialValue([{ type: 'paragraph', children: [{ text: initialValue }] }])
              editor.children = [{ type: 'paragraph', children: [{ text: initialValue }] }] // hacky!
          }
      }

  }, [post_id])

  const onDrop = useCallback(async acceptedFiles => {
      const url = await imageUpload(acceptedFiles[0])
      insertImage(editor, url)
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
      onDrop,
      noClick: true,
      accept: {
          'image/png': ['.png'],
          'image/jpeg': ['.jpg', '.jpeg'],
          'image/gif': ['.gif'],
      }
  })

  return (
      <> 
          <div
              {...getRootProps()}
              className={css`
              `}
          >
          <Slate editor={editor} initialValue={readOnly? processedInitialValue : initialValue}
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
          <Editable
              readOnly={readOnly}
              onKeyDown={event => {
                  if (isHotkey('mod+a', event)) {
                      event.preventDefault()
                      Transforms.select(editor, [])
                  }
              }}

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

          { !readOnly && isDragActive &&
          <div
              className={css`
                  font-size: 0.7rem;
                  `}
          >
              <input {...getInputProps()} />
              &nbsp;
              {
                  isDragActive?
                      <p
                          className={css`
                              text-align: center;
                              color: grey;
                              `
                          }
                      >Drop the files here ...</p>: 
                          <p
                              className={css`
                                  text-align: center;
                                  color: grey;
                                  `}
                          >You can drag files here...</p>

              }
          </div>
          }
          </Slate>
              {/*{ !readOnly &&
          <Grid2 display="flex" flexDirection={"row"} sx={{ marginTop: 2 }}>
              <Button>
                  <ImageOutlinedIcon />
              </Button>
              [><Button>
                 <UploadFileOutlinedIcon />
                 </Button><]
              [><Button>
                  <LinkOutlinedIcon 
                      onClick={() => {
                      }}
                  />
              </Button><]
          </Grid2>
          }*/}
          </div>
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
  const image = { type: 'image', url, children: [text] }
  Transforms.insertNodes(editor, image)
  // insert a blank line after the image
  Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] })
}

const Element = props => {
  const { attributes, children, element, readOnly } = props

  switch (element.type) {
    case 'image':
      return <Image {...props} readOnly={readOnly} />
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Image = ({ attributes, children, element, readOnly }) => {
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
          {readOnly && <div
              //active
              onClick={() => {
                  Transforms.removeNodes(editor, { at: path })
                  console.log("getting clicked")
              }}
              className={css`
                  //display: ${focused && selected? 'inline' : 'none'};
                  display: inline;
                  position: absolute;
                  top: 0.5em;
                  left: 0.5em;
                  `}
          >
              <Fab size="small" color="dark" aria-label="delete" >
                  <DeleteIcon />
              </Fab>
          </div>}
      </div>
    </div>
  )
}

const isImageUrl = url => {
  if (!url) return false
  if (!isUrl(url)) return false
  const ext = new URL(url).pathname.split('.').pop()
  return imageExtensions.includes(ext)
}

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
