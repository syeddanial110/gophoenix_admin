"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import { apiPost, ImageBaseUrl } from "@/apis/ApiRequest";

const HEADING_OPTIONS = [
  { label: "Normal", value: "p" },
  { label: "Heading 1", value: "h1" },
  { label: "Heading 2", value: "h2" },
  { label: "Heading 3", value: "h3" },
  { label: "Heading 4", value: "h4" },
  { label: "Blockquote", value: "blockquote" },
  { label: "Code Block", value: "pre" },
];

function ToolbarButton({ onClick, title, active, children, className = "" }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      title={title}
      className={`rte-btn ${active ? "rte-btn--active" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

function Separator() {
  return <div className="rte-sep" />;
}

export default function RichTextEditor({
  initialValue = "",
  onChange,
  placeholder = "Start typing here...",
  minHeight = 220,
  setHtmlOutput,
  htmlOutput
}) {
  console.log("htmlOutput", htmlOutput)
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState({});
  const [headingValue, setHeadingValue] = useState("p");
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [showSource, setShowSource] = useState(false);
  const [sourceCode, setSourceCode] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const savedRange = useRef(null);
  const hasInitialized = useRef(false);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedRange.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  };

  const exec = useCallback((command, value = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    updateState();
  }, []);

  const updateState = useCallback(() => {
    const formats = {
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikeThrough: document.queryCommandState("strikeThrough"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
      justifyRight: document.queryCommandState("justifyRight"),
      justifyFull: document.queryCommandState("justifyFull"),
      superscript: document.queryCommandState("superscript"),
      subscript: document.queryCommandState("subscript"),
    };
    setActiveFormats(formats);

    const block = document.queryCommandValue("formatBlock").toLowerCase();
    setHeadingValue(block || "p");

    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setHtmlOutput(html);
      onChange?.(html);
    }
  }, [onChange]);

  const handleInput = useCallback(() => updateState(), [updateState]);
  const handleKeyUp = useCallback(() => updateState(), [updateState]);
  const handleMouseUp = useCallback(() => updateState(), [updateState]);

  const insertLink = () => {
    restoreSelection();
    if (linkUrl && linkUrl !== "https://") {
      exec("createLink", linkUrl);
    }
    setShowLinkDialog(false);
    setLinkUrl("https://");
  };

  // ── Image handler: opens file picker → uploads via apiPost → embeds URL ──
  const imageHandler = () => {
    // Save cursor position before file picker steals focus
    saveSelection();

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      Array.from(input.files).forEach((f) => {
        formData.append("image", f);
      });

      setIsUploading(true);

      apiPost(
        `${ApiEndpoints.uploadImage.base}${ApiEndpoints.uploadImage.upload}`,
        formData,
        (res) => {
          setIsUploading(false);
          console.log("res", res)
          const imageUrl = res?.data?.[0]?.url; // Adjust to your API response shape
          if (!imageUrl) return;

          // Restore cursor to where it was before file picker opened
          restoreSelection();
          exec("insertImage", `${ImageBaseUrl}${imageUrl}`);
        },
        (err) => {
          setIsUploading(false);
          console.error("Image upload failed:", err);
        },
        { "Content-Type": "multipart/form-data" }
      );
    };
  };

  const handleHeadingChange = (value) => {
    editorRef.current?.focus();
    document.execCommand("formatBlock", false, value === "p" ? "p" : value);
    setHeadingValue(value);
    updateState();
  };

  const toggleSourceView = () => {
    if (!showSource) {
      setSourceCode(editorRef.current?.innerHTML || "");
    } else {
      if (editorRef.current) {
        editorRef.current.innerHTML = sourceCode;
        setHtmlOutput(sourceCode);
        onChange?.(sourceCode);
      }
    }
    setShowSource((v) => !v);
  };

  useEffect(() => {
    if (
      !hasInitialized.current &&
      htmlOutput &&
      htmlOutput !== "" &&
      editorRef.current
    ) {
      editorRef.current.innerHTML = htmlOutput;
      setSourceCode(htmlOutput);
      hasInitialized.current = true;
    }
  }, [htmlOutput]);

  console.log("sourceCode", sourceCode)

  return (
    <>
      <style>{`
        .rte-wrap {
          font-family: 'Georgia', serif;
          border: 1px solid #d1d5db;
          border-radius: 8px;
           overflow: visible;
          background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.07);
        }
        .rte-toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 2px;
           position: sticky;
            top: 70px;
            z-index: 10;
          padding: 6px 8px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }
        .rte-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 28px;
          border: none;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
          color: #374151;
          font-size: 13px;
          font-weight: 600;
          transition: background 0.12s, color 0.12s;
          flex-shrink: 0;
        }
        .rte-btn:hover { background: #e5e7eb; }
        .rte-btn--active { background: #dbeafe; color: #1d4ed8; }
        .rte-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .rte-sep {
          width: 1px;
          height: 20px;
          background: #d1d5db;
          margin: 0 4px;
          flex-shrink: 0;
        }
        .rte-select {
          height: 28px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          background: #fff;
          font-size: 12.5px;
          color: #374151;
          padding: 0 6px;
          cursor: pointer;
          outline: none;
          flex-shrink: 0;
        }
        .rte-select:focus { border-color: #6366f1; }
        .rte-color-btn {
          width: 30px;
          height: 28px;
          padding: 2px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          cursor: pointer;
          background: #fff;
          overflow: hidden;
          flex-shrink: 0;
        }
        .rte-color-input {
          width: 100%;
          height: 100%;
          border: none;
          padding: 0;
          cursor: pointer;
          background: transparent;
        }
        .rte-uploading-badge {
          font-size: 11px;
          color: #6366f1;
          font-weight: 600;
          padding: 0 6px;
          display: flex;
          align-items: center;
          gap: 4px;
          animation: rte-pulse 1s ease-in-out infinite;
        }
        @keyframes rte-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .rte-editor {
          min-height: ${minHeight}px;
          padding: 14px 16px;
          outline: none;
          font-size: 15px;
          line-height: 1.7;
          color: #111827;
          overflow-y: auto;
        }
        .rte-editor:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          font-style: italic;
        }
        .rte-editor h1 { font-size: 2em; font-weight: 700; margin: 0.5em 0; }
        .rte-editor h2 { font-size: 1.5em; font-weight: 700; margin: 0.5em 0; }
        .rte-editor h3 { font-size: 1.25em; font-weight: 600; margin: 0.5em 0; }
        .rte-editor h4 { font-size: 1.1em; font-weight: 600; margin: 0.5em 0; }
        .rte-editor blockquote {
          border-left: 4px solid #6366f1;
          margin: 0.75em 0;
          padding: 8px 16px;
          background: #f5f3ff;
          color: #4b5563;
          border-radius: 0 4px 4px 0;
        }
        .rte-editor pre {
          background: #1e1e2e;
          color: #cdd6f4;
          padding: 12px 16px;
          border-radius: 6px;
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 13.5px;
          overflow-x: auto;
          margin: 0.75em 0;
        }
        .rte-editor img { max-width: 100%; border-radius: 4px; margin: 4px 0; }
        .rte-editor a { color: #4f46e5; text-decoration: underline; }
        .rte-footer {
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
          padding: 8px 14px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .rte-footer label {
          font-size: 11px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
          padding-top: 6px;
        }
        .rte-footer textarea {
          flex: 1;
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 12px;
          color: #374151;
          border: none;
          background: transparent;
          resize: vertical;
          outline: none;
          min-height: 56px;
          line-height: 1.5;
        }
        .rte-dialog-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.3);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rte-dialog {
          background: #fff;
          border-radius: 10px;
          padding: 20px;
          width: 360px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        }
        .rte-dialog h3 {
          margin: 0 0 12px;
          font-size: 15px;
          font-weight: 700;
          color: #111827;
        }
        .rte-dialog input {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 14px;
          outline: none;
          color: #111827;
          margin-bottom: 12px;
        }
        .rte-dialog input:focus { border-color: #6366f1; }
        .rte-dialog-btns {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }
        .rte-dialog-btns button {
          padding: 7px 18px;
          border-radius: 6px;
          border: none;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
        }
        .rte-btn-cancel { background: #f3f4f6; color: #374151; }
        .rte-btn-confirm { background: #6366f1; color: #fff; }
        .rte-source-view {
          min-height: ${minHeight}px;
          padding: 14px 16px;
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 13px;
          color: #374151;
          border: none;
          resize: vertical;
          width: 100%;
          box-sizing: border-box;
          outline: none;
          background: #fafafa;
          line-height: 1.6;
        }
      `}</style>

      <div className="rte-wrap">
        {/* Toolbar */}
        <div className="rte-toolbar" role="toolbar">

          <select
            className="rte-select"
            value={headingValue}
            onChange={(e) => handleHeadingChange(e.target.value)}
            title="Paragraph style"
          >
            {HEADING_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <Separator />

          <ToolbarButton title="Bold (Ctrl+B)" active={activeFormats.bold} onClick={() => exec("bold")}>
            <svg width="13" height="14" viewBox="0 0 13 14" fill="none"><path d="M3 2h4.5a3 3 0 0 1 0 6H3V2zm0 6h5a3 3 0 0 1 0 6H3V8z" fill="currentColor" /></svg>
          </ToolbarButton>

          <ToolbarButton title="Italic (Ctrl+I)" active={activeFormats.italic} onClick={() => exec("italic")}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2h6M3 12h6M8 2 6 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
          </ToolbarButton>

          <ToolbarButton title="Underline (Ctrl+U)" active={activeFormats.underline} onClick={() => exec("underline")}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 2v5a4 4 0 0 0 8 0V2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><line x1="2" y1="13" x2="12" y2="13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
          </ToolbarButton>

          <ToolbarButton title="Strikethrough" active={activeFormats.strikeThrough} onClick={() => exec("strikeThrough")}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="M4 7V4.5a3 3 0 0 1 6 0V7M4 7v2.5a3 3 0 0 0 6 0V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </ToolbarButton>

          <Separator />

          <div className="rte-color-btn" title="Text color">
            <input type="color" className="rte-color-input" defaultValue="#111827" onChange={(e) => exec("foreColor", e.target.value)} title="Text color" />
          </div>

          <div className="rte-color-btn" title="Highlight color">
            <input type="color" className="rte-color-input" defaultValue="#fef08a" onChange={(e) => exec("hiliteColor", e.target.value)} title="Highlight" />
          </div>

          <Separator />

          <ToolbarButton title="Subscript" active={activeFormats.subscript} onClick={() => exec("subscript")}>
            <span style={{ fontSize: 11 }}>X<sub style={{ fontSize: 9 }}>2</sub></span>
          </ToolbarButton>

          <ToolbarButton title="Superscript" active={activeFormats.superscript} onClick={() => exec("superscript")}>
            <span style={{ fontSize: 11 }}>X<sup style={{ fontSize: 9 }}>2</sup></span>
          </ToolbarButton>

          <Separator />

          <ToolbarButton title="Ordered list" active={activeFormats.insertOrderedList} onClick={() => exec("insertOrderedList")}>
            <svg width="15" height="14" viewBox="0 0 15 14" fill="none"><line x1="6" y1="3" x2="14" y2="3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><line x1="6" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><line x1="6" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><text x="1" y="4.5" fontSize="5.5" fill="currentColor">1.</text><text x="1" y="8.5" fontSize="5.5" fill="currentColor">2.</text><text x="1" y="12.5" fontSize="5.5" fill="currentColor">3.</text></svg>
          </ToolbarButton>

          <ToolbarButton title="Unordered list" active={activeFormats.insertUnorderedList} onClick={() => exec("insertUnorderedList")}>
            <svg width="15" height="14" viewBox="0 0 15 14" fill="none"><circle cx="3" cy="3" r="1.5" fill="currentColor" /><circle cx="3" cy="7" r="1.5" fill="currentColor" /><circle cx="3" cy="11" r="1.5" fill="currentColor" /><line x1="6" y1="3" x2="14" y2="3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><line x1="6" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><line x1="6" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </ToolbarButton>

          <Separator />

          <ToolbarButton title="Outdent" onClick={() => exec("outdent")}>
            <svg width="15" height="14" viewBox="0 0 15 14" fill="none"><line x1="1" y1="3" x2="14" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="5" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="1" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M4 5.5 1 7l3 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </ToolbarButton>

          <ToolbarButton title="Indent" onClick={() => exec("indent")}>
            <svg width="15" height="14" viewBox="0 0 15 14" fill="none"><line x1="1" y1="3" x2="14" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="5" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="1" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M1 5.5l3 1.5-3 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </ToolbarButton>

          <Separator />

          <ToolbarButton title="Align left" active={activeFormats.justifyLeft} onClick={() => exec("justifyLeft")}>
            <svg width="15" height="14" viewBox="0 0 15 14" fill="none"><line x1="1" y1="3" x2="14" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="1" y1="7" x2="10" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="1" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </ToolbarButton>

          <ToolbarButton title="Align center" active={activeFormats.justifyCenter} onClick={() => exec("justifyCenter")}>
            <svg width="15" height="14" viewBox="0 0 15 14" fill="none"><line x1="1" y1="3" x2="14" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="3" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="1" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </ToolbarButton>

          <ToolbarButton title="Align right" active={activeFormats.justifyRight} onClick={() => exec("justifyRight")}>
            <svg width="15" height="14" viewBox="0 0 15 14" fill="none"><line x1="1" y1="3" x2="14" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="5" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="1" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </ToolbarButton>

          <ToolbarButton title="Justify" active={activeFormats.justifyFull} onClick={() => exec("justifyFull")}>
            <svg width="15" height="14" viewBox="0 0 15 14" fill="none"><line x1="1" y1="3" x2="14" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="1" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><line x1="1" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </ToolbarButton>

          <Separator />

          {/* Link */}
          <ToolbarButton title="Insert link" onClick={() => { saveSelection(); setShowLinkDialog(true); }}>
            <svg width="15" height="14" viewBox="0 0 15 14" fill="none"><path d="M6 8.5a3.5 3.5 0 0 0 5 0l2-2a3.5 3.5 0 0 0-5-5L7 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M9 5.5a3.5 3.5 0 0 0-5 0l-2 2a3.5 3.5 0 0 0 5 5L8 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </ToolbarButton>

          {/* Image — now uses file picker + apiPost upload */}
          <ToolbarButton
            title={isUploading ? "Uploading..." : "Insert image"}
            onClick={imageHandler}
            disabled={isUploading}
          >
            {isUploading ? (
              <svg width="15" height="14" viewBox="0 0 15 14" fill="none" style={{ animation: "rte-pulse 1s ease-in-out infinite" }}>
                <circle cx="7.5" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 6" />
              </svg>
            ) : (
              <svg width="15" height="14" viewBox="0 0 15 14" fill="none"><rect x="1" y="2" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><circle cx="5" cy="5.5" r="1.2" fill="currentColor" /><path d="M1 10l3.5-3.5 2.5 2.5 2-2L14 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            )}
          </ToolbarButton>

          {/* Video / embed */}
          <ToolbarButton
            title="Insert video URL"
            onClick={() => {
              const url = window.prompt("Enter video embed URL:");
              if (url) {
                const html = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:8px 0"><iframe src="${url}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen></iframe></div>`;
                exec("insertHTML", html);
              }
            }}
          >
            <svg width="15" height="14" viewBox="0 0 15 14" fill="none"><rect x="1" y="2" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><path d="M6 5l4 2-4 2V5z" fill="currentColor" /></svg>
          </ToolbarButton>

          <Separator />

          <ToolbarButton title="Blockquote" onClick={() => exec("formatBlock", "blockquote")}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4.5C2 3.4 2.9 2.5 4 2.5h1v3H4c-.6 0-1 .4-1 1v1H2V4.5zM8 4.5C8 3.4 8.9 2.5 10 2.5h1v3h-1c-.6 0-1 .4-1 1v1H8V4.5z" fill="currentColor" /></svg>
          </ToolbarButton>

          <ToolbarButton title="Code block" onClick={() => exec("formatBlock", "pre")}>
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none"><path d="M5 4L2 7l3 3M11 4l3 3-3 3M9 2l-2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </ToolbarButton>

          <ToolbarButton title="HTML source" active={showSource} onClick={toggleSourceView}>
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none"><path d="M5 4L2 7l3 3M11 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </ToolbarButton>

          <Separator />

          <ToolbarButton title="Clear formatting" onClick={() => exec("removeFormat")}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M3 4l7 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M6 2h6l-3 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><line x1="2" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
          </ToolbarButton>

          {/* Uploading indicator */}
          {isUploading && (
            <span className="rte-uploading-badge">⏳ Uploading…</span>
          )}

        </div>

        {/* Editor area */}
        {showSource ? (
          <textarea
            className="rte-source-view"
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            spellCheck={false}
          />
        ) : (
          <div
            ref={editorRef}
            className="rte-editor"
            contentEditable
            suppressContentEditableWarning
            data-placeholder={placeholder}
            onInput={handleInput}
            onKeyUp={handleKeyUp}
            onMouseUp={handleMouseUp}
            dangerouslySetInnerHTML={initialValue ? { __html: initialValue } : undefined}
          />
        )}

        {/* HTML output footer */}
        {/* <div className="rte-footer">
          <label>HTML</label>
          <textarea
            value={showSource ? sourceCode : htmlOutput}
            readOnly={!showSource}
            onChange={(e) => !showSource && setHtmlOutput(e.target.value)}
            spellCheck={false}
          />
        </div> */}
      </div>

      {/* Link dialog */}
      {showLinkDialog && (
        <div className="rte-dialog-overlay" onClick={() => setShowLinkDialog(false)}>
          <div className="rte-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Insert Link</h3>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && insertLink()}
            />
            <div className="rte-dialog-btns">
              <button className="rte-btn-cancel" onClick={() => setShowLinkDialog(false)}>Cancel</button>
              <button className="rte-btn-confirm" onClick={insertLink}>Insert</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}