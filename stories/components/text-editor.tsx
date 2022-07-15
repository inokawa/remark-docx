import React, { forwardRef } from "react";

const style: React.CSSProperties = {
  flex: 1,
  overflowY: "scroll",
};
const textAreaStyle = { width: "100%", height: "100%" };

export default forwardRef<
  HTMLTextAreaElement,
  {
    initialValue: string;
    onChange: (v: string) => void;
  }
>(({ initialValue, onChange }, ref) => (
  <div style={style}>
    <textarea
      ref={ref}
      style={textAreaStyle}
      defaultValue={initialValue}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
));
