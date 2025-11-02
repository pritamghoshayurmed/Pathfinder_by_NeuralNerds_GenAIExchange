import { Brain, Sparkles, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: t('footer.sections.product.links.features'), href: "#features" },
      { name: t('footer.sections.product.links.categories'), href: "#categories" },
      { name: t('footer.sections.product.links.pricing'), href: "#" },
      { name: t('footer.sections.product.links.roadmap'), href: "#" },
    ],
    dashboards: [
      { name: t('footer.sections.dashboards.links.class8to10'), href: "/dashboard/early-stage" },
      { name: t('footer.sections.dashboards.links.class11to12'), href: "/dashboard/decision-making" },
      { name: t('footer.sections.dashboards.links.post12th'), href: "/dashboard/college-admission" },
      { name: t('footer.sections.dashboards.links.collegeStudents'), href: "/dashboard/skill-development" },
    ],
    support: [
      { name: t('footer.sections.support.links.helpCenter'), href: "#" },
      { name: t('footer.sections.support.links.contactUs'), href: "#" },
      { name: t('footer.sections.support.links.faq'), href: "#" },
      { name: t('footer.sections.support.links.privacyPolicy'), href: "#" },
    ],
    company: [
      { name: t('footer.sections.company.links.aboutUs'), href: "#" },
      { name: t('footer.sections.company.links.careers'), href: "#" },
      { name: t('footer.sections.company.links.blog'), href: "#" },
      { name: t('footer.sections.company.links.press'), href: "#" },
    ],
  };

  const socialLinks = [
    { name: t('footer.social.twitter'), icon: Twitter, href: "#" },
    { name: t('footer.social.linkedin'), icon: Linkedin, href: "#" },
    { name: t('footer.social.instagram'), icon: Instagram, href: "#" },
  ];

  return (
    <footer className="bg-gradient-to-t from-muted/20 to-transparent border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 group mb-6">
              <div className="relative">
                <Brain className="w-8 h-8 text-primary group-hover:text-primary-glow transition-colors" />
                <Sparkles className="w-4 h-4 text-secondary absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="text-xl font-bold text-glow">{t('footer.brand.name')}</span>
            </Link>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {t('footer.brand.description')}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>{t('footer.brand.contact.email')}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span>+13205372177</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{t('footer.brand.contact.location')}</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t('footer.sections.product.title')}</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboards Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t('footer.sections.dashboards.title')}</h4>
            <ul className="space-y-2">
              {footerLinks.dashboards.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t('footer.sections.support.title')}</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t('footer.sections.company.title')}</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            {t('footer.copyright', { year: currentYear })}
          </div>
          
          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="w-10 h-10 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-all group"
                aria-label={social.name}
              >
                <social.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;