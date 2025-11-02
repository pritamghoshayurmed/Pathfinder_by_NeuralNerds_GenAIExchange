import { 
  Brain, 
  Target, 
  BookOpen, 
  TrendingUp, 
  Users, 
  Lightbulb,
  BarChart3,
  Compass,
  Rocket,
  Shield,
  Zap
} from "lucide-react";
import { useTranslation } from "react-i18next";

const FeaturesSection = () => {
  const { t } = useTranslation();

  const mainFeatures = [
    {
      icon: Brain,
      title: t('features.main.aiAssessment.title'),
      description: t('features.main.aiAssessment.description'),
      color: "text-primary"
    },
    {
      icon: Compass,
      title: t('features.main.careerMapping.title'),
      description: t('features.main.careerMapping.description'),
      color: "text-secondary"
    },
    {
      icon: TrendingUp,
      title: t('features.main.marketIntelligence.title'),
      description: t('features.main.marketIntelligence.description'),
      color: "text-accent"
    },
    {
      icon: BookOpen,
      title: t('features.main.skillDevelopment.title'),
      description: t('features.main.skillDevelopment.description'),
      color: "text-primary"
    }
  ];

  const categoryFeatures = [
    {
      category: t('features.categories.class8to10.title'),
      subtitle: t('features.categories.class8to10.subtitle'),
      icon: Lightbulb,
      features: [
        t('features.categories.class8to10.features.aptitudeTests'),
        t('features.categories.class8to10.features.careerAwareness'),
        t('features.categories.class8to10.features.skillStarter'),
        t('features.categories.class8to10.features.stressManagement'),
        t('features.categories.class8to10.features.gamifiedLearning')
      ],
      color: "border-primary/30 bg-primary/5"
    },
    {
      category: t('features.categories.class11to12.title'),
      subtitle: t('features.categories.class11to12.subtitle'),
      icon: Target,
      features: [
        t('features.categories.class11to12.features.pathwayExplorer'),
        t('features.categories.class11to12.features.examPrep'),
        t('features.categories.class11to12.features.alternativeOptions'),
        t('features.categories.class11to12.features.collegeInsights'),
        t('features.categories.class11to12.features.peerInteraction')
      ],
      color: "border-secondary/30 bg-secondary/5"
    },
    {
      category: t('features.categories.post12th.title'),
      subtitle: t('features.categories.post12th.subtitle'),
      icon: BarChart3,
      features: [
        t('features.categories.post12th.features.collegeTool'),
        t('features.categories.post12th.features.matchmaker'),
        t('features.categories.post12th.features.roiCalculator'),
        t('features.categories.post12th.features.simulator'),
        t('features.categories.post12th.features.scholarshipGuides')
      ],
      color: "border-accent/30 bg-accent/5"
    },
    {
      category: t('features.categories.college.title'),
      subtitle: t('features.categories.college.subtitle'),
      icon: Rocket,
      features: [
        t('features.categories.college.features.gapAnalyzer'),
        t('features.categories.college.features.learningPaths'),
        t('features.categories.college.features.trendsDashboard'),
        t('features.categories.college.features.internships'),
        t('features.categories.college.features.placementKit')
      ],
      color: "border-primary/30 bg-primary/5"
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-transparent to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Features */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">{t('features.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            {t('features.heading.line1')}
            <span className="text-glow block">{t('features.heading.line2')}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('features.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {mainFeatures.map((feature, index) => (
            <div key={index} className="feature-card text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Category-Specific Features */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-secondary/10 border border-secondary/20 rounded-full px-4 py-2 mb-6">
            <Users className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">{t('features.categorySection.badge')}</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold mb-6">
            {t('features.categorySection.heading.line1')}
            <span className="text-glow block">{t('features.categorySection.heading.line2')}</span>
          </h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {categoryFeatures.map((category, index) => (
            <div key={index} className={`feature-card ${category.color}`}>
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                  <category.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-1">{category.category}</h4>
                  <p className="text-muted-foreground">{category.subtitle}</p>
                </div>
              </div>
              
              <ul className="space-y-3">
                {category.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-foreground/90">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;