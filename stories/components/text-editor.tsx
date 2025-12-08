import debounce from "lodash.debounce";
import React, { forwardRef, useCallback } from "react";

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
>(({ initialValue, onChange }, ref) => {
  const onChangeDebounced = useCallback(debounce(onChange, 2000), []);
  return (
    <div style={style}>
      <textarea
        ref={ref}
        style={textAreaStyle}
        defaultValue={initialValue}
        onChange={(e) => onChangeDebounced(e.target.value)}
      />
    </div>
  );
});
