import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

const ImageUpload = ({ images, onChange, maxImages = 5, className }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/')
      );
      handleFiles(files);
    },
    [images, maxImages]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        handleFiles(files);
      }
    },
    [images, maxImages]
  );

  const handleFiles = async (files: File[]) => {
    const remainingSlots = maxImages - images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    if (filesToProcess.length === 0) return;

    setIsUploading(true);

    try {
      const newImages = await Promise.all(
        filesToProcess.map(
          (file) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result as string);
              };
              reader.readAsDataURL(file);
            })
        )
      );

      onChange([...images, ...newImages]);
    } catch (error) {
      console.error('Error processing images:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center',
          isDragging
            ? 'border-terracotta bg-terracotta/5'
            : 'border-border hover:border-terracotta/50 hover:bg-muted/30',
          images.length >= maxImages && 'opacity-50 pointer-events-none'
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={images.length >= maxImages || isUploading}
        />

        <div className="flex flex-col items-center gap-3">
          {isUploading ? (
            <Loader2 className="w-10 h-10 text-terracotta animate-spin" />
          ) : (
            <Upload className="w-10 h-10 text-muted-foreground" />
          )}
          <div>
            <p className="text-sm font-medium text-foreground">
              {isUploading ? 'Uploading...' : 'Drop images here or click to upload'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, WEBP up to 10MB ({images.length}/{maxImages} images)
            </p>
          </div>
        </div>
      </div>

      {/* Image Preview Grid */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
          >
            {images.map((image, index) => (
              <motion.div
                key={`${image.substring(0, 50)}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square rounded-lg overflow-hidden border border-border"
              >
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {index === 0 && (
                  <span className="absolute top-2 left-2 bg-terracotta text-white text-xs px-2 py-0.5 rounded">
                    Main
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUpload;
