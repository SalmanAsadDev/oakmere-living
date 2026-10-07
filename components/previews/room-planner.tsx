"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, RefreshCw, Download } from "lucide-react";

export function RoomPlanner() {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Overlay state
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Load sofa overlay (mocking an actual selected variant)
  useEffect(() => {
    // In a real app, this would be passed as a prop from the selected catalogue variant.
    // We use a placeholder image for demonstration purposes.
    setOverlayImage("/assets/oxford/oxford-3-seater-grey.webp");
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Browser-local processing: Never upload to a server
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setBackgroundImage(result);
      setPos({ x: 100, y: 100 });
      setScale(1);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setBackgroundImage(null);
    setPos({ x: 100, y: 100 });
    setScale(1);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawImages = async () => {
      // Draw background
      if (backgroundImage) {
        const bgImg = new Image();
        bgImg.src = backgroundImage;
        await new Promise((resolve) => {
          bgImg.onload = () => {
            // Scale background to fit canvas width while maintaining aspect ratio
            const ratio = canvas.width / bgImg.width;
            const height = bgImg.height * ratio;
            canvas.height = height; // Resize canvas height to match scaled background
            ctx.drawImage(bgImg, 0, 0, canvas.width, height);
            resolve(true);
          };
        });
      }

      // Draw overlay
      if (overlayImage && backgroundImage) {
        const overlayImg = new Image();
        overlayImg.src = overlayImage;
        await new Promise((resolve) => {
          overlayImg.onload = () => {
            const width = overlayImg.width * scale * 0.5; // Base scale adjustment
            const height = overlayImg.height * scale * 0.5;
            ctx.drawImage(overlayImg, pos.x, pos.y, width, height);
            resolve(true);
          };
        });
      }
    };

    drawImages();
  };

  useEffect(() => {
    drawCanvas();
  }, [backgroundImage, overlayImage, pos, scale]);

  // Mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - rect.left - pos.x,
        y: e.clientY - rect.top - pos.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setPos({
        x: e.clientX - rect.left - dragStart.x,
        y: e.clientY - rect.top - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Export standard browser functionality
    const dataUrl = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.download = "oakmere-room-plan.jpg";
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="space-y-6">
      {!backgroundImage ? (
        <div className="border-2 border-dashed border-border rounded-xl p-12 text-center bg-muted/20">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-serif text-xl mb-2">Upload a photo of your room</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
            Take a photo of where you want your new sofa to go. Your photo is processed entirely on your device and never uploaded to our servers.
          </p>
          <div className="flex justify-center">
            <Button asChild>
              <label className="cursor-pointer">
                Select Photo
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                  onChange={handleFileUpload} 
                />
              </label>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-muted/20 rounded-lg border border-border">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Size Adjust</label>
                <input 
                  type="range" 
                  min="0.2" 
                  max="2" 
                  step="0.1" 
                  value={scale} 
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-32 block"
                />
              </div>
              <p className="text-xs text-muted-foreground max-w-[200px] ml-4">
                Drag the sofa to position it. Use the slider to adjust its scale.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RefreshCw className="w-4 h-4 mr-2" /> Start Over
              </Button>
              <Button size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" /> Save Image
              </Button>
            </div>
          </div>

          <div className="relative border border-border rounded-lg overflow-hidden bg-black/5 flex justify-center">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className={`max-w-full touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              // Touch support for mobile
              onTouchStart={(e) => {
                setIsDragging(true);
                const rect = canvasRef.current?.getBoundingClientRect();
                if (rect && e.touches[0]) {
                  setDragStart({
                    x: e.touches[0].clientX - rect.left - pos.x,
                    y: e.touches[0].clientY - rect.top - pos.y,
                  });
                }
              }}
              onTouchMove={(e) => {
                if (!isDragging) return;
                e.preventDefault(); // Prevent scrolling while dragging
                const rect = canvasRef.current?.getBoundingClientRect();
                if (rect && e.touches[0]) {
                  setPos({
                    x: e.touches[0].clientX - rect.left - dragStart.x,
                    y: e.touches[0].clientY - rect.top - dragStart.y,
                  });
                }
              }}
              onTouchEnd={() => setIsDragging(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
