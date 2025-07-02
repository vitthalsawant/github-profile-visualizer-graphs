import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Github, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GitHubProfileFormProps {
  onSubmit: (username: string) => void;
  loading: boolean;
}

export const GitHubProfileForm = ({ onSubmit, loading }: GitHubProfileFormProps) => {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const extractUsername = (input: string): string | null => {
    // Remove any whitespace
    const trimmed = input.trim();
    
    // If it's just a username
    if (!trimmed.includes('/') && !trimmed.includes('.')) {
      return trimmed;
    }
    
    // Extract from GitHub URL patterns
    const patterns = [
      /github\.com\/([^\/\?#]+)/i,
      /^@?([a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38})$/
    ];
    
    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const username = extractUsername(url);
    
    if (!username) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid GitHub username or profile URL",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(username);
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-card via-card-secondary to-card border-card-border shadow-elevated backdrop-blur-sm">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary mb-4 shadow-glow">
          <Github className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          GitHub Profile Analyzer
        </h1>
        <p className="text-muted-foreground text-lg">
          Generate beautiful insights from any GitHub profile
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="github-url" className="text-sm font-medium text-foreground">
            GitHub Profile URL or Username
          </label>
          <div className="relative">
            <Input
              id="github-url"
              type="text"
              placeholder="octocat or https://github.com/octocat"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-10 h-12 bg-card/50 border-card-border focus:border-primary focus:ring-1 focus:ring-primary"
              disabled={loading}
            />
            <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">
            Enter a GitHub username (e.g., "octocat") or full profile URL
          </p>
        </div>

        <Button
          type="submit"
          variant="gradient"
          size="xl"
          className="w-full"
          disabled={loading || !url.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Profile...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Generate Profile Summary
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 p-4 bg-card/30 rounded-lg border border-card-border">
        <h3 className="text-sm font-medium text-foreground mb-2">What you'll get:</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Comprehensive profile overview with key statistics</li>
          <li>• Language distribution and technology stack analysis</li>
          <li>• Repository insights and contribution patterns</li>
          <li>• Visual charts and graphs for better understanding</li>
        </ul>
      </div>
    </Card>
  );
};