import api from "./api";

export interface StageAttachment {
  id: number;
  production_planning_plan_stage_id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  attachment_type: 'completion' | 'rejection';
  created_at: string;
  updated_at: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: StageAttachment[];
  errors?: any;
}

class StageAttachmentService {
  /**
   * Upload multiple files for a stage
   */
  async uploadAttachments(
    stageId: number,
    files: File[],
    attachmentType: 'completion' | 'rejection' = 'completion'
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('stage_id', stageId.toString());
    formData.append('attachment_type', attachmentType);

    files.forEach((file) => {
      formData.append(`attachments[]`, file, file.name);
    });

    try {
      const response = await api.post<UploadResponse>(
        '/stage-attachments/store',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload attachments',
        errors: error.response?.data?.errors,
      };
    }
  }

  /**
   * Get all attachments for a stage
   */
  async getAttachments(stageId: number): Promise<StageAttachment[]> {
    try {
      const response = await api.get<{ success: boolean; data: StageAttachment[] }>(
        `/stage-attachments/${stageId}`
      );
      return response.data.success ? response.data.data : [];
    } catch (error) {
      console.error('Error fetching attachments:', error);
      return [];
    }
  }

  /**
   * Get attachments by type for a stage
   */
  async getAttachmentsByType(
    stageId: number,
    type: 'completion' | 'rejection'
  ): Promise<StageAttachment[]> {
    try {
      const response = await api.get<{ success: boolean; data: StageAttachment[] }>(
        `/stage-attachments/${stageId}/type/${type}`
      );
      return response.data.success ? response.data.data : [];
    } catch (error) {
      console.error('Error fetching attachments:', error);
      return [];
    }
  }

  /**
   * Delete an attachment
   */
  async deleteAttachment(attachmentId: number): Promise<boolean> {
    try {
      const response = await api.delete<{ success: boolean; message: string }>(
        `/stage-attachments/${attachmentId}`
      );
      return response.data.success;
    } catch (error) {
      console.error('Error deleting attachment:', error);
      return false;
    }
  }

  /**
   * Download an attachment
   */
  async downloadAttachment(attachmentId: number, fileName: string): Promise<void> {
    try {
      const response = await api.get(`/stage-attachments-download/${attachmentId}`, {
        responseType: 'blob',
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentElement?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading attachment:', error);
    }
  }

  /**
   * Generate preview URL for file
   */
  generatePreviewUrl(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Get file icon based on MIME type
   */
  getFileIcon(mimeType: string): string {
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('pdf')) return 'document';
    if (mimeType.includes('word') || mimeType.includes('msword')) return 'document-text';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'table';
    return 'attach';
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

export default new StageAttachmentService();
