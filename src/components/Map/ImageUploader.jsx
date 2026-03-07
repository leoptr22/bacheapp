import { useState } from "react";

function ImageUploader({ onImageSelect }) {

  const [preview, setPreview] = useState(null);

  function handleChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setPreview(url);

    onImageSelect(url);
  }

  return (
    <div>

      <input
        type="file"
        className="form-control"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
      />

      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{
            width: "100%",
            marginTop: "8px",
            borderRadius: "6px"
          }}
        />
      )}

    </div>
  );
}

export default ImageUploader;