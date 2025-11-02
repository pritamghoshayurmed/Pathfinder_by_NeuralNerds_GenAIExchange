// PREMIUM GAP ANALYSIS SECTION - DARK THEME
// Replace the existing Gap Analysis section (lines ~362-665) with this code

{/* Gap Analysis Section - Premium Dark Theme */}
<div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 rounded-3xl p-8 border border-indigo-500/20 shadow-2xl mb-8">
  {/* Background Effects */}
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10"></div>
  <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
  <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>

  <div className="relative z-10">
    {/* Header */}
    <div className="text-center mb-8">
      <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 px-6 py-2 mb-4 shadow-lg">
        <BarChart3 className="w-5 h-5 mr-2" />
        AI-Powered Skill Gap Analysis
      </Badge>
      <h2 className="text-4xl font-bold text-white mb-3">Close Your Skill Gaps</h2>
      <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
        AI-driven insights to identify gaps and accelerate your career growth
      </p>
    </div>

    {/* Career Readiness Dashboard */}
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {/* Overall Score Card */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 col-span-1">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  className="text-white/20"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#scoreGradient)"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - careerReadiness.overall / 100)}`}
                  className="transition-all duration-1000"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{careerReadiness.overall}%</span>
                <span className="text-xs text-indigo-200">Ready</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Career Readiness</h3>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              <TrendingUp className="w-3 h-3 mr-1" />
              +7% This Month
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Category Scores */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 col-span-2">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Performance Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {careerReadiness.categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <IconComponent className="w-4 h-4 text-indigo-300" />
                    {category.trend === "up" && <TrendingUp className="w-4 h-4 text-green-400" />}
                    {category.trend === "down" && <TrendingDown className="w-4 h-4 text-red-400" />}
                    {category.trend === "neutral" && <Activity className="w-4 h-4 text-gray-400" />}
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{category.score}</div>
                  <div className="text-xs text-indigo-200 mb-2">{category.name}</div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs w-full justify-center ${
                      category.trend === "up" ? "border-green-500/50 text-green-300 bg-green-500/10" : 
                      category.trend === "down" ? "border-red-500/50 text-red-300 bg-red-500/10" : 
                      "border-gray-500/50 text-gray-300 bg-gray-500/10"
                    }`}
                  >
                    {category.change}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Weekly Progress Tracker */}
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            Weekly Learning Activity
          </h3>
          <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
            <Flame className="w-3 h-3 mr-1" />
            5 Day Streak
          </Badge>
        </div>
        <div className="grid grid-cols-7 gap-3">
          {weeklyProgress.map((day, index) => (
            <div key={index} className="text-center">
              <div className={`h-24 rounded-lg mb-2 flex flex-col items-center justify-end p-2 transition-all ${
                day.completed 
                  ? "bg-gradient-to-t from-indigo-600 to-purple-600 border-2 border-indigo-400/50" 
                  : "bg-white/5 border-2 border-white/10"
              }`}>
                {day.completed && (
                  <>
                    <Clock className="w-4 h-4 text-white mb-1" />
                    <span className="text-xs font-bold text-white">{day.hours}h</span>
                  </>
                )}
              </div>
              <div className={`text-xs font-medium ${day.completed ? "text-white" : "text-indigo-300"}`}>
                {day.day}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-indigo-200">Total this week: <span className="text-white font-bold">17.8 hours</span></span>
          <span className="text-indigo-200">Target: <span className="text-white font-bold">20 hours</span></span>
        </div>
      </CardContent>
    </Card>

    {/* Skill Gap Categories - Premium Cards */}
    <div className="grid md:grid-cols-3 gap-6">
      {skillGaps.map((category, index) => {
        const IconComponent = category.icon;
        return (
          <Card 
            key={index} 
            className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 group"
          >
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                <Badge 
                  className={`${
                    category.priority === "Critical" 
                      ? "bg-red-500/20 text-red-300 border-red-500/30" 
                      : category.priority === "High"
                      ? "bg-orange-500/20 text-orange-300 border-orange-500/30"
                      : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                  } shadow-lg`}
                >
                  {category.priority === "Critical" && <AlertCircle className="w-3 h-3 mr-1" />}
                  {category.priority}
                </Badge>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{category.category}</h3>
              <p className="text-indigo-200 text-sm mb-4">
                {category.gap}% gap to close • {category.estimatedCompletion}
              </p>

              {/* Progress Overview */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="text-xs text-indigo-200">Current</div>
                    <div className="text-2xl font-bold text-white">{category.currentLevel}%</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-indigo-300" />
                  <div className="text-right">
                    <div className="text-xs text-indigo-200">Target</div>
                    <div className="text-2xl font-bold text-green-400">{category.targetLevel}%</div>
                  </div>
                </div>
                
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`absolute h-full bg-gradient-to-r ${category.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${category.currentLevel}%` }}
                  ></div>
                </div>
              </div>

              {/* Learning Path Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-lg font-bold text-white">{category.learningPath.completedHours}/{category.learningPath.totalHours}</div>
                  <div className="text-xs text-indigo-200">Hours</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-lg font-bold text-white">{category.learningPath.coursesCompleted}/{category.learningPath.totalCourses}</div>
                  <div className="text-xs text-indigo-200">Courses</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                    <Flame className="w-4 h-4 text-orange-400" />
                    {category.learningPath.streak}
                  </div>
                  <div className="text-xs text-indigo-200">Streak</div>
                </div>
              </div>

              {/* Skills List */}
              <div className="space-y-2 mb-4">
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  <LineChart className="w-4 h-4" />
                  Skills ({category.skills.length})
                </div>
                {category.skills.slice(0, 3).map((skill, skillIndex) => (
                  <div key={skillIndex} className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-white flex items-center gap-2">
                        {skill.locked ? <Lock className="w-3 h-3 text-gray-400" /> : <Unlock className="w-3 h-3 text-green-400" />}
                        {skill.name}
                      </span>
                      <span className="text-xs text-indigo-200">{skill.current}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          skill.status === "Critical" ? "bg-gradient-to-r from-red-500 to-red-600" :
                          skill.status === "Needs Focus" ? "bg-gradient-to-r from-orange-500 to-orange-600" :
                          skill.status === "In Progress" || skill.status === "Learning" ? "bg-gradient-to-r from-blue-500 to-blue-600" :
                          "bg-gradient-to-r from-green-500 to-green-600"
                        }`}
                        style={{ width: `${(skill.current / skill.target) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                {category.skills.length > 3 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-indigo-300 hover:text-white hover:bg-white/10"
                  >
                    View All {category.skills.length} Skills
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>

              {/* Next Milestone */}
              <div className="p-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg border border-indigo-500/30 mb-4">
                <div className="text-xs text-indigo-200 mb-1 flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  Next Milestone
                </div>
                <div className="text-sm font-medium text-white">{category.nextMilestone}</div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  className={`flex-1 bg-gradient-to-r ${category.color} hover:opacity-90 text-white border-0 shadow-lg`}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Continue
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>

    {/* Quick Action Banner */}
    <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 rounded-2xl border border-white/20 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Ready to Close Your Gaps?</h3>
          <p className="text-indigo-200">Get personalized learning paths and AI-powered recommendations</p>
        </div>
        <Button 
          size="lg"
          className="bg-white text-indigo-900 hover:bg-indigo-50 shadow-xl"
        >
          <Rocket className="w-5 h-5 mr-2" />
          Start Learning Now
        </Button>
      </div>
    </div>
  </div>
</div>
