export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  keywords: string[];
}

export interface UserSkill extends Skill {
  currentLevel: number; // 0-100
  targetLevel: number;  // 0-100
  assessmentMethod: 'self' | 'quiz' | 'project' | 'combined';
  lastAssessed: Date;
  confidence: number; // 0-100
}

export interface QuizQuestion {
  id: string;
  skillId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  explanation: string;
  points: number;
}

export interface ProjectChallenge {
  id: string;
  skillId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeEstimate: string;
  requirements: string[];
  deliverables: string[];
  evaluationCriteria: {
    criterion: string;
    weight: number; // percentage
    description: string;
  }[];
  resources: LearningResource[];
}

export interface TargetRole {
  id: string;
  name: string;
  category: string;
  description: string;
  isSystemDefined: boolean;
  requiredSkills: {
    skillId: string;
    importance: 'critical' | 'high' | 'medium' | 'nice-to-have';
    minimumLevel: number; // 0-100
    weight: number; // for overall score calculation
  }[];
  averageSalary?: {
    min: number;
    max: number;
    currency: string;
  };
  jobMarketDemand: number; // 0-100
  growthRate: string;
}

export interface LearningResource {
  id: string;
  title: string;
  platform: 'coursera' | 'udemy' | 'youtube' | 'pluralsight' | 'edx' | 'other';
  url: string;
  type: 'course' | 'tutorial' | 'article' | 'video' | 'documentation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  rating: number;
  price: number; // 0 for free
  skillIds: string[];
  description: string;
  author?: string;
  thumbnail?: string;
}

export interface SkillTrend {
  skillId: string;
  demand: number; // 0-100
  growth: string; // e.g., "+25%"
  averageSalaryImpact: number; // percentage increase
  jobCount: number;
  topCompanies: string[];
  relatedSkills: string[];
}

export type SkillCategory = 'technical' | 'soft-skills' | 'industry-specific' | 'tools-platforms' | 'languages';

// Master Skills List
export const masterSkills: Skill[] = [
  // Technical Skills
  {
    id: 'html-css',
    name: 'HTML/CSS',
    category: 'technical',
    description: 'Markup and styling for web pages',
    level: 'beginner',
    keywords: ['html', 'css', 'web', 'frontend', 'styling', 'responsive']
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'technical',
    description: 'Programming language for web development',
    level: 'intermediate',
    keywords: ['javascript', 'js', 'programming', 'web', 'frontend']
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'technical',
    description: 'Typed superset of JavaScript',
    level: 'intermediate',
    keywords: ['typescript', 'ts', 'javascript', 'types', 'programming']
  },
  {
    id: 'react',
    name: 'React.js',
    category: 'technical',
    description: 'JavaScript library for building user interfaces',
    level: 'intermediate',
    keywords: ['react', 'javascript', 'frontend', 'component', 'ui']
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'technical',
    description: 'JavaScript runtime for server-side development',
    level: 'intermediate',
    keywords: ['nodejs', 'javascript', 'backend', 'server', 'api']
  },
  {
    id: 'python',
    name: 'Python',
    category: 'technical',
    description: 'High-level programming language',
    level: 'beginner',
    keywords: ['python', 'programming', 'data', 'backend', 'ml']
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    category: 'technical',
    description: 'AI algorithms and model development',
    level: 'advanced',
    keywords: ['ml', 'ai', 'algorithms', 'data', 'prediction']
  },
  {
    id: 'sql',
    name: 'SQL',
    category: 'technical',
    description: 'Database query language',
    level: 'intermediate',
    keywords: ['sql', 'database', 'query', 'data', 'mysql', 'postgresql']
  },
  
  // Soft Skills
  {
    id: 'communication',
    name: 'Communication',
    category: 'soft-skills',
    description: 'Effective verbal and written communication',
    level: 'beginner',
    keywords: ['communication', 'speaking', 'writing', 'presentation']
  },
  {
    id: 'leadership',
    name: 'Leadership',
    category: 'soft-skills',
    description: 'Leading and inspiring teams',
    level: 'advanced',
    keywords: ['leadership', 'management', 'team', 'mentoring']
  },
  {
    id: 'problem-solving',
    name: 'Problem Solving',
    category: 'soft-skills',
    description: 'Analytical thinking and solution development',
    level: 'intermediate',
    keywords: ['problem-solving', 'analytical', 'critical-thinking']
  },
  {
    id: 'project-management',
    name: 'Project Management',
    category: 'soft-skills',
    description: 'Planning and executing projects',
    level: 'intermediate',
    keywords: ['project-management', 'planning', 'agile', 'scrum']
  },

  // Tools & Platforms
  {
    id: 'git',
    name: 'Git/Version Control',
    category: 'tools-platforms',
    description: 'Version control system',
    level: 'beginner',
    keywords: ['git', 'github', 'version-control', 'collaboration']
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'tools-platforms',
    description: 'Containerization platform',
    level: 'intermediate',
    keywords: ['docker', 'containers', 'deployment', 'devops']
  },
  {
    id: 'aws',
    name: 'AWS',
    category: 'tools-platforms',
    description: 'Amazon Web Services cloud platform',
    level: 'advanced',
    keywords: ['aws', 'cloud', 'infrastructure', 'deployment']
  },

  // Industry Specific
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    category: 'industry-specific',
    description: 'Online marketing strategies and tools',
    level: 'intermediate',
    keywords: ['marketing', 'seo', 'social-media', 'analytics']
  },
  {
    id: 'ux-design',
    name: 'UX Design',
    category: 'industry-specific',
    description: 'User experience design principles',
    level: 'intermediate',
    keywords: ['ux', 'design', 'user-experience', 'wireframing']
  }
];

