import { useState } from "react";
import { Database, Server, Cloud, Layers, HardDrive, Network, Shield, Zap, Box, GitBranch, Globe, Cpu, Container, Activity, Lock, Users, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface IconLibraryProps {
  onIconSelect: (iconType: string, icon: string) => void;
}

// Professional technology stack icons with popular technologies
const systemDesignIcons = [
  // Databases
  { id: "postgresql", label: "PostgreSQL", Icon: Database, color: "#336791", category: "database" },
  { id: "mongodb", label: "MongoDB", Icon: Database, color: "#47A248", category: "database" },
  { id: "mysql", label: "MySQL", Icon: Database, color: "#4479A1", category: "database" },
  { id: "cassandra", label: "Cassandra", Icon: Database, color: "#1287B1", category: "database" },
  
  // Caching
  { id: "redis", label: "Redis", Icon: Layers, color: "#DC382D", category: "cache" },
  { id: "memcached", label: "Memcached", Icon: Layers, color: "#00B8D4", category: "cache" },
  
  // Message Queues
  { id: "kafka", label: "Kafka", Icon: Activity, color: "#231F20", category: "queue" },
  { id: "rabbitmq", label: "RabbitMQ", Icon: Activity, color: "#FF6600", category: "queue" },
  
  // Cloud & Infrastructure
  { id: "aws", label: "AWS", Icon: Cloud, color: "#FF9900", category: "cloud" },
  { id: "azure", label: "Azure", Icon: Cloud, color: "#0089D6", category: "cloud" },
  { id: "gcp", label: "GCP", Icon: Cloud, color: "#4285F4", category: "cloud" },
  
  // Load Balancing & Networking
  { id: "nginx", label: "NGINX", Icon: GitBranch, color: "#009639", category: "network" },
  { id: "loadbalancer", label: "Load Balancer", Icon: GitBranch, color: "#a855f7", category: "network" },
  { id: "cdn", label: "CDN", Icon: Globe, color: "#F16529", category: "network" },
  
  // API & Services
  { id: "api-gateway", label: "API Gateway", Icon: Zap, color: "#eab308", category: "api" },
  { id: "microservice", label: "Microservice", Icon: Box, color: "#06b6d4", category: "service" },
  { id: "rest-api", label: "REST API", Icon: FileText, color: "#00D9FF", category: "api" },
  
  // Containers & Orchestration
  { id: "docker", label: "Docker", Icon: Container, color: "#2496ED", category: "container" },
  { id: "kubernetes", label: "Kubernetes", Icon: Container, color: "#326CE5", category: "container" },
  
  // Servers & Compute
  { id: "server", label: "App Server", Icon: Server, color: "#10b981", category: "compute" },
  { id: "lambda", label: "Lambda", Icon: Cpu, color: "#FF9900", category: "compute" },
  
  // Security
  { id: "auth", label: "Auth Service", Icon: Lock, color: "#ef4444", category: "security" },
  { id: "firewall", label: "Firewall", Icon: Shield, color: "#DC2626", category: "security" },
  
  // Storage
  { id: "s3", label: "S3 Storage", Icon: HardDrive, color: "#569A31", category: "storage" },
  { id: "blob-storage", label: "Blob Storage", Icon: HardDrive, color: "#0089D6", category: "storage" },
  
  // Users & Clients
  { id: "users", label: "Users/Clients", Icon: Users, color: "#8b5cf6", category: "client" },
];

const categories = [
  { id: "all", label: "All", color: "default" },
  { id: "database", label: "Databases", color: "blue" },
  { id: "cache", label: "Cache", color: "orange" },
  { id: "queue", label: "Queues", color: "red" },
  { id: "cloud", label: "Cloud", color: "purple" },
  { id: "network", label: "Network", color: "green" },
  { id: "api", label: "API", color: "yellow" },
  { id: "service", label: "Services", color: "cyan" },
  { id: "container", label: "Containers", color: "blue" },
  { id: "compute", label: "Compute", color: "emerald" },
  { id: "security", label: "Security", color: "rose" },
  { id: "storage", label: "Storage", color: "pink" },
  { id: "client", label: "Clients", color: "violet" },
] as const;

// Helper to convert hex to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 59, g: 130, b: 246 };
};

export const SystemDesignIconLibrary = ({ onIconSelect }: IconLibraryProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredIcons = selectedCategory === "all" 
    ? systemDesignIcons 
    : systemDesignIcons.filter(icon => icon.category === selectedCategory);

  const handleDragStart = (e: React.DragEvent, iconType: string, icon: string, color: string) => {
    e.dataTransfer.setData("iconType", iconType);
    e.dataTransfer.setData("icon", icon);
    e.dataTransfer.setData("color", color);
    e.dataTransfer.effectAllowed = "copy";
    
    // Add visual feedback during drag
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  return (
    <Card className="h-full bg-card/80 backdrop-blur-sm border-border shadow-lg">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">Component Library</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Drag & drop technologies</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {filteredIcons.length} items
          </Badge>
        </div>
        
        {/* Category Filter */}
        <ScrollArea className="w-full">
          <div className="flex gap-1.5 pt-3 pb-1">
            {categories.map((cat) => (
              <Badge
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className="cursor-pointer text-xs px-2 py-1 whitespace-nowrap"
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </CardHeader>
      <CardContent className="p-3">
        <ScrollArea className="h-[calc(100vh-350px)] pr-3">
          <div className="grid grid-cols-2 gap-2.5">
            {filteredIcons.map((item) => {
              const Icon = item.Icon;
              const rgb = hexToRgb(item.color);
              
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id, item.label, item.color)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onIconSelect(item.id, item.label)}
                  className="relative flex flex-col items-center gap-1.5 p-2.5 rounded-lg cursor-move transition-all hover:scale-105 hover:shadow-lg active:scale-95 border-2"
                  style={{
                    backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`,
                    borderColor: item.color,
                  }}
                  title={`Drag ${item.label} to canvas`}
                >
                  {/* Header section */}
                  <div 
                    className="w-full h-8 rounded-t-md flex items-center justify-center -mt-2.5 -mx-2.5"
                    style={{ 
                      backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-sm"
                      style={{ 
                        backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`,
                        borderColor: item.color,
                      }}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  {/* Label */}
                  <span className="text-xs font-bold text-center leading-tight text-white mt-1">
                    {item.label}
                  </span>
                  
                  {/* Badge */}
                  <div 
                    className="w-full py-0.5 rounded text-center"
                    style={{ backgroundColor: item.color, opacity: 0.9 }}
                  >
                    <span className="text-[9px] font-semibold text-white">Component</span>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
