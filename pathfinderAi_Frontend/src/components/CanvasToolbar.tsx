import { Button } from "@/components/ui/button";
import { MousePointer2, Pencil, Square, Circle, ArrowRight, Trash2, Minus, Eraser, Type, Download } from "lucide-react";

interface CanvasToolbarProps {
  activeTool: "select" | "draw" | "rectangle" | "circle" | "arrow" | "line" | "eraser" | "text";
  onToolClick: (tool: "select" | "draw" | "rectangle" | "circle" | "arrow" | "line" | "eraser" | "text") => void;
  onClear: () => void;
  onExport: () => void;
  color: string;
  onColorChange: (color: string) => void;
}

const colors = [
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#ef4444" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Yellow", value: "#eab308" },
  { name: "Purple", value: "#a855f7" },
  { name: "Orange", value: "#f97316" },
  { name: "White", value: "#ffffff" },
];

export const CanvasToolbar = ({ activeTool, onToolClick, onClear, onExport, color, onColorChange }: CanvasToolbarProps) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-card/95 to-card/85 backdrop-blur-md border-2 border-border/50 rounded-xl shadow-lg flex-wrap">
      {/* Tools */}
      <div className="flex items-center gap-1 pr-3 border-r-2 border-border/50">
        <Button
          variant={activeTool === "select" ? "default" : "ghost"}
          size="icon"
          onClick={() => onToolClick("select")}
          title="Select (V)"
          className={activeTool === "select" ? "bg-primary shadow-md" : "hover:bg-primary/20"}
        >
          <MousePointer2 className="w-4 h-4" />
        </Button>
        <Button
          variant={activeTool === "draw" ? "default" : "ghost"}
          size="icon"
          onClick={() => onToolClick("draw")}
          title="Draw (P)"
          className={activeTool === "draw" ? "bg-primary shadow-md" : "hover:bg-primary/20"}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant={activeTool === "line" ? "default" : "ghost"}
          size="icon"
          onClick={() => onToolClick("line")}
          title="Line (L)"
          className={activeTool === "line" ? "bg-primary shadow-md" : "hover:bg-primary/20"}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Button
          variant={activeTool === "arrow" ? "default" : "ghost"}
          size="icon"
          onClick={() => onToolClick("arrow")}
          title="Arrow (A)"
          className={activeTool === "arrow" ? "bg-primary shadow-md" : "hover:bg-primary/20"}
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button
          variant={activeTool === "rectangle" ? "default" : "ghost"}
          size="icon"
          onClick={() => onToolClick("rectangle")}
          title="Rectangle (R)"
          className={activeTool === "rectangle" ? "bg-primary shadow-md" : "hover:bg-primary/20"}
        >
          <Square className="w-4 h-4" />
        </Button>
        <Button
          variant={activeTool === "circle" ? "default" : "ghost"}
          size="icon"
          onClick={() => onToolClick("circle")}
          title="Circle (C)"
          className={activeTool === "circle" ? "bg-primary shadow-md" : "hover:bg-primary/20"}
        >
          <Circle className="w-4 h-4" />
        </Button>
        <Button
          variant={activeTool === "text" ? "default" : "ghost"}
          size="icon"
          onClick={() => onToolClick("text")}
          title="Text (T)"
          className={activeTool === "text" ? "bg-primary shadow-md" : "hover:bg-primary/20"}
        >
          <Type className="w-4 h-4" />
        </Button>
        <Button
          variant={activeTool === "eraser" ? "default" : "ghost"}
          size="icon"
          onClick={() => onToolClick("eraser")}
          title="Eraser (E)"
          className={activeTool === "eraser" ? "bg-primary shadow-md" : "hover:bg-primary/20"}
        >
          <Eraser className="w-4 h-4" />
        </Button>
      </div>

      {/* Color Palette */}
      <div className="flex items-center gap-1.5 pr-3 border-r-2 border-border/50">
        <span className="text-xs font-semibold text-muted-foreground mr-1">Color:</span>
        {colors.map((c) => (
          <button
            key={c.value}
            onClick={() => onColorChange(c.value)}
            className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 ${
              color === c.value ? "border-primary scale-110 shadow-lg ring-2 ring-primary/30" : "border-border/50 hover:border-primary/50"
            }`}
            style={{ backgroundColor: c.value }}
            title={c.name}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onExport} 
          title="Export as PNG"
          className="hover:bg-green-500/20 hover:border-green-500/50 hover:text-green-500 transition-all"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button 
          variant="destructive" 
          size="icon" 
          onClick={onClear} 
          title="Clear Canvas"
          className="hover:bg-red-500 shadow-md transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