// Target Roles
export const systemTargetRoles: TargetRole[] = [
  {
    id: 'frontend-developer',
    name: 'Frontend Developer',
    category: 'Development',
    description: 'Builds user interfaces and client-side applications',
    isSystemDefined: true,
    requiredSkills: [
      { skillId: 'html-css', importance: 'critical', minimumLevel: 85, weight: 20 },
      { skillId: 'javascript', importance: 'critical', minimumLevel: 80, weight: 25 },
      { skillId: 'react', importance: 'high', minimumLevel: 75, weight: 20 },
      { skillId: 'typescript', importance: 'high', minimumLevel: 70, weight: 15 },
      { skillId: 'git', importance: 'high', minimumLevel: 65, weight: 10 },
      { skillId: 'problem-solving', importance: 'medium', minimumLevel: 70, weight: 10 }
    ],
    averageSalary: { min: 60000, max: 120000, currency: 'USD' },
    jobMarketDemand: 92,
    growthRate: '+22%'
  },
  {
    id: 'fullstack-developer',
    name: 'Fullstack Developer',
    category: 'Development',
    description: 'Develops both frontend and backend applications',
    isSystemDefined: true,
    requiredSkills: [
      { skillId: 'javascript', importance: 'critical', minimumLevel: 85, weight: 20 },
      { skillId: 'react', importance: 'high', minimumLevel: 75, weight: 15 },
      { skillId: 'nodejs', importance: 'critical', minimumLevel: 80, weight: 20 },
      { skillId: 'sql', importance: 'high', minimumLevel: 70, weight: 15 },
      { skillId: 'git', importance: 'high', minimumLevel: 70, weight: 10 },
      { skillId: 'problem-solving', importance: 'high', minimumLevel: 75, weight: 20 }
    ],
    averageSalary: { min: 70000, max: 140000, currency: 'USD' },
    jobMarketDemand: 88,
    growthRate: '+25%'
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    category: 'Analytics',
    description: 'Analyzes data to extract insights and build predictive models',
    isSystemDefined: true,
    requiredSkills: [
      { skillId: 'python', importance: 'critical', minimumLevel: 85, weight: 25 },
      { skillId: 'machine-learning', importance: 'critical', minimumLevel: 80, weight: 25 },
      { skillId: 'sql', importance: 'high', minimumLevel: 75, weight: 20 },
      { skillId: 'problem-solving', importance: 'critical', minimumLevel: 85, weight: 20 },
      { skillId: 'communication', importance: 'high', minimumLevel: 70, weight: 10 }
    ],
    averageSalary: { min: 80000, max: 160000, currency: 'USD' },
    jobMarketDemand: 95,
    growthRate: '+35%'
  },
  {
    id: 'digital-marketer',
    name: 'Digital Marketer',
    category: 'Marketing',
    description: 'Develops and executes online marketing strategies',
    isSystemDefined: true,
    requiredSkills: [
      { skillId: 'digital-marketing', importance: 'critical', minimumLevel: 85, weight: 30 },
      { skillId: 'communication', importance: 'critical', minimumLevel: 80, weight: 25 },
      { skillId: 'problem-solving', importance: 'high', minimumLevel: 70, weight: 20 },
      { skillId: 'project-management', importance: 'medium', minimumLevel: 65, weight: 15 },
      { skillId: 'html-css', importance: 'nice-to-have', minimumLevel: 50, weight: 10 }
    ],
    averageSalary: { min: 45000, max: 90000, currency: 'USD' },
    jobMarketDemand: 78,
    growthRate: '+18%'
  },
  {
    id: 'ux-designer',
    name: 'UX Designer',
    category: 'Design',
    description: 'Designs user experiences and interfaces',
    isSystemDefined: true,
    requiredSkills: [
      { skillId: 'ux-design', importance: 'critical', minimumLevel: 85, weight: 35 },
      { skillId: 'problem-solving', importance: 'high', minimumLevel: 75, weight: 20 },
      { skillId: 'communication', importance: 'high', minimumLevel: 75, weight: 20 },
      { skillId: 'html-css', importance: 'medium', minimumLevel: 60, weight: 15 },
      { skillId: 'project-management', importance: 'medium', minimumLevel: 60, weight: 10 }
    ],
    averageSalary: { min: 55000, max: 110000, currency: 'USD' },
    jobMarketDemand: 82,
    growthRate: '+20%'
  }
];

