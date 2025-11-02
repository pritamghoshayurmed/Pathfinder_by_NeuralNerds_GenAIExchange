import { GamepadIcon, Heart, Target, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";

const SkillGames = () => {
  const games = [
    {
      title: "Code Quest",
      description: "Learn programming basics through interactive adventures",
      difficulty: "Beginner",
      icon: GamepadIcon,
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "Design Challenge",
      description: "Creative problem-solving and visual design tasks",
      difficulty: "Easy",
      icon: Heart,
      color: "from-pink-500 to-red-500"
    },
    {
      title: "Logic Puzzles",
      description: "Strengthen analytical thinking with fun puzzles",
      difficulty: "Medium",
      icon: Target,
      color: "from-green-500 to-teal-500"
    }
  ];

  return (
    <DashboardLayout 
      title="Skill Building Games" 
      description="Learn through play - develop real skills with fun games"
    >
      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${game.color} flex items-center justify-center mb-2`}>
                  <game.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle>{game.title}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Play Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SkillGames;
