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

export const parseGitHubUrl = (url: string): { owner: string; repo: string } | null => {
  // Handle various GitHub URL formats
  const patterns = [
    /github\.com\/([^/]+)\/([^/?#]+)/,
    /^([^/]+)\/([^/]+)$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, ""),
      };
    }
  }

  return null;
};

export const fetchRepoData = async (owner: string, repo: string): Promise<RepoData> => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  // Fine-grained PATs (github_pat_) use Bearer, classic tokens (ghp_) use token
  const authPrefix = token?.startsWith('github_pat_') ? 'Bearer' : 'token';
  const headers: HeadersInit = token ? { Authorization: `${authPrefix} ${token}` } : {};

  // Fetch repo info
  const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });

  if (!repoResponse.ok) {
    if (repoResponse.status === 404) {
      throw new Error("Repository not found. Please check the URL.");
    }
    if (repoResponse.status === 403) {
      throw new Error("GitHub API rate limit exceeded. Please try again in a few minutes.");
    }
    throw new Error("Failed to fetch repository data.");
  }

  const repoData = await repoResponse.json();

  // Fetch contributors
  const contributorsResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=5`,
    { headers }
  );

  let contributors: Contributor[] = [];
  let contributorCount = 0;

  if (contributorsResponse.ok) {
    contributors = await contributorsResponse.json();

    // Get total contributor count from Link header if available
    const linkHeader = contributorsResponse.headers.get("Link");
    if (linkHeader) {
      const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
      if (lastPageMatch) {
        contributorCount = parseInt(lastPageMatch[1]) * 5;
      } else {
        contributorCount = contributors.length;
      }
    } else {
      contributorCount = contributors.length;
    }
  }

  return {
    owner: repoData.owner.login,
    name: repoData.name,
    description: repoData.description || "",
    stars: repoData.stargazers_count,
    contributors: contributors.map((c: Contributor) => ({
      login: c.login,
      avatar_url: c.avatar_url,
    })),
    contributorCount: contributorCount || contributors.length,
  };
};