// Quiz Questions
export const quizQuestions: QuizQuestion[] = [
  // JavaScript Questions
  {
    id: 'js-q1',
    skillId: 'javascript',
    question: 'What is the difference between let, const, and var in JavaScript?',
    options: [
      'No difference, they are interchangeable',
      'let and const have block scope, var has function scope',
      'var is deprecated, let and const are identical',
      'const is for numbers, let for strings, var for objects'
    ],
    correctAnswer: 1,
    difficulty: 'intermediate',
    explanation: 'let and const have block scope and are not hoisted, while var has function scope and is hoisted.',
    points: 10
  },
  {
    id: 'js-q2',
    skillId: 'javascript',
    question: 'Which method would you use to add an element to the end of an array?',
    options: ['push()', 'pop()', 'shift()', 'unshift()'],
    correctAnswer: 0,
    difficulty: 'beginner',
    explanation: 'push() adds elements to the end of an array and returns the new length.',
    points: 5
  },

  // React Questions
  {
    id: 'react-q1',
    skillId: 'react',
    question: 'What is the purpose of the useEffect hook in React?',
    options: [
      'To manage component state',
      'To handle side effects and lifecycle events',
      'To create reusable components',
      'To style components'
    ],
    correctAnswer: 1,
    difficulty: 'intermediate',
    explanation: 'useEffect is used for side effects like API calls, subscriptions, and manual DOM manipulation.',
    points: 10
  },

  // Python Questions
  {
    id: 'python-q1',
    skillId: 'python',
    question: 'Which of the following is the correct way to create a list in Python?',
    options: ['list = (1, 2, 3)', 'list = [1, 2, 3]', 'list = {1, 2, 3}', 'list = 1, 2, 3'],
    correctAnswer: 1,
    difficulty: 'beginner',
    explanation: 'Square brackets [] are used to create lists in Python.',
    points: 5
  },

  // ML Questions
  {
    id: 'ml-q1',
    skillId: 'machine-learning',
    question: 'What is overfitting in machine learning?',
    options: [
      'When a model performs well on training data but poorly on test data',
      'When a model has too few parameters',
      'When training takes too long',
      'When the dataset is too small'
    ],
    correctAnswer: 0,
    difficulty: 'advanced',
    explanation: 'Overfitting occurs when a model learns the training data too well, including noise, reducing generalization.',
    points: 15
  },

  // Communication Questions
  {
    id: 'comm-q1',
    skillId: 'communication',
    question: 'What is the most important aspect of effective communication?',
    options: [
      'Speaking loudly and clearly',
      'Using complex vocabulary',
      'Active listening and understanding your audience',
      'Having perfect grammar'
    ],
    correctAnswer: 2,
    difficulty: 'intermediate',
    explanation: 'Effective communication requires understanding your audience and actively listening to their needs.',
    points: 8
  }
];

