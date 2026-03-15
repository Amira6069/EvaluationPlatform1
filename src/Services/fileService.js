import API from './api';

const fileService = {
  uploadFile: async (file, evaluationId, criterionId) => {
    console.log('📤 Uploading file:', file.name);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('evaluationId', evaluationId);
    formData.append('criterionId', criterionId);

    const response = await API.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ File uploaded:', response.data.filename);
    return response.data;
  },

  getDownloadUrl: (evaluationId, filename) => {
    return `http://localhost:8080/api/files/download/${evaluationId}/${filename}`;
  },
};

export default fileService;