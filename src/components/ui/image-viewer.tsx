/**
 * Full-screen Image Viewer Component
 * Optimized for viewing floor plans and property photos
 */

import * as React from 'react'
import { X, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface ImageViewerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  src: string
  alt: string
  title?: string
}

export function ImageViewer({ open, onOpenChange, src, alt, title }: ImageViewerProps) {
  const [scale, setScale] = React.useState(1)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const imageRef = React.useRef<HTMLImageElement>(null)

  // Reset scale when opening
  React.useEffect(() => {
    if (open) {
      setScale(1)
      setIsFullscreen(false)
    }
  }, [open])

  // Handle fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Handle ESC key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && !document.fullscreenElement) {
        onOpenChange(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onOpenChange])

  if (!open) return null

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 5))
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 0.5))
  const handleResetZoom = () => setScale(1)

  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await containerRef.current.requestFullscreen()
      }
    } catch (err) {
      console.error('Fullscreen error:', err)
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'fixed inset-0 z-50 bg-black/95 flex flex-col',
        'animate-in fade-in-0 duration-200'
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onOpenChange(false)
        }
      }}
    >
      {/* Header Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="flex-1">
          {title && <h2 className="text-white font-semibold text-lg truncate">{title}</h2>}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-white text-sm font-medium min-w-[4rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
              onClick={handleZoomIn}
              disabled={scale >= 5}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            {scale !== 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-white hover:bg-white/20 text-xs"
                onClick={handleResetZoom}
              >
                Reset
              </Button>
            )}
          </div>

          {/* Fullscreen Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-white hover:bg-white/20"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-white hover:bg-white/20"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Image Container */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        <div
          className="transition-transform duration-200 ease-out"
          style={{ transform: `scale(${scale})` }}
        >
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain select-none"
            draggable={false}
          />
        </div>
      </div>

      {/* Footer Hints */}
      <div className="px-4 py-2 bg-black/50 backdrop-blur-sm border-t border-white/10 text-center">
        <p className="text-white/60 text-xs">
          Click outside image to close • Scroll to zoom • ESC to exit
        </p>
      </div>
    </div>
  )
}
