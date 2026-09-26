"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type RichTextEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const formats = [
  "font",
  "header",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "list",
  "indent",
  "align",
  "blockquote",
  "code-block",
  "link",
  "image",
  "video",
];

const RichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Write product description here...",
}: RichTextEditorProps) => {
  const quillRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fix: Ensure only one toolbar is present (React Strict Mode remount)
  useEffect(() => {
    if (!quillRef.current) {
      quillRef.current = true;

      setTimeout(() => {
        const root = containerRef.current ?? document;
        root.querySelectorAll(".ql-toolbar").forEach((toolbar, index) => {
          if (index > 0) {
            toolbar.remove();
          }
        });
      }, 100);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="rich-text-editor rounded-md border border-gray-700 overflow-hidden bg-transparent [&_.ql-toolbar.ql-snow]:border-0 [&_.ql-toolbar.ql-snow]:border-b [&_.ql-toolbar.ql-snow]:border-gray-700 [&_.ql-toolbar.ql-snow]:bg-gray-900 [&_.ql-container.ql-snow]:border-0 [&_.ql-container.ql-snow]:min-h-[220px] [&_.ql-editor]:min-h-[220px] [&_.ql-editor]:text-white [&_.ql-editor.ql-blank::before]:text-gray-400 [&_.ql-stroke]:!stroke-gray-300 [&_.ql-fill]:!fill-gray-300 [&_.ql-picker]:text-gray-300"
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
