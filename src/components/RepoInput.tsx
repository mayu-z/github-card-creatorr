import { useState } from "react";
import { Github, Loader2 } from "lucide-react";

interface RepoInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const RepoInput = ({ onSubmit, isLoading }: RepoInputProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-12">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste GitHub repo URL..."
            className="input-field w-full pl-12"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="generate-button flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Fetching...
            </>
          ) : (
            "Generate Card"
          )}
        </button>
      </div>
    </form>
  );
};

export default RepoInput;
