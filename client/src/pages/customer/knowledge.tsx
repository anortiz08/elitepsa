import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Article } from "@shared/schema";
import Sidebar from "@/components/layout/sidebar";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function CustomerKnowledge() {
  const [search, setSearch] = useState("");

  const { data: articles = [] } = useQuery<Article[]>({
    queryKey: ["/api/articles", search],
    queryFn: async ({ queryKey }) => {
      const [_, query] = queryKey;
      const url = new URL("/api/articles", window.location.origin);
      if (query) url.searchParams.set("q", query);
      const response = await fetch(url);
      return response.json();
    },
  });

  return (
    <div className="flex h-screen">
      <div className="w-64 hidden md:block">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Knowledge Base</h1>
            <p className="text-muted-foreground">
              Search our knowledge base for helpful articles and guides.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid gap-6">
            {articles.map((article) => (
              <Card key={article.id}>
                <CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}