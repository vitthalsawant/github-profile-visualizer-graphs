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
  Mail
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

  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <Card className="p-8 bg-gradient-to-br from-card via-card-secondary to-card border-card-border shadow-elevated">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <Avatar className="w-32 h-32 ring-4 ring-primary/20 shadow-glow">
              <AvatarImage src={user.avatar_url} alt={user.name || user.login} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-secondary text-white">
                {(user.name || user.login).slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="transition-all duration-300 hover:shadow-glow"
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
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {user.name || user.login}
              </h1>
              <p className="text-muted-foreground text-lg mb-4">@{user.login}</p>
              
              {user.bio && (
                <p className="text-foreground leading-relaxed mb-4">{user.bio}</p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {user.company && (
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    <span>{user.company}</span>
                  </div>
                )}
                
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                
                {user.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                )}
                
                {user.blog && (
                  <div className="flex items-center gap-1">
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
                
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(user.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-card to-card-secondary border-card-border hover:shadow-glow transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-1/20">
              <BookOpen className="w-5 h-5 text-chart-1" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{user.public_repos}</p>
              <p className="text-sm text-muted-foreground">Repositories</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-card to-card-secondary border-card-border hover:shadow-glow transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-2/20">
              <Users className="w-5 h-5 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{user.followers}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-card to-card-secondary border-card-border hover:shadow-glow transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-3/20">
              <Star className="w-5 h-5 text-chart-3" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.totalStars}</p>
              <p className="text-sm text-muted-foreground">Total Stars</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-card to-card-secondary border-card-border hover:shadow-glow transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-4/20">
              <GitFork className="w-5 h-5 text-chart-4" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.totalForks}</p>
              <p className="text-sm text-muted-foreground">Total Forks</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Languages */}
      {getTopLanguages().length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-card to-card-secondary border-card-border">
          <h3 className="text-xl font-semibold text-foreground mb-4">Top Languages</h3>
          <div className="space-y-3">
            {getTopLanguages().map((lang, index) => (
              <div key={lang.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{lang.name}</span>
                  <span className="text-sm text-muted-foreground">{lang.percentage}%</span>
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
        </Card>
      )}
    </div>
  );
};