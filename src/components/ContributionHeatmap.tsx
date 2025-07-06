import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, TrendingUp } from "lucide-react";

interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4 intensity level
}

interface ContributionHeatmapProps {
  totalContributions: number;
  contributionData?: {
    totalContributions: number;
    weeks: {
      contributionDays: {
        contributionCount: number;
        date: string;
      }[];
    }[];
  };
}

export const ContributionHeatmap = ({ 
  totalContributions, 
  contributionData 
}: ContributionHeatmapProps) => {
  
  const transformGitHubData = (githubData: any): ContributionDay[] => {
    if (!githubData?.weeks) return [];
    
    const data: ContributionDay[] = [];
    
    githubData.weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        const count = day.contributionCount;
        let level = 0;
        if (count === 0) level = 0;
        else if (count <= 2) level = 1;
        else if (count <= 4) level = 2;
        else if (count <= 8) level = 3;
        else level = 4;
        
        data.push({
          date: day.date,
          count: count,
          level: level
        });
      });
    });
    
    return data;
  };
  
  const generateGitHubStyleData = (): ContributionDay[] => {
    const data: ContributionDay[] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1);
    
    // Find the first Sunday of the year
    const firstSunday = new Date(startDate);
    firstSunday.setDate(startDate.getDate() - startDate.getDay());
    
    for (let d = new Date(firstSunday); d <= today; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      const randomFactor = Math.random();
      
      // Create more realistic GitHub-like patterns
      let baseActivity = 0.4;
      
      // Weekdays have higher activity
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        baseActivity = 0.7;
      }
      
      // Add monthly variations
      const month = d.getMonth();
      const monthMultipliers = [0.6, 0.8, 1.0, 1.2, 1.0, 0.7, 0.5, 0.6, 0.9, 1.1, 0.8, 0.6];
      baseActivity *= monthMultipliers[month];
      
      // Create some streaks and gaps
      const dayOfYear = Math.floor((d.getTime() - firstSunday.getTime()) / (1000 * 60 * 60 * 24));
      if (dayOfYear % 20 < 5) baseActivity *= 0.3; // Create gaps
      if (dayOfYear % 30 < 10) baseActivity *= 1.5; // Create active periods
      
      const count = randomFactor < 0.2 ? 0 : Math.floor(randomFactor * baseActivity * 12);
      
      let level = 0;
      if (count === 0) level = 0;
      else if (count <= 2) level = 1;
      else if (count <= 4) level = 2;
      else if (count <= 8) level = 3;
      else level = 4;
      
      data.push({
        date: d.toISOString().split('T')[0],
        count,
        level
      });
    }
    
    return data;
  };

  const data = contributionData ? transformGitHubData(contributionData) : generateGitHubStyleData();
  
  const getIntensityColor = (level: number): string => {
    const colors = [
      'bg-gray-100 dark:bg-gray-800/40', // Level 0 - no contributions
      'bg-green-200 dark:bg-green-900/40', // Level 1 - low
      'bg-green-300 dark:bg-green-700/60', // Level 2 - medium-low  
      'bg-green-500 dark:bg-green-500/80', // Level 3 - medium-high
      'bg-green-700 dark:bg-green-400'  // Level 4 - high
    ];
    return colors[level] || colors[0];
  };

  // Group data into weeks starting from Sunday
  const groupDataByWeeks = () => {
    const weeks: (ContributionDay | null)[][] = [];
    let currentWeek: (ContributionDay | null)[] = new Array(7).fill(null);
    let weekIndex = 0;
    
    data.forEach((day, index) => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay(); // 0 = Sunday
      
      // If it's Sunday and not the first day, start a new week
      if (dayOfWeek === 0 && index > 0) {
        weeks.push([...currentWeek]);
        currentWeek = new Array(7).fill(null);
        weekIndex++;
      }
      
      currentWeek[dayOfWeek] = day;
    });
    
    // Add the last week
    if (currentWeek.some(day => day !== null)) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const weeks = groupDataByWeeks();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Generate month labels positioned over the correct weeks
  const getMonthLabels = () => {
    const monthLabels: { month: string; position: number }[] = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    weeks.forEach((week, weekIndex) => {
      const firstDayOfWeek = week.find(day => day !== null);
      if (firstDayOfWeek) {
        const date = new Date(firstDayOfWeek.date);
        const monthIndex = date.getMonth();
        const dayOfMonth = date.getDate();
        
        // Show month label if it's the first week of the month or first few days
        if (dayOfMonth <= 7 && !monthLabels.some(m => m.month === monthNames[monthIndex])) {
          monthLabels.push({
            month: monthNames[monthIndex],
            position: weekIndex
          });
        }
      }
    });
    
    return monthLabels;
  };

  const monthLabels = getMonthLabels();

  const getContributionText = (count: number) => {
    if (count === 0) return "No contributions";
    if (count === 1) return "1 contribution";
    return `${count} contributions`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="stats-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Contribution Activity</h3>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{totalContributions}</span> contributions in the last year
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
            <TrendingUp className="w-3 h-3 mr-1" />
            Active
          </Badge>
        </div>

        <div className="space-y-2">
          {/* Month labels */}
          <div className="relative h-4">
            <div className="flex absolute top-0 left-8" style={{ width: `${weeks.length * 14}px` }}>
              {monthLabels.map((label) => (
                <div
                  key={label.month}
                  className="text-xs text-muted-foreground absolute"
                  style={{ left: `${label.position * 14}px` }}
                >
                  {label.month}
                </div>
              ))}
            </div>
          </div>

          {/* Contribution grid */}
          <div className="flex gap-1">
            {/* Weekday labels */}
            <div className="flex flex-col gap-1 text-xs text-muted-foreground w-6">
              {weekdays.map((day, index) => (
                <div key={day} className="h-3 flex items-center justify-end pr-1">
                  {index % 2 === 1 ? day.slice(0, 3) : ''}
                </div>
              ))}
            </div>

            {/* Contribution squares */}
            <TooltipProvider>
              <div className="flex gap-1 overflow-x-auto">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <Tooltip key={dayIndex}>
                        <TooltipTrigger asChild>
                          <div
                            className={`
                              w-3 h-3 rounded-sm transition-all duration-200 hover:ring-1 hover:ring-gray-400 cursor-default
                              ${day ? getIntensityColor(day.level) : 'bg-gray-100 dark:bg-gray-800/40'}
                            `}
                          />
                        </TooltipTrigger>
                        {day && (
                          <TooltipContent>
                            <div className="text-center">
                              <p className="font-medium">{getContributionText(day.count)}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(day.date)}
                              </p>
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between pt-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Learn how we count contributions
            </a>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(level => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-sm ${getIntensityColor(level)}`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};