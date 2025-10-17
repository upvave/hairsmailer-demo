'use client';

import {
  addToast,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@heroui/react';
import { useState } from 'react';
import { BsFiletypeJson } from 'react-icons/bs';
import { IoCloudDownloadOutline } from 'react-icons/io5';
import { LuFileSpreadsheet } from 'react-icons/lu';

interface ExportPopoverProps {
  hasData: boolean;
  name: string;
  url: string;
  params?: Record<string, string>;
  isDisabled?: boolean;
}

export default function ExportPopover({
  hasData,
  name,
  url,
  params = {},
  isDisabled = false,
}: ExportPopoverProps) {
  const [openDownload, setOpenDownload] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const downloadFile = async (downloadUrl: string, filename: string) => {
    try {
      setLoading(true);
      const response = await fetch(downloadUrl);

      if (!response.ok) {
        const errorData = await response.json();
        addToast({
          color: 'danger',
          title: errorData.error || 'Error downloading file',
        });
        return;
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      addToast({
        color: 'success',
        title: 'File downloaded successfully',
      });
    } catch (error: any) {
      console.error('Error downloading file:', error);
      addToast({
        color: 'danger',
        title: error.message || 'Error downloading file',
        timeout: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    setOpenDownload(false);
    if (!hasData) {
      addToast({
        color: 'danger',
        title: 'No data available to export',
        timeout: 3000,
      });
      return;
    }

    const searchParams = new URLSearchParams(params);
    const exportUrl = `${url}/export/excel?${searchParams.toString()}`;
    const fileName = `${name}_${new Date().toISOString().split('T')[0]}.xlsx`;
    await downloadFile(exportUrl, fileName);
  };

  const handleExportJson = async () => {
    setOpenDownload(false);
    if (!hasData) {
      addToast({
        color: 'danger',
        title: 'No data available to export',
        timeout: 3000,
      });
      return;
    }

    const searchParams = new URLSearchParams(params);
    const exportUrl = `${url}/export/json?${searchParams.toString()}`;
    const fileName = `${name}_${new Date().toISOString().split('T')[0]}.json`;
    await downloadFile(exportUrl, fileName);
  };

  return (
    <Popover
      showArrow
      backdrop="blur"
      placement="bottom"
      isOpen={openDownload}
      onOpenChange={setOpenDownload}
    >
      <PopoverTrigger>
        <Button
          isDisabled={isDisabled || !hasData}
          isLoading={loading}
          variant="solid"
          color="primary"
          className="shrink-0"
        >
          <IoCloudDownloadOutline />
          Download
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-4 p-4">
        <Button variant="solid" color="primary" onPress={handleExportExcel}>
          <LuFileSpreadsheet />
          Excel File
        </Button>
        <Button variant="solid" color="primary" onPress={handleExportJson}>
          <BsFiletypeJson />
          Json File
        </Button>
      </PopoverContent>
    </Popover>
  );
}
