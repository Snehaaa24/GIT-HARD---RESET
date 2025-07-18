import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  gradient?: boolean;
}

export const StatsCard = ({ title, value, trend, icon, gradient }: StatsCardProps) => {
  return (
    <div className={`card-hero ${gradient ? 'bg-gradient-to-br from-primary/5 to-secondary/5' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-label">{title}</p>
          <p className="text-stat">{value}</p>
          {trend && (
            <div className="flex items-center gap-1">
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-danger" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-success' : 'text-danger'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};