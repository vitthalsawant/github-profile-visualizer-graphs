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
  contributionData?: ContributionDay[];
}

export const ContributionHeatmap = ({ 
  totalContributions, 
  contributionData = [] 
}: ContributionHeatmapProps) => {
  // Generate mock data for demonstration (in real app, this would come from GitHub API)
  const generateMockData = (): ContributionDay[] => {
    const data: ContributionDay[] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1);
    
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      const randomFactor = Math.random();
      
      // More contributions on weekdays, less on weekends
      let baseIntensity = dayOfWeek === 0 || dayOfWeek === 6 ? 0.3 : 0.7;
      
      // Add some seasonal variation
      const month = d.getMonth();
      if (month >= 2 && month <= 4) baseIntensity *= 1.2; // Spring boost
      if (month >= 5 && month <= 7) baseIntensity *= 0.8; // Summer dip
      
      const count = Math.floor(randomFactor * baseIntensity * 8);
      const level = count === 0 ? 0 : Math.min(Math.floor(count / 2) + 1, 4);
      
      data.push({
        date: d.toISOString().split('T')[0],
        count,
        level
      });
    }
    
    return data;
  };

  const data = contributionData.length > 0 ? contributionData : generateMockData();
  
  const getIntensityColor = (level: number): string => {
    const colors = [
      'bg-muted/30', // Level 0 - no contributions
      'bg-primary/20', // Level 1 - low
      'bg-primary/40', // Level 2 - medium-low  
      'bg-primary/60', // Level 3 - medium-high
      'bg-primary/80'  // Level 4 - high
    ];
    return colors[level] || colors[0];
  };

  const getWeekOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
  };

  const groupByWeeks = () => {
    const weeks: ContributionDay[][] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1);
    
    // Group data by weeks
    data.forEach(day => {
      const date = new Date(day.date);
      const weekIndex = getWeekOfYear(date) - getWeekOfYear(startDate);
      
      if (!weeks[weekIndex]) {
        weeks[weekIndex] = [];
      }
      weeks[weekIndex][date.getDay()] = day;
    });
    
    return weeks.slice(0, 53); // Limit to 53 weeks
  };

  const weeks = groupByWeeks();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <TrendingUp className="w-3 h-3 mr-1" />
            Active
          </Badge>
        </div>

        <div className="space-y-3">
          {/* Month labels */}
          <div className="flex text-xs text-muted-foreground pl-8">
            {months.map((month, index) => (
              <div key={month} className="flex-1 text-center" style={{ minWidth: '14px' }}>
                {index % 3 === 0 ? month : ''}
              </div>
            ))}
          </div>

          {/* Contribution grid */}
          <div className="flex gap-1">
            {/* Weekday labels */}
            <div className="flex flex-col gap-1 text-xs text-muted-foreground pr-2">
              {weekdays.map((day, index) => (
                <div key={day} className="h-3 flex items-center">
                  {index % 2 === 1 ? day.slice(0, 3) : ''}
                </div>
              ))}
            </div>

            {/* Contribution squares */}
            <TooltipProvider>
              <div className="flex gap-1 overflow-x-auto">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {weekdays.map((_, dayIndex) => {
                      const day = week[dayIndex];
                      return (
                        <Tooltip key={dayIndex}>
                          <TooltipTrigger asChild>
                            <div
                              className={`
                                w-3 h-3 rounded-sm border border-card-border transition-all duration-200 hover:scale-110
                                ${day ? getIntensityColor(day.level) : 'bg-muted/20'}
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
                      );
                    })}
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">Learn how we count contributions</span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(level => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-sm border border-card-border ${getIntensityColor(level)}`}
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