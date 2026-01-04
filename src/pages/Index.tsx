import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import RepoInput from "@/components/RepoInput";
import RepoCard from "@/components/RepoCard";
import { parseGitHubUrl, fetchRepoData } from "@/lib/github";
import { Github, Download, ChevronDown } from "lucide-react";
import { toPng, toBlob } from "html-to-image";
import { saveAs } from "file-saver";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RepoData {
  owner: string;
  name: string;
  description: string;
  stars: number;
  contributors: { login: string; avatar_url: string }[];
  contributorCount: number;
}

const Index = () => {
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDownload = async (format: 'png' | 'webp') => {
    if (!cardRef.current) return;

    setIsDownloading(true);
    try {
      if (format === 'png') {
        const dataUrl = await toPng(cardRef.current, {
          cacheBust: true,
          style: { transform: "scale(1)" },
        });
        saveAs(dataUrl, `${repoData?.name || "github-repo"}-card.png`);
      } else {
        const blob = await toBlob(cardRef.current, {
          cacheBust: true,
          style: { transform: "scale(1)" },
          type: 'image/webp',
        });
        if (blob) {
          saveAs(blob, `${repoData?.name || "github-repo"}-card.webp`);
        }
      }

      toast({
        title: "Success",
        description: `Image downloaded as ${format.toUpperCase()} successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmit = async (url: string) => {
    const parsed = parseGitHubUrl(url);

    if (!parsed) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid GitHub repository URL.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setRepoData(null);

    try {
      const data = await fetchRepoData(parsed.owner, parsed.repo);
      setRepoData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch repository data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Github className="w-10 h-10 text-foreground" />
          <h1 className="text-3xl font-bold text-foreground">
            GitHub Repo Card Generator
          </h1>
        </div>
        <p className="text-foreground/70 text-lg">
          Paste a GitHub repo URL to generate a beautiful preview card
        </p>
      </div>

      {/* Input */}
      <RepoInput onSubmit={handleSubmit} isLoading={isLoading} />

      {/* Card Display */}
      {isLoading && (
        <div className="flex items-center justify-center">
          <div className="repo-card animate-pulse-soft">
            <div className="window-dots mb-6">
              <div className="window-dot window-dot-red" />
              <div className="window-dot window-dot-yellow" />
              <div className="window-dot window-dot-green" />
            </div>
            <div className="h-8 bg-muted rounded w-3/4 mb-4" />
            <div className="h-6 bg-muted rounded w-full mb-2" />
            <div className="h-6 bg-muted rounded w-2/3 mb-8" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-14 h-14 bg-muted rounded-full" />
              ))}
            </div>
          </div>
        </div>
      )}

      {repoData && !isLoading && (
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          {/* Capture Area */}
          <div
            ref={cardRef}
            className="p-16 rounded-xl bg-slate-300/80 shadow-xl"
            style={{ minWidth: 'fit-content' }}
          >
            <RepoCard data={repoData} />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                disabled={isDownloading}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                {isDownloading ? "Generating..." : "Download"}
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleDownload('png')}>
                Download as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('webp')}>
                Download as WebP
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Empty state */}
      {!repoData && !isLoading && (
        <div className="text-center text-foreground/50 mt-8">
          <p className="text-lg">Enter a GitHub URL above to get started</p>
          <p className="text-sm mt-2">
            Example: https://github.com/facebook/react
          </p>
        </div>
      )}
    </div>
  );
};

export default Index;
