import { useState, useRef } from 'react';
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { useData } from '../context/DataContext';
import { apiService } from '../services/apiService';

interface FHIRBundleUploadProps {
  onBack: () => void;
}

interface FHIRBundle {
  resourceType: string;
  type: string;
  entry?: Array<{
    resource?: {
      code?: {
        coding?: Array<{
          system?: string;
        }>;
      };
    };
  }>;
}

export function FHIRBundleUpload({ onBack }: FHIRBundleUploadProps) {
  const { exportFHIRData } = useData();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadResult, setUploadResult] = useState<{ id: string; success: boolean } | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('idle');
      setValidationErrors([]);
    }
  };

  const validateFHIRBundle = (bundle: FHIRBundle): string[] => {
    const errors: string[] = [];

    if (!bundle.resourceType || bundle.resourceType !== 'Bundle') {
      errors.push('Invalid FHIR Bundle: Missing or incorrect resourceType');
    }

    if (!bundle.type) {
      errors.push('Invalid FHIR Bundle: Missing type');
    }

    if (!bundle.entry || !Array.isArray(bundle.entry)) {
      errors.push('Invalid FHIR Bundle: Missing or invalid entry array');
    }

    // Check for required coding systems
    const hasNAMASTE = bundle.entry?.some((entry) =>
      entry.resource?.code?.coding?.some((coding) => coding.system === 'NAMASTE')
    );

    const hasICD11 = bundle.entry?.some((entry) =>
      entry.resource?.code?.coding?.some((coding) => coding.system?.includes('ICD-11'))
    );

    if (!hasNAMASTE) {
      errors.push('Bundle should contain NAMASTE coding system');
    }

    if (!hasICD11) {
      errors.push('Bundle should contain ICD-11 coding system');
    }

    return errors;
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');
    setValidationErrors([]);

    try {
      const fileContent = await selectedFile.text();
      const bundle = JSON.parse(fileContent);

      // Validate the FHIR Bundle
      const errors = validateFHIRBundle(bundle);
      if (errors.length > 0) {
        setValidationErrors(errors);
        setUploadStatus('error');
        return;
      }

      // Upload to API (mock implementation)
      const result = await apiService.uploadFHIRBundle(bundle);
      setUploadResult(result);
      setUploadStatus('success');

    } catch (error) {
      console.error('Upload error:', error);
      setValidationErrors(['Failed to parse JSON file or upload bundle']);
      setUploadStatus('error');
    }
  };

  const handleDownloadTemplate = () => {
    // Generate a sample FHIR Bundle template
    const template = {
      resourceType: "Bundle",
      id: "namaste-icd11-template",
      type: "collection",
      timestamp: new Date().toISOString(),
      entry: [
        {
          resource: {
            resourceType: "Condition",
            id: "condition-example",
            subject: {
              reference: "Patient/example-patient"
            },
            code: {
              coding: [
                {
                  system: "NAMASTE",
                  code: "NAM-AYU-103",
                  display: "Jvara"
                },
                {
                  system: "http://id.who.int/icd/release/11/2023-01/mms",
                  code: "1D44",
                  display: "Fever of unknown origin"
                }
              ]
            },
            meta: {
              profile: ["http://hl7.org/fhir/StructureDefinition/Condition"]
            }
          }
        }
      ]
    };

    const dataStr = JSON.stringify(template, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'fhir-bundle-template.json');
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </button>
              <h1 className="text-xl font-semibold text-gray-900">FHIR Bundle Upload</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Instructions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Upload FHIR Bundle</h2>
            <div className="prose prose-sm text-gray-600">
              <p className="mb-4">
                Upload a FHIR R4 Bundle containing patient data with NAMASTE and ICD-11 codings.
                The bundle should include:
              </p>
              <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Patient resources with demographic information</li>
                <li>Condition resources with dual coding (NAMASTE + ICD-11)</li>
                <li>Encounter resources for visit information</li>
                <li>Proper FHIR R4 structure and metadata</li>
              </ul>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </button>
                <button
                  onClick={exportFHIRData}
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export Current Data
                </button>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select FHIR Bundle File
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </button>
                  {selectedFile && (
                    <span className="text-sm text-gray-600">{selectedFile.name}</span>
                  )}
                </div>
              </div>

              {selectedFile && (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleUpload}
                    disabled={uploadStatus === 'uploading'}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                  >
                    {uploadStatus === 'uploading' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Bundle
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="text-sm font-medium text-red-800">Validation Errors</h3>
              </div>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm text-red-700">{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Upload Success */}
          {uploadStatus === 'success' && uploadResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-sm font-medium text-green-800">Upload Successful</h3>
              </div>
              <div className="text-sm text-green-700">
                <p>FHIR Bundle uploaded successfully!</p>
                <p className="mt-1">Bundle ID: {uploadResult.id}</p>
              </div>
            </div>
          )}

          {/* Upload Error */}
          {uploadStatus === 'error' && validationErrors.length === 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="text-sm font-medium text-red-800">Upload Failed</h3>
              </div>
              <p className="text-sm text-red-700">
                There was an error uploading the FHIR Bundle. Please check the file format and try again.
              </p>
            </div>
          )}

          {/* Recent Uploads */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Uploads</h3>
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No recent uploads</p>
              <p className="text-sm text-gray-500 mt-1">Uploaded bundles will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
