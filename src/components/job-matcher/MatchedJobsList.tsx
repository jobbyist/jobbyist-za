import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { MatchedJobCard } from './MatchedJobCard';
import { JobMatch } from '@/hooks/useJobMatcher';
import { Search, SlidersHorizontal } from 'lucide-react';

interface MatchedJobsListProps {
  matches: JobMatch[];
  onStatusChange: (matchId: string, status: JobMatch['status']) => void;
  onApply?: (jobId: string) => void;
}

export function MatchedJobsList({ matches, onStatusChange, onApply }: MatchedJobsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [minScore, setMinScore] = useState<number>(0);

  const filteredAndSortedMatches = useMemo(() => {
    let filtered = matches;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(match =>
        match.job?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.job?.companies?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.job?.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(match => match.status === filterStatus);
    }

    // Filter by minimum score
    if (minScore > 0) {
      filtered = filtered.filter(match => match.match_score >= minScore);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'score') {
        return b.match_score - a.match_score;
      } else {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return sorted;
  }, [matches, searchQuery, sortBy, filterStatus, minScore]);

  const stats = useMemo(() => {
    return {
      total: matches.length,
      excellent: matches.filter(m => m.match_score >= 90).length,
      good: matches.filter(m => m.match_score >= 70 && m.match_score < 90).length,
      new: matches.filter(m => m.status === 'new').length,
      applied: matches.filter(m => m.status === 'applied' || m.status === 'auto_applied').length,
    };
  }, [matches]);

  if (matches.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            No job matches yet. Complete your profile and preferences to start matching!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Matches</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.excellent}</div>
            <p className="text-xs text-muted-foreground">Excellent (90+%)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.good}</div>
            <p className="text-xs text-muted-foreground">Good (70-89%)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{stats.new}</div>
            <p className="text-xs text-muted-foreground">New</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">{stats.applied}</div>
            <p className="text-xs text-muted-foreground">Applied</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            <CardTitle>Filters & Search</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Job title, company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Match Score</SelectItem>
                  <SelectItem value="date">Date Posted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="viewed">Viewed</SelectItem>
                  <SelectItem value="saved">Saved</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Min Score */}
            <div className="space-y-2">
              <Label>Min Score: {minScore}%</Label>
              <Slider
                min={0}
                max={100}
                step={10}
                value={[minScore]}
                onValueChange={(value) => setMinScore(value[0])}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredAndSortedMatches.length} of {matches.length} matches
        </p>
        <div className="grid gap-4">
          {filteredAndSortedMatches.map(match => (
            <MatchedJobCard
              key={match.id}
              match={match}
              onStatusChange={onStatusChange}
              onApply={onApply}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
