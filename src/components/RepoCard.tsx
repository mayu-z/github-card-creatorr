import { Star } from "lucide-react";
import { forwardRef } from "react";

interface Contributor {
  login: string;
  avatar_url: string;
}

interface RepoData {
  owner: string;
  name: string;
  description: string;
  stars: number;
  contributors: Contributor[];
  contributorCount: number;
}

interface RepoCardProps {
  data: RepoData;
}

const RepoCard = forwardRef<HTMLDivElement, RepoCardProps>(({ data }, ref) => {
  const displayContributors = data.contributors.slice(0, 5);

  return (
    <div ref={ref} className="repo-card animate-fade-in bg-card text-card-foreground p-8 rounded-xl shadow-lg border border-border/50 max-w-2xl w-full">
      {/* Window dots and star count header */}
      <div className="flex items-start justify-between mb-6">
        <div className="window-dots flex gap-2">
          <div className="window-dot window-dot-red w-3 h-3 rounded-full bg-red-500" />
          <div className="window-dot window-dot-yellow w-3 h-3 rounded-full bg-yellow-500" />
          <div className="window-dot window-dot-green w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium">{data.stars}</span>
          <Star className="w-6 h-6 star-icon fill-current text-yellow-500" />
        </div>
      </div>

      {/* Repo name */}
      <h2 className="text-2xl font-semibold mb-4">
        <span className="repo-owner text-muted-foreground">{data.owner}</span>
        <span className="text-muted-foreground mx-1">/</span>
        <span className="repo-name text-github-green">{data.name}</span>
      </h2>

      {/* Description */}
      <p className="text-muted-foreground text-lg leading-relaxed mb-8">
        {data.description || "No description provided"}
      </p>

      {/* Contributors section */}
      <div className="flex items-end justify-between">
        <div className="flex items-center -space-x-3">
          {displayContributors.map((contributor, index) => (
            <img
              key={contributor.login}
              src={contributor.avatar_url}
              alt={contributor.login}
              className="contributor-avatar w-10 h-10 rounded-full border-2 border-background"
              style={{ zIndex: displayContributors.length - index }}
              title={contributor.login}
            />
          ))}
        </div>
        <span className="text-muted-foreground text-lg italic">
          {data.contributorCount} Contributor{data.contributorCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
});

RepoCard.displayName = "RepoCard";

export default RepoCard;
