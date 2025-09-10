function Magnitudo({ mgFill }) {
  try {
    if (mgFill <= 5) {
      return (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="16"
            fill="#f9990d"
            className="bi bi-exclamation-triangle ms-1"
            viewBox="0 0 16 16"
          >
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
        </>
      );
    } else {
      return (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="16"
            fill="#f33f0c"
            className="bi bi-exclamation-triangle ms-1"
            viewBox="0 0 16 16"
          >
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
        </>
      );
    }
  } catch (error) {
    console.log(
      "Icon Magnitude Error, Please check on : components/Magnitudo.jsx / Parameter Salah"
    );
  }
}

export default Magnitudo;
