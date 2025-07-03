import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  GitCommit, 
  MessageSquare, 
  GitPullRequest, 
  CheckCircle, 
  XCircle,
  Shield,
  TestTube,
  Code2,
  Trophy
} from "lucide-react";

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

interface AdvancedAnalyticsProps {
  analytics: AdvancedAnalytics;
}

export const AdvancedAnalytics = ({ analytics }: AdvancedAnalyticsProps) => {
  const getQualityLevel = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "bg-green-500" };
    if (score >= 60) return { label: "Good", color: "bg-blue-500" };
    if (score >= 40) return { label: "Fair", color: "bg-yellow-500" };
    return { label: "Needs Work", color: "bg-red-500" };
  };

  const quality = getQualityLevel(analytics.codeQualityScore);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Advanced Developer Analytics</h2>
        <p className="text-muted-foreground">Deep insights powered by GitHub API</p>
      </div>

      {/* Quality Score Card */}
      <Card className="stats-card">
        <div className="p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-4xl font-bold text-foreground">{analytics.codeQualityScore}%</p>
            <Badge 
              variant="secondary" 
              className={`${quality.color} text-white px-4 py-1`}
            >
              {quality.label}
            </Badge>
            <p className="text-sm text-muted-foreground">Overall Code Quality Score</p>
          </div>
        </div>
      </Card>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Commit Analytics */}
        <Card className="stats-card">
          <div className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <GitCommit className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{analytics.avgCommitMessageLength}</p>
            <p className="text-xs text-muted-foreground">Avg Commit Length</p>
          </div>
        </Card>

        <Card className="stats-card">
          <div className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{analytics.commitFrequency}</p>
            <p className="text-xs text-muted-foreground">Recent Commits</p>
          </div>
        </Card>

        {/* Issues Analytics */}
        <Card className="stats-card">
          <div className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{analytics.issuesOpened}</p>
            <p className="text-xs text-muted-foreground">Issues Opened</p>
          </div>
        </Card>

        <Card className="stats-card">
          <div className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{analytics.issuesClosed}</p>
            <p className="text-xs text-muted-foreground">Issues Closed</p>
          </div>
        </Card>

        {/* PR Analytics */}
        <Card className="stats-card">
          <div className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <GitPullRequest className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{analytics.pullRequestsCreated}</p>
            <p className="text-xs text-muted-foreground">PRs Created</p>
          </div>
        </Card>

        <Card className="stats-card">
          <div className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{analytics.pullRequestsMerged}</p>
            <p className="text-xs text-muted-foreground">PRs Merged</p>
          </div>
        </Card>

        {/* Language Diversity */}
        <Card className="stats-card">
          <div className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Code2 className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{analytics.languageDiversity}</p>
            <p className="text-xs text-muted-foreground">Languages Used</p>
          </div>
        </Card>

        {/* Development Practices */}
        <Card className="stats-card">
          <div className="p-4 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">DevOps</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                {analytics.hasCI ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-xs">CI/CD</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                {analytics.hasTests ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-xs">Testing</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quality Insights */}
      <Card className="stats-card">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Developer Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Commit Quality:</span>
                <span className="text-foreground">
                  {analytics.avgCommitMessageLength > 30 ? "Descriptive" : "Brief"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Activity Level:</span>
                <span className="text-foreground">
                  {analytics.commitFrequency > 10 ? "Very Active" : 
                   analytics.commitFrequency > 5 ? "Active" : "Moderate"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Issue Management:</span>
                <span className="text-foreground">
                  {analytics.issuesClosed > analytics.issuesOpened * 0.7 ? "Excellent" : "Good"}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">PR Success Rate:</span>
                <span className="text-foreground">
                  {analytics.pullRequestsCreated > 0 
                    ? `${Math.round((analytics.pullRequestsMerged / analytics.pullRequestsCreated) * 100)}%`
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tech Diversity:</span>
                <span className="text-foreground">
                  {analytics.languageDiversity > 5 ? "Polyglot" : 
                   analytics.languageDiversity > 2 ? "Multi-tech" : "Focused"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Best Practices:</span>
                <span className="text-foreground">
                  {analytics.hasCI && analytics.hasTests ? "Advanced" : 
                   analytics.hasCI || analytics.hasTests ? "Good" : "Basic"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};