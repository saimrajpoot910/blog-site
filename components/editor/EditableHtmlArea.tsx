'use client';

import React, { useEffect, useRef } from 'react';

/** contentEditable region; parent reads `ref.current.innerHTML` on submit. Remount with `key` when loading new entity. */
export function EditableHtmlArea({
  areaRef,
  initialHtml,
  placeholder,
  minHeight = 160,
}: {
  areaRef: React.RefObject<HTMLDivElement | null>;
  initialHtml: string;
  placeholder: string;
  minHeight?: number;
}) {
  const seeded = useRef(false);
  useEffect(() => {
    if (areaRef.current && !seeded.current) {
      areaRef.current.innerHTML = initialHtml;
      seeded.current = true;
    }
  }, [areaRef, initialHtml]);

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    areaRef.current?.focus();
  };

  return (
    <div className="rich-editor-wrap">
      <div className="rich-toolbar">
        <button type="button" className="rich-btn" title="Bold" onClick={() => exec('bold')}><strong>B</strong></button>
        <button type="button" className="rich-btn" title="Italic" onClick={() => exec('italic')}><em>I</em></button>
        <button type="button" className="rich-btn" title="Underline" onClick={() => exec('underline')}><u>U</u></button>
        <button type="button" className="rich-btn" title="Bullet list" onClick={() => exec('insertUnorderedList')}>• List</button>
      </div>
      <div
        ref={areaRef}
        className="rich-body"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        style={{ minHeight }}
      />
    </div>
  );
}
