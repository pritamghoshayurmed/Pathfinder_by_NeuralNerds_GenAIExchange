import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Target, 
  GraduationCap, 
  Briefcase,
  ArrowRight,
  Clock,
  Users,
  TrendingUp,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CategoriesSection = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const { t } = useTranslation();

  const categories = [
    {
      id: "early-stage",
      title: t('categoriesSection.items.earlyStage.title'),
      subtitle: t('categoriesSection.items.earlyStage.subtitle'),
      icon: BookOpen,
      color: "from-blue-500/20 to-purple-500/20",
      borderColor: "border-blue-500/30",
      description: t('categoriesSection.items.earlyStage.description'),
      keyPoints: [
        t('categoriesSection.items.earlyStage.keyPoints.point1'),
        t('categoriesSection.items.earlyStage.keyPoints.point2'),
        t('categoriesSection.items.earlyStage.keyPoints.point3'),
        t('categoriesSection.items.earlyStage.keyPoints.point4')
      ],
      stats: { 
        students: t('categoriesSection.items.earlyStage.stats.students'), 
        satisfaction: t('categoriesSection.items.earlyStage.stats.satisfaction'), 
        timeSpent: t('categoriesSection.items.earlyStage.stats.timeSpent') 
      },
      dashboardLink: "/auth"
    },
    {
      id: "decision-making",
      title: t('categoriesSection.items.decisionMaking.title'),
      subtitle: t('categoriesSection.items.decisionMaking.subtitle'),
      icon: Target,
      color: "from-green-500/20 to-teal-500/20",
      borderColor: "border-green-500/30",
      description: t('categoriesSection.items.decisionMaking.description'),
      keyPoints: [
        t('categoriesSection.items.decisionMaking.keyPoints.point1'),
        t('categoriesSection.items.decisionMaking.keyPoints.point2'),
        t('categoriesSection.items.decisionMaking.keyPoints.point3'),
        t('categoriesSection.items.decisionMaking.keyPoints.point4')
      ],
      stats: { 
        students: t('categoriesSection.items.decisionMaking.stats.students'), 
        satisfaction: t('categoriesSection.items.decisionMaking.stats.satisfaction'), 
        timeSpent: t('categoriesSection.items.decisionMaking.stats.timeSpent') 
      },
      dashboardLink: "/auth"
    },
    {
      id: "college-admission",
      title: t('categoriesSection.items.collegeAdmission.title'),
      subtitle: t('categoriesSection.items.collegeAdmission.subtitle'),
      icon: GraduationCap,
      color: "from-orange-500/20 to-red-500/20",
      borderColor: "border-orange-500/30",
      description: t('categoriesSection.items.collegeAdmission.description'),
      keyPoints: [
        t('categoriesSection.items.collegeAdmission.keyPoints.point1'),
        t('categoriesSection.items.collegeAdmission.keyPoints.point2'),
        t('categoriesSection.items.collegeAdmission.keyPoints.point3'),
        t('categoriesSection.items.collegeAdmission.keyPoints.point4')
      ],
      stats: { 
        students: t('categoriesSection.items.collegeAdmission.stats.students'), 
        satisfaction: t('categoriesSection.items.collegeAdmission.stats.satisfaction'), 
        timeSpent: t('categoriesSection.items.collegeAdmission.stats.timeSpent') 
      },
      dashboardLink: "/auth"
    },
    {
      id: "skill-development",
      title: t('categoriesSection.items.skillDevelopment.title'),
      subtitle: t('categoriesSection.items.skillDevelopment.subtitle'),
      icon: Briefcase,
      color: "from-purple-500/20 to-pink-500/20", 
      borderColor: "border-purple-500/30",
      description: t('categoriesSection.items.skillDevelopment.description'),
      keyPoints: [
        t('categoriesSection.items.skillDevelopment.keyPoints.point1'),
        t('categoriesSection.items.skillDevelopment.keyPoints.point2'),
        t('categoriesSection.items.skillDevelopment.keyPoints.point3'),
        t('categoriesSection.items.skillDevelopment.keyPoints.point4')
      ],
      stats: { 
        students: t('categoriesSection.items.skillDevelopment.stats.students'), 
        satisfaction: t('categoriesSection.items.skillDevelopment.stats.satisfaction'), 
        timeSpent: t('categoriesSection.items.skillDevelopment.stats.timeSpent') 
      },
      dashboardLink: "/auth"
    }
  ];

  return (
    <section id="categories" className="py-24 bg-gradient-to-b from-muted/20 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Users className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">{t('categoriesSection.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            {t('categoriesSection.heading.line1')}
            <span className="text-glow block">{t('categoriesSection.heading.line2')}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('categoriesSection.description')}
          </p>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(index)}
              className={`feature-card p-4 transition-all ${
                activeCategory === index 
                  ? category.borderColor + ' bg-gradient-to-r ' + category.color
                  : 'hover:border-primary/30'
              }`}
            >
              <div className="flex items-center space-x-3">
                <category.icon className={`w-6 h-6 ${activeCategory === index ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="text-left">
                  <div className={`font-semibold ${activeCategory === index ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {category.title}
                  </div>
                  <div className="text-sm text-muted-foreground hidden sm:block">
                    {category.subtitle}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Active Category Details */}
        <div className="feature-card p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${categories[activeCategory].color} flex items-center justify-center`}>
                    {(() => {
                      const IconComponent = categories[activeCategory].icon;
                      return <IconComponent className="w-6 h-6 text-primary" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{categories[activeCategory].title}</h3>
                    <p className="text-muted-foreground">{categories[activeCategory].subtitle}</p>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {categories[activeCategory].description}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">{t('categoriesSection.keyFeatures')}</h4>
                <ul className="space-y-3">
                  {categories[activeCategory].keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/90">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/auth">
                <button className="btn-hero flex items-center space-x-2">
                  <span>{t('categoriesSection.getStarted')}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>

            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{categories[activeCategory].stats.students}</div>
                  <div className="text-sm text-muted-foreground">{t('categoriesSection.stats.students')}</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-primary/10">
                  <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{categories[activeCategory].stats.satisfaction}</div>
                  <div className="text-sm text-muted-foreground">{t('categoriesSection.stats.satisfaction')}</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-accent/10 to-secondary/10">
                  <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold">{categories[activeCategory].stats.timeSpent}</div>
                  <div className="text-sm text-muted-foreground">{t('categoriesSection.stats.dailyUse')}</div>
                </div>
              </div>

              {/* Visual Element */}
              <div className={`relative rounded-2xl p-8 bg-gradient-to-br ${categories[activeCategory].color} border ${categories[activeCategory].borderColor}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl"></div>
                <div className="relative text-center">
                  {(() => {
                    const IconComponent = categories[activeCategory].icon;
                    return <IconComponent className="w-16 h-16 text-primary mx-auto mb-4" />;
                  })()}
                  <h4 className="text-xl font-bold mb-2">{t('categoriesSection.readyToStart.title')}</h4>
                  <p className="text-muted-foreground">
                    {t('categoriesSection.readyToStart.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;