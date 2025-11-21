import React, { useState, useRef } from 'react'
import { scanService } from '../../services/scan.service';

const ScanDocs = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scannedImage, setScannedImage] = useState(null);
  const cameraInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError("");
      setLoading(true);
      
      try {
        const result = await scanService.scanDocument(file);
        setOutput(result.explanation || "No explanation provided.");
        setScannedImage(result.imageUrl);
        setError("");
      } catch (err) {
        setError(err?.message || "Failed to scan document. Please try again.");
        setOutput("");
        setScannedImage(null);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div className="w-screen min-h-screen mt-10 bg-[#E8FDFF] overflow-y-auto pb-10 lg:w-full">
      {/* Main Container */}
      <div className="w-full px-8 lg:px-16 py-6 mt-20 lg:mt-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Section - Upload Area */}
          <div className="flex-1">
            <div className="bg-linear-to-r from-[#3B9FFF] to-[#5FB4FF] rounded-4xl lg:rounded-[3rem] shadow-2xl relative overflow-hidden p-8 lg:p-12 h-[200px] lg:h-[350px] flex items-center gap-6">
              {/* Kid Image */}
              <img
                src="/imgs/kid3.png"
                alt="Scan kid"
                className="h-full max-h-[250px] lg:max-h-[250px] object-contain"
              />
              
              {/* Text Content */}
              <div className="flex-1">
                <h1
                  className="text-1xl sm:text-3xl lg:text-4xl xl:text-4xl text-white font-normal leading-tight"
                  style={{ fontFamily: "Righteous, sans-serif" }}
                >
                  Upload or Scan <br />
                  your Docs for clear <br />
                  understanding
                </h1>
              </div>
            </div>
          </div>

          {/* Right Section - Upload Card */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white rounded-3xl shadow-lg p-8 min-h-[100px] lg:h-[350px] flex flex-col items-center justify-center gap-6">
              {/* File Upload Area */}
              <label htmlFor="file-upload" className="w-full cursor-pointer">
                <div className="border-2 border-dashed border-[#FF9D5C] rounded-2xl p-8 lg:p-12 flex flex-col items-center justify-center hover:bg-orange-50 transition-colors">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <i className="ri-image-line text-3xl text-gray-400"></i>
                  </div>
                  <p className="text-gray-400 text-sm">Select file</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="image/*,.pdf,.doc,.docx"
                />
              </label>

              {/* OR Divider */}
              <div className="w-full text-center">
                <span className="text-gray-400 text-sm">or</span>
              </div>

              {/* Camera Button */}
              <button
                onClick={handleCameraCapture}
                className="w-full bg-[#FFE4C4] hover:bg-[#FFD9B3] text-[#FF9D5C] font-medium py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                disabled={loading}
              >
                <i className="ri-camera-line text-xl"></i>
                Open Camera & Take Photo
              </button>

              {/* Hidden camera input */}
              <input
                ref={cameraInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*"
                capture="environment"
              />

              {/* Loading State */}
              {loading && (
                <div className="w-full text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#FF9D5C] border-t-transparent"></div>
                  <p className="text-sm text-gray-500 mt-2">Analyzing document...</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="w-full bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Selected File Info */}
              {selectedFile && !loading && (
                <div className="w-full bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <i className="ri-file-check-line"></i>
                  <span className="truncate">{selectedFile.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scanned Image Preview */}
        {scannedImage && (
          <div className="mt-8 lg:mt-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Scanned Document</h2>
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <img 
                src={scannedImage} 
                alt="Scanned document" 
                className="w-full h-auto rounded-xl max-h-[400px] object-contain"
              />
            </div>
          </div>
        )}

        {/* Output Section */}
        <div className="mt-8 lg:mt-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Output</h2>
          <div className="bg-[#CAECFF] rounded-3xl p-8 lg:p-12 min-h-[250px] shadow-md">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-lg">Processing your document...</p>
              </div>
            ) : (
              <p className="text-gray-700 text-lg whitespace-pre-line">
                {output || "After upload your docs you will get all information here.."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScanDocs
