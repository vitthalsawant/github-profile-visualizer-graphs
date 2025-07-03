import { GitHubProfileForm } from "@/components/GitHubProfileForm";
import { ProfileSummary } from "@/components/ProfileSummary";
import { RepositoryList } from "@/components/RepositoryList";
import { AdvancedAnalytics } from "@/components/AdvancedAnalytics";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useGitHubAPI } from "@/hooks/useGitHubAPI";

const Index = () => {
  const { loading, user, repositories, stats, fetchGitHubData, resetData } = useGitHubAPI();

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
                onClick={resetData}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </Button>
            </div>
            
            <ProfileSummary user={user} stats={stats} />
            <AdvancedAnalytics analytics={stats.analytics} />
            <RepositoryList repositories={repositories} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
