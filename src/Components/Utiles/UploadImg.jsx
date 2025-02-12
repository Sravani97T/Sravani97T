import React, { useState } from "react";
import { Upload, Modal, Button, message } from "antd";
import { PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const AvatarUpload = () => {
  const [imageUrl, setImageUrl] = useState(null); // Preview URL
  const [previewVisible, setPreviewVisible] = useState(false); // Modal visibility
  const [base64Image, setBase64Image] = useState(null); // Base64 formatted image
  const [fileName, setFileName] = useState(null); // Extracted file name
  const [fileBase, setFileBase] = useState(null); // Server response fileBase

  // Convert file to Base64
  const getBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result);
    reader.onerror = () => message.error("Failed to convert image to Base64");
  };

  // Handle Image Upload
  const handleBeforeUpload = (file) => {
    const isValidType = file.type === "image/jpeg" || file.type === "image/png";
    const isValidSize = file.size / 1024 / 1024 < 2; // 2MB limit

    if (!isValidType) {
      message.error("You can only upload JPG/PNG files!");
      return false;
    }

    if (!isValidSize) {
      message.error("Image must be smaller than 2MB!");
      return false;
    }

    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);

    // Set the file name
    setFileName(file.name);

    // Convert the file to Base64 and set it
    getBase64(file, (base64) => {
      setBase64Image(base64.split(",")[1]); // Remove the "data:image/*;base64," prefix
    });

    return false; // Prevent automatic upload
  };

  // Preview Image in Modal
  const handlePreview = () => {
    setPreviewVisible(true);
  };

  // Delete Image
  const handleDelete = () => {
    setImageUrl(null);
    setBase64Image(null);
    setFileName(null);
    setFileBase(null);
    message.success("Image removed successfully!");
  };

  // Submit Image to API
  const handleSubmit = async () => {
    if (!base64Image) {
        message.error("Please upload an image first!");
        return;
    }

    const payload = {
        clientName: "MADHU",
        dbId: "",
        fileName: fileName,
        fileBase: base64Image,
    };

    try {
        const response = await axios.post(
            `${CREATE_jwel}`+"/api/Utilities/SaveClientImages",
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        // Extract response data
        setFileName(response.data.fileName);
        setFileBase(response.data.fileBase);

        message.success("Image uploaded successfully!");

        // Reset the preview and state variables
        setImageUrl(null);
        setBase64Image(null);
        setFileName(null);
        setFileBase(null);
    } catch (error) {
        console.error("Upload error:", error);
        message.error("Failed to upload the image!");
    }
};


  return (
    <div style={{ textAlign: "center" }}>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={handleBeforeUpload}
        openFileDialogOnClick={!imageUrl} // Prevent opening dialog if image exists
      >
        {imageUrl ? (
          <div className="image-container">
            <img
              src={imageUrl}
              alt="Uploaded"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <div className="hover-overlay">
              <EyeOutlined
                className="icon"
                style={{ marginRight: "16px" }}
                onClick={handlePreview}
              />
              <DeleteOutlined className="icon" onClick={handleDelete} />
            </div>
          </div>
        ) : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>

      {/* Submit Button */}
      <Button
        type="primary"
        onClick={handleSubmit}
        style={{ marginTop: "16px" }}
        disabled={!base64Image}
      >
        Submit
      </Button>

      {/* Image Preview Modal */}
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="Preview" style={{ width: "100%" }} src={imageUrl} />
      </Modal>

      {/* Display Response */}
      {fileBase && (
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <p>
            <strong>File Name:</strong> {fileName}
          </p>
          <p>
            <strong>Base64:</strong> {fileBase}
          </p>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
