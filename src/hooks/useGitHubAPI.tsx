import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  size: number;
  open_issues_count: number;
}

interface GitHubStats {
  totalStars: number;
  totalForks: number;
  languages: Record<string, number>;
  totalCommits: number;
  contributionStreak: number;
  topRepo: Repository | null;
  techStack: string[];
}

export const useGitHubAPI = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [stats, setStats] = useState<GitHubStats>({
    totalStars: 0,
    totalForks: 0,
    languages: {},
    totalCommits: 0,
    contributionStreak: 0,
    topRepo: null,
    techStack: []
  });
  const { toast } = useToast();

  const callGitHubAPI = async (username: string, endpoint: string) => {
    const { data, error } = await supabase.functions.invoke('github-api', {
      body: { username, endpoint }
    });

    if (error) {
      throw new Error(error.message || 'Failed to fetch data');
    }

    if (!data.success) {
      throw new Error(data.error || 'API call failed');
    }

    return data.data;
  };

  const fetchGitHubData = async (username: string) => {
    setLoading(true);
    
    try {
      // Fetch user data
      const userData = await callGitHubAPI(username, 'user');
      
      // Fetch repositories
      const reposData = await callGitHubAPI(username, 'repos');
      
      // Fetch recent activity for commit estimation
      let eventsData = [];
      try {
        eventsData = await callGitHubAPI(username, 'events');
      } catch (error) {
        console.warn('Could not fetch events data:', error);
      }

      // Calculate enhanced stats
      const totalStars = reposData.reduce((sum: number, repo: Repository) => sum + repo.stargazers_count, 0);
      const totalForks = reposData.reduce((sum: number, repo: Repository) => sum + repo.forks_count, 0);
      
      // Language distribution
      const languages: Record<string, number> = {};
      reposData.forEach((repo: Repository) => {
        if (repo.language && !repo.fork) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      });

      // Estimate commits from events (PushEvents)
      const pushEvents = eventsData.filter((event: any) => event.type === 'PushEvent');
      const estimatedCommits = pushEvents.reduce((sum: number, event: any) => {
        return sum + (event.payload?.commits?.length || 0);
      }, 0);

      // Calculate contribution streak (simplified)
      const recentActivity = pushEvents.length;
      const contributionStreak = Math.min(recentActivity * 2 + Math.floor(totalStars / 10), 99);

      // Find top repository
      const topRepo = reposData.reduce((top: Repository | null, repo: Repository) => {
        if (!top || repo.stargazers_count > top.stargazers_count) {
          return repo;
        }
        return top;
      }, null);

      // Detect tech stack from languages and repo topics
      const allTopics = reposData.flatMap((repo: Repository) => repo.topics || []);
      const topLanguages = Object.keys(languages).slice(0, 5);
      const techStack = [...new Set([...topLanguages, ...allTopics.slice(0, 10)])];

      const enhancedStats = {
        totalStars,
        totalForks,
        languages,
        totalCommits: estimatedCommits,
        contributionStreak,
        topRepo,
        techStack: techStack.slice(0, 8)
      };
      
      setUser(userData);
      setRepositories(reposData);
      setStats(enhancedStats);
      
      toast({
        title: "Success!",
        description: `Enhanced profile data loaded for ${userData.name || userData.login}`,
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

  const resetData = () => {
    setUser(null);
    setRepositories([]);
    setStats({
      totalStars: 0,
      totalForks: 0,
      languages: {},
      totalCommits: 0,
      contributionStreak: 0,
      topRepo: null,
      techStack: []
    });
  };

  return {
    loading,
    user,
    repositories,
    stats,
    fetchGitHubData,
    resetData
  };
};