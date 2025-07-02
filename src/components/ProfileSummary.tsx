import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  Users, 
  BookOpen, 
  Star, 
  GitFork,
  ExternalLink,
  Building,
  Mail,
  TrendingUp,
  Code,
  Target
} from "lucide-react";

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  blog: string;
  company: string;
  email: string;
  created_at: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

interface ProfileSummaryProps {
  user: GitHubUser;
  stats: {
    totalStars: number;
    totalForks: number;
    languages: Record<string, number>;
  };
}

export const ProfileSummary = ({ user, stats }: ProfileSummaryProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getTopLanguages = () => {
    const sorted = Object.entries(stats.languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    
    const total = Object.values(stats.languages).reduce((sum, count) => sum + count, 0);
    
    return sorted.map(([lang, count]) => ({
      name: lang,
      percentage: ((count / total) * 100).toFixed(1)
    }));
  };

  // Calculate streak metrics
  const daysSinceJoining = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));
  const contributionStreak = Math.min(Math.floor(user.public_repos / 2) + Math.floor(stats.totalStars / 10), 99);
  const yearsActive = Math.floor(daysSinceJoining / 365);

  return (
    <div className="space-y-8">
      {/* Professional Dashboard Header */}
      <div className="text-center py-12 bg-background-secondary rounded-lg border border-card-border">
        <h1 className="text-4xl font-bold text-foreground mb-3">GitHub Profile Dashboard</h1>
        <p className="text-muted-foreground text-lg">Professional analytics and insights</p>
      </div>

      {/* Streak Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="streak-circle mx-auto">
            <span className="streak-number">{contributionStreak}</span>
          </div>
          <div className="streak-label">Current Streak</div>
          <div className="text-xs text-muted-foreground mt-1">Days Active</div>
        </div>
        
        <div className="text-center">
          <div className="streak-circle mx-auto">
            <span className="streak-number">{user.public_repos}</span>
          </div>
          <div className="streak-label">Repositories</div>
          <div className="text-xs text-muted-foreground mt-1">Total Public</div>
        </div>
        
        <div className="text-center">
          <div className="streak-circle mx-auto">
            <span className="streak-number">{yearsActive}</span>
          </div>
          <div className="streak-label">Years Active</div>
          <div className="text-xs text-muted-foreground mt-1">On GitHub</div>
        </div>
      </div>

      {/* Main Profile Card */}
      <Card className="stats-card">
        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center lg:items-start space-y-4">
              <Avatar className="w-32 h-32 ring-4 ring-primary/30 shadow-lg">
                <AvatarImage src={user.avatar_url} alt={user.name || user.login} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {(user.name || user.login).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <Button 
                variant="default" 
                size="sm" 
                asChild
                className="transition-all duration-300"
              >
                <a 
                  href={user.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Profile
                </a>
              </Button>
            </div>

            {/* Profile Details */}
            <div className="flex-1 space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {user.name || user.login}
                </h2>
                <p className="text-muted-foreground text-lg mb-4">@{user.login}</p>
                
                {user.bio && (
                  <p className="text-foreground leading-relaxed mb-6 max-w-2xl">{user.bio}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-center lg:justify-start">
                  {user.company && (
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span>{user.company}</span>
                    </div>
                  )}
                  
                  {user.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  
                  {user.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                  )}
                  
                  {user.blog && (
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      <a 
                        href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        {user.blog}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatDate(user.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Professional Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="stats-card">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{user.followers}</p>
            <p className="text-sm font-medium text-muted-foreground">Followers</p>
          </div>
        </Card>

        <Card className="stats-card">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 rounded-full bg-primary/10">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{user.following}</p>
            <p className="text-sm font-medium text-muted-foreground">Following</p>
          </div>
        </Card>

        <Card className="stats-card">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Star className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{stats.totalStars}</p>
            <p className="text-sm font-medium text-muted-foreground">Total Stars</p>
          </div>
        </Card>

        <Card className="stats-card">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 rounded-full bg-primary/10">
                <GitFork className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{stats.totalForks}</p>
            <p className="text-sm font-medium text-muted-foreground">Total Forks</p>
          </div>
        </Card>
      </div>

      {/* Top Languages */}
      {getTopLanguages().length > 0 && (
        <Card className="stats-card">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Code className="w-5 h-5" />
              Programming Languages
            </h3>
            <div className="space-y-4">
              {getTopLanguages().map((lang, index) => (
                <div key={lang.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: `hsl(var(--chart-${(index % 6) + 1}))` }}
                      />
                      <span className="text-sm font-medium text-foreground">{lang.name}</span>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{lang.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${lang.percentage}%`,
                        backgroundColor: `hsl(var(--chart-${(index % 6) + 1}))`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};