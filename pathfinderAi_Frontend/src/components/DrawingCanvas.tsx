import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, Circle, Rect, Line, IText, PencilBrush, Group } from "fabric";
import { CanvasToolbar } from "./CanvasToolbar";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";

export const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#000000");
  const [activeTool, setActiveTool] = useState<"select" | "draw" | "rectangle" | "circle" | "arrow" | "line" | "eraser" | "text">("select");
  const isDrawingRef = useRef(false);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const tempShapeRef = useRef<Rect | Circle | Line | null>(null);
  


  useEffect(() => {
    if (!canvasRef.current) return;

    // Calculate optimal canvas size based on viewport
    const canvasWidth = Math.min(window.innerWidth > 1400 ? 1400 : window.innerWidth - 200, 1600);
    const canvasHeight = Math.min(window.innerHeight - 250, 800);

    const canvas = new FabricCanvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: "#1a1f2e",
    });

    // Add a professional grid pattern
    const gridSize = 25;
    const gridColor = "#2d3748";
    
    for (let i = 0; i < (canvas.width! / gridSize); i++) {
      canvas.add(new Line([i * gridSize, 0, i * gridSize, canvas.height!], {
        stroke: gridColor,
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
      }));
    }
    
    for (let i = 0; i < (canvas.height! / gridSize); i++) {
      canvas.add(new Line([0, i * gridSize, canvas.width!, i * gridSize], {
        stroke: gridColor,
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
      }));
    }

    // Initialize freeDrawingBrush (ensure it exists)
    if (!canvas.freeDrawingBrush) {
      // Create a pencil brush if missing (Fabric v6 ESM sometimes needs explicit init)
      try {
        canvas.freeDrawingBrush = new PencilBrush(canvas as any);
      } catch {
        // Fallback for any type issues
        (canvas as any).freeDrawingBrush = new (PencilBrush as any)(canvas as any);
      }
    }
    canvas.freeDrawingBrush.color = activeColor;
    canvas.freeDrawingBrush.width = 2;

    setFabricCanvas(canvas);

    const handleResize = () => {
      const newWidth = Math.min(window.innerWidth > 1400 ? 1400 : window.innerWidth - 200, 1600);
      const newHeight = Math.min(window.innerHeight - 250, 800);
      canvas.setDimensions({ width: newWidth, height: newHeight });
    };

    window.addEventListener("resize", handleResize);

    // Handle drop events for icon library
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const iconType = e.dataTransfer?.getData("iconType");
      const iconLabel = e.dataTransfer?.getData("icon");
      const iconColor = e.dataTransfer?.getData("color");
      
      if (iconType && iconLabel) {
        const pointer = canvas.getPointer(e as any);
        addSystemDesignIcon(canvas, iconType, iconLabel, pointer.x, pointer.y, iconColor);
        toast.success(`Added ${iconLabel} to canvas`);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer!.dropEffect = 'copy';
    };

    canvasRef.current.addEventListener("drop", handleDrop);
    canvasRef.current.addEventListener("dragover", handleDragOver);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("drop", handleDrop);
        canvasRef.current.removeEventListener("dragover", handleDragOver);
      }
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    // Reset drawing mode first
    fabricCanvas.isDrawingMode = false;
    
    if (activeTool === "draw") {
      if (!fabricCanvas.freeDrawingBrush) {
        try {
          fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas as any);
        } catch {
          (fabricCanvas as any).freeDrawingBrush = new (PencilBrush as any)(fabricCanvas as any);
        }
      }
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.freeDrawingBrush.color = activeColor;
      fabricCanvas.freeDrawingBrush.width = 2;
    }

    if (activeTool === "eraser") {
      if (!fabricCanvas.freeDrawingBrush) {
        try {
          fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas as any);
        } catch {
          (fabricCanvas as any).freeDrawingBrush = new (PencilBrush as any)(fabricCanvas as any);
        }
      }
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.freeDrawingBrush.color = "#1a1f2e"; // Background color
      fabricCanvas.freeDrawingBrush.width = 20;
    }

    // Handle object selection based on tool
    if (activeTool === "select") {
      fabricCanvas.selection = true;
      fabricCanvas.forEachObject((obj) => {
        obj.selectable = true;
        obj.evented = true;
      });
    } else if (activeTool === "draw" || activeTool === "eraser") {
      // For drawing tools, make objects non-interactive so they don't block drawing
      fabricCanvas.selection = false;
      fabricCanvas.discardActiveObject();
      fabricCanvas.forEachObject((obj) => {
        obj.selectable = false;
        obj.evented = false; // Let drawing happen without objects interfering
      });
    } else {
      // For other tools (shapes, text, arrows, etc), disable selection but keep objects visible
      fabricCanvas.selection = false;
      fabricCanvas.discardActiveObject();
      fabricCanvas.forEachObject((obj) => {
        obj.selectable = false;
        obj.evented = true;
      });
    }
    
    fabricCanvas.renderAll();
  }, [activeTool, activeColor, fabricCanvas]);

  useEffect(() => {
    if (!fabricCanvas) return;

    const handleMouseDown = (e: any) => {
      if (activeTool === "select" || activeTool === "draw" || activeTool === "eraser") return;

      const pointer = fabricCanvas.getPointer(e.e);
      isDrawingRef.current = true;
      startPointRef.current = { x: pointer.x, y: pointer.y };

      if (activeTool === "text") {
        const text = new IText("Double click to edit", {
          left: pointer.x,
          top: pointer.y,
          fill: activeColor,
          fontSize: 20,
          fontFamily: "Arial",
          selectable: true,
          evented: true,
        });
        fabricCanvas.add(text);
        fabricCanvas.setActiveObject(text);
        text.enterEditing();
        isDrawingRef.current = false;
        return;
      }

      if (activeTool === "rectangle") {
        const rect = new Rect({
          left: pointer.x,
          top: pointer.y,
          width: 0,
          height: 0,
          fill: "transparent",
          stroke: activeColor,
          strokeWidth: 2,
          selectable: true,
          evented: true,
        });
        fabricCanvas.add(rect);
        tempShapeRef.current = rect;
      } else if (activeTool === "circle") {
        const circle = new Circle({
          left: pointer.x,
          top: pointer.y,
          radius: 0,
          fill: "transparent",
          stroke: activeColor,
          strokeWidth: 2,
          selectable: true,
          evented: true,
        });
        fabricCanvas.add(circle);
        tempShapeRef.current = circle;
      } else if (activeTool === "line" || activeTool === "arrow") {
        const line = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
          stroke: activeColor,
          strokeWidth: 2,
          selectable: true,
          evented: true,
        });
        fabricCanvas.add(line);
        tempShapeRef.current = line;
      }
    };

    const handleMouseMove = (e: any) => {
      if (!isDrawingRef.current || !startPointRef.current || !tempShapeRef.current) return;

      const pointer = fabricCanvas.getPointer(e.e);

      if (activeTool === "rectangle") {
        const rect = tempShapeRef.current as Rect;
        const width = pointer.x - startPointRef.current.x;
        const height = pointer.y - startPointRef.current.y;
        
        rect.set({
          width: Math.abs(width),
          height: Math.abs(height),
          left: width < 0 ? pointer.x : startPointRef.current.x,
          top: height < 0 ? pointer.y : startPointRef.current.y,
        });
      } else if (activeTool === "circle") {
        const circle = tempShapeRef.current as Circle;
        const radius = Math.sqrt(
          Math.pow(pointer.x - startPointRef.current.x, 2) +
          Math.pow(pointer.y - startPointRef.current.y, 2)
        ) / 2;
        
        circle.set({
          radius: Math.abs(radius),
        });
      } else if (activeTool === "line" || activeTool === "arrow") {
        const line = tempShapeRef.current as Line;
        line.set({
          x2: pointer.x,
          y2: pointer.y,
        });
      }

      fabricCanvas.renderAll();
    };

    const handleMouseUp = () => {
      if (activeTool === "arrow" && tempShapeRef.current) {
        const line = tempShapeRef.current as Line;
        const angle = Math.atan2(line.y2! - line.y1!, line.x2! - line.x1!);
        const headLength = 15;
        
        const arrowHead1 = new Line(
          [
            line.x2!,
            line.y2!,
            line.x2! - headLength * Math.cos(angle - Math.PI / 6),
            line.y2! - headLength * Math.sin(angle - Math.PI / 6),
          ],
          {
            stroke: activeColor,
            strokeWidth: 2,
            selectable: true,
            evented: true,
          }
        );
        
        const arrowHead2 = new Line(
          [
            line.x2!,
            line.y2!,
            line.x2! - headLength * Math.cos(angle + Math.PI / 6),
            line.y2! - headLength * Math.sin(angle + Math.PI / 6),
          ],
          {
            stroke: activeColor,
            strokeWidth: 2,
            selectable: true,
            evented: true,
          }
        );
        
        fabricCanvas.add(arrowHead1, arrowHead2);
      }

      isDrawingRef.current = false;
      startPointRef.current = null;
      tempShapeRef.current = null;
    };

    fabricCanvas.on("mouse:down", handleMouseDown);
    fabricCanvas.on("mouse:move", handleMouseMove);
    fabricCanvas.on("mouse:up", handleMouseUp);

    return () => {
      fabricCanvas.off("mouse:down", handleMouseDown);
      fabricCanvas.off("mouse:move", handleMouseMove);
      fabricCanvas.off("mouse:up", handleMouseUp);
    };
  }, [activeTool, activeColor, fabricCanvas]);

  const handleToolClick = (tool: typeof activeTool) => {
    setActiveTool(tool);
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#1a1f2e";
    
    // Restore grid pattern
    const gridSize = 25;
    const gridColor = "#2d3748";
    
    for (let i = 0; i < (fabricCanvas.width! / gridSize); i++) {
      fabricCanvas.add(new Line([i * gridSize, 0, i * gridSize, fabricCanvas.height!], {
        stroke: gridColor,
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
      }));
    }
    
    for (let i = 0; i < (fabricCanvas.height! / gridSize); i++) {
      fabricCanvas.add(new Line([0, i * gridSize, fabricCanvas.width!, i * gridSize], {
        stroke: gridColor,
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
      }));
    }
    
    fabricCanvas.renderAll();
    toast.success("Canvas cleared!");
  };

  const handleExport = () => {
    if (!fabricCanvas) return;
    
    // Export as PNG
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2, // Higher resolution
    });
    
    const link = document.createElement('a');
    link.download = `system-design-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    
    toast.success("Canvas exported as PNG!");
  };

  // Enable dropping on the container (works across browsers)
  const handleContainerDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleContainerDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!fabricCanvas || !canvasRef.current) return;

    const iconType = e.dataTransfer.getData("iconType");
    const iconLabel = e.dataTransfer.getData("icon");
    const iconColor = e.dataTransfer.getData("color");
    if (!iconType || !iconLabel) return;

    const rect = (canvasRef.current as HTMLCanvasElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    addSystemDesignIcon(fabricCanvas, iconType, iconLabel, x, y, iconColor);
    toast.success(`Added ${iconLabel} to canvas`);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <CanvasToolbar
        activeTool={activeTool}
        onToolClick={handleToolClick}
        onClear={handleClear}
        onExport={handleExport}
        color={activeColor}
        onColorChange={setActiveColor}
      />
      <div 
        className="flex-1 flex items-center justify-center bg-secondary/20 rounded-lg overflow-hidden"
        onDragOver={handleContainerDragOver}
        onDrop={handleContainerDrop}
      >
        <canvas ref={canvasRef} className="border border-border rounded shadow-lg" />
      </div>
    </div>
  );
};

// Helper function to add system design icons with actual icon rendering
const addSystemDesignIcon = (
  canvas: FabricCanvas,
  iconType: string,
  label: string,
  x: number,
  y: number,
  customColor?: string
) => {
  const colorMap: Record<string, string> = {
    database: "#3b82f6",
    server: "#10b981",
    cloud: "#8b5cf6",
    cache: "#f59e0b",
    storage: "#ec4899",
    network: "#14b8a6",
    security: "#ef4444",
    api: "#eab308",
    service: "#06b6d4",
    loadbalancer: "#a855f7",
    postgresql: "#336791",
    mongodb: "#47A248",
    mysql: "#4479A1",
    redis: "#DC382D",
    kafka: "#231F20",
    aws: "#FF9900",
    nginx: "#009639",
    docker: "#2496ED",
    kubernetes: "#326CE5",
    memcached: "#00B8D4",
    rabbitmq: "#FF6600",
    azure: "#0089D6",
    gcp: "#4285F4",
    cdn: "#F16529",
    lambda: "#FF9900",
    s3: "#569A31",
    users: "#8b5cf6",
    "api-gateway": "#eab308",
    microservice: "#06b6d4",
    "rest-api": "#00D9FF",
    auth: "#ef4444",
    firewall: "#DC2626",
    "blob-storage": "#0089D6",
    cassandra: "#1287B1",
  };

  const color = customColor || colorMap[iconType] || "#3b82f6";
  
  // Parse color to RGB for transparency effects
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 59, g: 130, b: 246 };
  };
  
  const rgb = hexToRgb(color);
  
  // Card dimensions
  const cardWidth = 140;
  const cardHeight = 110;
  const cardX = x - cardWidth / 2;
  const cardY = y - cardHeight / 2;
  
  // Create all shapes as a group for better undo/redo
  const shapes: any[] = [];
  
  // Outer glow/shadow effect
  shapes.push(new Rect({
    left: -3,
    top: -3,
    width: cardWidth + 6,
    height: cardHeight + 6,
    fill: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`,
    rx: 14,
    ry: 14,
  }));

  // Main card background
  shapes.push(new Rect({
    left: 0,
    top: 0,
    width: cardWidth,
    height: cardHeight,
    fill: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`,
    stroke: color,
    strokeWidth: 3,
    rx: 12,
    ry: 12,
  }));

  // Header section
  shapes.push(new Rect({
    left: 0,
    top: 0,
    width: cardWidth,
    height: 50,
    fill: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`,
    rx: 12,
    ry: 12,
  }));

  // Icon background circle
  shapes.push(new Circle({
    left: cardWidth / 2 - 22,
    top: 3,
    radius: 22,
    fill: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`,
    stroke: color,
    strokeWidth: 3,
  }));

  // Draw simplified icon representation based on type
  const iconCenterX = cardWidth / 2;
  const iconCenterY = 25;
  
  // Add icon shapes based on type
  if (iconType.includes("database") || iconType === "postgresql" || iconType === "mongodb" || iconType === "mysql" || iconType === "cassandra") {
    // Database cylinder
    shapes.push(new Circle({
      left: iconCenterX - 12,
      top: iconCenterY - 15,
      radius: 12,
      radiusY: 4,
      fill: "transparent",
      stroke: "#ffffff",
      strokeWidth: 2,
    }));
    shapes.push(new Rect({
      left: iconCenterX - 12,
      top: iconCenterY - 11,
      width: 24,
      height: 20,
      fill: "transparent",
      stroke: "#ffffff",
      strokeWidth: 2,
    }));
    shapes.push(new Circle({
      left: iconCenterX - 12,
      top: iconCenterY + 9,
      radius: 12,
      radiusY: 4,
      fill: "transparent",
      stroke: "#ffffff",
      strokeWidth: 2,
    }));
  } else if (iconType.includes("redis") || iconType.includes("cache") || iconType === "memcached") {
    // Cache/Layers icon
    shapes.push(new Rect({
      left: iconCenterX - 14,
      top: iconCenterY - 12,
      width: 28,
      height: 6,
      fill: "transparent",
      stroke: "#ffffff",
      strokeWidth: 2,
      rx: 2,
    }));
    shapes.push(new Rect({
      left: iconCenterX - 14,
      top: iconCenterY - 3,
      width: 28,
      height: 6,
      fill: "transparent",
      stroke: "#ffffff",
      strokeWidth: 2,
      rx: 2,
    }));
    shapes.push(new Rect({
      left: iconCenterX - 14,
      top: iconCenterY + 6,
      width: 28,
      height: 6,
      fill: "transparent",
      stroke: "#ffffff",
      strokeWidth: 2,
      rx: 2,
    }));
  } else if (iconType.includes("server") || iconType === "nginx") {
    // Server icon
    shapes.push(new Rect({
      left: iconCenterX - 12,
      top: iconCenterY - 14,
      width: 24,
      height: 28,
      fill: "transparent",
      stroke: "#ffffff",
      strokeWidth: 2,
      rx: 2,
    }));
    shapes.push(new Circle({
      left: iconCenterX - 2,
      top: iconCenterY - 8,
      radius: 2,
      fill: "#ffffff",
    }));
    shapes.push(new Circle({
      left: iconCenterX - 2,
      top: iconCenterY,
      radius: 2,
      fill: "#ffffff",
    }));
  } else if (iconType.includes("cloud") || iconType === "aws" || iconType === "azure" || iconType === "gcp") {
    // Cloud icon
    shapes.push(new Circle({
      left: iconCenterX - 10,
      top: iconCenterY - 6,
      radius: 7,
      fill: "transparent",
      stroke: "#ffffff",
      strokeWidth: 2,
    }));
    shapes.push(new Circle({
      left: iconCenterX - 2,
      top: iconCenterY - 8,
      radius: 8,
      fill: "transparent",
      stroke: "#ffffff",
      strokeWidth: 2,
    }));
    shapes.push(new Circle({
      left: iconCenterX + 4,
      top: iconCenterY - 6,
      radius: 6,
      fill: "transparent",
      stroke: "#ffffff",
      strokeWidth: 2,
    }));
  } else if (iconType.includes("docker") || iconType.includes("kubernetes") || iconType.includes("container")) {
    // Container icon
    shapes.push(new Rect({
      left: iconCenterX - 12,
      top: iconCenterY - 10,
      width: 24,
      height: 20,
      fill: "transparent",
      stroke: "#ffffff",
      strokeWidth: 2,
      rx: 2,
    }));
    shapes.push(new Line([iconCenterX - 12, iconCenterY - 3, iconCenterX + 12, iconCenterY - 3], {
      stroke: "#ffffff",
      strokeWidth: 2,
    }));
    shapes.push(new Line([iconCenterX - 12, iconCenterY + 4, iconCenterX + 12, iconCenterY + 4], {
      stroke: "#ffffff",
      strokeWidth: 2,
    }));
  } else if (iconType.includes("users") || iconType.includes("client")) {
    // Users icon
    shapes.push(new Circle({
      left: iconCenterX - 8,
      top: iconCenterY - 10,
      radius: 5,
      fill: "transparent",
      stroke: "#ffffff",
      strokeWidth: 2,
    }));
    shapes.push(new Circle({
      left: iconCenterX + 3,
      top: iconCenterY - 10,
      radius: 5,
      fill: "transparent",
      stroke: "#ffffff",
      strokeWidth: 2,
    }));
  } else {
    // Default: simple icon box
    shapes.push(new Rect({
      left: iconCenterX - 10,
      top: iconCenterY - 10,
      width: 20,
      height: 20,
      fill: "transparent",
      stroke: "#ffffff",
      strokeWidth: 2,
      rx: 3,
    }));
  }

  // Label text
  shapes.push(new IText(label, {
    left: cardWidth / 2 - 50,
    top: 60,
    width: 100,
    fontSize: 12,
    fill: "#ffffff",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
    textAlign: "center",
  }));

  // Badge at bottom
  shapes.push(new Rect({
    left: cardWidth / 2 - 50,
    top: 82,
    width: 100,
    height: 18,
    fill: color,
    rx: 4,
    ry: 4,
    opacity: 0.9,
  }));

  shapes.push(new IText("Component", {
    left: cardWidth / 2 - 35,
    top: 85,
    fontSize: 9,
    fill: "#ffffff",
    fontFamily: "Arial, sans-serif",
    fontWeight: "600",
  }));

  // Create group from all shapes
  const group = new Group(shapes, {
    left: cardX,
    top: cardY,
    selectable: true,
    hasControls: true,
  });

  canvas.add(group);
  canvas.renderAll();
};
