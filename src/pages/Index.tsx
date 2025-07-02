import { useState } from "react";
import { GitHubProfileForm } from "@/components/GitHubProfileForm";
import { ProfileSummary } from "@/components/ProfileSummary";
import { RepositoryList } from "@/components/RepositoryList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [stats, setStats] = useState({
    totalStars: 0,
    totalForks: 0,
    languages: {} as Record<string, number>
  });
  const { toast } = useToast();

  const fetchGitHubData = async (username: string) => {
    setLoading(true);
    
    try {
      // Fetch user data
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      
      if (!userResponse.ok) {
        throw new Error(
          userResponse.status === 404 
            ? "User not found. Please check the username and try again." 
            : "Failed to fetch user data. Please try again later."
        );
      }
      
      const userData: GitHubUser = await userResponse.json();
      
      // Fetch repositories
      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos?sort=stars&direction=desc&per_page=30`
      );
      
      if (!reposResponse.ok) {
        throw new Error("Failed to fetch repositories");
      }
      
      const reposData: Repository[] = await reposResponse.json();
      
      // Calculate stats
      const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = reposData.reduce((sum, repo) => sum + repo.forks_count, 0);
      
      // Calculate language distribution
      const languages: Record<string, number> = {};
      reposData.forEach((repo) => {
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      });
      
      setUser(userData);
      setRepositories(reposData);
      setStats({ totalStars, totalForks, languages });
      
      toast({
        title: "Success!",
        description: `Profile data loaded for ${userData.name || userData.login}`,
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      console.error("Error fetching GitHub data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUser(null);
    setRepositories([]);
    setStats({ totalStars: 0, totalForks: 0, languages: {} });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {!user ? (
          <div className="max-w-2xl mx-auto">
            <GitHubProfileForm onSubmit={fetchGitHubData} loading={loading} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </Button>
            </div>
            
            <ProfileSummary user={user} stats={stats} />
            <RepositoryList repositories={repositories} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
