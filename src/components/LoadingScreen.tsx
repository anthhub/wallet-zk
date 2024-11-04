import { Loading } from "./Loading"
import { Skeleton } from "./Skeleton"

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-gray-900 p-8 rounded-2xl shadow-xl">
          <div className="space-y-4">
            <Skeleton className="h-16 w-16 mx-auto rounded-full" />
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
            <div className="pt-4">
              <Skeleton className="h-12 w-full" />
              <div className="h-4" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <Loading size="lg" />
          </div>
        </div>
      </div>
    </div>
  )
} 