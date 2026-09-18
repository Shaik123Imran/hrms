import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description,
  action
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lavender-50 text-lavender-400">
        <Icon className="h-6 w-6" />
        </div>
        
        <div>
            <p className="text-sm font-semibold text-ink-700">
            {title}
            </p>
            {description && (
            <p className="mt-1 max-w-xs text-xs text-ink-400">
            {description}
            </p>
        )}
        
        </div>
        {action}
        </div>
  );
}