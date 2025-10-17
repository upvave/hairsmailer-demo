'use client';

import {
  addToast,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Switch,
  Textarea,
} from '@heroui/react';
import { useRef, useState } from 'react';
import {
  FiAlertTriangle,
  FiCheck,
  FiFile,
  FiUpload,
  FiX,
} from 'react-icons/fi';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataSource:
    | 'firmen'
    | 'google-maps'
    | 'treatwell'
    | 'firmen-keywords'
    | 'firmen-locations'
    | 'treatwell-keywords'
    | 'treatwell-locations';
  onImportComplete?: () => void;
}

interface ImportResults {
  total: number;
  successful: number;
  failed: number;
  errors: string[];
  duplicates: number;
  updated: number;
}

const DATA_SOURCE_LABELS = {
  firmen: 'Firmen',
  'google-maps': 'Google Maps',
  treatwell: 'Treatwell',
  'firmen-keywords': 'Firmen Keywords',
  'firmen-locations': 'Firmen Locations',
  'treatwell-keywords': 'Treatwell Keywords',
  'treatwell-locations': 'Treatwell Locations',
};

export default function ImportModal({
  isOpen,
  onClose,
  dataSource,
  onImportComplete,
}: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState('');
  const [importType, setImportType] = useState<'file' | 'json'>('file');
  const [updateExisting, setUpdateExisting] = useState(false);
  const [batchSize, setBatchSize] = useState(100);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<ImportResults | null>(
    null,
  );
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setJsonData('');
    }
  };

  const handleJsonChange = (value: string) => {
    setJsonData(value);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateJsonData = () => {
    if (!jsonData.trim()) return false;
    try {
      const parsed = JSON.parse(jsonData);
      return Array.isArray(parsed) || typeof parsed === 'object';
    } catch {
      return false;
    }
  };

  const handleImport = async () => {
    if (importType === 'file' && !file) {
      addToast({
        color: 'danger',
        title: 'No file selected',
        description: 'Please select a file to import',
      });
      return;
    }

    if (importType === 'json' && !validateJsonData()) {
      addToast({
        color: 'danger',
        title: 'Invalid JSON',
        description: 'Please provide valid JSON data',
      });
      return;
    }

    setIsImporting(true);
    setProgress(0);
    setImportResults(null);

    try {
      // Map data sources to their corresponding API endpoints
      const getApiUrl = (source: string) => {
        switch (source) {
          case 'firmen':
            return '/api/firmen/import';
          case 'google-maps':
            return '/api/google-maps/import'; // Assuming this exists
          case 'treatwell':
            return '/api/treatwell/import';
          case 'firmen-keywords':
            return '/api/firmen/keyword/import';
          case 'firmen-locations':
            return '/api/firmen/location/import';
          case 'treatwell-keywords':
            return '/api/treatwell/keyword/import';
          case 'treatwell-locations':
            return '/api/treatwell/location/import';
          default:
            return `/api/${source}/import`;
        }
      };

      const url = `${getApiUrl(dataSource)}?update=${updateExisting}&batchSize=${batchSize}`;
      let response: Response;

      if (importType === 'file' && file) {
        // File upload
        const formData = new FormData();
        formData.append('file', file);

        response = await fetch(url, {
          method: 'POST',
          body: formData,
        });
      } else {
        // JSON data
        const parsedData = JSON.parse(jsonData);
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(parsedData),
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Import failed');
      }

      const results = await response.json();
      setImportResults(results.results);
      setProgress(100);

      addToast({
        color: 'success',
        title: 'Import completed',
        description: `Successfully imported ${results.results.successful} records`,
      });

      if (onImportComplete) {
        onImportComplete();
      }
    } catch (error: any) {
      console.error('Import error:', error);
      addToast({
        color: 'danger',
        title: 'Import failed',
        description: error.message || 'Failed to import data',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    if (!isImporting) {
      setFile(null);
      setJsonData('');
      setImportResults(null);
      setProgress(0);
      onClose();
    }
  };

  const canImport = () => {
    if (isImporting) return false;
    if (importType === 'file') return !!file;
    if (importType === 'json') return validateJsonData();
    return false;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
      isDismissable={!isImporting}
      hideCloseButton={isImporting}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold">
            Import {DATA_SOURCE_LABELS[dataSource]} Data
          </h3>
          <p className="text-foreground-500 text-sm">
            Upload JSON file or paste JSON data to import records
          </p>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-6">
            {/* Import Type Selection */}
            <div className="flex gap-2">
              <Button
                variant={importType === 'file' ? 'solid' : 'bordered'}
                color="primary"
                onPress={() => setImportType('file')}
                className="flex-1"
                startContent={<FiUpload />}
              >
                Upload File
              </Button>
              <Button
                variant={importType === 'json' ? 'solid' : 'bordered'}
                color="primary"
                onPress={() => setImportType('json')}
                className="flex-1"
                startContent={<FiFile />}
              >
                Paste JSON
              </Button>
            </div>

            {/* File Upload */}
            {importType === 'file' && (
              <div className="space-y-4">
                <div className="border-foreground-200 rounded-lg border-2 border-dashed p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,.xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isImporting}
                  />
                  <Button
                    color="primary"
                    variant="flat"
                    startContent={<FiUpload />}
                    onPress={() => fileInputRef.current?.click()}
                    isDisabled={isImporting}
                  >
                    Select File
                  </Button>
                  <p className="text-foreground-500 mt-2 text-sm">
                    Supports JSON, Excel (.xlsx, .xls), and CSV files
                  </p>
                </div>

                {file && (
                  <Card>
                    <CardBody>
                      <div className="flex items-center gap-3">
                        <FiFile className="text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">{file.name}</p>
                          <p className="text-foreground-500 text-sm">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => {
                            setFile(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          isDisabled={isImporting}
                        >
                          <FiX />
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                )}
              </div>
            )}

            {/* JSON Input */}
            {importType === 'json' && (
              <div className="space-y-4">
                <Textarea
                  label="JSON Data"
                  placeholder="Paste your JSON data here..."
                  value={jsonData}
                  onValueChange={handleJsonChange}
                  rows={10}
                  isDisabled={isImporting}
                  description="Paste an array of objects or a single object"
                />
                {jsonData && !validateJsonData() && (
                  <div className="text-danger flex items-center gap-2">
                    <FiAlertTriangle />
                    <span className="text-sm">Invalid JSON format</span>
                  </div>
                )}
              </div>
            )}

            <Divider />

            {/* Import Options */}
            <div className="space-y-4">
              <h4 className="font-medium">Import Options</h4>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Update Existing Records</p>
                  <p className="text-foreground-500 text-sm">
                    Update records if they already exist (based on title)
                  </p>
                </div>
                <Switch
                  isSelected={updateExisting}
                  onValueChange={setUpdateExisting}
                  isDisabled={isImporting}
                />
              </div>

              <Input
                type="number"
                label="Batch Size"
                value={batchSize.toString()}
                onValueChange={(value) => setBatchSize(parseInt(value) || 100)}
                min={1}
                max={1000}
                isDisabled={isImporting}
                description="Number of records to process at once"
              />
            </div>

            {/* Progress */}
            {isImporting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Importing data...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} color="primary" />
              </div>
            )}

            {/* Results */}
            {importResults && (
              <Card>
                <CardBody>
                  <h4 className="mb-3 font-medium">Import Results</h4>
                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Chip color="primary" variant="flat">
                        {importResults.total}
                      </Chip>
                      <span className="text-sm">Total</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip
                        color="success"
                        variant="flat"
                        startContent={<FiCheck />}
                      >
                        {importResults.successful}
                      </Chip>
                      <span className="text-sm">Successful</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip color="warning" variant="flat">
                        {importResults.updated}
                      </Chip>
                      <span className="text-sm">Updated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip
                        color="danger"
                        variant="flat"
                        startContent={<FiX />}
                      >
                        {importResults.failed}
                      </Chip>
                      <span className="text-sm">Failed</span>
                    </div>
                  </div>

                  {importResults.errors.length > 0 && (
                    <div>
                      <p className="text-danger mb-2 font-medium">Errors:</p>
                      <div className="max-h-32 overflow-y-auto">
                        {importResults.errors
                          .slice(0, 10)
                          .map((error, index) => (
                            <p key={index} className="text-danger mb-1 text-sm">
                              {error}
                            </p>
                          ))}
                        {importResults.errors.length > 10 && (
                          <p className="text-foreground-500 text-sm">
                            ... and {importResults.errors.length - 10} more
                            errors
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="light"
            onPress={handleClose}
            isDisabled={isImporting}
          >
            {importResults ? 'Close' : 'Cancel'}
          </Button>
          <Button
            color="primary"
            onPress={handleImport}
            isDisabled={!canImport()}
            isLoading={isImporting}
            startContent={!isImporting ? <FiUpload /> : undefined}
          >
            {isImporting ? 'Importing...' : 'Import Data'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