// Project Challenges
export const projectChallenges: ProjectChallenge[] = [
  {
    id: 'react-todo-app',
    skillId: 'react',
    title: 'Build a Todo Application',
    description: 'Create a fully functional todo application with React, including add, edit, delete, and filter functionality.',
    difficulty: 'intermediate',
    timeEstimate: '1-2 weeks',
    requirements: [
      'React functional components with hooks',
      'State management for todos',
      'Add, edit, delete todo functionality',
      'Filter todos by status (all, active, completed)',
      'Responsive design',
      'Local storage persistence'
    ],
    deliverables: [
      'Source code repository',
      'Live deployed application',
      'README with setup instructions',
      'Screenshots of the application'
    ],
    evaluationCriteria: [
      { criterion: 'Functionality', weight: 40, description: 'All required features work correctly' },
      { criterion: 'Code Quality', weight: 30, description: 'Clean, readable, and well-organized code' },
      { criterion: 'User Experience', weight: 20, description: 'Intuitive and responsive design' },
      { criterion: 'Documentation', weight: 10, description: 'Clear README and code comments' }
    ],
    resources: []
  },
  {
    id: 'python-data-analysis',
    skillId: 'python',
    title: 'Data Analysis with Python',
    description: 'Analyze a dataset using Python, pandas, and matplotlib to extract meaningful insights.',
    difficulty: 'intermediate',
    timeEstimate: '1 week',
    requirements: [
      'Use pandas for data manipulation',
      'Create visualizations with matplotlib/seaborn',
      'Perform statistical analysis',
      'Generate insights and conclusions',
      'Handle missing data appropriately'
    ],
    deliverables: [
      'Jupyter notebook with analysis',
      'Clean dataset',
      'Visualization charts',
      'Summary report with insights'
    ],
    evaluationCriteria: [
      { criterion: 'Data Handling', weight: 35, description: 'Proper data cleaning and manipulation' },
      { criterion: 'Analysis Quality', weight: 30, description: 'Meaningful insights and conclusions' },
      { criterion: 'Visualizations', weight: 25, description: 'Clear and informative charts' },
      { criterion: 'Documentation', weight: 10, description: 'Well-documented notebook' }
    ],
    resources: []
  }
];

