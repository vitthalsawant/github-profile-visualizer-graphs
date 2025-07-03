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

interface AdvancedAnalytics {
  avgCommitMessageLength: number;
  commitFrequency: number;
  issuesOpened: number;
  issuesClosed: number;
  pullRequestsCreated: number;
  pullRequestsMerged: number;
  hasCI: boolean;
  hasTests: boolean;
  languageDiversity: number;
  codeQualityScore: number;
}

interface GitHubStats {
  totalStars: number;
  totalForks: number;
  languages: Record<string, number>;
  totalCommits: number;
  contributionStreak: number;
  topRepo: Repository | null;
  techStack: string[];
  analytics: AdvancedAnalytics;
}

export const useGitHubAPI = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const defaultAnalytics: AdvancedAnalytics = {
    avgCommitMessageLength: 0,
    commitFrequency: 0,
    issuesOpened: 0,
    issuesClosed: 0,
    pullRequestsCreated: 0,
    pullRequestsMerged: 0,
    hasCI: false,
    hasTests: false,
    languageDiversity: 0,
    codeQualityScore: 0
  };

  const [stats, setStats] = useState<GitHubStats>({
    totalStars: 0,
    totalForks: 0,
    languages: {},
    totalCommits: 0,
    contributionStreak: 0,
    topRepo: null,
    techStack: [],
    analytics: defaultAnalytics
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

  const trackSearch = async (username: string, originalUrl: string) => {
    try {
      await supabase.from('github_searches').insert({
        github_url: originalUrl,
        github_username: username,
        ip_address: null, // Will be captured by Supabase
        user_agent: navigator.userAgent
      });
    } catch (error) {
      // Silent fail - don't interrupt user experience
      console.log('Analytics tracking failed:', error);
    }
  };

  const fetchGitHubData = async (username: string, originalUrl?: string) => {
    setLoading(true);
    
    try {
      // Track the search silently in background
      if (originalUrl) {
        trackSearch(username, originalUrl);
      }
      
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

      // Fetch advanced analytics data
      let issuesData = [];
      let pullsData = [];
      try {
        [issuesData, pullsData] = await Promise.all([
          callGitHubAPI(username, 'issues'),
          callGitHubAPI(username, 'pulls')
        ]);
      } catch (error) {
        console.warn('Could not fetch issues/PRs data:', error);
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

      // Calculate advanced analytics
      const commitMessages = pushEvents.flatMap((event: any) => 
        event.payload?.commits?.map((commit: any) => commit.message) || []
      );
      const avgCommitMessageLength = commitMessages.length > 0 
        ? Math.round(commitMessages.reduce((sum: number, msg: string) => sum + msg.length, 0) / commitMessages.length)
        : 0;

      const commitFrequency = pushEvents.length;
      const issuesOpened = (issuesData as any)?.total_count || 0;
      const issuesClosed = (issuesData as any)?.items?.filter((issue: any) => issue.state === 'closed').length || 0;
      const pullRequestsCreated = (pullsData as any)?.total_count || 0;
      const pullRequestsMerged = (pullsData as any)?.items?.filter((pr: any) => pr.state === 'closed' && pr.pull_request?.merged_at).length || 0;

      // Check for CI/CD and testing
      const hasCI = reposData.some((repo: Repository) => 
        repo.topics?.some((topic: string) => 
          ['ci', 'cd', 'github-actions', 'travis', 'jenkins', 'circleci'].includes(topic.toLowerCase())
        )
      );
      
      const hasTests = reposData.some((repo: Repository) => 
        repo.topics?.some((topic: string) => 
          ['testing', 'jest', 'mocha', 'cypress', 'test'].includes(topic.toLowerCase())
        )
      );

      const languageDiversity = Object.keys(languages).length;
      const codeQualityScore = Math.min(
        Math.round((totalStars * 0.3 + pullRequestsMerged * 0.4 + languageDiversity * 0.3) / 10),
        100
      );

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

      const analytics: AdvancedAnalytics = {
        avgCommitMessageLength,
        commitFrequency,
        issuesOpened,
        issuesClosed,
        pullRequestsCreated,
        pullRequestsMerged,
        hasCI,
        hasTests,
        languageDiversity,
        codeQualityScore
      };

      const enhancedStats = {
        totalStars,
        totalForks,
        languages,
        totalCommits: estimatedCommits,
        contributionStreak,
        topRepo,
        techStack: techStack.slice(0, 8),
        analytics
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
      techStack: [],
      analytics: defaultAnalytics
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