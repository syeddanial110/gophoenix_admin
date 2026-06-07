import React, { useCallback, useEffect, useRef, useState } from 'react'
import './UIRichTextEditor.css'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { ListNode, ListItemNode } from '@lexical/list'
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $getSelection,
  $isRangeSelection,
  $getRoot,
  $createParagraphNode,
  $createTextNode,
} from 'lexical'
import { $patchStyleText, $getSelectionStyleValueForProperty } from '@lexical/selection'
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  $createListNode,
  $createListItemNode,
} from '@lexical/list'
import { $generateHtmlFromNodes } from '@lexical/html'

const FONT_SIZES = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px']

const theme = {
  paragraph: 'editor-paragraph',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
  },
  list: {
    ul: 'editor-list-ul',
    ol: 'editor-list-ol',
    listitem: 'editor-listitem',
  },
}

const baseConfig = {
  theme,
  nodes: [ListNode, ListItemNode],
  onError(error) {
    console.error(error)
  },
}

// Converts editor state to HTML and calls setHtmlOutput on every change
function HtmlOutputPlugin({ setHtmlOutput }) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor, null)
        setHtmlOutput?.(html)
      }, { editor })
    })
  }, [editor, setHtmlOutput])

  return null
}

// Walk inline DOM nodes, accumulate bold/italic/underline/strikethrough/fontSize/color,
// and append Lexical TextNodes directly. This avoids $generateNodesFromDOM's limitation
// of only applying one level's forChild callback, which caused font-size to be dropped
// when it appeared on <strong> or <span> inside <strong>.
function parseInline(domNode, fmt, lexicalParent) {
  for (const child of domNode.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent
      if (!text) continue
      const textNode = $createTextNode(text)
      if (fmt.bold) textNode.toggleFormat('bold')
      if (fmt.italic) textNode.toggleFormat('italic')
      if (fmt.underline) textNode.toggleFormat('underline')
      if (fmt.strikethrough) textNode.toggleFormat('strikethrough')
      const styleParts = []
      if (fmt.fontSize) styleParts.push(`font-size: ${fmt.fontSize}`)
      if (fmt.color) styleParts.push(`color: ${fmt.color}`)
      if (styleParts.length) textNode.setStyle(styleParts.join('; '))
      lexicalParent.append(textNode)
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const tag = child.tagName.toLowerCase()
      if (tag === 'br') continue
      const f = { ...fmt }
      if (tag === 'b' || tag === 'strong') f.bold = true
      if (tag === 'i' || tag === 'em') f.italic = true
      if (tag === 'u') f.underline = true
      if (tag === 's' || tag === 'del' || tag === 'strike') f.strikethrough = true
      if (child.style.fontSize) f.fontSize = child.style.fontSize
      if (child.style.color) f.color = child.style.color
      if (child.style.fontWeight === 'bold' || child.style.fontWeight === '700') f.bold = true
      if (child.style.fontStyle === 'italic') f.italic = true
      parseInline(child, f, lexicalParent)
    }
  }
}

function parseBlock(el) {
  const tag = el.tagName?.toLowerCase()
  if (!tag) return null

  if (tag === 'ul' || tag === 'ol') {
    const listNode = $createListNode(tag === 'ul' ? 'bullet' : 'number')
    for (const child of el.childNodes) {
      if (child.nodeType !== Node.ELEMENT_NODE) continue
      if (child.tagName?.toLowerCase() !== 'li') continue
      const listItem = $createListItemNode()
      parseInline(child, {}, listItem)
      listNode.append(listItem)
    }
    return listNode
  }

  const para = $createParagraphNode()
  if (el.style?.textAlign) para.setFormat(el.style.textAlign)
  parseInline(el, {}, para)
  return para
}

function loadHtmlIntoEditor(editor, html) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  editor.update(() => {
    const root = $getRoot()
    root.clear()
    let hasContent = false
    for (const child of doc.body.childNodes) {
      if (child.nodeType !== Node.ELEMENT_NODE) continue
      const node = parseBlock(child)
      if (node) { root.append(node); hasContent = true }
    }
    if (!hasContent) root.append($createParagraphNode())
  })
}

// Loads htmlOutput into the editor once when it first becomes non-empty
function InitialHtmlPlugin({ htmlOutput }) {
  const [editor] = useLexicalComposerContext()
  const hasLoaded = useRef(false)

  useEffect(() => {
    if (!htmlOutput || hasLoaded.current) return
    hasLoaded.current = true
    loadHtmlIntoEditor(editor, htmlOutput)
  }, [htmlOutput, editor])

  return null
}

function ToolbarButton({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`toolbar-btn${active ? ' active' : ''}`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="toolbar-divider" />
}

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  })
  const [fontSize, setFontSize] = useState('16px')

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setActiveFormats({
        bold: selection.hasFormat('bold'),
        italic: selection.hasFormat('italic'),
        underline: selection.hasFormat('underline'),
        strikethrough: selection.hasFormat('strikethrough'),
      })
      const size = $getSelectionStyleValueForProperty(selection, 'font-size', '16px')
      setFontSize(size)
    }
  }, [])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar()
      }, { editor })
    })
  }, [editor, updateToolbar])

  const format = (type) => editor.dispatchCommand(FORMAT_TEXT_COMMAND, type)
  const align = (type) => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, type)

  const applyFontSize = (size) => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { 'font-size': size })
      }
    })
    setFontSize(size)
  }

  return (
    <div className="toolbar">
      <ToolbarButton onClick={() => editor.dispatchCommand(UNDO_COMMAND)} title="Undo">
        ↩
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.dispatchCommand(REDO_COMMAND)} title="Redo">
        ↪
      </ToolbarButton>

      <Divider />

      <select
        className="toolbar-select"
        value={fontSize}
        onChange={(e) => applyFontSize(e.target.value)}
        title="Font Size"
      >
        {FONT_SIZES.map((size) => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>

      <Divider />

      <ToolbarButton onClick={() => format('bold')} active={activeFormats.bold} title="Bold">
        <b>B</b>
      </ToolbarButton>
      <ToolbarButton onClick={() => format('italic')} active={activeFormats.italic} title="Italic">
        <i>I</i>
      </ToolbarButton>
      <ToolbarButton onClick={() => format('underline')} active={activeFormats.underline} title="Underline">
        <u>U</u>
      </ToolbarButton>
      <ToolbarButton onClick={() => format('strikethrough')} active={activeFormats.strikethrough} title="Strikethrough">
        <s>S</s>
      </ToolbarButton>

      <Divider />

      <ToolbarButton onClick={() => align('left')} title="Align Left">
        ⬛
      </ToolbarButton>
      <ToolbarButton onClick={() => align('center')} title="Align Center">
        ☰
      </ToolbarButton>
      <ToolbarButton onClick={() => align('right')} title="Align Right">
        ≡
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND)}
        title="Bullet List"
      >
        • ≡
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND)}
        title="Numbered List"
      >
        1. ≡
      </ToolbarButton>
    </div>
  )
}

const UIRichTextEditor = ({
  placeholder = 'Start typing here...',
  setHtmlOutput,
  htmlOutput,
}) => {
  const initialConfig = useRef({
    ...baseConfig,
    namespace: `UIRichTextEditor-${Math.random().toString(36).slice(2)}`,
  }).current

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<div className="editor-placeholder">{placeholder}</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <ListPlugin />
        <HtmlOutputPlugin setHtmlOutput={setHtmlOutput} />
        <InitialHtmlPlugin htmlOutput={htmlOutput} />
      </div>
    </LexicalComposer>
  )
}

export default UIRichTextEditor
