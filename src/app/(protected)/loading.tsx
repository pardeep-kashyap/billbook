import { PostItem } from '@/components/post-item'

export default function DashboardLoading() {
  return (
    <div className="divide-border-200 divide-y rounded-md border">
      <PostItem.Skeleton />
      <PostItem.Skeleton />
      <PostItem.Skeleton />
      <PostItem.Skeleton />
      <PostItem.Skeleton />
    </div>
  )
}
