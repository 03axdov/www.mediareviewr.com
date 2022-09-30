import React, { useState } from "react";

export default function FormInput(props) {
  const [focused, setFocused] = useState(false);
  const { label, errorMessage, onChange, id, name, ...inputProps } = props;

  const handleFocus = (e) => {
    setFocused(true);
  };

  const styleName = 'input ' + 'input-' + name

  if (name === 'body') {
    return (
      <div className="form-input">
        {props.required == true && <label className="input-label">{label}*</label>}
        {props.required != true && <label className="input-label">{label}</label>}
        <textarea
          {...inputProps}
          name={name}
          onChange={onChange}
          onBlur={handleFocus}
          focused={focused.toString()}
          className={styleName}
          required
        />
      </div>
    );
  } else if (name === 'type') {
    return (
      <div className="form-input">
        {props.required == true && <label className="input-label">{label}*</label>}
        {props.required != true && <label className="input-label">{label}</label>}
        
        <input
          {...inputProps}
          name={name}
          onChange={onChange}
          onBlur={handleFocus}
          focused={focused.toString()}
          className={styleName}
          required
        />
        
      </div>
    )
  } else if (name==='rating') {

    return (
      <div className="form-input rating-input">
        {props.required == true && <label className="input-label">{label}*</label>}
        {props.required != true && <label className="input-label">{label}</label>}
        
        <input
          {...inputProps}
          id="inputBox"
          name={name}
          onChange={onChange}
          onBlur={handleFocus}
          focused={focused.toString()}
          className={styleName}
          required
          onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
        />
      
      </div>
    
    )
  } else {
    return (
      <div className="form-input">
        {props.required == true &&
         <label className="input-label">{label}*</label>
        }
        {props.required != true && <label className="input-label">{label}</label>}
        
        {props.required && 
        <input
          {...inputProps}
          name={name}
          onChange={onChange}
          onBlur={handleFocus}
          focused={focused.toString()}
          className={styleName}
          required
        />
        }
        {!props.required && 
        <input
          {...inputProps}
          name={name}
          onChange={onChange}
          onBlur={handleFocus}
          focused={focused.toString()}
          className={styleName}
        />
        }
        
      </div>
    );
  }

};