// Learning Resources
export const learningResources: LearningResource[] = [
  {
    id: 'react-course-1',
    title: 'React - The Complete Guide 2024',
    platform: 'udemy',
    url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
    type: 'course',
    difficulty: 'intermediate',
    duration: '48 hours',
    rating: 4.8,
    price: 89.99,
    skillIds: ['react', 'javascript'],
    description: 'Comprehensive React course covering hooks, context, Redux, and modern patterns.',
    author: 'Maximilian Schwarzmüller'
  },
  {
    id: 'js-mdn-docs',
    title: 'JavaScript Guide - MDN',
    platform: 'other',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
    type: 'documentation',
    difficulty: 'beginner',
    duration: 'Self-paced',
    rating: 4.9,
    price: 0,
    skillIds: ['javascript'],
    description: 'Complete JavaScript documentation and guide by Mozilla.',
    author: 'Mozilla Developer Network'
  },
  {
    id: 'python-ml-course',
    title: 'Machine Learning A-Z',
    platform: 'udemy',
    url: 'https://www.udemy.com/course/machinelearning/',
    type: 'course',
    difficulty: 'intermediate',
    duration: '44 hours',
    rating: 4.5,
    price: 94.99,
    skillIds: ['python', 'machine-learning'],
    description: 'Comprehensive machine learning course with Python implementation.',
    author: 'Kirill Eremenko'
  },
  {
    id: 'typescript-handbook',
    title: 'TypeScript Handbook',
    platform: 'other',
    url: 'https://www.typescriptlang.org/docs/',
    type: 'documentation',
    difficulty: 'intermediate',
    duration: 'Self-paced',
    rating: 4.8,
    price: 0,
    skillIds: ['typescript'],
    description: 'Official TypeScript documentation and learning resource.',
    author: 'Microsoft'
  },
  {
    id: 'communication-coursera',
    title: 'Improve Your English Communication Skills',
    platform: 'coursera',
    url: 'https://www.coursera.org/specializations/improve-english',
    type: 'course',
    difficulty: 'beginner',
    duration: '6 months',
    rating: 4.6,
    price: 49,
    skillIds: ['communication'],
    description: 'Specialization to improve professional communication skills.',
    author: 'Georgia Institute of Technology'
  },
  {
    id: 'git-tutorial-yt',
    title: 'Git Tutorial for Beginners',
    platform: 'youtube',
    url: 'https://www.youtube.com/watch?v=8JJ101D3knE',
    type: 'video',
    difficulty: 'beginner',
    duration: '1 hour',
    rating: 4.7,
    price: 0,
    skillIds: ['git'],
    description: 'Complete Git tutorial covering all essential commands and workflows.',
    author: 'Programming with Mosh'
  }
];

// Skill Trends
export const skillTrends: SkillTrend[] = [
  {
    skillId: 'react',
    demand: 95,
    growth: '+25%',
    averageSalaryImpact: 15,
    jobCount: 45000,
    topCompanies: ['Meta', 'Netflix', 'Airbnb', 'Uber'],
    relatedSkills: ['javascript', 'typescript', 'nodejs']
  },
  {
    skillId: 'typescript',
    demand: 88,
    growth: '+40%',
    averageSalaryImpact: 20,
    jobCount: 32000,
    topCompanies: ['Microsoft', 'Google', 'Slack', 'Discord'],
    relatedSkills: ['javascript', 'react', 'nodejs']
  },
  {
    skillId: 'machine-learning',
    demand: 98,
    growth: '+35%',
    averageSalaryImpact: 35,
    jobCount: 28000,
    topCompanies: ['Google', 'Amazon', 'Tesla', 'OpenAI'],
    relatedSkills: ['python', 'sql', 'aws']
  },
  {
    skillId: 'python',
    demand: 92,
    growth: '+28%',
    averageSalaryImpact: 18,
    jobCount: 55000,
    topCompanies: ['Google', 'Instagram', 'Spotify', 'Dropbox'],
    relatedSkills: ['machine-learning', 'sql', 'django']
  },
  {
    skillId: 'aws',
    demand: 85,
    growth: '+30%',
    averageSalaryImpact: 25,
    jobCount: 38000,
    topCompanies: ['Amazon', 'Netflix', 'Twitch', 'Slack'],
    relatedSkills: ['docker', 'kubernetes', 'python']
  }
];

// Utility functions
export const getSkillById = (id: string): Skill | undefined => {
  return masterSkills.find(skill => skill.id === id);
};

export const getSkillsByCategory = (category: SkillCategory): Skill[] => {
  return masterSkills.filter(skill => skill.category === category);
};

export const getQuestionsBySkill = (skillId: string): QuizQuestion[] => {
  return quizQuestions.filter(q => q.skillId === skillId);
};

export const getResourcesBySkill = (skillId: string): LearningResource[] => {
  return learningResources.filter(r => r.skillIds.includes(skillId));
};

export const getTrendBySkill = (skillId: string): SkillTrend | undefined => {
  return skillTrends.find(t => t.skillId === skillId);
};