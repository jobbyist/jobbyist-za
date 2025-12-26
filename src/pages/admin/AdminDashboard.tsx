import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Briefcase, Building2, Users, FileText, TrendingUp, Clock } from 'lucide-react';

interface Stats {
  totalJobs: number;
  activeJobs: number;
  totalCompanies: number;
  totalUsers: number;
  pendingVerifications: number;
  totalApplications: number;
  waitingListCount: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalJobs: 0,
    activeJobs: 0,
    totalCompanies: 0,
    totalUsers: 0,
    pendingVerifications: 0,
    totalApplications: 0,
    waitingListCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        { count: totalJobs },
        { count: activeJobs },
        { count: totalCompanies },
        { count: totalUsers },
        { count: pendingVerifications },
        { count: totalApplications },
        { count: waitingListCount },
      ] = await Promise.all([
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('companies').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending').eq('profile_completion', 100),
        supabase.from('job_applications').select('*', { count: 'exact', head: true }),
        supabase.from('waiting_list').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        totalJobs: totalJobs || 0,
        activeJobs: activeJobs || 0,
        totalCompanies: totalCompanies || 0,
        totalUsers: totalUsers || 0,
        pendingVerifications: pendingVerifications || 0,
        totalApplications: totalApplications || 0,
        waitingListCount: waitingListCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Jobs', value: stats.totalJobs, icon: Briefcase, color: 'text-blue-500' },
    { title: 'Active Jobs', value: stats.activeJobs, icon: TrendingUp, color: 'text-green-500' },
    { title: 'Companies', value: stats.totalCompanies, icon: Building2, color: 'text-purple-500' },
    { title: 'Registered Users', value: stats.totalUsers, icon: Users, color: 'text-orange-500' },
    { title: 'Pending Verifications', value: stats.pendingVerifications, icon: Clock, color: 'text-yellow-500' },
    { title: 'Applications', value: stats.totalApplications, icon: FileText, color: 'text-pink-500' },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-8 w-8 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">Monitor your platform's performance and activity</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Waiting List</CardTitle>
            <CardDescription>Users waiting for expansion to new countries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.waitingListCount}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Signups from eSwatini, Botswana, Zambia, Zimbabwe, Mozambique, Namibia, Malawi, Tanzania
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href="/admin/users" className="block p-3 rounded-lg border hover:bg-muted transition-colors">
              Review {stats.pendingVerifications} pending user verifications
            </a>
            <a href="/admin/scraper" className="block p-3 rounded-lg border hover:bg-muted transition-colors">
              Run job scraper for new listings
            </a>
            <a href="/admin/jobs" className="block p-3 rounded-lg border hover:bg-muted transition-colors">
              Manage job postings
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
