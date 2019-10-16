import React from "react";
import MaskedInput from "react-text-mask";
import NumberFormat from "react-number-format";
import CurrencyInput from "react-currency-masked-input";
export function TextMaskBSB(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/]}
      placeholderChar={"\u2000"}
      showMask
    />
  );
}

export function TextMaskNumber(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name: other.name,
            value: values.value
          }
        });
      }}
    />
  );
}
export function TextMaskMoney(props) {
  const { inputRef, onChange, onBlur, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name: other.name,
            value: values.value
          }
        });
      }}
      decimalScale={2}
      prefix="$"
    />
  );
}
