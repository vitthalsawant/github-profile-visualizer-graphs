import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, GitFork, ExternalLink, Eye, Calendar } from "lucide-react";

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  updated_at: string;
  topics: string[];
  fork: boolean;
}

interface RepositoryListProps {
  repositories: Repository[];
}

export const RepositoryList = ({ repositories }: RepositoryListProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Updated yesterday";
    if (diffDays < 7) return `Updated ${diffDays} days ago`;
    if (diffDays < 30) return `Updated ${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `Updated ${Math.ceil(diffDays / 30)} months ago`;
    return `Updated ${Math.ceil(diffDays / 365)} years ago`;
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      JavaScript: "hsl(var(--chart-4))",
      TypeScript: "hsl(var(--chart-1))",
      Python: "hsl(var(--chart-3))",
      Java: "hsl(var(--chart-5))",
      React: "hsl(var(--chart-6))",
      HTML: "hsl(var(--chart-2))",
      CSS: "hsl(var(--chart-1))",
      Go: "hsl(var(--chart-6))",
      Rust: "hsl(var(--chart-5))",
      C: "hsl(var(--chart-4))",
      "C++": "hsl(var(--chart-3))",
      PHP: "hsl(var(--chart-2))",
      Ruby: "hsl(var(--chart-1))",
      Swift: "hsl(var(--chart-4))",
      Kotlin: "hsl(var(--chart-2))",
    };
    
    return colors[language] || "hsl(var(--muted-foreground))";
  };

  if (repositories.length === 0) {
    return (
      <Card className="p-8 text-center bg-card/50 border-card-border">
        <p className="text-muted-foreground">No repositories found.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Top Repositories
        </h2>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {repositories.length} repos
        </Badge>
      </div>

      <div className="grid gap-4">
        {repositories.map((repo) => (
          <Card
            key={repo.id}
            className="p-6 bg-gradient-to-br from-card via-card-secondary to-card border-card-border hover:shadow-glow transition-all duration-300 group"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {repo.name}
                      </h3>
                      {repo.fork && (
                        <Badge variant="outline" className="text-xs bg-muted/50">
                          Fork
                        </Badge>
                      )}
                    </div>
                    
                    {repo.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                        {repo.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {repo.language && (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getLanguageColor(repo.language) }}
                          />
                          <span>{repo.language}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>{repo.stargazers_count}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <GitFork className="w-4 h-4" />
                        <span>{repo.forks_count}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{repo.watchers_count}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(repo.updated_at)}</span>
                      </div>
                    </div>
                    
                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {repo.topics.slice(0, 5).map((topic) => (
                          <Badge
                            key={topic}
                            variant="secondary"
                            className="text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            {topic}
                          </Badge>
                        ))}
                        {repo.topics.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{repo.topics.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                asChild
                className="self-start lg:self-center hover:shadow-glow transition-all duration-300"
              >
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Repo
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};