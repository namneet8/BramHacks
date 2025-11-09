import React from 'react'

const ImageComponent = ({ base64Data }) => {
    const imageSrc = `data:image/png;base64,${base64Data}`;
  return (
    <div>
      <img src={imageSrc} alt="AI Generated" style={{ maxWidth: "100%" }} />
    </div>
  )
}

export default ImageComponent