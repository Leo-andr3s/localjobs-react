function InputField({ label, type, placeholder }) {
  return (
    <div>
      <label>{label}</label>
      <input type={type} placeholder={placeholder} />
    </div>
  );
}

export default InputField;