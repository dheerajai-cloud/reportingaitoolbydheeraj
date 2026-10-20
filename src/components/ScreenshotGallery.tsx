import React, { useState } from 'react';
import { UploadedImage } from '../types/report';
import { Eye, X, ZoomIn } from 'lucide-react';

interface ScreenshotGalleryProps {
  images: UploadedImage[];
  isEditable?: boolean;
  onUpdateCaption?: (id: string, caption: string) => void;
  onRemoveImage?: (id: string) => void;
}

export const ScreenshotGallery: React.FC<ScreenshotGalleryProps> = ({
  images,
  isEditable = false,
  onUpdateCaption,
  onRemoveImage,
}) => {
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>Visual Proof & Screenshot Evidence</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
            {images.length} {images.length === 1 ? 'Proof Attached' : 'Proofs Attached'}
          </span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((img, idx) => (
          <div
            key={img.id || idx}
            className="group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
          >
            {/* Browser / Device Frame bar */}
            <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                <span className="ml-2 font-mono text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-[200px]">
                  {img.name || `Evidence_Capture_${idx + 1}.png`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className="hover:text-indigo-600 transition-colors p-1"
                  title="Zoom Image"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                {isEditable && onRemoveImage && (
                  <button
                    type="button"
                    onClick={() => onRemoveImage(img.id)}
                    className="hover:text-rose-600 transition-colors p-1"
                    title="Remove Image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Image Preview Container */}
            <div
              className="relative max-h-72 overflow-hidden bg-slate-950/5 flex items-center justify-center cursor-pointer"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img.previewUrl}
                alt={img.caption || `Screenshot ${idx + 1}`}
                className="w-full object-contain max-h-72 group-hover:scale-[1.01] transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5" /> Click to Enlarge
                </span>
              </div>
            </div>

            {/* Caption Section */}
            <div className="p-3 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800">
              {isEditable && onUpdateCaption ? (
                <input
                  type="text"
                  value={img.caption || ''}
                  onChange={(e) => onUpdateCaption(img.id, e.target.value)}
                  placeholder="Add a descriptive caption for this screenshot..."
                  className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium italic">
                  {img.caption || `Key visual milestone and verification for Deliverable Phase ${idx + 1}`}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Zoom */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {selectedImage.caption || selectedImage.name || 'Screenshot Preview'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 overflow-auto max-h-[80vh] flex items-center justify-center">
              <img
                src={selectedImage.previewUrl}
                alt="Enlarged view"
                className="max-w-full max-h-[75vh] object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
