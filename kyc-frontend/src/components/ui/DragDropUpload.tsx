import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface DragDropUploadProps {
  label: string;
  description: string;
  error?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
}

export const DragDropUpload: React.FC<DragDropUploadProps> = ({
  label,
  description,
  error,
  value,
  onChange,
  accept = 'image/*',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generar vista previa temporal cuando cambie el archivo
  React.useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(value);
    setPreviewUrl(objectUrl);
    
    // Revocar para limpiar memoria cuando se desmonte el componente o cambie el valor
    return () => URL.revokeObjectURL(objectUrl);
  }, [value]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onChange(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onChange(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const uploadId = `upload-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  return (
    <div className="flex flex-col space-y-2 w-full">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </span>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={label}
        aria-describedby={`${uploadId}-desc`}
        className={`relative w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-200 min-h-[180px] outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20 focus-visible:border-primary-500 dark:focus-visible:ring-primary-500/30
          ${isDragOver ? 'border-primary-500 bg-primary-50/30 dark:bg-primary-950/10' : 'border-slate-300 dark:border-slate-800 hover:border-primary-400 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60'}
          ${error ? 'border-red-500 dark:border-red-500' : ''}`}
      >
        <input
          id={uploadId}
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={accept}
          className="hidden"
        />

        {previewUrl ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center space-y-3 animate-fade-in">
            <div className="relative group w-32 h-32 md:w-36 md:h-36 rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
              <img
                src={previewUrl}
                alt="Vista previa"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-slate-950/80 hover:bg-red-600 text-white rounded-full p-1.5 transition-all duration-200 shadow-md"
                title="Eliminar archivo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1.5 font-semibold">
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="truncate max-w-[150px]">{value?.name}</span>
              <span>({((value?.size || 0) / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800 text-slate-400 dark:text-slate-500">
              <Upload className="w-6 h-6 text-primary-500 dark:text-primary-400 animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Arrastra tu archivo o <span className="text-primary-600 dark:text-primary-400 hover:underline">búscalo</span>
              </p>
              <p id={`${uploadId}-desc`} className="text-xs text-slate-500 dark:text-slate-400">
                {description}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <span className="text-xs font-semibold text-red-500 dark:text-red-400 mt-1 animate-fade-in">
          {error}
        </span>
      )}
    </div>
  );
};
export default DragDropUpload;
